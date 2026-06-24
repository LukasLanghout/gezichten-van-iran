# Gezichten van Iran — Projecthandover

## Inhoudsopgave

1. [Wat is dit project?](#wat-is-dit-project)
2. [Live omgeving](#live-omgeving)
3. [Technologie-stack](#technologie-stack)
4. [Hoe het werkt — architectuur](#hoe-het-werkt--architectuur)
5. [Huidige functies](#huidige-functies)
6. [Database-schema](#database-schema)
7. [API-routes](#api-routes)
8. [Omgevingsvariabelen](#omgevingsvariabelen)
9. [Lokaal opstarten](#lokaal-opstarten)
10. [Beheerderspaneel](#beheerderspaneel)
11. [Slapende code (voor later)](#slapende-code-voor-later)
12. [Mogelijke uitbreidingen](#mogelijke-uitbreidingen)

---

## Wat is dit project?

**Gezichten van Iran** is een Nederlandse storytelling-webapp waarop mensen persoonlijke verhalen delen over het Iran-conflict. Fysieke posters in bushokjes hebben een QR-code die verwijst naar de site.

De homepage toont geanimeerde portretkaarten. Als je op een kaart klikt, draait hij om en zie je de brief (het verhaal) van die persoon. Eronder staat een link naar het volledige overzicht. Op de verhaaldetailpagina staat het portret met animatie, de brief op gelinieerd papier, en eronder een handgeschreven brief van een kind.

---

## Live omgeving

| Onderdeel | URL |
|---|---|
| Frontend (productie) | https://gezichten-van-iran.vercel.app |
| Beheerderspaneel | https://gezichten-van-iran.vercel.app/admin |
| Supabase-project | `gesjtagpekwzeisuaaag.supabase.co` (regio: eu-west-1) |
| GitHub-repo | https://github.com/LukasLanghout/gezichten-van-iran |

---

## Technologie-stack

| Laag | Keuze | Reden |
|---|---|---|
| Framework | **Next.js 14** (App Router) | Server Components + API Routes in één codebase |
| Hosting | **Vercel** | Automatisch deployen bij push naar `main` |
| Database + Auth | **Supabase** | Postgres, Auth, Storage en Realtime in één platform |
| Styling | **Tailwind CSS** | Utility-first, eigen kleurenpalet |
| Lettertypes | Playfair Display (serif) + Inter (sans) | Via Google Fonts |
| Supabase client | `@supabase/ssr` | Cookie-gebaseerde auth voor SSR |

### Kleurenpalet (Tailwind)

```
background  #F8F5F0  — warm papier
paper       #FDFBF7  — kaarten
sand        #EFE7DA  — achtergrond secties
clay        #E3D5C3  — randen
charcoal    #1C1C1C  — primaire tekst
terracotta  #C0503A  — primaire accentkleur
saffron     #D89B4A  — goud accent
pine        #3C5A4E  — groen accent
```

---

## Hoe het werkt — architectuur

```
Browser
  ↕ (HTTP)
Vercel (Next.js 14 App Router)
  ├── Server Components  →  lezen direct uit Supabase via server-client
  ├── API Routes (/api)  →  schrijven + auth-acties via server-client
  └── Client Components  →  FlipCard (flip-animatie)
          ↕
Supabase
  ├── Postgres-database
  ├── Auth (email + wachtwoord, zonder e-mailbevestiging)
  └── Storage (bucket 'photos' voor verhaalfoto's)
```

### Authenticatie

Alleen nodig voor beheerders en de slapende groepen-functionaliteit. Registratie via `/api/auth/register` met `supabase.auth.admin.createUser({ email_confirm: true })` — geen SMTP nodig. Sessie via cookies met `@supabase/ssr`.

### Supabase-clients

| Client | Sleutel | Gebruik |
|---|---|---|
| `getAuthClient()` | Anon key | Leest gebruikerssessie uit cookies |
| `getAdminClient()` | Service role key | Schrijf-acties, omzeilt RLS |

Beide in `src/lib/supabase/api-helpers.ts`.

---

## Huidige functies

### 1. Homepage — flip-kaarten

- Toont geanimeerde portretkaarten van alle goedgekeurde verhalen (subtiele zweef-animatie).
- Klik op een kaart → 3D-flip-animatie, de achterkant toont de brief op gelinieerd papier.
- Onderaan: pijl met "Overzicht" die naar `/verhalen` leidt.

### 2. Verhaaldetailpagina (`/verhaal/[id]`)

Drie secties, van boven naar onder:

1. **Portret** — full-bleed foto met zwevende animatie en naam-overlay.
2. **De brief** — verhaal op gelinieerd papier met rode kantlijn, drop-cap, datum en handtekening.
3. **Brief van een kind** — reactief schrijven van een kind, op warm gelinieerd papier met andere stijl.

### 3. Verhalen indienen (`/deel`)

- Formulier: voornaam, stad, land, tekst (max 500 woorden), optionele foto.
- Foto gaat naar Supabase Storage (`photos`-bucket).
- Verhaal wordt als `status: 'pending'` opgeslagen — wacht op goedkeuring beheerder.
- `child_letter` veld is beschikbaar maar wordt ingevuld door de redactie via het beheerderspaneel.

### 4. Verhalenlijst (`/verhalen`)

- Alle goedgekeurde verhalen in kaartformaat.
- Filterbaar op Iran / Nederland / Alle.

### 5. Community (`/groepen`)

- Eenvoudige pagina met link naar de Signal-community van Gezichten van Iran.
- **Let op:** vervang de placeholder-URL `https://signal.group/#VERVANG_MET_ECHTE_LINK` in `src/app/groepen/page.tsx` door de echte Signal-group-link.

### 6. QR-code tracking

- `/qr/home` — redirect naar homepage + registreert scan in `qr_scans`.
- Statistieken zichtbaar in beheerderspaneel.

### 7. Beheerderspaneel (`/admin`)

- Verhalen goedkeuren of afwijzen.
- QR-statistieken bekijken.
- Homepage-QR genereren en downloaden.
- Per verhaal: posterlink met QR-code.

---

## Database-schema

```sql
-- Verhalen (inclusief kinderbrief)
stories (
  id            uuid PRIMARY KEY,
  first_name    text NOT NULL,
  city          text NOT NULL,
  country       text NOT NULL,
  story_text    text NOT NULL,
  child_letter  text,               -- Brief van een kind (optioneel, redactie vult in)
  photo_url     text,
  status        text DEFAULT 'pending',  -- 'pending' | 'approved' | 'rejected'
  created_at    timestamptz
)

-- Privéberichten aan vertellers (via beheerderspaneel te lezen)
messages (
  id           uuid PRIMARY KEY,
  story_id     uuid REFERENCES stories,
  sender_name  text NOT NULL,
  message      text NOT NULL,
  created_at   timestamptz
)

-- QR-scan registraties
qr_scans (
  id          uuid PRIMARY KEY,
  scanned_at  timestamptz,
  source      text        -- 'homepage' | 'story' | etc.
)

-- ── Slapende groepen-structuur (klaar voor activatie) ──

-- Gebruikers-chat per verhaal
chat_messages (
  id, story_id, user_id, display_name, content, created_at
)

-- Groepen
groups (id, name, description, created_by, created_at)

-- Groepsleden
group_members (id, group_id, user_id, role, joined_at)

-- Groepsuitnodigingen
group_invitations (id, group_id, invited_email, invited_by, status, created_at)

-- Groepschat
group_chat_messages (id, group_id, user_id, display_name, content, created_at)
```

---

## API-routes

| Methode | Route | Beschrijving |
|---|---|---|
| `GET` | `/api/stories` | Alle goedgekeurde verhalen |
| `POST` | `/api/stories` | Verhaal indienen (multipart form) |
| `POST` | `/api/admin/stories/[id]` | Verhaal goedkeuren of afwijzen |
| `POST` | `/api/auth/register` | Gebruiker aanmaken (admin API) |
| `POST` | `/api/messages` | Privébericht aan verteller |
| `GET` | `/api/qr-scan` | QR-scan registreren |
| `GET` | `/qr/home` | Homepage QR-redirect + scan registreren |
| *(slapend)* | `/api/groups/*` | Groepen-API (zie slapende code) |

---

## Omgevingsvariabelen

Stel in via Vercel Dashboard → Project → Settings → Environment Variables.

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...          # Alleen server-side, nooit NEXT_PUBLIC_
NEXT_PUBLIC_SITE_URL=https://gezichten-van-iran.vercel.app
```

---

## Lokaal opstarten

```bash
git clone https://github.com/LukasLanghout/gezichten-van-iran.git
cd gezichten-van-iran
npm install

# Maak .env.local aan en vul de vier variabelen in
cp .env.example .env.local   # of maak het bestand handmatig

npm run dev
# → http://localhost:3000
```

---

## Beheerderspaneel

Momenteel **zonder inlogvereiste** (uitgeschakeld voor prototype-testen). Voor productie:

1. Open `src/app/admin/page.tsx` en `src/app/admin/poster/[id]/page.tsx`.
2. Zet de auth-check terug:
   ```ts
   const { data: { user } } = await supabase.auth.getUser()
   if (!user) redirect('/admin/login')
   ```
3. Zorg voor een admin-account in Supabase Auth.

### Kinderbrief toevoegen aan een verhaal

Voer direct SQL uit in Supabase (Dashboard → SQL Editor):
```sql
UPDATE stories
SET child_letter = 'Lieve [naam], ...'
WHERE id = '[uuid van het verhaal]';
```

Of voeg een invoerveld toe aan het beheerderspaneel in `src/app/admin/page.tsx`.

---

## Slapende code (voor later)

De volledige **groepen-app** is bewaard in de codebase maar niet actief in de navigatie.  
Dit kan later worden geactiveerd als in-app community ter vervanging van de Signal-link.

**Wat er al is:**
- API-routes: `/api/groups/*`, `/api/groups/invitations/*`
- Pagina's: `src/app/groepen/[id]/page.tsx` (groepschat)
- Componenten: `GroupChat.tsx`, `InviteToGroupModal.tsx`, `GroupsNavLink.tsx`, `Avatar.tsx`
- Database-tabellen: `groups`, `group_members`, `group_invitations`, `group_chat_messages`
- Auth-systeem: register/login volledig werkend

**Om het te activeren:**
1. Vervang `src/app/groepen/page.tsx` door de groepen-overzichtspagina (zie git-history).
2. Vervang de "Community"-link in `Nav.tsx` door `<GroupsNavLink />` (toont badge bij uitnodigingen).
3. Voeg chat per verhaal terug toe in `src/app/verhaal/[id]/page.tsx` (`<Chat storyId={...} />`).

---

## Mogelijke uitbreidingen

### Snel (1–4 uur)

| Idee | Toelichting |
|---|---|
| **Signal-link bijwerken** | Vervang placeholder in `src/app/groepen/page.tsx` |
| **Kinderbrief-veld in admin** | Voeg textarea toe aan beheerderspaneel zodat redactie brieven kan schrijven zonder SQL |
| **Admin-inlog aanzetten** | Twee regels code — zie beheerderspaneel-sectie hierboven |
| **Meer QR-bronnen tracken** | Voeg `source`-parameter toe aan `/qr/home` voor locatie-specifieke QR-codes |
| **Deelknop per verhaal** | `navigator.share()` of kopieer URL naar klembord |

### Gemiddeld (een dag)

| Idee | Toelichting |
|---|---|
| **Audiobrieven** | Voeg `audio_url` toe aan `stories` en embed een audiospeler |
| **Videoportretten** | Vervang de foto-animatie door een korte looping video (Supabase Storage) |
| **Meer talen** | `next-intl` voor NL + EN, verhalen blijven in originele taal |
| **Moderatie-e-mails** | Supabase Edge Function + Resend.com bij nieuw ingediend verhaal |
| **Kinderbrief-formulier** | Apart inzendformulier voor kinderen/scholen met moderatieflow |

### Groot (meerdere dagen)

| Idee | Toelichting |
|---|---|
| **In-app community** | Activeer de slapende groepen-code (zie boven) als vervanging voor Signal |
| **Schoolproject-module** | Klassenregistratie + kinderbrieven per klas beheren |
| **Analytics-dashboard** | Grafieken van scans per dag, per locatie, per verhaal (Recharts) |
| **PWA / offline** | `manifest.json` + Service Worker voor offline lezen |
| **Row Level Security** | RLS-policies in Supabase zodat gebruikers alleen eigen data lezen/schrijven |

---

## Projectstructuur

```
src/
├── app/
│   ├── admin/          Beheerderspaneel (verhalen, QR, posters)
│   ├── api/            Alle API-routes (incl. slapende groepen-routes)
│   ├── auth/           Login & registratie
│   ├── deel/           Verhaal indienen
│   ├── groepen/
│   │   ├── page.tsx    Signal-community-pagina (actief)
│   │   └── [id]/       Groepschat (slapend, code bewaard)
│   ├── verhaal/[id]    Portret + brief + kinderbrief
│   ├── verhalen/       Verhalenlijst met filter
│   ├── qr/             QR-redirect routes
│   └── page.tsx        Homepage met flip-kaarten
├── components/
│   ├── Avatar.tsx           Gekleurde initialen-avatar (slapend)
│   ├── AuthButton.tsx       Login/logout in navigatie
│   ├── Chat.tsx             Realtime chat per verhaal (slapend)
│   ├── FlipCard.tsx         3D flip-kaart voor homepage ← nieuw
│   ├── Footer.tsx           Sitefooter
│   ├── GroupChat.tsx        Realtime groepschat (slapend)
│   ├── GroupsNavLink.tsx    Groepen-link met badge (slapend)
│   ├── InviteToGroupModal.tsx Uitnodigingsmodal (slapend)
│   ├── Nav.tsx              Navigatiebalk
│   └── StoryCard.tsx        Verhaalkaart voor /verhalen
└── lib/
    └── supabase/
        ├── api-helpers.ts   getAuthClient() + getAdminClient()
        ├── client.ts        Browser Supabase-client
        └── server.ts        Server Supabase-client
supabase/
└── migrations/
    ├── 001_initial.sql      Volledige database-setup + seed-data
    └── 002_child_letters.sql Kinderbrief-kolom + seed kinderbrieven
```

---

*Gemaakt als prototype voor Gezichten van Iran. Gebouwd met Next.js 14, Supabase en Tailwind CSS. Gehost op Vercel.*
