import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PosterPreview from './PosterPreview'

export default async function PosterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient()

  const { data: story } = await supabase.from('stories').select('*').eq('id', id).single()
  if (!story) redirect('/admin')

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gezichten-van-iran.vercel.app'
  const storyUrl = `${siteUrl}/verhaal/${id}`

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl font-bold mb-8">Poster: {story.first_name}</h1>
      <PosterPreview story={story} storyUrl={storyUrl} />
    </main>
  )
}
