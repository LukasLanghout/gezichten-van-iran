'use client'
import { useEffect, useState } from 'react'
import Nav from '@/components/Nav'
import StoryCard from '@/components/StoryCard'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'

type Filter = 'alle' | 'iran' | 'nederland'

interface Story {
  id: string
  first_name: string
  city: string
  country: string
  story_text: string
  photo_url: string | null
}

export default function VerhalenPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [filter, setFilter] = useState<Filter>('alle')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    setLoading(true)
    let query = supabase.from('stories').select('*').eq('status', 'approved').order('created_at', { ascending: false })
    if (filter === 'iran') query = query.eq('country', 'Iran')
    if (filter === 'nederland') query = query.eq('country', 'Nederland')
    query.then(({ data }) => { setStories(data || []); setLoading(false) })
  }, [filter])

  const filters: { key: Filter; label: string }[] = [
    { key: 'alle', label: 'Alle' },
    { key: 'iran', label: 'Vanuit Iran' },
    { key: 'nederland', label: 'Vanuit Nederland' },
  ]

  return (
    <>
      <Nav />
      <main className="mx-auto min-h-[60vh] max-w-6xl px-4 py-14">
        <header className="mb-10 max-w-2xl">
          <p className="eyebrow mb-2">De collectie</p>
          <h1 className="font-serif text-4xl font-bold md:text-5xl">Alle verhalen</h1>
          <p className="mt-3 text-charcoal/60">
            Blader door de stemmen achter de gezichten. Filter op herkomst om specifieke
            perspectieven te ontdekken.
          </p>
        </header>

        <div className="mb-10 flex flex-wrap gap-2.5">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-5 py-2 text-sm font-medium transition-all duration-200 ${
                filter === f.key
                  ? 'border-terracotta bg-terracotta text-white shadow-soft'
                  : 'border-charcoal/15 bg-paper/60 text-charcoal/70 hover:border-terracotta hover:text-terracotta'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-72 break-inside-avoid animate-pulse rounded-2xl bg-charcoal/5"
              />
            ))}
          </div>
        ) : stories.length > 0 ? (
          <div className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3">
            {stories.map((story, i) => (
              <div
                key={story.id}
                className="animate-fade-up break-inside-avoid"
                style={{ animationDelay: `${Math.min(i * 50, 300)}ms` }}
              >
                <StoryCard story={story} />
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-charcoal/15 bg-paper p-10 text-center text-charcoal/50">
            Geen verhalen gevonden voor deze filter.
          </p>
        )}
      </main>
      <Footer />
    </>
  )
}
