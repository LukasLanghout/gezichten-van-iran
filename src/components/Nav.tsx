import Link from 'next/link'
import AuthButton from './AuthButton'

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-charcoal/10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-serif font-bold text-lg text-charcoal">
          Gezichten van Iran
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-terracotta transition-colors">Home</Link>
          <Link href="/verhalen" className="hover:text-terracotta transition-colors">Verhalen</Link>
          <Link href="/deel" className="hover:text-terracotta transition-colors font-semibold">Deel jouw verhaal</Link>
          <AuthButton />
        </div>
      </div>
    </nav>
  )
}
