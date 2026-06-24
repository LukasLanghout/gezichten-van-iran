'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Nav from '@/components/Nav'
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

  if (loading) return <><Nav /><main className="max-w-5xl mx-auto px-4 py-12 text-charcoal/50">Laden...</main></>

  return (
    <>
      <Nav />
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/groepen" className="text-sm text-charcoal/50 hover:text-terracotta">← Groepen</Link>
            <h1 className="font-serif text-3xl font-bold mt-1">{group?.name}</h1>
            {group?.description && <p className="text-charcoal/60 text-sm mt-1">{group.description}</p>}
          </div>
          <button
            onClick={() => setShowMembers(!showMembers)}
            className="flex items-center gap-2 border border-charcoal/20 px-4 py-2 text-sm hover:border-charcoal transition-colors"
          >
            <span>{members.length} leden</span>
          </button>
        </div>

        <div className="flex gap-6">
          {/* Chat — main column */}
          <div className="flex-1 bg-white rounded-sm shadow-sm p-6">
            <h2 className="font-serif text-xl font-bold mb-6 pb-4 border-b border-charcoal/10">Groepschat</h2>
            {currentUser && <GroupChat groupId={id} currentUser={currentUser} />}
          </div>

          {/* Sidebar: members + invite */}
          {showMembers && (
            <aside className="w-64 shrink-0 space-y-4">
              <div className="bg-white rounded-sm shadow-sm p-4">
                <h3 className="font-semibold mb-3">Leden</h3>
                <div className="space-y-2">
                  {members.map(member => (
                    <div key={member.user_id} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold">{member.display_name}</p>
                        {member.role === 'admin' && (
                          <span className="text-xs text-terracotta">Beheerder</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {isAdmin && (
                <div className="bg-white rounded-sm shadow-sm p-4">
                  <h3 className="font-semibold mb-3">Uitnodigen</h3>
                  <form onSubmit={invite} className="space-y-2">
                    <input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      placeholder="E-mailadres"
                      className="w-full border border-charcoal/20 px-3 py-2 bg-white text-sm"
                    />
                    <button type="submit" disabled={inviting} className="w-full bg-terracotta text-white py-2 text-sm font-semibold hover:bg-terracotta/90 disabled:opacity-50">
                      {inviting ? 'Versturen...' : 'Uitnodiging sturen'}
                    </button>
                    {inviteMsg && (
                      <p className={`text-xs ${inviteMsg.includes('!') ? 'text-green-600' : 'text-red-500'}`}>{inviteMsg}</p>
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
