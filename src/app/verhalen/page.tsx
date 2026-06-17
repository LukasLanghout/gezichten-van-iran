'use client'
import { useEffect, useState } from 'react'
import Nav from '@/components/Nav'
import StoryCard from '@/components/StoryCard'
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

  useEffect(() => {
    const supabase = createClient()
    let query = supabase.from('stories').select('*').eq('status', 'approved').order('created_at', { ascending: false })
    if (filter === 'iran') query = query.eq('country', 'Iran')
    if (filter === 'nederland') query = query.eq('country', 'Nederland')
    query.then(({ data }) => setStories(data || []))
  }, [filter])

  const filters: { key: Filter; label: string }[] = [
    { key: 'alle', label: 'Alle' },
    { key: 'iran', label: 'Vanuit Iran' },
    { key: 'nederland', label: 'Vanuit Nederland' },
  ]

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl font-bold mb-8">Alle verhalen</h1>
        <div className="flex gap-3 mb-10">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 text-sm rounded-full border transition-colors ${filter === f.key ? 'bg-terracotta text-white border-terracotta' : 'border-charcoal/20 hover:border-terracotta'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {stories.map(story => (
            <div key={story.id} className="break-inside-avoid">
              <StoryCard story={story} />
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
