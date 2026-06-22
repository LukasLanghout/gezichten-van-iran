'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Nav from '@/components/Nav'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

interface Group { id: string; name: string; description: string; created_by: string }
interface Member { user_id: string; display_name: string; email: string; role: string }

export default function GroepDetailPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const [group, setGroup] = useState<Group | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [inviteMsg, setInviteMsg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push(`/auth/login?next=/groepen/${id}`); return }
      setCurrentUserId(data.user.id)
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

  const isAdmin = members.find(m => m.user_id === currentUserId)?.role === 'admin'

  if (loading) return <><Nav /><main className="max-w-4xl mx-auto px-4 py-12 text-charcoal/50">Laden...</main></>

  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/groepen" className="text-sm text-charcoal/50 hover:text-terracotta">← Terug naar groepen</Link>
        <h1 className="font-serif text-4xl font-bold mt-4 mb-2">{group?.name}</h1>
        {group?.description && <p className="text-charcoal/60 mb-8">{group.description}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-2">
            <h2 className="font-serif text-2xl font-bold mb-4">Leden ({members.length})</h2>
            <div className="space-y-2">
              {members.map(member => (
                <div key={member.user_id} className="bg-white p-3 rounded-sm shadow-sm flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{member.display_name}</p>
                    <p className="text-xs text-charcoal/50">{member.email}</p>
                  </div>
                  {member.role === 'admin' && (
                    <span className="text-xs bg-terracotta/10 text-terracotta px-2 py-0.5 rounded-full">Beheerder</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {isAdmin && (
            <div>
              <h2 className="font-serif text-xl font-bold mb-4">Iemand uitnodigen</h2>
              <form onSubmit={invite} className="space-y-3">
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
                  <p className={`text-sm ${inviteMsg.includes('!') ? 'text-green-600' : 'text-red-500'}`}>{inviteMsg}</p>
                )}
              </form>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
