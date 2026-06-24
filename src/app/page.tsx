import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'
import FlipCard from '@/components/FlipCard'
import Footer from '@/components/Footer'

export const revalidate = 60

export default async function HomePage() {
  const supabase = createClient()
  const { data: stories } = await supabase
    .from('stories')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  const all = stories ?? []

  return (
    <>
      <Nav />
      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-charcoal text-background">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(900px 500px at 85% -10%, rgba(216,155,74,0.10), transparent 60%), radial-gradient(700px 500px at -5% 110%, rgba(192,80,58,0.12), transparent 55%)',
            }}
          />
          <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28 text-center">
            <p className="eyebrow mb-4 animate-fade-up text-terracotta-light">
              Persoonlijke verhalen · Iran
            </p>
            <h1
              className="animate-fade-up font-serif text-5xl font-extrabold leading-[0.95] tracking-tight md:text-8xl"
              style={{ animationDelay: '60ms' }}
            >
              Gezichten<br />van <span className="text-terracotta-light">Iran</span>
            </h1>
            <p
              className="mx-auto mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-background/70 md:text-xl"
              style={{ animationDelay: '120ms' }}
            >
              Klik op een gezicht om de brief te lezen.
            </p>
          </div>
        </section>

        {/* ── Flip-kaarten ── */}
        {all.length > 0 ? (
          <section className="mx-auto max-w-6xl px-4 py-14">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {all.map((story, i) => (
                <div
                  key={story.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  <FlipCard story={story} delay={i * 800} />
                </div>
              ))}
            </div>

            {/* Pijl naar overzicht */}
            <div className="mt-14 flex flex-col items-center gap-4">
              <div className="h-12 w-px bg-charcoal/20" />
              <Link
                href="/verhalen"
                className="group flex flex-col items-center gap-2 text-charcoal/60 transition-colors hover:text-terracotta"
              >
                <span className="text-sm font-semibold uppercase tracking-[0.18em]">Overzicht</span>
                <svg
                  className="h-6 w-6 transition-transform group-hover:translate-y-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>
          </section>
        ) : (
          <section className="mx-auto max-w-6xl px-4 py-20 text-center">
            <p className="rounded-2xl border border-dashed border-charcoal/15 bg-paper p-10 text-charcoal/50">
              Nog geen verhalen. Wees de eerste die er een deelt.
            </p>
            <Link href="/deel" className="btn-primary mt-6 px-7 py-3.5">
              Deel jouw verhaal →
            </Link>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
