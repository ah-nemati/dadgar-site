# وب‌سایت حقوقی دادگر

پروژه‌ی Next.js 16 و React 19 برای وب‌سایت و پنل دفتر حقوقی است. احراز هویت، نشست‌ها و مدیریت کاربران به‌صورت داخلی روی PostgreSQL فعلی پروژه انجام می‌شود و هیچ سرویس احراز هویت بیرونی در مسیر ثبت‌نام یا ورود وجود ندارد.

## امکانات احراز هویت

- ثبت‌نام، ورود و خروج کاربران
- تغییر رمز برای موکل، وکیل و مدیر
- بازیابی رمز بدون سرویس ایمیل، با لینک یک‌بارمصرف ۳۰ دقیقه‌ای که مدیر می‌سازد
- سه نقش `CLIENT`، `LAWYER` و `ADMIN`
- وضعیت‌های `ACTIVE`، `DISABLED` و `PASSWORD_RESET_REQUIRED`
- مدیریت مستقیم کاربران از پنل مدیر: ساخت، ویرایش، حذف، تغییر نقش، فعال/غیرفعال‌کردن و ساخت لینک بازنشانی رمز
- محدودسازی تلاش‌های ورود، ثبت‌نام و بازیابی رمز در PostgreSQL
- ثبت رویدادهای امنیتی اصلی در `audit_logs`

رمز عبور با `PBKDF2-HMAC-SHA256`، salt تصادفی ۱۶ بایتی و ۶۰۰٬۰۰۰ دور هش می‌شود. توکن نشست ۲۵۶ بیت entropy دارد، با HMAC امضا می‌شود و فقط هش SHA-256 آن در `user_sessions` ذخیره می‌شود. Cookie نشست در production دارای `HttpOnly`، `Secure`، `SameSite=Lax`، مسیر `/` و انقضای هفت‌روزه است.

## نقش‌ها و دسترسی‌ها

| نقش      | پنل       | دسترسی                                                     |
| -------- | --------- | ---------------------------------------------------------- |
| `CLIENT` | `/portal` | پروفایل، پرونده‌های خود، نوبت‌ها و گفت‌وگوهای خود          |
| `LAWYER` | `/admin`  | پرونده‌ها، نوبت‌ها، درخواست‌های مشاوره و گفت‌وگوهای دفتر   |
| `ADMIN`  | `/admin`  | همه‌ی امکانات وکیل به‌علاوه مدیریت کاربران، نقش‌ها و وبلاگ |

Middleware ابتدا امضای نشست و نقش را بررسی می‌کند. همه‌ی layoutها و Server Actionهای حساس نیز نشست را از جدول `user_sessions` و وضعیت/نقش فعلی کاربر را از `users` دوباره کنترل می‌کنند؛ بنابراین حذف نشست، غیرفعال‌کردن حساب یا تغییر نقش فوراً در سمت سرور اعمال می‌شود.

## ساختار داده

Migrationها در `database/migrations` قرار دارند. جدول اصلی کاربر شامل ستون‌های زیر است:

```text
id, email, password_hash, name, phone, role, status,
password_changed_at, created_at, updated_at
```

جدول‌های تکمیلی احراز هویت:

- `user_sessions`: هش توکن، مالک نشست، زمان انقضا و هش حریم‌خصوصی IP/User-Agent
- `password_reset_tokens`: هش توکن یک‌بارمصرف و زمان انقضا/مصرف
- `auth_rate_limits`: محدودسازی تلاش‌ها بر اساس ترکیب هش‌شده‌ی IP و شناسه
- `lawyer_profiles`: شماره پروانه و فهرست تحصیلات وکیل

اطلاعات وکیل پیش‌فرض از داده‌های خود پروژه استفاده می‌کند:

- نام:
- شماره پروانه: ۲۳۰۶
- کارشناسی ارشد حقوق خصوصی
- کارشناسی ارشد زبان و ادبیات عربی
- نقش: `LAWYER`

## راه‌اندازی محلی

پیش‌نیازها: Node.js 22، npm و PostgreSQL 16 یا نسخه‌ی سازگار.

```bash
cp .env.example .env.local
openssl rand -base64 48
```

خروجی دستور دوم را به‌عنوان `SESSION_SECRET` در `.env.local` قرار دهید. مقدار باید حداقل ۳۲ کاراکتر و در همه‌ی deploymentهای یک محیط ثابت باشد.

برای PostgreSQL محلی می‌توان از Docker Compose همراه پروژه استفاده کرد:

```bash
docker compose up -d
npm install --include=optional
npm run db:migrate
npm run db:seed
npm run dev
```

صفحه‌ی محلی در `http://localhost:3000` در دسترس است. متغیرهای `INITIAL_ADMIN_*` و `INITIAL_LAWYER_*` فقط هنگام اجرای seed خوانده می‌شوند. بعد از ساخت حساب‌ها، رمزهای bootstrap را از محیط CI حذف یا rotate کنید.

## ارتقای دیتابیس موجود

قبل از migration از PostgreSQL نسخه‌ی پشتیبان بگیرید. سپس روی همان دیتابیس فعلی اجرا کنید:

```bash
npm run db:migrate
npm run db:seed
```

