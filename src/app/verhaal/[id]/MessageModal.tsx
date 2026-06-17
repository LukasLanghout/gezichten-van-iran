'use client'
import { useState } from 'react'

export default function MessageModal({ storyId }: { storyId: string }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ story_id: storyId, sender_name: name, message }),
    })
    setSent(true)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-terracotta text-white px-6 py-3 font-semibold hover:bg-terracotta/90 transition-colors"
      >
        Stuur een bericht
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background max-w-md w-full p-6 rounded-sm">
            {sent ? (
              <div>
                <h2 className="font-serif text-2xl mb-4">Bedankt!</h2>
                <p className="text-charcoal/70 mb-4">Je bericht is ontvangen.</p>
                <button onClick={() => { setOpen(false); setSent(false) }} className="text-terracotta font-semibold">Sluiten</button>
              </div>
            ) : (
              <>
                <h2 className="font-serif text-2xl mb-6">Stuur een bericht</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jouw naam"
                    className="w-full border border-charcoal/20 px-3 py-2 bg-white"
                  />
                  <textarea
                    required
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Jouw bericht..."
                    rows={4}
                    className="w-full border border-charcoal/20 px-3 py-2 bg-white resize-none"
                  />
                  <div className="flex gap-3">
                    <button type="submit" className="bg-terracotta text-white px-5 py-2 font-semibold hover:bg-terracotta/90">Versturen</button>
                    <button type="button" onClick={() => setOpen(false)} className="px-5 py-2 border border-charcoal/20 hover:border-charcoal">Annuleren</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
