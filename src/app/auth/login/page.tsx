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
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm animate-scale-in rounded-3xl border border-charcoal/5 bg-paper p-8 shadow-card">
          <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-terracotta">
            <span className="h-4 w-4 rounded-full border-2 border-background" />
          </span>
          <h1 className="font-serif text-3xl font-bold">Welkom terug</h1>
          <p className="mt-1.5 mb-7 text-sm text-charcoal/60">
            Nog geen account?{' '}
            <Link href={`/auth/register?next=${encodeURIComponent(next)}`} className="font-semibold text-terracotta hover:underline">
              Registreer hier
            </Link>
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mailadres" className="field" />
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Wachtwoord" className="field" />
            {error && <p className="rounded-lg bg-terracotta/10 px-3 py-2 text-sm text-terracotta-dark">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
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
