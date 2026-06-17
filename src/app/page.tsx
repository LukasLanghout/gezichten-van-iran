import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'
import StoryCard from '@/components/StoryCard'

export const revalidate = 60

export default async function HomePage() {
  const supabase = createClient()
  const { data: stories } = await supabase
    .from('stories')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="bg-charcoal text-background py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Gezichten<br />van Iran
            </h1>
            <p className="text-xl md:text-2xl text-background/80 max-w-xl">
              Persoonlijke verhalen van mensen die verbonden zijn aan Iran — voor iedereen die wil begrijpen wat er speelt.
            </p>
          </div>
        </section>

        {/* Stories grid */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="font-serif text-3xl font-bold mb-8">Recente verhalen</h2>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {stories?.map(story => (
              <div key={story.id} className="break-inside-avoid">
                <StoryCard story={story} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
