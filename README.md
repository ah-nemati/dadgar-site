# مجید سواری — دفتر وکالت

Next.js implementation of **Phase 1 — Public Website** for مجید سواری (وکیل پایه یک
دادگستری، عضو کانون وکلای خوزستان، اهواز), based on the RFP
`RFP - وب سایت و پنل مدیریتی دفتر حقوقی` — plus **Phase 2 — پنل مدیریتی**
work: a blog CMS, a Contact-form inbox, and real client registration/login
with a protected portal, all backed by Supabase. See **What's built** below
for the exact boundary.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript** (strict mode)
- **Tailwind CSS v4** (CSS-first theme in `app/globals.css` — sky-blue palette)
- **shadcn/ui** (Radix primitives, owned as source in `components/ui/`)
- **Supabase** — Postgres database + Auth, free tier (see **Supabase setup**)
- **lucide-react** for icons, **jalaali-js** for Gregorian→Jalali date display

## ⚠️ Before publishing — confirm these

- **Domain / email**: `data/firm.ts` uses `majidsavarivakil.ir` as a _suggested_
  domain (mirrors the Instagram handle `savari_lawyer.ahvaz`) —
  **not registered or availability-checked**. Email is set to
  `savari.vakil2023@gmail.com` (the newest of three Gmail accounts visible in
  a screenshot) — change in `data/firm.ts` if a different address was intended.
- **Years of experience / education**: left as `[...]` placeholders in
  `data/firm.ts` and `data/lawyers.ts` — no verified figures were provided.
- **Supabase project**: this code expects a real Supabase project's URL/key
  and schema — see the setup steps below. Nothing under `/admin`, `/portal`,
  or the blog works without it (the rest of the public site does).

## Supabase setup

1. Create a free project at [supabase.com](https://supabase.com).
2. **SQL Editor** → New query → paste and run `supabase/schema.sql` (creates
   every table, the `profiles`/role system, and every RLS policy).
3. Optional: also run `supabase/seed.sql` for 4 starter blog posts.
4. **Authentication → Users → Add user** → create your own admin login (email
   - password). This is what you'll use at `/admin/login`.
5. Run this in the SQL Editor (with that same email) so Supabase recognizes
   them as admin, not a regular client:
   ```sql
   update profiles set role = 'admin'
   where id = (select id from auth.users where email = 'your-admin-email@example.com');
   ```
6. **Settings → API** → copy the Project URL and the `anon`/`public` key
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
end. What I _did_ verify, concretely:

- `supabase/schema.sql` and `supabase/seed.sql` run cleanly against a real,
  local PostgreSQL 16 instance (installed just for this check), including the
  `profiles` table, the `is_admin()` function, and the new-user trigger.
- Every RLS policy behaves exactly as intended, tested by actually creating
  Postgres roles and rows and attempting each operation: `anon` can insert a
  consultation request but not read them back; `anon` sees only `published`
  blog posts and cannot write to that table at all; a `client`-role user can
  read/edit only their own `profiles` row and sees nothing in
  `consultation_requests`/`blog_posts`; a `client` attempting to `UPDATE` their
  own row to `role = 'admin'` is rejected by the policy; an `admin`-role user
  can do everything intended. The signup trigger was tested by inserting a row
  into a stand-in `auth.users` table and confirming a matching `profiles` row
  appeared automatically with the right name/phone pulled from metadata.
- The whole app builds successfully and passes ESLint with the real Supabase
  client, auth, and portal code in place.

What that leaves unverified: the actual `@supabase/supabase-js` /
`@supabase/ssr` calls succeeding against a **live** Supabase endpoint, and
Supabase Auth's real sign-in/sign-up flow. Please treat the checklist below as
your own first smoke test after setup — it's exactly what I would have run
myself if I'd had a project to point at.

### Testing checklist (do this once, after setup)

- [ ] `npm run dev`, open `/`, confirm the homepage loads
- [ ] Submit the Contact form → should show the success state
- [ ] Log into `/admin/login` with the user you created and promoted to admin
      → should land on `/admin/messages` and show the submission above
- [ ] Mark it read/replied → status badge updates
- [ ] `/admin/blog` → New post → fill in the form, leave "published" unchecked
      → save → confirm it appears in the admin list as "پیش‌نویس" (draft) but
      **not** on the public `/blog` page
- [ ] Edit that post, check "published" → save → confirm it now appears on
      `/blog`
- [ ] Delete it → confirm it disappears from both places
- [ ] `/client-login/signup` → create a client account with a _different_
      email than your admin → depending on your project's email-confirmation
      setting, either lands on `/portal` or shows "check your email"
- [ ] Once signed in as that client, confirm `/portal` shows their name and
      lets them edit it
- [ ] Try visiting `/admin/messages` while signed in as that client → should
      redirect to `/admin/login` (a client account has no admin access)

## What's built

**Public site (Phase 1, complete):** Home, About, Practice Areas (list +
detail), Lawyer profile, Blog (list + detail), FAQ, Contact.

**Client accounts (Phase 2, section 4.2 — foundation):**

- `/client-login/signup` and `/client-login` — real self-service registration
  and login (Supabase Auth). Email confirmation follows whatever your Supabase
  project has configured (Authentication → Settings) — on by default, so new
  users see "check your email" rather than landing straight in the portal.
- `/portal` — protected dashboard: shows the signed-in client's name, lets
  them edit their name/phone. Case tracking, documents, and secure messaging
  are **not built** — the dashboard says so plainly rather than faking it;
  they're the natural next slice once there's a `cases` table to back them.

**Admin panel (Phase 2, section 4.1 & 4.4):**

- `/admin/messages` — every Contact-form submission, mark read/replied.
- `/admin/blog` — full CMS for blog posts: create, edit, delete, publish/
  unpublish, automatic Jalali date + reading-time display.
- Real Supabase Auth, and checks the signed-in user's `role` is `admin` (see
  **Roles & security** below), not just "any authenticated user."

