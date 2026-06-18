import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import AdminActions from './AdminActions'
import HomepageQR from './HomepageQR'

export default async function AdminPage() {
  const supabase = createClient()

  const [{ data: pending }, { data: approved }, { data: scanRows }] = await Promise.all([
    supabase.from('stories').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
    supabase.from('stories').select('*').eq('status', 'approved').order('created_at', { ascending: false }),
    supabase.from('qr_scans').select('source'),
  ])

  const totalScans = scanRows?.length || 0
  const homepageScans = scanRows?.filter(r => r.source === 'homepage').length || 0
  const testScans = scanRows?.filter(r => r.source === 'test-qr').length || 0

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gezichten-van-iran.vercel.app'

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl font-bold mb-10">Admin dashboard</h1>

      {/* QR stats */}
      <section className="mb-12 grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-sm shadow-sm text-center">
          <p className="text-3xl font-bold">{totalScans}</p>
          <p className="text-sm text-charcoal/50 mt-1">Totale scans</p>
        </div>
        <div className="bg-white p-4 rounded-sm shadow-sm text-center">
          <p className="text-3xl font-bold">{homepageScans}</p>
          <p className="text-sm text-charcoal/50 mt-1">Homepage QR</p>
        </div>
        <div className="bg-white p-4 rounded-sm shadow-sm text-center">
          <p className="text-3xl font-bold">{testScans}</p>
          <p className="text-sm text-charcoal/50 mt-1">Test QR</p>
        </div>
      </section>

      {/* Homepage QR code */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold mb-4">Homepage QR-code</h2>
        <HomepageQR url={`${siteUrl}/qr/home`} />
      </section>

      {/* Pending stories */}
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

      {/* Approved stories */}
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
