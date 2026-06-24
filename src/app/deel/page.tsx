'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default function DeelPage() {
  const [firstName, setFirstName] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('Iran')
  const [storyText, setStoryText] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const wordCount = storyText.trim() ? storyText.trim().split(/\s+/).length : 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData()
    formData.append('first_name', firstName)
    formData.append('city', city)
    formData.append('country', country)
    formData.append('story_text', storyText)
    if (photo) formData.append('photo', photo)
    await fetch('/api/stories', { method: 'POST', body: formData })
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <>
        <Nav />
        <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
          <div className="mb-6 flex h-16 w-16 animate-scale-in items-center justify-center rounded-full bg-terracotta/10 text-3xl">
            ✓
          </div>
          <h1 className="font-serif text-4xl font-bold">Bedankt!</h1>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-charcoal/70">
            Je verhaal is ingediend en wordt zo snel mogelijk beoordeeld. We nemen contact met je op.
          </p>
          <a href="/verhalen" className="btn-primary mt-8 px-6 py-3 text-sm">
            Bekijk andere verhalen →
          </a>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-2xl px-4 py-14">
        <header className="mb-10">
          <p className="eyebrow mb-2">Jouw stem</p>
          <h1 className="font-serif text-4xl font-bold md:text-5xl">Deel jouw verhaal</h1>
          <p className="mt-3 text-charcoal/60">
            Jouw persoonlijke verhaal kan anderen helpen begrijpen wat er speelt. Vertel het op
            jouw manier — eerlijk en in je eigen woorden.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-charcoal/5 bg-paper p-6 shadow-card md:p-8"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Voornaam</label>
              <input required value={firstName} onChange={e => setFirstName(e.target.value)} className="field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Stad</label>
              <input required value={city} onChange={e => setCity(e.target.value)} className="field" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold">Land</label>
            <select value={country} onChange={e => setCountry(e.target.value)} className="field">
              <option>Iran</option>
              <option>Nederland</option>
              <option>Anders</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold">Jouw verhaal</label>
            <textarea
              required
              value={storyText}
              onChange={e => setStoryText(e.target.value)}
              rows={10}
              placeholder="Begin hier met schrijven..."
              className="field resize-none leading-relaxed"
            />
            <div className="mt-2 flex items-center justify-between">
              <p className={`text-xs ${wordCount > 500 ? 'font-semibold text-terracotta' : 'text-charcoal/45'}`}>
                {wordCount} / 500 woorden
              </p>
              <div className="h-1 w-32 overflow-hidden rounded-full bg-charcoal/10">
                <div
                  className={`h-full rounded-full transition-all ${wordCount > 500 ? 'bg-terracotta' : 'bg-terracotta/60'}`}
                  style={{ width: `${Math.min((wordCount / 500) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold">Foto <span className="font-normal text-charcoal/45">(optioneel)</span></label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setPhoto(e.target.files?.[0] || null)}
              className="block w-full text-sm text-charcoal/60 file:mr-4 file:rounded-full file:border-0 file:bg-terracotta/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-terracotta hover:file:bg-terracotta/20"
            />
          </div>

          <button type="submit" disabled={loading || wordCount > 500} className="btn-primary w-full px-8 py-3.5 sm:w-auto">
            {loading ? 'Bezig...' : 'Verhaal indienen'}
          </button>
        </form>
      </main>
      <Footer />
    </>
  )
}
