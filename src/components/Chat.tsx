'use client'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import InviteToGroupModal from './InviteToGroupModal'
import Avatar from './Avatar'
import type { User } from '@supabase/supabase-js'

interface Message {
  id: string
  user_id: string
  display_name: string
  content: string
  created_at: string
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'nu'
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} uur`
  return `${Math.floor(h / 24)} d`
}

export default function Chat({ storyId, storyPath }: { storyId: string; storyPath: string }) {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [invite, setInvite] = useState<{ userId: string; displayName: string } | null>(null)
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
    <div className="mt-14 rounded-3xl border border-charcoal/5 bg-paper p-6 shadow-card md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <h2 className="font-serif text-2xl font-bold">Gesprek</h2>
        {messages.length > 0 && (
          <span className="rounded-full bg-terracotta/10 px-2.5 py-0.5 text-xs font-semibold text-terracotta">
            {messages.length}
          </span>
        )}
      </div>

      <div className="mb-6 max-h-[28rem] space-y-4 overflow-y-auto pr-1">
        {messages.length === 0 && (
          <div className="rounded-2xl border border-dashed border-charcoal/15 py-10 text-center">
            <p className="text-sm text-charcoal/45">Nog geen berichten. Wees de eerste!</p>
          </div>
        )}
        {messages.map(msg => {
          const own = !!user && msg.user_id === user.id
          return (
            <div key={msg.id} className={`flex animate-fade-in gap-3 ${own ? 'flex-row-reverse' : ''}`}>
              <Avatar name={msg.display_name} size={36} />
              <div className={`max-w-[80%] ${own ? 'items-end text-right' : ''} flex flex-col`}>
                <div className={`mb-1 flex items-baseline gap-2 ${own ? 'flex-row-reverse' : ''}`}>
                  <button
                    onClick={() => setInvite({ userId: msg.user_id, displayName: msg.display_name })}
                    className={`text-sm font-semibold transition-colors hover:underline ${
                      own ? 'text-terracotta' : 'text-charcoal hover:text-terracotta'
                    }`}
                    title="Uitnodigen voor groep"
                  >
                    {msg.display_name}
                  </button>
                  <span className="text-[11px] text-charcoal/35">{timeAgo(msg.created_at)}</span>
                </div>
                <div
                  className={`inline-block rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    own
                      ? 'rounded-tr-sm bg-terracotta text-white'
                      : 'rounded-tl-sm bg-sand text-ink'
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

      {user ? (
        <form onSubmit={sendMessage} className="flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Schrijf een bericht..."
            className="field flex-1 rounded-full"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="btn-primary px-6 py-2.5 text-sm"
          >
            Sturen
          </button>
        </form>
      ) : (
        <div className="rounded-2xl bg-sand/60 p-6 text-center">
          <p className="mb-4 text-charcoal/70">Log in om mee te praten in het gesprek.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={`/auth/login?next=${encodeURIComponent(storyPath)}`} className="btn-primary px-6 py-2.5 text-sm">
              Inloggen
            </Link>
            <Link href={`/auth/register?next=${encodeURIComponent(storyPath)}`} className="btn-ghost px-6 py-2.5 text-sm">
              Account aanmaken
            </Link>
          </div>
        </div>
      )}

      {invite && (
        <InviteToGroupModal
          userId={invite.userId}
          displayName={invite.displayName}
          onClose={() => setInvite(null)}
        />
      )}
    </div>
  )
}
