'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Avatar from './Avatar'

interface Group { id: string; name: string; role: string }

export default function InviteToGroupModal({
  userId,
  displayName,
  onClose,
}: {
  userId: string
  displayName: string
  onClose: () => void
}) {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSelf, setIsSelf] = useState(false)
  const [sending, setSending] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, string>>({})

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setLoading(false); return }
      if (data.user.id === userId) { setIsSelf(true); setLoading(false); return }
      setIsLoggedIn(true)
      const res = await fetch('/api/groups')
      const all: Group[] = await res.json()
      // Only show groups where current user is admin
      setGroups(Array.isArray(all) ? all.filter(g => g.role === 'admin') : [])
      setLoading(false)
    })
  }, [userId])

  async function invite(groupId: string) {
    setSending(groupId)
    const res = await fetch(`/api/groups/${groupId}/invite-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    const data = await res.json()
    setResults(prev => ({ ...prev, [groupId]: res.ok ? 'Uitnodiging verstuurd!' : data.error }))
    setSending(null)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm animate-scale-in rounded-3xl bg-paper p-6 shadow-soft"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold">Uitnodigen voor groep</h2>
          <button onClick={onClose} className="text-2xl leading-none text-charcoal/40 transition-colors hover:text-charcoal">&times;</button>
        </div>

        <div className="mb-5 flex items-center gap-3 rounded-2xl bg-sand/60 p-3">
          <Avatar name={displayName} size={40} />
          <div>
            <p className="text-xs text-charcoal/55">Uitnodigen</p>
            <p className="font-semibold text-charcoal">{displayName}</p>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-charcoal/50">Laden...</p>
        ) : isSelf ? (
          <p className="rounded-xl bg-sand/60 p-4 text-center text-sm text-charcoal/55">Je kunt jezelf niet uitnodigen.</p>
        ) : !isLoggedIn ? (
          <div className="space-y-3 text-center">
            <p className="text-sm text-charcoal/60">Je moet ingelogd zijn om uit te nodigen.</p>
            <Link href="/auth/login" onClick={onClose} className="btn-primary px-5 py-2.5 text-sm">
              Inloggen
            </Link>
          </div>
        ) : groups.length === 0 ? (
          <div className="space-y-3 text-center">
            <p className="text-sm text-charcoal/60">Je bent nog geen beheerder van een groep.</p>
            <Link href="/groepen" onClick={onClose} className="inline-block text-sm font-semibold text-terracotta hover:underline">
              Maak een groep aan →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {groups.map(group => (
              <div key={group.id} className="flex items-center justify-between gap-3 rounded-xl bg-sand/50 p-3">
                <span className="text-sm font-semibold">{group.name}</span>
                {results[group.id] ? (
                  <span className={`text-xs font-medium ${
                    results[group.id].includes('!') ? 'text-pine' : 'text-terracotta'
                  }`}>
                    {results[group.id]}
                  </span>
                ) : (
                  <button
                    onClick={() => invite(group.id)}
                    disabled={sending === group.id}
                    className="rounded-full bg-terracotta px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-terracotta-dark disabled:opacity-50"
                  >
                    {sending === group.id ? '...' : 'Uitnodigen'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
