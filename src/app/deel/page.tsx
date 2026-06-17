'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'

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
        <main className="max-w-2xl mx-auto px-4 py-24 text-center">
          <h1 className="font-serif text-4xl font-bold mb-4">Bedankt!</h1>
          <p className="text-lg text-charcoal/70">Je verhaal is ingediend en wordt zo snel mogelijk beoordeeld. We nemen contact met je op.</p>
        </main>
      </>
    )
  }

  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl font-bold mb-2">Deel jouw verhaal</h1>
        <p className="text-charcoal/60 mb-10">Jouw persoonlijke verhaal kan anderen helpen begrijpen wat er speelt.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-1">Voornaam</label>
            <input required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full border border-charcoal/20 px-3 py-2 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Stad</label>
            <input required value={city} onChange={e => setCity(e.target.value)} className="w-full border border-charcoal/20 px-3 py-2 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Land</label>
            <select value={country} onChange={e => setCountry(e.target.value)} className="w-full border border-charcoal/20 px-3 py-2 bg-white">
              <option>Iran</option>
              <option>Nederland</option>
              <option>Anders</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Jouw verhaal</label>
            <textarea
              required
              value={storyText}
              onChange={e => setStoryText(e.target.value)}
              rows={10}
              className="w-full border border-charcoal/20 px-3 py-2 bg-white resize-none"
            />
            <p className={`text-xs mt-1 ${wordCount > 500 ? 'text-red-500' : 'text-charcoal/50'}`}>{wordCount} / 500 woorden</p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Foto (optioneel)</label>
            <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files?.[0] || null)} className="w-full" />
          </div>
          <button
            type="submit"
            disabled={loading || wordCount > 500}
            className="bg-terracotta text-white px-8 py-3 font-semibold hover:bg-terracotta/90 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Bezig...' : 'Verhaal indienen'}
          </button>
        </form>
      </main>
    </>
  )
}
