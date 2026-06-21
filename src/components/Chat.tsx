'use client'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

interface Message {
  id: string
  display_name: string
  content: string
  created_at: string
  user_id: string
}

export default function Chat({ storyId, storyPath }: { storyId: string; storyPath: string }) {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })

    supabase
      .from('chat_messages')
      .select('*')
      .eq('story_id', storyId)
      .order('created_at', { ascending: true })
      .limit(100)
      .then(({ data }) => setMessages(data || []))

    const channel = supabase
      .channel(`chat:${storyId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `story_id=eq.${storyId}`,
      }, payload => {
        setMessages(prev => [...prev, payload.new as Message])
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
      supabase.removeChannel(channel)
    }
  }, [storyId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || !user) return
    setSending(true)
    const displayName = user.user_metadata?.name || user.email?.split('@')[0] || 'Anoniem'
    await supabase.from('chat_messages').insert({
      story_id: storyId,
      user_id: user.id,
      display_name: displayName,
      content: input.trim(),
    })
    setInput('')
    setSending(false)
  }

  return (
    <div className="mt-16 border-t border-charcoal/10 pt-10">
      <h2 className="font-serif text-2xl font-bold mb-6">Gesprek</h2>

      {/* Messages */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
        {messages.length === 0 && (
          <p className="text-charcoal/40 text-sm">Nog geen berichten. Wees de eerste!</p>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${
            user && msg.user_id === user.id ? 'flex-row-reverse' : ''
          }`}>
            <div className={`max-w-xs sm:max-w-md px-4 py-2 rounded-sm ${
              user && msg.user_id === user.id
                ? 'bg-terracotta text-white'
                : 'bg-white shadow-sm'
            }`}>
              {(!user || msg.user_id !== user.id) && (
                <p className="text-xs font-semibold mb-1 text-charcoal/60">{msg.display_name}</p>
              )}
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input or login prompt */}
      {user ? (
        <form onSubmit={sendMessage} className="flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Schrijf een bericht..."
            className="flex-1 border border-charcoal/20 px-3 py-2 bg-white text-sm"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="bg-terracotta text-white px-5 py-2 text-sm font-semibold hover:bg-terracotta/90 disabled:opacity-40"
          >
            Sturen
          </button>
        </form>
      ) : (
        <div className="bg-white p-5 rounded-sm shadow-sm text-center">
          <p className="text-charcoal/70 mb-3">Log in om mee te praten in het gesprek.</p>
          <div className="flex gap-3 justify-center">
            <Link
              href={`/auth/login?next=${encodeURIComponent(storyPath)}`}
              className="bg-terracotta text-white px-5 py-2 text-sm font-semibold hover:bg-terracotta/90"
            >
              Inloggen
            </Link>
            <Link
              href={`/auth/register?next=${encodeURIComponent(storyPath)}`}
              className="border border-charcoal/20 px-5 py-2 text-sm hover:border-terracotta"
            >
              Account aanmaken
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
