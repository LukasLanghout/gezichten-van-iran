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
  const excerpt = story.story_text.split('. ').slice(0, 2).join('. ') + '.'
  return (
    <Link href={`/verhaal/${story.id}`} className="block group">
      <div className="bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {story.photo_url && (
          <div className="relative h-56 w-full">
            <Image src={story.photo_url} alt={story.first_name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        )}
        <div className="p-4">
          <p className="text-xs text-charcoal/50 uppercase tracking-wider mb-1">{story.city} · {story.country}</p>
          <h3 className="font-serif text-xl font-bold mb-2">{story.first_name}</h3>
          <p className="text-sm text-charcoal/70 leading-relaxed line-clamp-3">{excerpt}</p>
        </div>
      </div>
    </Link>
  )
}
