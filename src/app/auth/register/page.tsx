'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import { Suspense } from 'react'

function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) { setError(error.message); setLoading(false) }
    else router.push(next)
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-3xl font-bold mb-2">Account aanmaken</h1>
          <p className="text-charcoal/60 mb-8 text-sm">Al een account? <Link href={`/auth/login?next=${encodeURIComponent(next)}`} className="text-terracotta hover:underline">Log hier in</Link></p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required value={name} onChange={e => setName(e.target.value)} placeholder="Jouw naam" className="w-full border border-charcoal/20 px-3 py-2 bg-white" />
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mailadres" className="w-full border border-charcoal/20 px-3 py-2 bg-white" />
            <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="Wachtwoord (min. 6 tekens)" className="w-full border border-charcoal/20 px-3 py-2 bg-white" />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-terracotta text-white py-2 font-semibold hover:bg-terracotta/90 disabled:opacity-50">
              {loading ? 'Bezig...' : 'Account aanmaken'}
            </button>
          </form>
        </div>
      </main>
    </>
  )
}

export default function RegisterPage() {
  return <Suspense><RegisterForm /></Suspense>
}
