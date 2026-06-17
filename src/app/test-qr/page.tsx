import { createClient } from '@/lib/supabase/server'

export default async function TestQRPage() {
  const supabase = createClient()
  await supabase.from('qr_scans').insert({ scanned_at: new Date().toISOString() })

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <p className="font-serif text-4xl mb-4">🙏</p>
        <h1 className="font-serif text-3xl font-bold mb-4">Bedankt!</h1>
        <p className="text-lg text-charcoal/70">
          Bedankt dat je onze QR-code hebt gescand! Je helpt ons project verder.
        </p>
      </div>
    </main>
  )
}
