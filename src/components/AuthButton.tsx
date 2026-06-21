'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  if (user) {
    const displayName = user.user_metadata?.name || user.email?.split('@')[0]
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="text-charcoal/60 hidden sm:inline">{displayName}</span>
        <button onClick={logout} className="hover:text-terracotta transition-colors">Uitloggen</button>
      </div>
    )
  }

  return (
    <Link
      href={`/auth/login?next=${encodeURIComponent(pathname)}`}
      className="text-sm hover:text-terracotta transition-colors font-semibold"
    >
      Inloggen
    </Link>
  )
}
