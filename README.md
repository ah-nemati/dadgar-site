# مجید سواری — دفتر وکالت

Next.js implementation of **Phase 1 — Public Website** for مجید سواری (وکیل پایه یک
دادگستری، عضو کانون وکلای خوزستان، اهواز), based on the RFP
`RFP - وب سایت و پنل مدیریتی دفتر حقوقی` — plus the start of **Phase 2 —
پنل مدیریتی**: a working Contact-form inbox and a blog CMS, both backed by
Supabase. See **What's built** below for the exact boundary.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript** (strict mode)
- **Tailwind CSS v4** (CSS-first theme in `app/globals.css` — sky-blue palette)
- **shadcn/ui** (Radix primitives, owned as source in `components/ui/`)
- **Supabase** — Postgres database + Auth, free tier (see **Supabase setup**)
- **lucide-react** for icons, **jalaali-js** for Gregorian→Jalali date display

## ⚠️ Before publishing — confirm these

- **Domain / email**: `data/firm.ts` uses `savarilawyer.ir` as a *suggested*
  domain (mirrors the Instagram handle `savari_lawyer.ahvaz`) —
  **not registered or availability-checked**. Email is set to
  `savari.vakil2023@gmail.com` (the newest of three Gmail accounts visible in
  a screenshot) — change in `data/firm.ts` if a different address was intended.
- **Years of experience / education**: left as `[...]` placeholders in
  `data/firm.ts` and `data/lawyers.ts` — no verified figures were provided.
- **Supabase project**: this code expects a real Supabase project's URL/key
  and schema — see the setup steps below. Nothing works without it.

## Supabase setup

