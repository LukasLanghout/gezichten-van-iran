'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function GroupsNavLink() {
  const [count, setCount] = useState(0)

  async function fetchCount() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setCount(0); return }
    const res = await fetch('/api/groups/invitations')
    const data = await res.json()
    setCount(Array.isArray(data) ? data.length : 0)
  }

  useEffect(() => {
    fetchCount()
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => fetchCount())
    // Re-check every 30s in case a new invite arrives
    const interval = setInterval(fetchCount, 30_000)
    return () => { subscription.unsubscribe(); clearInterval(interval) }
  }, [])

  return (
    <Link href="/groepen" className="relative hover:text-terracotta transition-colors">
      Groepen
      {count > 0 && (
        <span className="absolute -top-2.5 -right-3.5 bg-terracotta text-white text-[10px] min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center font-bold">
          {count}
        </span>
      )}
    </Link>
  )
}
