'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/admin')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl font-bold mb-8">Admin login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mailadres" className="w-full border border-charcoal/20 px-3 py-2 bg-white" />
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Wachtwoord" className="w-full border border-charcoal/20 px-3 py-2 bg-white" />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-charcoal text-background py-2 font-semibold hover:bg-charcoal/90 disabled:opacity-50">
            {loading ? 'Inloggen...' : 'Inloggen'}
          </button>
        </form>
      </div>
    </main>
  )
}
