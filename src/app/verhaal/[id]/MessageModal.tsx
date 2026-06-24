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
        className="btn-primary px-6 py-3"
      >
        Stuur een privébericht ✉
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md animate-scale-in rounded-3xl bg-paper p-7 shadow-soft"
            onClick={e => e.stopPropagation()}
          >
            {sent ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta/10 text-2xl">✓</div>
                <h2 className="font-serif text-2xl font-bold">Bedankt!</h2>
                <p className="mt-2 text-charcoal/70">Je bericht is ontvangen.</p>
                <button onClick={() => { setOpen(false); setSent(false) }} className="btn-primary mt-6 px-6 py-2.5 text-sm">Sluiten</button>
              </div>
            ) : (
              <>
                <h2 className="mb-1 font-serif text-2xl font-bold">Stuur een bericht</h2>
                <p className="mb-6 text-sm text-charcoal/55">Een persoonlijk bericht aan de verteller.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jouw naam"
                    className="field"
                  />
                  <textarea
                    required
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Jouw bericht..."
                    rows={4}
                    className="field resize-none"
                  />
                  <div className="flex gap-3">
                    <button type="submit" className="btn-primary px-6 py-2.5 text-sm">Versturen</button>
                    <button type="button" onClick={() => setOpen(false)} className="btn-ghost px-6 py-2.5 text-sm">Annuleren</button>
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
