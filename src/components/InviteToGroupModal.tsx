'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

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
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-background max-w-sm w-full p-6 rounded-sm shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-xl font-bold">Uitnodigen voor groep</h2>
          <button onClick={onClose} className="text-charcoal/40 hover:text-charcoal text-2xl leading-none">&times;</button>
        </div>

        <p className="text-sm text-charcoal/60 mb-5">
          Nodig <strong className="text-charcoal">{displayName}</strong> uit
        </p>

        {loading ? (
          <p className="text-sm text-charcoal/50">Laden...</p>
        ) : isSelf ? (
          <p className="text-sm text-charcoal/50">Je kunt jezelf niet uitnodigen.</p>
        ) : !isLoggedIn ? (
          <div className="text-center space-y-3">
            <p className="text-sm text-charcoal/60">Je moet ingelogd zijn om uit te nodigen.</p>
            <Link href="/auth/login" onClick={onClose} className="inline-block bg-terracotta text-white px-5 py-2 text-sm font-semibold hover:bg-terracotta/90">
              Inloggen
            </Link>
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center space-y-3">
            <p className="text-sm text-charcoal/60">Je bent nog geen beheerder van een groep.</p>
            <Link href="/groepen" onClick={onClose} className="inline-block text-terracotta text-sm font-semibold hover:underline">
              Maak een groep aan →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {groups.map(group => (
              <div key={group.id} className="flex justify-between items-center p-3 bg-white rounded-sm">
                <span className="text-sm font-semibold">{group.name}</span>
                {results[group.id] ? (
                  <span className={`text-xs font-medium ${
                    results[group.id].includes('!') ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {results[group.id]}
                  </span>
                ) : (
                  <button
                    onClick={() => invite(group.id)}
                    disabled={sending === group.id}
                    className="text-xs bg-terracotta text-white px-3 py-1.5 font-semibold hover:bg-terracotta/90 disabled:opacity-50"
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