1. Create a free project at [supabase.com](https://supabase.com).
2. **SQL Editor** → New query → paste and run `supabase/schema.sql` (creates
   both tables and every RLS policy).
3. Optional: also run `supabase/seed.sql` for 4 starter blog posts (the same
   ones that shipped in earlier drafts of this site).
4. **Authentication → Users → Add user** → create your own admin login (email
   + password). This is what you'll use at `/admin/login` — there's no
   separate signup flow by design (single admin for now).
5. **Settings → API** → copy the Project URL and the `anon`/`public` key
   (some newer projects label it "Publishable key" instead — same thing) into
   `.env.local` (copy `.env.example` first).

```bash
npm install
cp .env.example .env.local     # then fill in the two Supabase values
npm run dev
```

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint     # ESLint
```

### ⚠️ What I could and couldn't verify

I don't have a Supabase account/project reachable from the sandbox this was
built in, so I could not run the app against a real Supabase backend end to
end. What I *did* verify, concretely:

- `supabase/schema.sql` and `supabase/seed.sql` run cleanly against a real,
  local PostgreSQL 16 instance (installed just for this check).
- Every RLS policy behaves exactly as intended, tested by actually switching
  Postgres roles and attempting each operation: `anon` can insert a
  consultation request but not read them back; `anon` sees only `published`
  blog posts and cannot write to that table at all; `authenticated` can read
  and update consultation requests and has full read/write on blog posts
  (including drafts).
- The whole app builds successfully and passes ESLint with the real Supabase
  client code in place.

What that leaves unverified: the actual `@supabase/supabase-js` /
`@supabase/ssr` calls succeeding against a **live** Supabase endpoint, and
Supabase Auth's real sign-in flow. Please treat the first login and the first
Contact-form submission after setup as your own smoke test — the **Testing
checklist** below is exactly what I would have run myself if I'd had a project
to point at.

### Testing checklist (do this once, after setup)

- [ ] `npm run dev`, open `/`, confirm the homepage loads
- [ ] Submit the Contact form → should show the success state
- [ ] Log into `/admin/login` with the user you created in Supabase → should
      land on `/admin/messages` and show the submission above
- [ ] Mark it read/replied → status badge updates
- [ ] `/admin/blog` → New post → fill in the form, leave "published" unchecked
      → save → confirm it appears in the admin list as "پیش‌نویس" (draft) but
      **not** on the public `/blog` page
- [ ] Edit that post, check "published" → save → confirm it now appears on
      `/blog`
- [ ] Delete it → confirm it disappears from both places

## What's built

**Public site (Phase 1, complete):** Home, About, Practice Areas (list +
detail), Lawyer profile, Blog (list + detail), FAQ, Contact, Client Login
(honest stub — explains the real client portal is a later Phase 2 item).

**Admin panel (Phase 2, in progress):**
- `/admin/messages` — every Contact-form submission, mark read/replied.
- `/admin/blog` — full CMS for blog posts: create, edit, delete, publish/
  unpublish, with automatic Jalali date + reading-time display on the public
  site.
- Auth is real Supabase Auth (email + password), not a placeholder.

**Not built yet (documented roadmap only):** client portal with case
tracking, booking/calendar, payments, email/SMS notifications, multi-role
accounts (Lawyer/Staff/Client — right now every Supabase-authenticated user
has full admin rights, since the only accounts are admin ones; see the ⚠️ note
at the bottom of `supabase/schema.sql` before adding client accounts).

## Project structure

```
app/
  (site)/                  the public site — its own root layout (Header/Footer)
  admin/                    the admin panel — its OWN separate root layout
    layout.tsx, actions.ts (login/logout)
    login/page.tsx
    messages/page.tsx, actions.ts (status updates)
    blog/page.tsx (list), new/page.tsx, [id]/page.tsx (edit), actions.ts, BlogForm.tsx
  icon.tsx, apple-icon.tsx, opengraph-image.tsx, sitemap.ts, robots.ts, globals.css
proxy.ts                    refreshes the Supabase session + gates /admin/*
                             (renamed from `middleware.ts` — Next.js 16 convention)
components/ui/               shadcn primitives (owned source, not a dependency)
lib/
  supabase/
    client.ts                 browser client (Client Components)
    server.ts                 server client, cookie-aware (Server Components/Actions)
    public.ts                  server client, NOT cookie-aware — for public reads
                               that also run at build time (see note below)
    middleware.ts               session-refresh logic shared by proxy.ts
  content/                    async data-access layer; pages only import from here
  content/blog-admin.ts        admin-only CRUD (drafts included), used only by /admin
  actions/consultation.ts       Server Action: Contact form → Supabase
  format.ts                     Jalali date + reading-time helpers
data/                         practice areas, lawyers, FAQ (still static — see below)
supabase/schema.sql, seed.sql   run these in the Supabase SQL Editor
types/content.ts               shared TypeScript types
```

### Why `lib/supabase/public.ts` is separate from `server.ts`

`generateStaticParams` and any build-time static generation run with no
incoming HTTP request, so `cookies()` (which `server.ts` needs) isn't
available and throws. `public.ts` is a plain client with no cookie handling,
safe to call from anywhere — used for the blog's public reads. Content that
still lives in `data/*.ts` (practice areas, lawyers, FAQ) doesn't touch
Supabase at all yet, so it isn't affected either way — see below.

### Why blog pages are `force-dynamic` instead of statically built

Blog content now lives in Supabase and can change any time via `/admin/blog`.
Statically pre-building every post at `next build` time would mean (a) a new
or edited post needs a full redeploy to appear, and (b) the build itself would
fail if Supabase happened to be unreachable at build time. `force-dynamic` on
`app/(site)/blog/page.tsx`, `blog/[slug]/page.tsx`, and `sitemap.ts` avoids
both problems. The homepage's blog-preview section and the sitemap also wrap
their Supabase calls in `.catch()` so a Supabase hiccup degrades gracefully
(hides that section / omits blog URLs) instead of breaking an otherwise-static
page. If traffic ever makes the extra per-request DB round-trip worth avoiding,
swap `force-dynamic` for `export const revalidate = 3600` (ISR) — ordinary
Next.js caching, ordinary Postgres, no code changes beyond that one line.

### Only blog content moved to Supabase — practice areas, lawyers, and FAQ are
still static files in `data/`. They change rarely and weren't asked for as
CMS-editable yet; moving them later follows the exact same pattern as blog
(`lib/content/*.ts` already isolates every page from where the data actually
lives) — add a `practice_areas`/`faqs` table and a `lib/content/*-admin.ts`
file the same way `blog-admin.ts` was added.

## SEO — what's already in place

Every public route ships per-page metadata + local-search keywords, JSON-LD
(`Attorney` with Instagram `sameAs` + opening hours, `BreadcrumbList` on detail
pages, `FAQPage`, `BlogPosting`), a generated favicon/Apple icon/OG image
(deliberately text-free — the image-generation environment doesn't reliably
shape Arabic/Persian script without an embedded font), and `sitemap.xml`/
`robots.txt` generated from the live content (`/admin` excluded from
indexing). Outside this codebase: register the domain, create a Google
Business Profile with identical name/address/phone.

## Notes

- **Fonts**: Google Fonts via `@import url(...)` rather than `next/font/google`
  (no build-time dependency on reaching Google's font CDN).
- **Deploying**: works on Vercel (unlike the earlier SQLite version, Supabase
  is reachable from serverless functions — this was the whole reason for the
  migration) or any Node.js host.
