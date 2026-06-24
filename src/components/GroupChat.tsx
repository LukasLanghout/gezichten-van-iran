'use client'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface Message {
  id: string
  user_id: string
  display_name: string
  content: string
  created_at: string
}

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return 'zojuist'
  if (diff < 3600) return `${Math.floor(diff / 60)} min geleden`
  if (diff < 86400) return `${Math.floor(diff / 3600)} uur geleden`
  return `${Math.floor(diff / 86400)} dag geleden`
}

export default function GroupChat({ groupId, currentUser }: { groupId: string; currentUser: User }) {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase
      .from('group_chat_messages')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true })
      .limit(100)
      .then(({ data }) => setMessages(data || []))

    const channel = supabase
      .channel(`group-chat:${groupId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'group_chat_messages',
        filter: `group_id=eq.${groupId}`,
      }, payload => {
        setMessages(prev => [...prev, payload.new as Message])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [groupId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    setSending(true)
    const displayName = currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'Anoniem'
    await supabase.from('group_chat_messages').insert({
      group_id: groupId,
      user_id: currentUser.id,
      display_name: displayName,
      content: input.trim(),
    })
    setInput('')
    setSending(false)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-1 mb-4" style={{ maxHeight: '60vh' }}>
        {messages.length === 0 && (
          <p className="text-charcoal/40 text-sm">Nog geen berichten. Stuur het eerste bericht!</p>
        )}
        {messages.map(msg => (
          <div key={msg.id}>
            {/* Name + timestamp */}
            <div className="flex items-baseline gap-2 mb-1">
              <span className={`font-semibold text-sm ${
                msg.user_id === currentUser.id ? 'text-terracotta' : 'text-charcoal'
              }`}>
                {msg.display_name}
              </span>
              <span className="text-xs text-charcoal/40">{timeAgo(msg.created_at)}</span>
            </div>
            {/* Message content */}
            <p className="text-sm text-charcoal leading-relaxed">{msg.content}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-2 border-t border-charcoal/10 pt-4">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Schrijf een bericht..."
          className="flex-1 border border-charcoal/20 px-3 py-2 bg-white text-sm"
          maxLength={1000}
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="bg-terracotta text-white px-5 py-2 text-sm font-semibold hover:bg-terracotta/90 disabled:opacity-40"
        >
          Sturen
        </button>
      </form>
    </div>
  )
}
