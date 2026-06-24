import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function VerhaalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient()
  const { data: story } = await supabase.from('stories').select('*').eq('id', id).single()
  if (!story) notFound()

  return (
    <>
      <Nav />
      <main>
        {/* ── Portret met animatie ── */}
        {story.photo_url ? (
          <header className="relative h-[55vh] min-h-[380px] w-full overflow-hidden">
            <div className="animate-float absolute inset-0" style={{ animationDuration: '6s' }}>
              <Image
                src={story.photo_url}
                alt={story.first_name}
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent" />
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
            href="/"
            className="mb-10 inline-flex items-center gap-1.5 text-sm font-medium text-charcoal/50 transition-colors hover:text-terracotta"
          >
            ← Terug naar overzicht
          </Link>

          {/* ── De brief ── */}
          <section aria-label="Brief">
            <p className="eyebrow mb-4">De brief</p>

            {/* Paper card with ruled lines and margin */}
            <div className="relative overflow-hidden rounded-2xl bg-paper shadow-card">
              <div className="letter-lines absolute inset-0" />
              <div className="absolute inset-y-0 left-16 w-px bg-terracotta/15" />

              <div className="relative px-8 py-8 pl-20">
                {/* Greeting */}
                <p className="mb-6 font-serif text-lg italic text-charcoal/70">
                  {story.city}, {new Date(story.created_at ?? Date.now()).toLocaleDateString('nl-NL', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>

                <div className="dropcap whitespace-pre-wrap font-serif text-lg leading-[1.85rem] text-ink">
                  {story.story_text}
                </div>

                <p className="mt-8 font-serif italic text-charcoal/60">
                  — {story.first_name}
                </p>
              </div>
            </div>
          </section>

          {/* ── Scheidingslijn ── */}
          <div className="my-14 flex items-center gap-4">
            <span className="h-px flex-1 bg-charcoal/10" />
            <span className="font-serif text-charcoal/25 text-lg">✉</span>
            <span className="h-px flex-1 bg-charcoal/10" />
          </div>

          {/* ── Brief van een kind ── */}
          {story.child_letter && (
            <section aria-label="Brief van een kind">
              <p className="eyebrow mb-4">Brief van een kind</p>

              {/* Slightly different paper — warmer, more childlike */}
              <div className="relative overflow-hidden rounded-2xl shadow-card" style={{ background: '#FFF9F0' }}>
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      to bottom,
                      transparent,
                      transparent calc(1.9rem - 1px),
                      rgba(28,28,28,0.06) calc(1.9rem - 1px),
                      rgba(28,28,28,0.06) 1.9rem
                    )`,
                    backgroundSize: '100% 1.9rem',
                  }}
                />
                {/* Pink margin line */}
                <div className="absolute inset-y-0 left-14 w-px bg-terracotta/30" />

                <div className="relative px-6 py-8 pl-18" style={{ paddingLeft: '4.5rem' }}>
                  {/* Pencil icon top-right */}
                  <div className="absolute right-5 top-5 text-2xl opacity-20">✏️</div>

                  <div className="handwritten text-[16px] text-ink/80">
                    {story.child_letter.split('\n').map((line: string, i: number) => (
                      <span key={i}>
                        {line}
                        {i < story.child_letter.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          <div className="mt-12">
            <Link
              href="/deel"
              className="btn-primary px-7 py-3.5"
            >
              Deel jouw eigen verhaal →
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
