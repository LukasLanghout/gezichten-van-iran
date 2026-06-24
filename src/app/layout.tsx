import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  themeColor: '#1C1C1C',
}

export const metadata: Metadata = {
  title: 'Gezichten van Iran — Persoonlijke verhalen',
  description:
    'Persoonlijke verhalen van mensen die verbonden zijn aan Iran. Voor iedereen die wil begrijpen wat er speelt.',
  openGraph: {
    title: 'Gezichten van Iran',
    description: 'Persoonlijke verhalen van mensen verbonden aan Iran.',
    locale: 'nl_NL',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="min-h-screen bg-background font-sans text-charcoal antialiased selection:bg-terracotta/20 selection:text-terracotta-dark">
        {children}
      </body>
    </html>
  )
}
