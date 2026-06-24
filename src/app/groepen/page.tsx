'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
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
    return (
      <>
        <Nav />
        <main className="mx-auto max-w-4xl px-4 py-14">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-charcoal/5" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-charcoal/5" />
            ))}
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Nav />
      <main className="mx-auto min-h-[60vh] max-w-4xl px-4 py-14">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="eyebrow mb-2">Samen praten</p>
            <h1 className="font-serif text-4xl font-bold md:text-5xl">Groepen</h1>
          </div>
          <button onClick={() => setShowCreate(!showCreate)} className="btn-primary px-5 py-2.5 text-sm">
            {showCreate ? 'Sluiten' : '+ Nieuwe groep'}
          </button>
        </div>

        {showCreate && (
          <form onSubmit={createGroup} className="mb-8 animate-scale-in space-y-4 rounded-3xl border border-charcoal/5 bg-paper p-6 shadow-card">
            <h2 className="font-serif text-xl font-bold">Groep aanmaken</h2>
            <input required value={newName} onChange={e => setNewName(e.target.value)} placeholder="Groepsnaam" className="field" />
            <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Beschrijving (optioneel)" rows={2} className="field resize-none" />
            <div className="flex gap-3">
              <button type="submit" disabled={creating} className="btn-primary px-6 py-2.5 text-sm">
                {creating ? 'Aanmaken...' : 'Aanmaken'}
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="btn-ghost px-6 py-2.5 text-sm">Annuleren</button>
            </div>
          </form>
        )}

        {invitations.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 font-serif text-2xl font-bold">
              Uitnodigingen <span className="text-terracotta">({invitations.length})</span>
            </h2>
            <div className="space-y-3">
              {invitations.map(inv => (
                <div key={inv.id} className="flex items-center justify-between gap-4 rounded-2xl border border-terracotta/20 bg-terracotta/[0.04] p-4">
                  <div>
                    <p className="font-semibold">{inv.group_name}</p>
                    <p className="text-sm text-charcoal/60">Uitgenodigd door {inv.invited_by_name}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button onClick={() => respond(inv.id, 'accept')} className="rounded-full bg-pine px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:opacity-90">Accepteren</button>
                    <button onClick={() => respond(inv.id, 'reject')} className="rounded-full border border-charcoal/15 px-4 py-1.5 text-sm transition-colors hover:border-terracotta hover:text-terracotta">Weigeren</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-4 font-serif text-2xl font-bold">Mijn groepen</h2>
          {groups.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-charcoal/15 bg-paper p-8 text-center text-charcoal/50">
              Je bent nog geen lid van een groep. Maak er een aan of wacht op een uitnodiging.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {groups.map(group => (
                <Link
                  key={group.id}
                  href={`/groepen/${group.id}`}
                  className="group block rounded-2xl border border-charcoal/5 bg-paper p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  <h3 className="mb-1 font-serif text-xl font-bold transition-colors group-hover:text-terracotta">{group.name}</h3>
                  {group.description
                    ? <p className="text-sm text-charcoal/60">{group.description}</p>
                    : <p className="text-sm text-charcoal/35">Geen beschrijving</p>}
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-terracotta opacity-0 transition-opacity group-hover:opacity-100">
                    Open chat →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
