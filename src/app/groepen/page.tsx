'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Nav from '@/components/Nav'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Group { id: string; name: string; description: string }
interface Invitation { id: string; group_id: string; group_name: string; invited_by_name: string; created_at: string }

export default function GroepenPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [creating, setCreating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/auth/login?next=/groepen')
      else loadData()
    })
  }, [])

  async function loadData() {
    const [g, i] = await Promise.all([fetch('/api/groups'), fetch('/api/groups/invitations')])
    setGroups(await g.json())
    setInvitations(await i.json())
    setLoading(false)
  }

  async function createGroup(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    const res = await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, description: newDesc }),
    })
    const data = await res.json()
    if (res.ok) router.push(`/groepen/${data.id}`)
    else setCreating(false)
  }

  async function respond(invId: string, action: 'accept' | 'reject') {
    await fetch(`/api/groups/invitations/${invId}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    loadData()
  }

  if (loading) {
    return <><Nav /><main className="max-w-4xl mx-auto px-4 py-12 text-charcoal/50">Laden...</main></>
  }

  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-10">
          <h1 className="font-serif text-4xl font-bold">Groepen</h1>
          <button onClick={() => setShowCreate(!showCreate)} className="bg-terracotta text-white px-5 py-2 font-semibold hover:bg-terracotta/90">
            + Nieuwe groep
          </button>
        </div>

        {showCreate && (
          <form onSubmit={createGroup} className="bg-white p-6 rounded-sm shadow-sm mb-8 space-y-4">
            <h2 className="font-serif text-xl font-bold">Groep aanmaken</h2>
            <input required value={newName} onChange={e => setNewName(e.target.value)} placeholder="Groepsnaam" className="w-full border border-charcoal/20 px-3 py-2" />
            <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Beschrijving (optioneel)" rows={2} className="w-full border border-charcoal/20 px-3 py-2 resize-none" />
            <div className="flex gap-3">
              <button type="submit" disabled={creating} className="bg-terracotta text-white px-5 py-2 font-semibold hover:bg-terracotta/90 disabled:opacity-50">
                {creating ? 'Aanmaken...' : 'Aanmaken'}
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="px-5 py-2 border border-charcoal/20">Annuleren</button>
            </div>
          </form>
        )}

        {invitations.length > 0 && (
          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold mb-4">Uitnodigingen ({invitations.length})</h2>
            <div className="space-y-3">
              {invitations.map(inv => (
                <div key={inv.id} className="bg-white p-4 rounded-sm shadow-sm flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{inv.group_name}</p>
                    <p className="text-sm text-charcoal/60">Uitgenodigd door {inv.invited_by_name}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => respond(inv.id, 'accept')} className="bg-green-600 text-white px-4 py-1.5 text-sm font-semibold hover:bg-green-700">Accepteren</button>
                    <button onClick={() => respond(inv.id, 'reject')} className="border border-charcoal/20 px-4 py-1.5 text-sm hover:border-red-500 hover:text-red-500">Weigeren</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="font-serif text-2xl font-bold mb-4">Mijn groepen</h2>
          {groups.length === 0 ? (
            <p className="text-charcoal/50">Je bent nog geen lid van een groep. Maak er een aan of wacht op een uitnodiging.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {groups.map(group => (
                <Link key={group.id} href={`/groepen/${group.id}`} className="bg-white p-5 rounded-sm shadow-sm hover:shadow-md transition-shadow block">
                  <h3 className="font-serif text-xl font-bold mb-1">{group.name}</h3>
                  {group.description && <p className="text-sm text-charcoal/60">{group.description}</p>}
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  )
}