**Not built yet (documented roadmap only):** case tracking, document upload,
in-portal messaging, booking/calendar, payments, email/SMS notifications,
Lawyer/Staff roles (only `admin`/`client` exist right now).

## Roles & security

Every Supabase user gets a row in `profiles` (auto-created by a trigger on
signup) with `role` = `'client'` by default. `/admin/*` requires `role =
'admin'` (checked in `proxy.ts` **and** re-checked in the login action itself,
so a client account gets a clear "این حساب دسترسی مدیریتی ندارد" message
instead of a confusing silent redirect). `/portal/*` requires only "signed
in," any role.

RLS policies use an `is_admin()` SQL function rather than checking `to
authenticated` directly — with only an admin account, those were equivalent,
but now that any visitor can self-register as a `client`, a blanket
`authenticated` policy would have handed every new signup full read/write
access to messages and blog posts. I tested this specific scenario against a
real (local) Postgres instance: a client account cannot read
`consultation_requests` or `blog_posts`, and — importantly — cannot `UPDATE`
their own `profiles` row to grant themselves `role = 'admin'` (the policy's
`WITH CHECK` blocks it). See **What I could and couldn't verify** above for
exactly what was and wasn't tested this way.

### ⚠️ `/admin` and `/portal` need Supabase configured just to load

Unlike the rest of the public site (which works with zero configuration),
every route under `/admin` and `/portal` goes through `proxy.ts`, which
constructs a Supabase client unconditionally — so without real
`NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` values, even
`/admin/login` itself will 500 rather than degrade gracefully. This is
expected once you've set up Supabase (a couple of minutes, see above); it's
only surprising if you skip straight to `npm run dev` without it. The public
site — including `/client-login` and `/client-login/signup` themselves —
still renders fine without Supabase configured; only actually submitting
those forms needs it.

## Project structure

```
app/
  (site)/                  the public site — its own root layout (Header/Footer)
    layout.tsx, page.tsx, about/, practice-areas/, lawyers/, blog/, faq/, contact/
    client-login/           login page, actions.ts (client signup/login/logout)
    client-login/signup/     registration page
    portal/                  protected client dashboard + profile edit form
  admin/                    the admin panel — its OWN separate root layout
    layout.tsx, actions.ts (login/logout, verifies role='admin')
    login/page.tsx
    messages/page.tsx, actions.ts (status updates)
    blog/page.tsx (list), new/page.tsx, [id]/page.tsx (edit), actions.ts, BlogForm.tsx
  icon.tsx, apple-icon.tsx, opengraph-image.tsx, sitemap.ts, robots.ts, globals.css
proxy.ts                    refreshes the Supabase session + gates /admin/* and
                             /portal/* (renamed from `middleware.ts` — Next.js 16 convention)
components/ui/               shadcn primitives (owned source, not a dependency)
lib/
  supabase/
    client.ts                 browser client (Client Components)
    server.ts                 server client, cookie-aware (Server Components/Actions)
    public.ts                  server client, NOT cookie-aware — for public reads
                               that also run at build time
    middleware.ts               session-refresh + route-gating logic shared by proxy.ts
  content/                    async data-access layer; pages only import from here
  content/blog-admin.ts        admin-only CRUD (drafts included), used only by /admin
  actions/consultation.ts       Server Action: Contact form → Supabase
  profile.ts                    signed-in user's own profile (get/update)
  format.ts                     Jalali date + reading-time helpers
data/                         practice areas, lawyers, FAQ (still static — see below)
supabase/schema.sql, seed.sql   run these in the Supabase SQL Editor
types/content.ts               shared TypeScript types
```

