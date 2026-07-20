# مجید سواری — دفتر وکالت

Next.js implementation of **Phase 1 — Public Website** for مجید سواری (وکیل پایه یک
دادگستری، عضو کانون وکلای خوزستان، اهواز), based on the RFP
`RFP - وب سایت و پنل مدیریتی دفتر حقوقی` — plus a first slice of **Phase 2 —
پنل مدیریتی**: a working Contact form → database → admin panel pipeline for the
"messages/consultation requests" subsystem. See **What's built** below for the
exact boundary.

## Stack

- **Next.js 16** (App Router, Turbopack, static generation for every public route)
- **TypeScript** (strict mode)
- **Tailwind CSS v4** (CSS-first theme in `app/globals.css` — sky-blue palette)
- **shadcn/ui** (Radix primitives, owned as source in `components/ui/`)
- **better-sqlite3** — a real, free, zero-config database (see **Database** below)
- **lucide-react** for icons

## ⚠️ Before publishing — confirm these

- **Domain / email**: `data/firm.ts` uses `savarilawyer.ir` as a *suggested*
  domain (mirrors the Instagram handle `savari_lawyer.ahvaz` for brand
  consistency) — **not registered or availability-checked**. Confirm at
  `nic.ir` (`.ir`) or any registrar before using it, then update `url` in
  `data/firm.ts`. Email is set to `savari.vakil2023@gmail.com` (the newest of
  the three Gmail accounts visible in the screenshot) — change in `data/firm.ts`
  if a different address was intended.
- **Years of experience / education**: left as `[...]` placeholders in
  `data/firm.ts` and `data/lawyers.ts` — no verified figures were provided.
- **`ADMIN_PASSWORD` / `SESSION_SECRET`**: must be set before the admin panel
  works at all — see **Admin panel** below. Nothing is shipped with a real
  secret.

## Getting started

```bash
npm install
cp .env.example .env.local     # then edit ADMIN_PASSWORD and SESSION_SECRET
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The database file is
created automatically on first run — no migration step needed.

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint     # ESLint
```

## What's built

**Public site (Phase 1, complete):** Home, About, Practice Areas (list + detail),
Lawyer profile, Blog (list + detail), FAQ, Contact, Client Login (honest stub —
explains the real portal is a Phase 2 item, doesn't fake a login).

**Admin panel (first Phase-2 slice, complete):** the Contact form now really
submits — it's saved to a SQLite database, and `/admin/messages` (password
gated) lists every submission with name/phone/email/area/message and lets you
mark each as read/replied. This directly covers the RFP's "بخش ۴.۴ — مدیریت
پیام‌ها و درخواست‌های مشاوره" for its most basic version: centralized inbox +
status. Not built yet: assigning a message to a specific staff member, reply
templates, or a reporting view — natural next steps once this foundation is in use.

**Not built (documented roadmap only):** CMS/content editing UI, client portal
with case tracking, booking/calendar, payments, email/SMS notifications,
multi-role accounts. See **Phase 2 roadmap** below.

## Project structure

```
app/
  (site)/                  the public site — its own root layout (Header/Footer)
    layout.tsx, page.tsx, about/, practice-areas/, lawyers/, blog/, faq/,
    contact/, client-login/, not-found.tsx
  admin/                    the admin panel — its OWN separate root layout (no
                             public nav), gated by proxy.ts
    layout.tsx, actions.ts (login/logout), AdminHeader.tsx
    login/page.tsx
    messages/page.tsx, actions.ts (status updates), StatusControls.tsx
  icon.tsx, apple-icon.tsx, opengraph-image.tsx   generated favicon/OG image
  sitemap.ts, robots.ts, globals.css
proxy.ts                    gates every /admin/* route behind the session cookie
                             (renamed from `middleware.ts` — Next.js 16 convention)
components/
  ui/                       shadcn primitives (owned source, not a dependency)
  Header.tsx, Footer.tsx, ContactForm.tsx, ...    site-specific components
lib/
  content/                  async data-access layer for marketing content
  actions/consultation.ts    Server Action: Contact form → database
  db.ts                      SQLite connection (creates the table if missing)
  messages.ts                 typed data-access layer for consultation requests
  auth.ts                     password check + signed session-cookie helpers
  icons.ts, utils.ts, seo.ts
data/                        raw marketing content (firm.ts, lawyers.ts, ...)
types/content.ts               shared TypeScript types for every content model
```

Two separate root layouts (`app/(site)/layout.tsx` and `app/admin/layout.tsx`)
is a standard, documented Next.js pattern for "marketing site + dashboard with a
completely different shell" — see the
[Route Groups docs](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups)
if extending this further.

