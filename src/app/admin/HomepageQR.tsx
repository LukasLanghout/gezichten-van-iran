'use client'
import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

export default function HomepageQR({ url }: { url: string }) {
  const [qrDataUrl, setQrDataUrl] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    QRCode.toDataURL(url, { width: 300, margin: 2 }).then(setQrDataUrl)
  }, [url])

  function download() {
    const link = document.createElement('a')
    link.download = 'homepage-qr.png'
    link.href = qrDataUrl
    link.click()
  }

  return (
    <div className="bg-white p-6 rounded-sm shadow-sm inline-flex flex-col items-center gap-4">
      {qrDataUrl ? (
        <img src={qrDataUrl} alt="Homepage QR code" className="w-48 h-48" />
      ) : (
        <div className="w-48 h-48 bg-charcoal/5 animate-pulse" />
      )}
      <p className="text-xs text-charcoal/50 text-center max-w-48 break-all">{url}</p>
      <button
        onClick={download}
        disabled={!qrDataUrl}
        className="bg-charcoal text-background px-5 py-2 text-sm font-semibold hover:bg-charcoal/90 disabled:opacity-40"
      >
        Download PNG
      </button>
    </div>
  )
}
