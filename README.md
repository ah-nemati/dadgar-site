# موسسه حقوقی دادگر — وب‌سایت عمومی (فاز اول)

Next.js (App Router) implementation of **Phase 1 — Public Website** from the RFP
`RFP - وب سایت و پنل مدیریتی دفتر حقوقی`. Phase 2 (admin panel / CMS / client portal /
booking system / payments) is out of scope for this build — see **Scope** below.

## Stack

- **Next.js 16** (App Router, Turbopack, static generation for every route)
- **React 19**
- **Tailwind CSS v4** (CSS-first theme in `app/globals.css`)
- **lucide-react** for icons
- Plain JavaScript (no TypeScript) — see *Notes* if you'd rather convert it

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
  layout.js              root layout (html lang="fa" dir="rtl", Header, Footer, metadata)
  page.js                 Home
  about/page.js
  practice-areas/page.js
  practice-areas/[slug]/page.js
  lawyers/page.js
  lawyers/[slug]/page.js
  blog/page.js
  blog/[slug]/page.js
  faq/page.js
  contact/page.js
  client-login/page.js
  not-found.js
  sitemap.js / robots.js
components/               Header, Footer, forms, and shared UI pieces
data/                     firm.js, practiceAreas.js, lawyers.js, blogPosts.js, faqs.js
```

All content is data-driven — edit the files in `data/` and every page that uses that
data (cards, detail pages, footer links, sitemap, `<option>` lists, etc.) updates
automatically.

## ⚠️ Placeholder content

Since the RFP left these fields to be filled in by the client, everything below is
**sample content** for the demo and should be replaced with the real thing in `data/`:

- Firm name, tagline, phone, email, address, hours → `data/firm.js`
- Lawyer names, bios, photos (currently initials-only avatars, no stock photos used
  on purpose) → `data/lawyers.js`, `components/Avatar.jsx`
- Blog posts → `data/blogPosts.js`
- Practice areas can stay, be trimmed, or expanded → `data/practiceAreas.js`
- Logo/emblem is an original geometric "seal" mark (`components/Seal.jsx`), not a
  real logo — swap in the firm's actual logo when ready

## Scope note — Phase 2 is not implemented here

Per the RFP, `بخش دوم: پنل مدیریتی` (CMS, client portal with real authentication,
booking calendar, payment gateway, message-management dashboard) needs a real backend,
database, and integrations, and is a separate build. The `/client-login` page is an
honest stub: it explains that the portal ships with Phase 2 instead of faking a login.

## Notes

- **Fonts**: loaded via a plain `@import url(...)` of Google Fonts in `globals.css`
  rather than `next/font/google`, so the build has no build-time dependency on
  reaching Google's font CDN (useful for restricted-network CI). Swapping to
  `next/font/google` for self-hosted, zero-layout-shift fonts is a small, optional
  upgrade — see the [Next.js font docs](https://nextjs.org/docs/app/getting-started/fonts).
- **TypeScript**: this was scaffolded as JavaScript for simplicity. `npx next typegen`
  plus renaming files to `.tsx`/`.ts` is the supported migration path if you want it.
- **Deploying**: any Node.js host or platform that supports Next.js (Vercel, your own
  server, etc.) works — see the [deployment guide](https://nextjs.org/docs/app/getting-started/deploying).
