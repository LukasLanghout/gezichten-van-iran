import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gezichten van Iran',
  description: 'Persoonlijke verhalen van mensen verbonden aan Iran',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="bg-background text-charcoal font-sans min-h-screen">
        {children}
      </body>
    </html>
  )
}
