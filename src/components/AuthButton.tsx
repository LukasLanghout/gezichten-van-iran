'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import Avatar from './Avatar'
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
    const displayName = user.user_metadata?.name || user.email?.split('@')[0] || 'Account'
    return (
      <div className="flex items-center gap-2 text-sm">
        <Avatar name={displayName} size={28} />
        <span className="hidden text-charcoal/70 sm:inline">{displayName}</span>
        <button
          onClick={logout}
          className="rounded-full px-2 py-1 text-charcoal/50 transition-colors hover:text-terracotta"
          title="Uitloggen"
        >
          Uitloggen
        </button>
      </div>
    )
  }

  return (
    <Link
      href={`/auth/login?next=${encodeURIComponent(pathname)}`}
      className="rounded-full px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-charcoal/5 hover:text-terracotta"
    >
      Inloggen
    </Link>
  )
}
