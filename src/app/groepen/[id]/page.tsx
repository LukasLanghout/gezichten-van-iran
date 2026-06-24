'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Nav from '@/components/Nav'
import Avatar from '@/components/Avatar'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import GroupChat from '@/components/GroupChat'
import type { User } from '@supabase/supabase-js'

interface Group { id: string; name: string; description: string; created_by: string }
interface Member { user_id: string; display_name: string; email: string; role: string }

export default function GroepDetailPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const [group, setGroup] = useState<Group | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [inviteMsg, setInviteMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const [showMembers, setShowMembers] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push(`/auth/login?next=/groepen/${id}`); return }
      setCurrentUser(data.user)
      fetch(`/api/groups/${id}`).then(async res => {
        if (!res.ok) { router.push('/groepen'); return }
        const d = await res.json()
        setGroup(d.group)
        setMembers(d.members)
        setLoading(false)
      })
    })
  }, [id])

  async function invite(e: React.FormEvent) {
    e.preventDefault()
    setInviting(true)
    setInviteMsg('')
    const res = await fetch(`/api/groups/${id}/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail }),
    })
    const data = await res.json()
    setInviteMsg(res.ok ? 'Uitnodiging verstuurd!' : data.error)
    if (res.ok) setInviteEmail('')
    setInviting(false)
  }

  const isAdmin = members.find(m => m.user_id === currentUser?.id)?.role === 'admin'

  if (loading) {
    return (
      <>
        <Nav />
        <main className="mx-auto max-w-5xl px-4 py-8">
          <div className="h-8 w-56 animate-pulse rounded-lg bg-charcoal/5" />
          <div className="mt-6 h-[60vh] animate-pulse rounded-3xl bg-charcoal/5" />
        </main>
      </>
    )
  }

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <Link href="/groepen" className="text-sm font-medium text-charcoal/50 transition-colors hover:text-terracotta">← Groepen</Link>
            <h1 className="mt-1 font-serif text-3xl font-bold md:text-4xl">{group?.name}</h1>
            {group?.description && <p className="mt-1 text-sm text-charcoal/60">{group.description}</p>}
          </div>
          <button
            onClick={() => setShowMembers(!showMembers)}
            className="flex shrink-0 items-center gap-2 rounded-full border border-charcoal/15 bg-paper/60 px-4 py-2 text-sm font-medium transition-colors hover:border-terracotta hover:text-terracotta"
          >
            <span className="flex h-2 w-2 rounded-full bg-pine" />
            {members.length} leden
          </button>
        </div>

        <div className="flex gap-6">
          {/* Chat — main column */}
          <div className="flex-1 rounded-3xl border border-charcoal/5 bg-paper p-6 shadow-card">
            <h2 className="mb-6 border-b border-charcoal/10 pb-4 font-serif text-xl font-bold">Groepschat</h2>
            {currentUser && <GroupChat groupId={id} currentUser={currentUser} />}
          </div>

          {/* Sidebar: members + invite */}
          {showMembers && (
            <aside className="w-72 shrink-0 animate-fade-in space-y-4">
              <div className="rounded-2xl border border-charcoal/5 bg-paper p-5 shadow-card">
                <h3 className="mb-4 font-semibold">Leden</h3>
                <div className="space-y-3">
                  {members.map(member => (
                    <div key={member.user_id} className="flex items-center gap-3">
                      <Avatar name={member.display_name} size={34} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{member.display_name}</p>
                        {member.role === 'admin' && (
                          <span className="text-xs font-medium text-terracotta">Beheerder</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {isAdmin && (
                <div className="rounded-2xl border border-charcoal/5 bg-paper p-5 shadow-card">
                  <h3 className="mb-3 font-semibold">Uitnodigen</h3>
                  <form onSubmit={invite} className="space-y-2.5">
                    <input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      placeholder="E-mailadres"
                      className="field text-sm"
                    />
                    <button type="submit" disabled={inviting} className="btn-primary w-full py-2 text-sm">
                      {inviting ? 'Versturen...' : 'Uitnodiging sturen'}
                    </button>
                    {inviteMsg && (
                      <p className={`text-xs ${inviteMsg.includes('!') ? 'text-pine' : 'text-terracotta'}`}>{inviteMsg}</p>
                    )}
                  </form>
                </div>
              )}
            </aside>
          )}
        </div>
      </main>
    </>
  )
}
