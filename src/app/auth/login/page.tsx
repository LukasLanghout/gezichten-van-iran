'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import { Suspense } from 'react'

function LoginForm() {
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
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push(next)
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-3xl font-bold mb-2">Inloggen</h1>
          <p className="text-charcoal/60 mb-8 text-sm">Nog geen account? <Link href={`/auth/register?next=${encodeURIComponent(next)}`} className="text-terracotta hover:underline">Registreer hier</Link></p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mailadres" className="w-full border border-charcoal/20 px-3 py-2 bg-white" />
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Wachtwoord" className="w-full border border-charcoal/20 px-3 py-2 bg-white" />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-terracotta text-white py-2 font-semibold hover:bg-terracotta/90 disabled:opacity-50">
              {loading ? 'Bezig...' : 'Inloggen'}
            </button>
          </form>
        </div>
      </main>
    </>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}
