import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'
import Image from 'next/image'
import MessageModal from './MessageModal'
import Chat from '@/components/Chat'
import { notFound } from 'next/navigation'

export default async function VerhaalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient()
  const { data: story } = await supabase.from('stories').select('*').eq('id', id).single()
  if (!story) notFound()

  const storyPath = `/verhaal/${id}`

  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-12">
        {story.photo_url && (
          <div className="relative w-full h-80 mb-8 rounded-sm overflow-hidden">
            <Image src={story.photo_url} alt={story.first_name} fill className="object-cover" />
          </div>
        )}
        <p className="text-xs text-charcoal/50 uppercase tracking-wider mb-2">
          {story.city} · {story.country}
        </p>
        <h1 className="font-serif text-4xl font-bold mb-6">{story.first_name}</h1>
        <p className="text-lg leading-relaxed whitespace-pre-wrap mb-10">{story.story_text}</p>
        <MessageModal storyId={story.id} />
        <Chat storyId={story.id} storyPath={storyPath} />
      </main>
    </>
  )
}
