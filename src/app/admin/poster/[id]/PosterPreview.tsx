'use client'
import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

interface Story {
  id: string
  first_name: string
  city: string
  country: string
  story_text: string
  photo_url: string | null
}

export default function PosterPreview({ story, storyUrl }: { story: Story; storyUrl: string }) {
  const posterRef = useRef<HTMLDivElement>(null)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const pullQuote = story.story_text.split('. ').slice(0, 2).join('. ') + '.'

  useEffect(() => {
    QRCode.toDataURL(storyUrl, { width: 200, margin: 1 }).then(setQrDataUrl)
  }, [storyUrl])

  async function downloadPoster() {
    if (!posterRef.current) return
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(posterRef.current, { scale: 2, useCORS: true })
    const link = document.createElement('a')
    link.download = `poster-${story.first_name.toLowerCase()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div>
      <div
        ref={posterRef}
        className="bg-background"
        style={{ width: 595, minHeight: 842, position: 'relative', overflow: 'hidden', fontFamily: 'Georgia, serif' }}
      >
        {/* Photo */}
        {story.photo_url && (
          <div style={{ width: '100%', height: 420, overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={story.photo_url} alt={story.first_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
          </div>
        )}
        {/* Quote */}
        <div style={{ padding: '40px 48px 24px' }}>
          <p style={{ fontSize: 28, lineHeight: 1.4, fontStyle: 'italic', color: '#1C1C1C', marginBottom: 24 }}>
            &ldquo;{pullQuote}&rdquo;
          </p>
          <p style={{ fontSize: 16, color: '#C0503A', fontWeight: 'bold', fontFamily: 'system-ui, sans-serif' }}>
            — {story.first_name}, {story.city}
          </p>
        </div>
        {/* Footer */}
        <div style={{ position: 'absolute', bottom: 40, left: 48, right: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ fontSize: 20, fontWeight: 'bold', color: '#1C1C1C' }}>Gezichten van Iran</p>
            <p style={{ fontSize: 12, color: '#666', fontFamily: 'system-ui, sans-serif' }}>gezichtenvaniran.nl</p>
          </div>
          {qrDataUrl && (
            <div style={{ textAlign: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt="QR code" style={{ width: 100, height: 100 }} />
              <p style={{ fontSize: 10, color: '#666', marginTop: 4, fontFamily: 'system-ui, sans-serif' }}>Scan voor het verhaal</p>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={downloadPoster}
        className="mt-6 bg-charcoal text-background px-8 py-3 font-semibold hover:bg-charcoal/90 transition-colors"
      >
        Download als PNG
      </button>
    </div>
  )
}
