# Gezichten van Iran

Storytelling platform voor persoonlijke verhalen verbonden aan Iran.

## Setup

1. Maak een Supabase project aan
2. Kopieer `.env.local.example` naar `.env.local` en vul de waarden in
3. Voer de SQL migration uit in de Supabase SQL Editor: `supabase/migrations/001_initial.sql`
4. Maak een `photos` storage bucket aan (public) in Supabase
5. Voeg een admin-gebruiker toe via Supabase Authentication > Users
6. `npm install && npm run dev`

## Pagina's

- `/` — Homepage
- `/verhalen` — Alle verhalen
- `/verhaal/[id]` — Volledig verhaal
- `/deel` — Verhaal indienen
- `/admin` — Admin dashboard
- `/admin/poster/[id]` — Poster generator
- `/test-qr` — QR-scan test