## Database

**Now (development, and any host with a persistent disk):** `better-sqlite3`
writes to `.data/app.db`, created automatically. Zero signup, zero cost, zero
external network dependency — genuinely a "just works" free option, and the
reason I picked it over Prisma (whose engine binaries need a network fetch that
wasn't reachable while building this).

**⚠️ Known limitation:** SQLite-on-disk does **not** work on Vercel's default
serverless deployment (its filesystem is ephemeral/read-only in production, and
writes from one function instance aren't visible to others) — it's a great fit
for local dev, a VPS, Railway, Render, or Fly.io, but **not** a Vercel deploy
as-is.

**Recommended free upgrade path when you're ready to deploy on Vercel:**
[Turso](https://turso.tech) (LibSQL — SQLite-compatible, generous free tier,
works from serverless). The swap is contained to `lib/db.ts` and `lib/messages.ts`
(same function signatures, `lib/content/*.ts` and every page are untouched) —
this is exactly the "data layer is isolated so it's easy to upgrade later"
architecture the rest of the content already follows.

## Admin panel

`/admin/messages` — lists Contact-form submissions, mark as read/replied.

- **Auth is deliberately basic**: one shared password (`ADMIN_PASSWORD`), no
  individual accounts or roles yet. The session cookie is HMAC-signed
  (`SESSION_SECRET`) so it can't be trivially forged, but this is still a single
  shared secret, not the role-based Admin/Lawyer/Staff/Client system the RFP
  describes for the full panel. Auth.js (next-auth) or Clerk are the natural
  upgrade — see the roadmap table.
- Generate a real `SESSION_SECRET` with: `openssl rand -hex 32`

## SEO — what's already in place

- Every public route is statically prerendered.
- Per-page metadata, plus keywords targeting local search (`وکیل اهواز`,
  `وکیل ملکی اهواز`, `وکیل چک`, …) in `app/(site)/layout.tsx`.
- JSON-LD: `Attorney` (name, address, phone, specialties, bar membership,
  Instagram `sameAs`, opening hours) site-wide; `BreadcrumbList` on every detail
  page; `FAQPage` on `/faq` (eligible for expandable Q&A rich results);
  `BlogPosting` on every article.
- Generated favicon + Apple touch icon + Open Graph image (`app/icon.tsx`,
  `app/apple-icon.tsx`, `app/opengraph-image.tsx`) — deliberately text-free
  (a geometric seal mark): the image-generation environment (Satori, via
  `next/og`) doesn't reliably shape Arabic/Persian script without an explicitly
  embedded font, which wasn't fetchable while building this, so a safe
  language-independent mark was used instead of risking garbled glyphs.
- `sitemap.xml` / `robots.txt` generated from the same content data (can't drift
  out of sync), `/admin` excluded from indexing.
- Outside this codebase: register the domain, create a Google Business Profile
  with identical name/address/phone (NAP consistency matters most for local
  SEO), link it to the site.

## Phase 2 roadmap — پنل مدیریتی

| RFP item | Status | Suggested approach |
|---|---|---|
| **Messages/consultation-request dashboard** | ✅ Built (`/admin/messages`) | Add per-message assignment + reply templates next. |
| **CMS** (blog, pages, lawyer profile, media) | Not built | Rewrite `lib/content/*.ts` bodies to read/write the DB instead of `data/*.ts`; add `app/admin/content/...` with shadcn `Table`/`Dialog`/`Form`. |
| **Auth + roles** (Admin/Lawyer/Staff/Client) | Basic single-password only | Auth.js (next-auth) or Clerk; replace `lib/auth.ts`. |
| **Client portal** (case status, secure docs, messaging) | Not built | Real auth above + `Case`/`Document`/`Message` tables; replace the honest stub in `app/(site)/client-login/`. |
| **Booking system** (calendar, reminders, sync) | Not built | `react-day-picker` (shadcn `Calendar`) + Google/Microsoft calendar APIs. |
| **Email/SMS notifications** | Not built | Resend (email) + Kavenegar/Twilio (SMS), called from `lib/actions/consultation.ts` once a submission is saved. |
| **Payment gateway** | Not built | ZarinPal or similar, as a step in the booking flow. |

`.env.example` documents every variable each of these will need.

## Notes

- **Fonts**: Google Fonts via `@import url(...)` in `globals.css` rather than
  `next/font/google`, so the build has no build-time dependency on reaching
  Google's font CDN.
- **Deploying**: any Node.js host with a persistent filesystem works out of the
  box (Railway, Render, Fly.io, a VPS). For Vercel, swap the database per the
  **Database** section first.
