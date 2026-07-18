# مجید سواری — دفتر وکالت (فاز اول)

Next.js implementation of **Phase 1 — Public Website** for مجید سواری (وکیل پایه یک
دادگستری، عضو کانون وکلای خوزستان، اهواز), based on the RFP
`RFP - وب سایت و پنل مدیریتی دفتر حقوقی`. Structured so **Phase 2 — پنل مدیریتی**
(CMS, client portal, booking, message management) can be added without reworking
the public site — see **Phase 2 roadmap** below.

## Stack

- **Next.js 16** (App Router, Turbopack, static generation for every route)
- **TypeScript** (strict mode)
- **Tailwind CSS v4** (CSS-first theme in `app/globals.css` — sky-blue palette)
- **shadcn/ui** (Radix primitives — Button, Input, Textarea, Label, Select,
  Checkbox, Accordion, Sheet, Card, Badge, Alert, Separator — owned as source in
  `components/ui/`, not an npm dependency)
- **lucide-react** for icons

## ⚠️ Before publishing — confirm these

- **Domain / email**: `data/firm.ts` uses `savarilawyer.ir` and
  `info@savarilawyer.ir` as a *suggestion* (mirrors the existing Instagram handle
  `savari_lawyer.ahvaz` for brand consistency) — this domain has **not** been
  registered or availability-checked by me. Confirm availability at an ICANN
  registrar (`.com`) or `nic.ir` (`.ir`) before using it, then update
  `data/firm.ts` (`url`, `email`) and `.env` once decided.
- **Years of experience**: `data/lawyers.ts` and `data/firm.ts` leave this as a
  `[...]` placeholder — no verified figure was provided, and I didn't want to
  invent one for a real person's site.
- **Education**: same — `data/lawyers.ts` has a bracketed placeholder for
  degree/university.
- **Contact info**: phone numbers and the Ahvaz office address came directly from
  your message and are already filled in in `data/firm.ts`. Double-check them.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build (statically prerenders every page)
npm run start   # serve the production build
npm run lint     # ESLint
```

## Project structure

```
app/
  layout.tsx              root layout (html lang="fa" dir="rtl", Header, Footer, metadata, JSON-LD)
  page.tsx                 Home
  about/  practice-areas/  lawyers/  blog/  faq/  contact/  client-login/
  not-found.tsx
  sitemap.ts / robots.ts
components/
  ui/                     shadcn primitives (owned source, not a dependency)
  Header.tsx, Footer.tsx, Seal.tsx, ...    site-specific components
lib/
  content/                 async data-access layer — pages only ever import from here
  icons.ts                 icon-name → component registry
  utils.ts                 shadcn's cn() helper
data/                       raw content (today: static arrays; Phase 2: a database)
types/content.ts             shared TypeScript types for every content model
```

### Why the `data/` ↔ `lib/content/` split?

`data/*.ts` holds the actual content — today, plain typed arrays. Every page
imports from `lib/content/*.ts` instead, which re-exports that same data through
**async** functions (`getPracticeAreas()`, `getLawyerBySlug()`, etc.). Pages already
`await` these calls, so when Phase 2 introduces a real database, only the *body* of
the functions in `lib/content/` needs to change — no page or component is touched.

## SEO — what's already in place

- Every route is statically prerendered (fast, fully crawlable HTML, no
  client-side-only rendering).
- Per-page `<title>`/meta description, plus site-wide keywords targeting local
  search (`وکیل اهواز`, `وکیل ملکی اهواز`, `وکیل چک`, …) in `app/layout.tsx`.
- `Attorney` JSON-LD structured data (name, address, phone, specialties, bar
  membership) in the root layout — this is what lets Google show rich local-search
  results (knowledge panel, map pack) rather than a plain blue link.
- `sitemap.xml` and `robots.txt` are generated automatically from the same content
  data, so they can never drift out of sync with the real pages.
- Next step *outside this codebase*: register the confirmed domain, set up a
  Google Business Profile with the same name/address/phone as the site (NAP
  consistency is the single biggest factor in local SEO), and link to it.

## Content already customized for this site

- Practice areas trimmed to the three real specialties: حقوق ملک و املاک، دعاوی
  چک، حقوق خانواده (`data/practice-areas.ts`) — the previous demo's corporate/
  criminal/labor/contract areas were removed rather than left inaccurate.
- Single-lawyer layout throughout (spotlight section on Home, singular copy in
  nav/headings) instead of the earlier multi-lawyer "team" framing.
- Blog seeded with 4 posts matching the real specialties (`data/blog-posts.ts`).

## Phase 2 roadmap — پنل مدیریتی

Not implemented here (needs a real backend), but this is how the pieces already in
this codebase connect to it:

| RFP item | Suggested approach | Where it plugs in |
|---|---|---|
| **CMS** (blog, pages, lawyer profile, media) | Prisma + PostgreSQL, or a headless CMS (Sanity/Payload) | Rewrite the bodies of `lib/content/*.ts` to query it instead of reading `data/*.ts`. Add `app/admin/(dashboard)/...` routes with shadcn `Table`/`Dialog`/`Form` for CRUD. |
| **Auth + roles** | Auth.js (next-auth) or Clerk | `middleware.ts` gating `/admin` and `/portal`. |
| **Client portal** (case status, secure docs, messaging) | Auth above + a `Case`/`Document`/`Message` schema | New `app/portal/...` route group; replace the honest stub in `app/client-login/page.tsx` / `components/ClientLoginForm.tsx` with real sign-in. |
| **Booking system** (calendar, reminders, sync) | `react-day-picker` (what shadcn's `Calendar` wraps — not yet added) + Google/Microsoft calendar APIs | New `Appointment` schema; booking UI reuses `components/ui/*`. |
| **Messages/consultation-request dashboard** | `ContactForm` posts to a real API route instead of simulating success | `app/admin/messages/page.tsx` with shadcn `Table`, `Badge`, `Select`. |
| **Email/SMS notifications** | Resend (email) + Kavenegar/Twilio (SMS) | Called from the new API routes. |
| **Payment gateway** (optional consultation fee) | ZarinPal or similar | A checkout step in the booking flow. |

`.env.example` lists the environment variables each of these will need, already
named and commented.

## Notes

- **Fonts**: loaded via a plain `@import url(...)` of Google Fonts in
  `globals.css` rather than `next/font/google`, so the build has no build-time
  dependency on reaching Google's font CDN. Swapping to `next/font/google` for
  self-hosted fonts is a small, optional upgrade.
- **Deploying**: any Node.js host or platform that supports Next.js (Vercel, your
  own server, etc.) works.
