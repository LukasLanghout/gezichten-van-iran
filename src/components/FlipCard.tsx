'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Story {
  id: string
  first_name: string
  city: string
  country: string
  story_text: string
  photo_url: string | null
}

// Show the first ~120 words of the letter on the back of the card
function excerpt(text: string, words = 120) {
  const ws = text.trim().split(/\s+/)
  return ws.length <= words ? text : ws.slice(0, words).join(' ') + '…'
}

export default function FlipCard({ story, delay = 0 }: { story: Story; delay?: number }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="flip-scene w-full" style={{ height: 520 }}>
      <div
        className={`flip-inner relative h-full w-full cursor-pointer ${flipped ? 'is-flipped' : ''}`}
        onClick={() => setFlipped(f => !f)}
        role="button"
        aria-pressed={flipped}
        aria-label={flipped ? `Sluit brief van ${story.first_name}` : `Lees brief van ${story.first_name}`}
      >
        {/* ── VOORZIJDE: portret ── */}
        <div className="flip-face absolute inset-0 overflow-hidden rounded-3xl shadow-card">
          {story.photo_url ? (
            <>
              <div
                className="animate-float absolute inset-0"
                style={{ animationDelay: `${delay}ms` }}
              >
                <Image
                  src={story.photo_url}
                  alt={story.first_name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Gradient overlay bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-charcoal" />
          )}

          {/* Name + location */}
          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta-light">
              {story.city} · {story.country}
            </p>
            <h2 className="mt-1 font-serif text-3xl font-extrabold text-background">
              {story.first_name}
            </h2>
            <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-background/60">
              <span className="inline-block animate-pulse">✉</span>
              Klik om de brief te lezen
            </p>
          </div>
        </div>

        {/* ── ACHTERZIJDE: brief ── */}
        <div className="flip-face flip-face-back absolute inset-0 overflow-hidden rounded-3xl bg-paper shadow-card">
          {/* Ruled-paper effect */}
          <div className="letter-lines absolute inset-0 opacity-100" />

          {/* Red margin line */}
          <div className="absolute inset-y-0 left-16 w-px bg-terracotta/20" />

          <div className="relative flex h-full flex-col p-8 pl-20">
            {/* Header */}
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-terracotta/70">
                  Brief van
                </p>
                <h3 className="font-serif text-xl font-bold text-charcoal">{story.first_name}</h3>
                <p className="text-xs text-charcoal/45">{story.city}, {story.country}</p>
              </div>
              <span className="text-2xl opacity-30">✉</span>
            </div>

            {/* Letter text */}
            <div className="flex-1 overflow-hidden">
              <p className="font-serif text-[15px] italic leading-[1.85rem] text-ink/85">
                {excerpt(story.story_text)}
              </p>
            </div>

            {/* Footer: link to full story */}
            <div className="mt-4 flex items-center justify-between border-t border-charcoal/10 pt-4">
              <span className="text-xs text-charcoal/40">Klik kaart om terug te draaien</span>
              <Link
                href={`/verhaal/${story.id}`}
                onClick={e => e.stopPropagation()}
                className="inline-flex items-center gap-1 rounded-full bg-terracotta px-4 py-1.5 text-xs font-semibold text-white transition-all hover:bg-terracotta-dark"
              >
                Lees volledig →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
