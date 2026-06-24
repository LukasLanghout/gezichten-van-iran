import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

// De volledige groepen-functionaliteit (API routes, database-tabellen, GroupChat component etc.)
// is bewaard in de codebase en kan later worden geactiveerd voor de community-app.
// Zie /api/groups/*, /groepen/[id], GroupChat.tsx, InviteToGroupModal.tsx

export default function GroepenPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
        {/* Signal icon */}
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#3A76F0]/10">
          <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none">
            <circle cx="24" cy="24" r="22" fill="#3A76F0" />
            <path
              d="M24 12C17.373 12 12 17.373 12 24c0 2.09.544 4.055 1.496 5.76L12 36l6.24-1.496A11.956 11.956 0 0024 36c6.627 0 12-5.373 12-12S30.627 12 24 12z"
              fill="white"
            />
          </svg>
        </div>

        <p className="eyebrow mb-3 text-[#3A76F0]">Community</p>
        <h1 className="font-serif text-4xl font-bold md:text-5xl">Samen in gesprek</h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-charcoal/65">
          Gezichten van Iran heeft een Signal-community waar je persoonlijke verhalen kunt
          delen, in gesprek kunt gaan en anderen kunt ontmoeten die verbonden zijn aan Iran.
        </p>

        <a
          href="https://signal.group/#CjQKIFKY5-4DmnxNcU-pBvfJ-Ap_FlToRTBtjdskjug6pJ7pEhDhOTGes1SqJb6LthruQUGZ"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#3A76F0] px-8 py-4 text-base font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-[#2d5fc9]"
        >
          <svg viewBox="0 0 20 20" className="h-5 w-5 fill-white">
            <circle cx="10" cy="10" r="9" />
            <path
              d="M10 4.5C7.015 4.5 4.5 7.015 4.5 10c0 .87.226 1.69.624 2.4L4.5 15.5l3.1-.624A5.481 5.481 0 0010 15.5c2.985 0 5.5-2.515 5.5-5.5S12.985 4.5 10 4.5z"
              fill="white"
              opacity="0.3"
            />
          </svg>
          Sluit aan bij de Signal-community
        </a>

        <p className="mt-6 text-sm text-charcoal/40">
          Signal is gratis, veilig en versleuteld.
        </p>
      </main>
      <Footer />
    </>
  )
}