### Why `lib/supabase/public.ts` is separate from `server.ts`

`generateStaticParams` and any build-time static generation run with no
incoming HTTP request, so `cookies()` (which `server.ts` needs) isn't
available and throws. `public.ts` is a plain client with no cookie handling,
safe to call from anywhere — used for the blog's public reads.

### Why blog pages are `force-dynamic` instead of statically built

Blog content lives in Supabase and can change any time via `/admin/blog`.
Statically pre-building every post at `next build` time would mean (a) a new
or edited post needs a full redeploy to appear, and (b) the build itself would
fail if Supabase happened to be unreachable at build time. `force-dynamic` on
`app/blog/page.tsx`, `blog/[slug]/page.tsx`, and `sitemap.ts` avoids
both. The homepage's blog-preview section and the sitemap wrap their Supabase
calls in `.catch()` so a Supabase hiccup degrades gracefully instead of
breaking an otherwise-static page. Swap `force-dynamic` for `export const
revalidate = 3600` (ISR) later if traffic makes the per-request DB round-trip
worth avoiding — no other code changes needed.

Practice areas, lawyers, and FAQ are still static files in `data/` — they
change rarely and weren't asked for as CMS-editable yet; moving them later
follows the exact same pattern as blog.

## SEO — what's already in place

Every public route ships per-page metadata + locally-relevant keywords
(city+service combinations like "وکیل ملکی اهواز", "وکیل چک", plus dedicated
keywords per practice-area page), JSON-LD (`Attorney` with Instagram `sameAs`

- opening hours, `WebSite`, `BreadcrumbList` on detail pages, `FAQPage`,
  `BlogPosting`), a generated favicon/Apple icon/OG image (`app/icon.tsx` — this
  is the "logo" that shows in the browser tab and next to the result in Google
  search; deliberately text-free since the image-generation environment doesn't
  reliably shape Arabic/Persian script without an embedded font), and
  `sitemap.xml`/`robots.txt` generated from the live content (`/admin` and
  `/portal` excluded from indexing).

**On "showing site sections in Google search" (sitelinks):** that expandable
multi-link display under a search result is Google's own algorithmic decision
based on site structure, internal linking, and established traffic over
time — no meta tag or schema turns it on directly, and I'd rather say that
plainly than add structured data that _implies_ a feature (like a site-search
box) this site doesn't actually have, which Google's guidelines treat as a red
flag, not a ranking boost. What legitimately improves the odds — clear
navigation, breadcrumbs, an accurate sitemap, consistent internal linking — is
already in place. The highest-value next step is entirely outside this
codebase: register the domain and create a Google Business Profile / Search
Console with identical name-address-phone.

## Phase 2 roadmap — remaining پنل مدیریتی items

| RFP item                                      | Status    | Suggested approach                                                                                    |
| --------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------- |
| Messages/consultation-request dashboard       | ✅ Built  | Add per-message assignment + reply templates next.                                                    |
| Blog CMS                                      | ✅ Built  | Extend the same pattern to static pages/lawyer profile if useful.                                     |
| Client accounts (register/login/basic panel)  | ✅ Built  | —                                                                                                     |
| Case tracking, documents, in-portal messaging | Not built | Add `cases`/`documents`/`messages` tables + RLS scoped to `client_id = auth.uid()`; extend `/portal`. |
| Lawyer/Staff roles                            | Not built | Extend the `role` check in `profiles` beyond `admin`/`client`.                                        |
| Booking system (calendar, reminders, sync)    | Not built | `react-day-picker` (shadcn `Calendar`) + Google/Microsoft calendar APIs.                              |
| Email/SMS notifications                       | Not built | Resend (email) + Kavenegar/Twilio (SMS).                                                              |
| Payment gateway                               | Not built | ZarinPal or similar.                                                                                  |

## Notes

- **Fonts**: Google Fonts via `@import url(...)` rather than `next/font/google`
  (no build-time dependency on reaching Google's font CDN).
- **Deploying**: works on Vercel (Supabase is reachable from serverless
  functions) or any Node.js host.
