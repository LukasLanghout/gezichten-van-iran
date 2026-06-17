'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminActions({ storyId }: { storyId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function updateStatus(status: 'approved' | 'rejected') {
    setLoading(true)
    await fetch(`/api/admin/stories/${storyId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex gap-3 mt-3">
      <button
        onClick={() => updateStatus('approved')}
        disabled={loading}
        className="px-4 py-1.5 bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50"
      >
        Goedkeuren
      </button>
      <button
        onClick={() => updateStatus('rejected')}
        disabled={loading}
        className="px-4 py-1.5 bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
      >
        Afwijzen
      </button>
    </div>
  )
}
