import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'
import StoryCard from '@/components/StoryCard'
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
  const featured = all[0]
  const rest = all.slice(1)

  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-charcoal text-background">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            style={{
              background:
                'radial-gradient(800px 400px at 85% 0%, rgba(216,155,74,0.5), transparent 60%), radial-gradient(700px 500px at 0% 100%, rgba(192,80,58,0.6), transparent 55%)',
            }}
          />
          <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
            <p className="eyebrow mb-5 animate-fade-up text-terracotta-light">
              Persoonlijke verhalen · Iran
            </p>
            <h1
              className="animate-fade-up font-serif text-5xl font-extrabold leading-[0.95] tracking-tight md:text-8xl"
              style={{ animationDelay: '60ms' }}
            >
              Gezichten
              <br />
              van <span className="text-terracotta-light">Iran</span>
            </h1>
            <p
              className="mt-7 max-w-xl animate-fade-up text-lg leading-relaxed text-background/75 md:text-2xl"
              style={{ animationDelay: '120ms' }}
            >
              Echte mensen, echte verhalen. Voor iedereen die wil begrijpen wat er speelt —
              gezien op straat, gedeeld met de wereld.
            </p>
            <div
              className="mt-10 flex animate-fade-up flex-wrap items-center gap-4"
              style={{ animationDelay: '180ms' }}
            >
              <Link href="/verhalen" className="btn-primary px-7 py-3.5 text-base">
                Ontdek de verhalen →
              </Link>
              <Link
                href="/deel"
                className="inline-flex items-center gap-2 rounded-full border border-background/25 px-7 py-3.5 text-base font-medium text-background transition-all hover:border-background/60 hover:bg-background/5"
              >
                Deel jouw verhaal
              </Link>
            </div>

            <div
              className="mt-14 flex animate-fade-up items-center gap-8 text-sm text-background/55"
              style={{ animationDelay: '240ms' }}
            >
              <div>
                <span className="block font-serif text-3xl font-bold text-background">
                  {all.length}
                </span>
                gedeelde verhalen
              </div>
              <div className="h-10 w-px bg-background/15" />
              <div className="max-w-[14rem] leading-relaxed">
                Iedere stem telt. Iedere ervaring verdient gehoord te worden.
              </div>
            </div>
          </div>
        </section>

        {/* Featured story */}
        {featured && (
          <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
            <Link href={`/verhaal/${featured.id}`} className="group block">
              <div className="grid items-stretch overflow-hidden rounded-3xl border border-charcoal/5 bg-paper shadow-card transition-all duration-300 hover:shadow-card-hover md:grid-cols-2">
                {featured.photo_url && (
                  <div className="relative h-72 w-full overflow-hidden md:h-auto">
                    <Image
                      src={featured.photo_url}
                      alt={featured.first_name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-col justify-center p-8 md:p-12">
                  <p className="eyebrow mb-3">Uitgelicht verhaal · {featured.city} · {featured.country}</p>
                  <h2 className="font-serif text-4xl font-bold leading-tight text-charcoal transition-colors group-hover:text-terracotta md:text-5xl">
                    {featured.first_name}
                  </h2>
                  <p className="mt-4 line-clamp-4 text-base leading-relaxed text-charcoal/70">
                    {featured.story_text}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-terracotta transition-all group-hover:gap-2">
                    Lees het volledige verhaal →
                  </span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Stories grid */}
        <section className="mx-auto max-w-6xl px-4 pb-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="eyebrow mb-1">Meer stemmen</p>
              <h2 className="font-serif text-3xl font-bold md:text-4xl">Recente verhalen</h2>
            </div>
            <Link
              href="/verhalen"
              className="hidden text-sm font-semibold text-terracotta transition-all hover:gap-2 sm:inline-flex sm:items-center sm:gap-1"
            >
              Alle verhalen →
            </Link>
          </div>

          {rest.length > 0 ? (
            <div className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3">
              {rest.map((story, i) => (
                <div
                  key={story.id}
                  className="animate-fade-up break-inside-avoid"
                  style={{ animationDelay: `${Math.min(i * 60, 360)}ms` }}
                >
                  <StoryCard story={story} />
                </div>
              ))}
            </div>
          ) : (
            !featured && (
              <p className="rounded-2xl border border-dashed border-charcoal/15 bg-paper p-10 text-center text-charcoal/50">
                Nog geen verhalen. Wees de eerste die er een deelt.
              </p>
            )
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
