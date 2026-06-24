import Link from 'next/link'
import Image from 'next/image'

interface Story {
  id: string
  first_name: string
  city: string
  country: string
  story_text: string
  photo_url: string | null
}

export default function StoryCard({ story }: { story: Story }) {
  const excerpt = story.story_text.split('. ').slice(0, 2).join('. ').replace(/\.?$/, '.')

  return (
    <Link href={`/verhaal/${story.id}`} className="group block">
      <article className="overflow-hidden rounded-2xl border border-charcoal/5 bg-paper shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
        {story.photo_url && (
          <div className="relative h-60 w-full overflow-hidden">
            <Image
              src={story.photo_url}
              alt={story.first_name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-charcoal/0 to-transparent" />
            <span className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-charcoal backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
              {story.city} · {story.country}
            </span>
          </div>
        )}
        <div className="p-5">
          {!story.photo_url && (
            <p className="eyebrow mb-2">{story.city} · {story.country}</p>
          )}
          <h3 className="font-serif text-2xl font-bold leading-tight text-charcoal transition-colors group-hover:text-terracotta">
            {story.first_name}
          </h3>
          <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-charcoal/65">
            {excerpt}
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-terracotta opacity-0 transition-all duration-300 group-hover:gap-2 group-hover:opacity-100">
            Lees verhaal →
          </span>
        </div>
      </article>
    </Link>
  )
}
