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
11. [Mogelijke uitbreidingen](#mogelijke-uitbreidingen)

---

## Wat is dit project?

**Gezichten van Iran** is een Nederlandse storytelling-webapp waarop mensen persoonlijke verhalen delen over het Iran-conflict. Fysieke posters in bushokjes hebben een QR-code die verwijst naar de site. Bezoekers lezen verhalen, reageren via chat, nodigen elkaar uit in groepen en delen zelf verhalen.

Het project is gebouwd als prototype / MVP — geen e-mailverificatie, geen betalingen, geen complexe rechtenstructuur. Het doel is snel tonen hoe zoiets werkt.

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
pine        #3C5A4E  — groen accent (accepteer-knoppen)
```

---

## Hoe het werkt — architectuur

```
Browser
  ↕ (HTTP/WebSocket)
Vercel (Next.js 14 App Router)
  ├── Server Components  →  lezen direct uit Supabase via server-client
  ├── API Routes (/api)  →  schrijven + auth-acties via server-client
  └── Client Components  →  Supabase browser-client voor realtime chat
          ↕
Supabase
  ├── Postgres-database
  ├── Auth (email + wachtwoord, zonder e-mailbevestiging)
  ├── Storage (bucket 'photos' voor verhaalfoto's)
  └── Realtime (postgres_changes op chat_messages + group_chat_messages)
```

### Authenticatie

- Registratie gaat via `/api/auth/register` (server-side) met `supabase.auth.admin.createUser({ email_confirm: true })` om e-mailbevestiging te omzeilen — geen SMTP-server nodig.
- Na registratie logt de browser direct in met `signInWithPassword`.
- Sessie wordt bewaard in cookies via `@supabase/ssr`.

### Supabase-clients

Er zijn twee clients:

| Client | Sleutel | Gebruik |
|---|---|---|
| `getAuthClient()` | Anon key | Leest gebruikerssessie uit cookies; respecteert Row Level Security |
| `getAdminClient()` | Service role key | Schrijf-acties (verhalen, groepen, uitnodigingen); omzeilt RLS |

Beide helpers zitten in `src/lib/supabase/api-helpers.ts`.

---

## Huidige functies

### 1. Verhalen lezen

- **Homepage** (`/`) — hero-sectie met uitgelicht verhaal + kaartenoverzicht.
- **Verhalenlijst** (`/verhalen`) — alle goedgekeurde verhalen, filterbaar op Iran / Nederland / Alle.
- **Verhaaldetail** (`/verhaal/[id]`) — full-bleed foto, redactionele tekst met drop cap, privébericht-knop, chatruimte.

### 2. Verhaal indienen

- Via `/deel` — formulier met voornaam, stad, land, tekst (max 500 woorden) en optionele foto.
- Foto wordt geüpload naar Supabase Storage (`photos`-bucket).
- Verhaal komt als `status: 'pending'` in de database — wacht op goedkeuring door beheerder.

### 3. Account & authenticatie

- Registreren op `/auth/register` (naam, e-mail, wachtwoord).
- Inloggen op `/auth/login`.
- Sessie zichtbaar in navigatiebalk (avatar + naam + uitloggen-knop).
- Geen e-mailbevestiging vereist (prototype-instelling).

### 4. Realtime chat per verhaal

- Zichtbaar onderaan elk verhaal.
- Vereist inloggen — niet-ingelogde bezoekers zien een aanmeld-prompt.
- Berichten staan als chatbubbels: eigen berichten rechts (terracotta), anderen links (zand).
- Avatar gegenereerd uit initialen (deterministisch gekleurd).
- Realtime via Supabase `postgres_changes`-subscription.
- Klikbaar op naam van andere gebruiker → uitnodigingsmodal.

### 5. Groepen

- Overzichtspagina op `/groepen` (vereist inloggen).
- Groep aanmaken → maker wordt automatisch `admin`.
- Uitnodigen via e-mailadres (door admin) of via klikbare naam in chat (uitnodigingsmodal).
- Uitnodigingen ontvangen via `/groepen` — accepteren of weigeren.
- **Notificatiebadge** op "Groepen" in de navigatiebalk: rood getal bij openstaande uitnodigingen (ververst elke 30 seconden).

### 6. Groepschat

- Toegankelijk via `/groepen/[id]`.
- Realtime chatbubbels met avatars, timestamps en naam.
- Ledenlijst in sidebar (aan/uit te zetten).
- Admin kan extra leden uitnodigen via sidebar.

### 7. QR-code tracking

- `/qr/home` — redirect naar homepage + registreert scan in `qr_scans`.
- `/api/qr-scan` — alternatieve route voor per-verhaal QR-codes.
- Statistieken zichtbaar in het beheerderspaneel.

### 8. Beheerderspaneel

- Toegankelijk op `/admin` (momenteel zonder inlogvereiste — zie [Beheerderspaneel](#beheerderspaneel)).
- Inzien van scanstatistieken.
- Homepage-QR-code genereren en downloaden als PNG.
- Verhalen goedkeuren of afwijzen.
- Per goedgekeurd verhaal: posterpagina met QR-code (`/admin/poster/[id]`).

---

## Database-schema

```sql
-- Verhalen
stories (
  id          uuid PRIMARY KEY,
  first_name  text NOT NULL,
  city        text NOT NULL,
  country     text NOT NULL,
  story_text  text NOT NULL,
  photo_url   text,
  status      text DEFAULT 'pending',  -- 'pending' | 'approved' | 'rejected'
  created_at  timestamptz
)

-- Privéberichten aan vertellers
messages (
  id           uuid PRIMARY KEY,
  story_id     uuid REFERENCES stories,
  sender_name  text NOT NULL,
  message      text NOT NULL,
  created_at   timestamptz
)

-- Chat per verhaal
chat_messages (
  id            uuid PRIMARY KEY,
  story_id      uuid REFERENCES stories,
  user_id       uuid,
  display_name  text NOT NULL,
  content       text NOT NULL,
  created_at    timestamptz
)

-- QR-scan registraties
qr_scans (
  id          uuid PRIMARY KEY,
  scanned_at  timestamptz,
  source      text  -- 'homepage' | 'story' | etc.
)

-- Groepen
groups (
  id          uuid PRIMARY KEY,
  name        text NOT NULL,
  description text,
  created_by  uuid,
  created_at  timestamptz
)

-- Groepsleden
group_members (
  id          uuid PRIMARY KEY,
  group_id    uuid REFERENCES groups,
  user_id     uuid,
  role        text DEFAULT 'member',  -- 'admin' | 'member'
  joined_at   timestamptz
)

-- Groepsuitnodigingen
group_invitations (
  id              uuid PRIMARY KEY,
  group_id        uuid REFERENCES groups,
  invited_email   text NOT NULL,
  invited_by      uuid,
  status          text DEFAULT 'pending',  -- 'pending' | 'accepted' | 'rejected'
  created_at      timestamptz
)

-- Groepschat
group_chat_messages (
  id            uuid PRIMARY KEY,
  group_id      uuid REFERENCES groups,
  user_id       uuid,
  display_name  text NOT NULL,
  content       text NOT NULL,
  created_at    timestamptz
)
```

---

## API-routes

| Methode | Route | Beschrijving |
|---|---|---|
| `GET` | `/api/stories` | Alle goedgekeurde verhalen |
| `POST` | `/api/stories` | Verhaal indienen (multipart form) |
| `POST` | `/api/admin/stories/[id]` | Verhaal goedkeuren of afwijzen |
| `POST` | `/api/auth/register` | Gebruiker aanmaken (admin API, geen e-mail) |
| `POST` | `/api/messages` | Privébericht versturen aan verteller |
| `GET` | `/api/groups` | Groepen van ingelogde gebruiker |
| `POST` | `/api/groups` | Nieuwe groep aanmaken |
| `GET` | `/api/groups/[id]` | Groepdetails + ledenlijst |
| `POST` | `/api/groups/[id]/invite` | Uitnodigen via e-mailadres |
| `POST` | `/api/groups/[id]/invite-user` | Uitnodigen via user ID (vanuit chat) |
| `GET` | `/api/groups/invitations` | Openstaande uitnodigingen voor ingelogde gebruiker |
| `POST` | `/api/groups/invitations/[id]/respond` | Uitnodiging accepteren of weigeren |
| `GET` | `/api/qr-scan` | QR-scan registreren (per verhaal) |
| `GET` | `/qr/home` | Homepage QR-redirect + scan registreren |

---

## Omgevingsvariabelen

Stel deze in via Vercel Dashboard → Project → Settings → Environment Variables.

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=https://gezichten-van-iran.vercel.app
```

> **Let op:** De `SUPABASE_SERVICE_ROLE_KEY` is gevoelig — stel hem alleen in als server-side omgevingsvariabele (geen `NEXT_PUBLIC_` prefix).

---

## Lokaal opstarten

```bash
# 1. Kloon de repo
git clone https://github.com/LukasLanghout/gezichten-van-iran.git
cd gezichten-van-iran

# 2. Installeer dependencies
npm install

# 3. Maak .env.local aan
cp .env.example .env.local
# Vul de vier variabelen in (zie boven)

# 4. Start de dev-server
npm run dev
# → http://localhost:3000
```

> Er is geen lokale Supabase-setup nodig — de dev-omgeving praat direct met het productie-Supabase-project. Gebruik eventueel `supabase start` voor echte lokale isolatie.

---

## Beheerderspaneel

Momenteel is `/admin` **zonder inlogvereiste** (uitgeschakeld voor prototype-testen). De admin-loginpagina bestaat op `/admin/login` maar wordt niet afgedwongen.

**Voor productie moet je dit opnieuw inschakelen:**

1. Open `src/app/admin/page.tsx` en `src/app/admin/poster/[id]/page.tsx`.
2. Zet de auth-check terug:
   ```ts
   const supabase = createClient()
   const { data: { user } } = await supabase.auth.getUser()
   if (!user) redirect('/admin/login')
   ```
3. Zorg dat de admin-gebruiker in Supabase Auth bestaat (e-mail: naar keuze, wachtwoord: naar keuze).

---

## Mogelijke uitbreidingen

Hieronder staan ideeën die logisch passen bij wat er al is, geordend van makkelijk naar complex.

### Klein (1–4 uur)

| Idee | Toelichting |
|---|---|
| **E-mailbevestiging aanzetten** | In Supabase: Authentication → Email → schakel in. Verwijder `email_confirm: true` uit de register-route en stel SMTP in (bijv. Resend.com). |
| **Admin-inlog verplichten** | Zie sectie hierboven — twee regels code terug. |
| **Zoekbalk op /verhalen** | Voeg een tekstveld toe dat filtert op `first_name` of `city` via `.ilike()`. |
| **Deelknop per verhaal** | Kopieer URL naar klembord of open native share-API (`navigator.share()`). |
| **Leesaantal bijhouden** | Voeg kolom `views int default 0` toe aan `stories` en increment bij elke paginabezoek. |
| **Meer QR-bronnen tracken** | Voeg `source`-parameter toe aan de `/qr/home`-route voor locatie-specifieke QR-codes (bijv. `/qr/home?source=Amsterdam-Centraal`). |

### Gemiddeld (een dag)

| Idee | Toelichting |
|---|---|
| **Reacties op verhalen** | Voeg `likes`-tabel toe (story_id + user_id, uniek). Toon hartje-knop met teller. |
| **Moderatie-e-mails** | Stuur de beheerder een e-mail bij nieuw ingediend verhaal via een Supabase Edge Function of Resend. |
| **Profielpagina** | `/profiel/[id]` — toon naam, avatar, verhalen en groepen van een gebruiker. |
| **Notificaties in-app** | Tabel `notifications` (user_id, type, payload, read) + badge in nav. Stuur bij nieuwe chatberichten, groepsuitnodigingen, etc. |
| **Groep verlaten** | Knop in groepspagina om jezelf uit `group_members` te verwijderen. |
| **Afbeeldingen optimaliseren** | Resize foto's via Supabase Edge Function bij upload (bijv. naar max 1200px breed). |

### Groot (meerdere dagen)

| Idee | Toelichting |
|---|---|
| **Meertaligheid (i18n)** | Voeg Engels toe met `next-intl`. Vertalingen voor UI, verhalen blijven in originele taal. |
| **Geavanceerde moderatie** | Admin-dashbord met bulk-acties, zoeken op naam/stad, e-maillog van afgewezen verhalen. |
| **Audio/video verhalen** | Voeg `media_url` en `media_type` toe aan `stories`. Embed audiospeler of video. |
| **Publieke groepen** | Voeg `is_public boolean` toe aan `groups`. Gebruikers kunnen zelf lid worden zonder uitnodiging. |
| **PWA / offline** | Voeg `manifest.json` toe en een Service Worker voor offline lezen van goedgekeurde verhalen. |
| **Analytics-dashboard** | Vervang de simpele QR-teller door een volledige grafiek (bijv. met Recharts) — scans per dag, per bron, per verhaal. |
| **CMS-integratie** | Vervang het hand-gemaakte admin-paneel door Sanity of Payload CMS zodat redacteuren verhalen rijker kunnen opmaken. |
| **Row Level Security** | Voeg RLS-policies toe aan Supabase zodat gebruikers alleen hun eigen data kunnen lezen/schrijven — momenteel niet geconfigureerd. |

---

## Projectstructuur (kort)

```
src/
├── app/
│   ├── admin/          Beheerderspaneel (verhalen, QR, posters)
│   ├── api/            Alle API-routes
│   ├── auth/           Login & registratie
│   ├── deel/           Verhaal indienen
│   ├── groepen/        Groepen + groepschat
│   ├── verhaal/[id]    Verhaaldetailpagina + chat
│   ├── verhalen/       Verhalenlijst met filter
│   ├── qr/             QR-redirect routes
│   └── page.tsx        Homepage
├── components/
│   ├── Avatar.tsx      Gekleurde initials-avatar
│   ├── AuthButton.tsx  Login/logout in navigatie
│   ├── Chat.tsx        Realtime chat per verhaal
│   ├── Footer.tsx      Sitefooter
│   ├── GroupChat.tsx   Realtime groepschat
│   ├── GroupsNavLink.tsx Groepen-link met uitnodigingsbadge
│   ├── InviteToGroupModal.tsx Modal om iemand uit te nodigen
│   ├── Nav.tsx         Navigatiebalk
│   └── StoryCard.tsx   Verhaalkaart in overzicht
└── lib/
    └── supabase/
        ├── api-helpers.ts  getAuthClient() + getAdminClient()
        ├── client.ts       Browser Supabase-client
        └── server.ts       Server Supabase-client
supabase/
└── migrations/
    └── 001_initial.sql   Volledige database-setup + seed-data
```

---

*Gemaakt als prototype voor Gezichten van Iran. Gebouwd met Next.js 14, Supabase en Tailwind CSS. Gehost op Vercel.*
