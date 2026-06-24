import Link from 'next/link'
import AuthButton from './AuthButton'

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-charcoal/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-terracotta transition-transform duration-300 group-hover:scale-110">
            <span className="h-3 w-3 rounded-full border-2 border-background" />
          </span>
          <span className="font-serif text-lg font-bold leading-none text-charcoal">
            Gezichten van Iran
          </span>
        </Link>

        <div className="flex items-center gap-1 text-sm sm:gap-2">
          <Link
            href="/verhalen"
            className="rounded-full px-3 py-1.5 transition-colors hover:bg-charcoal/5 hover:text-terracotta"
          >
            Verhalen
          </Link>
          <Link
            href="/groepen"
            className="rounded-full px-3 py-1.5 transition-colors hover:bg-charcoal/5 hover:text-terracotta"
          >
            Community
          </Link>
          <Link
            href="/deel"
            className="ml-1 hidden rounded-full bg-terracotta px-4 py-1.5 font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-terracotta-dark sm:inline-block"
          >
            Deel jouw verhaal
          </Link>
          <span className="ml-1 border-l border-charcoal/10 pl-2">
            <AuthButton />
          </span>
        </div>
      </div>
    </nav>
  )
}
