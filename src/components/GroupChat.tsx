'use client'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Avatar from './Avatar'
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
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="mb-4 flex-1 space-y-4 overflow-y-auto pr-1" style={{ maxHeight: '60vh' }}>
        {messages.length === 0 && (
          <div className="rounded-2xl border border-dashed border-charcoal/15 py-10 text-center">
            <p className="text-sm text-charcoal/45">Nog geen berichten. Stuur het eerste bericht!</p>
          </div>
        )}
        {messages.map(msg => {
          const own = msg.user_id === currentUser.id
          return (
            <div key={msg.id} className={`flex animate-fade-in gap-3 ${own ? 'flex-row-reverse' : ''}`}>
              <Avatar name={msg.display_name} size={36} />
              <div className={`flex max-w-[80%] flex-col ${own ? 'items-end text-right' : ''}`}>
                <div className={`mb-1 flex items-baseline gap-2 ${own ? 'flex-row-reverse' : ''}`}>
                  <span className={`text-sm font-semibold ${own ? 'text-terracotta' : 'text-charcoal'}`}>
                    {msg.display_name}
                  </span>
                  <span className="text-[11px] text-charcoal/35">{timeAgo(msg.created_at)}</span>
                </div>
                <div
                  className={`inline-block rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    own ? 'rounded-tr-sm bg-terracotta text-white' : 'rounded-tl-sm bg-sand text-ink'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-2 border-t border-charcoal/10 pt-4">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Schrijf een bericht..."
          className="field flex-1 rounded-full"
          maxLength={1000}
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="btn-primary px-6 py-2.5 text-sm"
        >
          Sturen
        </button>
      </form>
    </div>
  )
}
