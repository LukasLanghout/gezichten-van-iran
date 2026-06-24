import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
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
      <main>
        {/* Hero image with title overlay */}
        {story.photo_url ? (
          <header className="relative h-[52vh] min-h-[360px] w-full overflow-hidden">
            <Image
              src={story.photo_url}
              alt={story.first_name}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/10" />
            <div className="absolute inset-x-0 bottom-0">
              <div className="mx-auto max-w-3xl px-4 pb-10">
                <p className="eyebrow mb-2 text-terracotta-light">
                  {story.city} · {story.country}
                </p>
                <h1 className="animate-fade-up font-serif text-5xl font-extrabold leading-none text-background md:text-7xl">
                  {story.first_name}
                </h1>
              </div>
            </div>
          </header>
        ) : (
          <header className="mx-auto max-w-3xl px-4 pt-16">
            <p className="eyebrow mb-2">{story.city} · {story.country}</p>
            <h1 className="font-serif text-5xl font-extrabold leading-none md:text-7xl">
              {story.first_name}
            </h1>
          </header>
        )}

        <article className="mx-auto max-w-3xl px-4 py-12">
          <Link
            href="/verhalen"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-charcoal/50 transition-colors hover:text-terracotta"
          >
            ← Alle verhalen
          </Link>

          <div className="dropcap whitespace-pre-wrap font-serif text-lg leading-[1.85] text-ink/90 md:text-xl">
            {story.story_text}
          </div>

          <div className="my-12 flex items-center gap-4">
            <span className="h-px flex-1 bg-charcoal/10" />
            <span className="h-2 w-2 rotate-45 bg-terracotta/40" />
            <span className="h-px flex-1 bg-charcoal/10" />
          </div>

          <MessageModal storyId={story.id} />
          <Chat storyId={story.id} storyPath={storyPath} />
        </article>
      </main>
      <Footer />
    </>
  )
}
