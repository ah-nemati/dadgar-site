# دادگر — Next.js 16 + Auth0 + PostgreSQL

پرتال کامل دفتر حقوقی با معماری مستقل و قابل استقرار روی هر سرویس:

- **Auth0** برای Universal Login، ثبت‌نام، Session، بازیابی رمز و مدیریت هویت
- **PostgreSQL** برای پروفایل‌ها، پرونده‌ها، نوبت‌ها، پیام‌ها، درخواست‌ها و وبلاگ
- **ImageKit** برای تصاویر عمومی و اسناد خصوصی با Signed URL
- **Next.js App Router / Server Actions** به‌عنوان Backend-for-Frontend
- پنل‌های مجزای مدیر و موکل، Skeleton loading، طراحی RTL و ریسپانسیو
- ساعات نوبت‌دهی: شنبه تا چهارشنبه، ساعت ۱۷ تا ۲۲، بازه‌های نیم‌ساعته

## پیش‌نیازها

- Node.js `20.19.0` یا جدیدتر
- npm 10 یا جدیدتر
- یک Tenant در Auth0
- PostgreSQL و یک حساب رایگان ImageKit

## ۱. نصب محلی

```bash
cp .env.example .env.local
npm install
```

برای اجرای PostgreSQL محلی:

```bash
docker compose up -d
npm run db:migrate
npm run db:seed
npm run dev
```

سایت در `http://localhost:3000` و PostgreSQL روی پورت `5432` در دسترس است. فایل‌ها مستقیماً در ImageKit ذخیره می‌شوند.

## ۲. تنظیم Auth0 Regular Web Application

> **نکته سازگاری Cloudflare:** در این نسخه هیچ `middleware.ts` یا `proxy.ts` وجود ندارد. مسیرهای Auth0 از `app/auth/[auth0]/route.ts` اجرا می‌شوند تا مشکل Node.js Middleware و هنگ درخواست در Next.js 16/Cloudflare ایجاد نشود. Sessionهای Auth0 نیز به‌صورت غیر Rolling و با عمر ثابت سه‌روزه تنظیم شده‌اند.

در Auth0 یک **Regular Web Application** بسازید و Database Connection مورد استفاده را برای آن فعال کنید. اگر ثبت‌نام عمومی لازم است، گزینه غیرفعال‌کردن Sign Up در همان Connection روشن نباشد.

مقادیر زیر را در `.env.local` قرار دهید:

```env
AUTH0_DOMAIN="your-tenant.eu.auth0.com"
AUTH0_CLIENT_ID="..."
AUTH0_CLIENT_SECRET="..."
APP_BASE_URL="http://localhost:3000"
```

Secret نشست را بسازید:

```bash
openssl rand -hex 32
```

خروجی ۶۴ کاراکتری را در `AUTH0_SECRET` قرار دهید. سپس در Application Settings این URLها را ثبت کنید:

```text
Allowed Callback URLs: http://localhost:3000/auth/callback
Allowed Logout URLs:   http://localhost:3000
Allowed Web Origins:   http://localhost:3000
```

برای Production همین سه مقدار را با دامنه واقعی سایت جایگزین کنید و `APP_BASE_URL` و `NEXT_PUBLIC_SITE_URL` را نیز روی دامنه HTTPS قرار دهید.

## ۳. نقش ادمین و موکل

فایل زیر را در Auth0 به‌عنوان **Post Login Action** ایجاد، Deploy و به Login Flow اضافه کنید:

```text
auth0/post-login-action.js
```

برای Action یک Secret با نام `ROLE_CLAIM_NAMESPACE` و همان مقدار `AUTH0_ROLE_CLAIM_NAMESPACE` بسازید. این Action مقدار `app_metadata.role` را به‌صورت Claim نام‌گذاری‌شده داخل ID Token قرار می‌دهد.

برای Bootstrap مدیر اولیه، ایمیل او را موقتاً در `AUTH0_ADMIN_EMAILS` قرار دهید. سپس نقش دائمی را ثبت کنید:

```bash
node scripts/set-auth0-role.mjs admin@example.com admin
```

بعد از تخصیص نقش، کاربر باید Sign Out و دوباره Sign In کند. پس از اطمینان از ثبت Claim می‌توانید ایمیل Bootstrap را از `AUTH0_ADMIN_EMAILS` حذف کنید.

## ۴. Auth0 Management API

یک **Machine-to-Machine Application** بسازید و آن را برای Auth0 Management API با Scopeهای زیر مجاز کنید:

```text
read:users
create:users
update:users
delete:users
```

مقادیر آن را در متغیرهای زیر قرار دهید:

```env
AUTH0_M2M_CLIENT_ID="..."
AUTH0_M2M_CLIENT_SECRET="..."
AUTH0_DB_CONNECTION="Username-Password-Authentication"
```

این دسترسی فقط روی سرور استفاده می‌شود و برای موارد زیر است:

- ساخت حساب موکل با رمز موقت از پنل مدیر، بدون ارسال ایمیل تأیید
- تغییر رمز حساب‌های Database Connection
- همگام‌سازی نام و تلفن با پروفایل Auth0
- Rollback حساب Auth0 در صورت شکست تراکنش دیتابیس

حساب‌های Google یا سایر Social Connectionها رمز محلی ندارند و امنیت آن‌ها از همان Provider مدیریت می‌شود.