Migration شماره‌ی `003` جدول هویت قبلی را درجا به `users` تبدیل می‌کند تا شناسه‌ها و کلیدهای خارجی پرونده‌ها، پیام‌ها، نوبت‌ها و لاگ‌ها حفظ شوند. چون هش رمز سرویس قبلی قابل انتقال نیست، کاربران منتقل‌شده با وضعیت `PASSWORD_RESET_REQUIRED` علامت می‌خورند. مدیر از صفحه جزئیات هر کاربر برای او لینک یک‌بارمصرف می‌سازد تا رمز تازه تعیین کند.

اجرای مجدد migrate و seed امن است: migrationهای ثبت‌شده دوباره اجرا نمی‌شوند و seed، رمز یک حساب فعال را overwrite نمی‌کند.

## بازیابی رمز بدون سرویس ایمیل

برای بازیابی رمز هیچ سرویس ایمیل، API پولی یا Secret جداگانه‌ای لازم نیست:

1. کاربر از صفحه «فراموشی رمز» با دفتر تماس می‌گیرد یا از صفحه تماس درخواست می‌فرستد.
2. مدیر هویت کاربر را با اطلاعات ثبت‌شده بررسی می‌کند.
3. مدیر وارد `مدیریت کاربران` می‌شود، صفحه همان کاربر را باز می‌کند و در بخش «بازنشانی رمز کاربر» روی «ساخت لینک بازنشانی» می‌زند.
4. لینک را خصوصی از طریق پیام‌رسان یا روش مورد اعتماد برای کاربر می‌فرستد.
5. کاربر با همان لینک رمز تازه تعیین می‌کند.

توکن لینک ۲۵۶ بیتی است، فقط هش SHA-256 آن در دیتابیس ذخیره می‌شود، پس از ۳۰ دقیقه منقضی می‌شود و فقط یک‌بار قابل استفاده است. ساخت لینک، حساب را تا تعیین رمز تازه در وضعیت `PASSWORD_RESET_REQUIRED` می‌گذارد و رمز قبلی دیگر امکان ورود ندارد. لینک استفاده‌نشده قبلی و همه نشست‌های فعال کاربر نیز باطل می‌شوند. توکن در لاگ امنیتی ذخیره نمی‌شود.

## استقرار روی Cloudflare Workers

1. یک Hyperdrive متصل به PostgreSQL فعلی بسازید و مقدار `id` آن را در `wrangler.jsonc` جایگزین کنید.
2. `compatibility_flags: ["nodejs_compat"]` را حفظ کنید.
3. متغیرهای عمومی `APP_BASE_URL` و `NEXT_PUBLIC_SITE_URL` را با دامنه‌ی واقعی تنظیم کنید.
4. secretهای runtime را در داشبورد Cloudflare یا با Wrangler ثبت کنید:

```bash
npx wrangler secret put SESSION_SECRET
npx wrangler secret put DATABASE_URL
npx wrangler secret put IMAGEKIT_PUBLIC_KEY
npx wrangler secret put IMAGEKIT_PRIVATE_KEY
npx wrangler secret put IMAGEKIT_URL_ENDPOINT
```

5. migration و seed را از محیطی اجرا کنید که به PostgreSQL دسترسی شبکه دارد.
6. Worker را build و deploy کنید:

```bash
npm run cf:build
npm run deploy
```

برای preview محلی Worker، `.dev.vars.example` را به `.dev.vars` کپی و سپس `npm run preview` را اجرا کنید.

### نکته‌ی Next.js 16 و OpenNext

Next.js 16 فایل `proxy.ts` را فقط با Node runtime اجرا می‌کند، در حالی که OpenNext 1.20 هنوز Node Middleware را bundle نمی‌کند. به همین دلیل محافظ مسیر عمداً در `middleware.ts` با `experimental-edge` نگه داشته شده است. هشدار deprecation در build انتظار می‌رود، اما build کامل OpenNext و بسته‌ی Worker موفق است. پس از اضافه‌شدن پشتیبانی Node Proxy به OpenNext می‌توان این فایل را با codemod رسمی به `proxy.ts` تبدیل کرد.

## استقرار خودکار GitHub Actions

Workflow آماده در `.github/workflows/deploy-cloudflare.yml` ابتدا migration، seed، audit، typecheck و lint را اجرا می‌کند و سپس Worker را می‌سازد. secretهای زیر را در repository تنظیم کنید:

- `CLOUDFLARE_API_TOKEN` و `CLOUDFLARE_ACCOUNT_ID`
- `SESSION_SECRET` و `DATABASE_URL`
- `IMAGEKIT_PUBLIC_KEY`، `IMAGEKIT_PRIVATE_KEY` و `IMAGEKIT_URL_ENDPOINT`
- `INITIAL_ADMIN_*` و در صورت نیاز `INITIAL_LAWYER_*`

`DATABASE_URL` مورد استفاده‌ی CI باید از GitHub runner قابل دسترسی باشد. خود Worker در runtime، در صورت وجود binding، اتصال Hyperdrive را ترجیح می‌دهد.

## کنترل کیفیت

```bash
npm run audit:storage
npm run audit:runtime
npm run typecheck
npm run lint
npm run build
npm run cf:build
```

فرمان کوتاه `npm run check` چهار بررسی نخست را یکجا اجرا می‌کند.
