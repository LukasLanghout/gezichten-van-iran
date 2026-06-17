import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import AdminActions from './AdminActions'

export default async function AdminPage() {
  const supabase = createClient()

  const [{ data: pending }, { data: approved }, { count: scanCount }] = await Promise.all([
    supabase.from('stories').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
    supabase.from('stories').select('*').eq('status', 'approved').order('created_at', { ascending: false }),
    supabase.from('qr_scans').select('*', { count: 'exact', head: true }),
  ])

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="font-serif text-3xl font-bold">Admin dashboard</h1>
        <p className="text-sm text-charcoal/50">QR-scans totaal: <strong>{scanCount}</strong></p>
      </div>

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold mb-4">In behandeling ({pending?.length || 0})</h2>
        {pending?.length === 0 ? (
          <p className="text-charcoal/50">Geen verhalen in behandeling.</p>
        ) : (
          <div className="space-y-4">
            {pending?.map(story => (
              <div key={story.id} className="bg-white p-4 rounded-sm shadow-sm">
                <p className="font-semibold">{story.first_name} — {story.city}, {story.country}</p>
                <p className="text-sm text-charcoal/60 mt-1 line-clamp-2">{story.story_text}</p>
                <AdminActions storyId={story.id} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold mb-4">Goedgekeurde verhalen ({approved?.length || 0})</h2>
        <div className="space-y-3">
          {approved?.map(story => (
            <div key={story.id} className="flex justify-between items-center bg-white p-3 rounded-sm shadow-sm">
              <span>{story.first_name} — {story.city}, {story.country}</span>
              <Link href={`/admin/poster/${story.id}`} className="text-terracotta text-sm font-semibold hover:underline">Genereer poster</Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