## ۵. PostgreSQL

Migration اصلی در این مسیر است:

```text
database/migrations/001_initial.sql
database/migrations/002_imagekit_storage.sql
```

اجرا:

```bash
npm run db:migrate
```

شناسه اصلی هر کاربر همان Auth0 `sub` است؛ برای مثال `auth0|abc123`. همه Queryها فقط در Server Component یا Server Action اجرا می‌شوند و دسترسی موکل با همین شناسه محدود می‌شود.

برای Production می‌توان از PostgreSQL مدیریت‌شده یا Self-hosted استفاده کرد. در اتصال‌های ابری، `DATABASE_SSL` را حذف کنید یا روی `true` نگه دارید؛ مقدار `false` فقط برای Docker محلی است.

## ۶. ImageKit

فایل‌های عمومی و خصوصی در ImageKit Media Library نگهداری می‌شوند و دسترسی اسناد محرمانه فقط با URL امضاشده انجام می‌شود.

متغیرهای لازم:

```env
IMAGEKIT_PUBLIC_KEY="public_xxxxxxxxx"
IMAGEKIT_PRIVATE_KEY="private_xxxxxxxxx"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_imagekit_id"
IMAGEKIT_PUBLIC_FOLDER="/blog-images"
IMAGEKIT_PRIVATE_FOLDER="/client-documents"
```

- تصاویر وبلاگ عمومی و بهینه‌شده در `/blog-images` ذخیره می‌شوند.
- اسناد پرونده با `isPrivateFile: true` در `/client-documents` ذخیره می‌شوند.
- لینک دانلود سند فقط پس از کنترل Auth0 و به‌صورت Signed URL پانزده‌دقیقه‌ای ساخته می‌شود.
- `IMAGEKIT_PRIVATE_KEY` فقط در سرور و Cloudflare Secret قرار می‌گیرد.
- Metadata استاندارد و Custom Metadata سئو هنگام آپلود تصاویر ثبت می‌شود؛ اگر فیلدهای Custom Metadata هنوز در ImageKit ساخته نشده باشند، آپلود به‌صورت امن بدون آن فیلدها تکرار می‌شود.

## ۷. ایمیل‌های Auth0

بازیابی رمز عمومی از Email Provider خود Auth0 استفاده می‌کند. برای Production، Provider یا Custom SMTP را در Auth0 تنظیم کنید. مسیر مدیریتی تعیین رمز موقت به ایمیل وابسته نیست.

## ۸. Build و اجرا

```bash
npm run audit:storage
npm run audit:runtime
npm run typecheck
npm run lint
npm run build
npm run start
```

برای Preview واقعی Cloudflare، فایل `.dev.vars` باید `APP_BASE_URL="http://localhost:8787"` داشته باشد:

```bash
cp .dev.vars.example .dev.vars
npm run preview
```

سپس این دو مسیر را بررسی کنید:

```text
http://localhost:8787/api/health
http://localhost:8787/auth/login
```

## کنترل‌های امنیتی پیاده‌شده

- کلیدها فقط در متغیرهای محیطی سرور نگهداری می‌شوند.
- تمام Server Actionهای مدیریتی با `requireAdmin` محافظت شده‌اند.
- موکل فقط پرونده، سند، نوبت و گفت‌وگوی متعلق به Auth0 `sub` خود را دریافت می‌کند.
- نقش namespaced Auth0 با PostgreSQL همگام می‌شود و Claim صریح Auth0 منبع معتبر نقش است.
- اسناد با رابطه مرکب پرونده/موکل در دیتابیس یکپارچگی دارند.
- حساب مدیر از مسیر تغییر رمز موکل قابل تغییر نیست.
- مسیرهای `/admin`، `/portal` و `/auth` در robots مسدود و صفحات پنل `noindex` هستند.
- صفحات عمومی، وبلاگ و Sitemap از ISR و invalidation بعد از تغییر محتوا استفاده می‌کنند.


## بررسی لایه ذخیره‌سازی

```bash
npm run audit:storage
```

این دستور تأیید می‌کند که تمام کدهای پروژه از لایه ImageKit استفاده می‌کنند. دستور `npm run audit:runtime` نیز نبودن Middleware/Proxy ناسازگار و وجود Route Handler Auth0 را کنترل می‌کند.

## نصب بدون وابستگی ذخیره‌سازی اضافی

Adapter استقرار Cloudflare داخل وابستگی‌های دائمی پروژه نصب نمی‌شود. فرمان‌های `cf:build`، `preview`، `deploy` و `upload` نسخه پین‌شده Adapter را فقط هنگام همان فرمان با `npx` اجرا می‌کنند. بنابراین نصب عادی پروژه فقط کد برنامه و ImageKit را وارد `node_modules` می‌کند.

```bash
rm -rf node_modules package-lock.json .next .open-next
npm install
npm run audit:storage
npm run typecheck
npm run build
```

برای استقرار:

```bash
npm run preview
npm run deploy
```

## انتشار در صورت خطای شبکه محلی

اگر npm با `ECONNRESET` یا Wrangler با `403 bot challenge` متوقف شد، از Workflow آماده GitHub Actions استفاده کن:

- `.github/workflows/deploy-cloudflare.yml`
- `GITHUB_DEPLOY_FA.md`
