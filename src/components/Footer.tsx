import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-charcoal/10 bg-charcoal text-background">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="font-serif text-2xl font-bold leading-tight">
              Gezichten<br />van Iran
            </h3>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-background/60">
              Een platform voor persoonlijke verhalen van mensen die verbonden zijn aan Iran.
              Gezien op straat, gedeeld online.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta-light">
              Ontdek
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-background/75">
              <li><Link href="/" className="transition-colors hover:text-white">Home</Link></li>
              <li><Link href="/verhalen" className="transition-colors hover:text-white">Alle verhalen</Link></li>
              <li><Link href="/groepen" className="transition-colors hover:text-white">Groepen</Link></li>
              <li><Link href="/deel" className="transition-colors hover:text-white">Deel jouw verhaal</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta-light">
              Meedoen
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-background/60">
              Heb jij een verhaal te delen? Iedere stem telt. Vertel het jouwe en help anderen
              begrijpen wat er speelt.
            </p>
            <Link
              href="/deel"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-terracotta-light"
            >
              Vertel jouw verhaal →
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-background/10 pt-6 text-xs text-background/40 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Gezichten van Iran</p>
          <p>Gemaakt met zorg en respect voor ieder verhaal.</p>
        </div>
      </div>
    </footer>
  )
}
