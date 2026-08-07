# استقرار production روی Cloudflare برای majidsavarivakil.ir

این بسته برای معماری زیر آماده شده است:

- Cloudflare Workers + OpenNext: اجرای Next.js
- Auth0: احراز هویت
- Neon: PostgreSQL
- ImageKit: تصاویر عمومی و اسناد خصوصی

## اصل مهم: بدون قطعی جابه‌جا کنید

دامنه فعلی را تا پایان تست تغییر ندهید. ابتدا Worker را روی آدرس Preview یا workers.dev منتشر و همه مسیرها را تست کنید. تغییر nameserver و اتصال دامنه آخرین مرحله است.

## 1. نصب و تست محلی

```bash
cp .env.example .env.local
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

## 2. Auth0

در Regular Web Application این URLها را وارد کنید:

Allowed Callback URLs:

```text
http://localhost:3000/auth/callback,
https://majidsavarivakil.ir/auth/callback
```

Allowed Logout URLs:

```text
http://localhost:3000,
https://majidsavarivakil.ir
```

Allowed Web Origins:

```text
http://localhost:3000,
https://majidsavarivakil.ir
```

فایل `auth0/post-login-action.js` را به Login Flow اضافه کنید و secret زیر را در Action بسازید:

```text
ROLE_CLAIM_NAMESPACE=https://majidsavarivakil.ir
```

## 3. Neon

یک پروژه Neon بسازید و Pooled connection string را در `DATABASE_URL` قرار دهید. سپس:

```bash
npm run db:migrate
npm run db:seed
```

## 4. ImageKit

در ImageKit یک حساب رایگان بسازید و در Media Library دو پوشه زیر را ایجاد کنید:

```text
/blog-images
/client-documents
```

از بخش Developer options → API keys این مقادیر را بردارید و در `.env.local` قرار دهید:

```env
IMAGEKIT_PUBLIC_KEY="public_xxxxxxxxx"
IMAGEKIT_PRIVATE_KEY="private_xxxxxxxxx"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_imagekit_id"
IMAGEKIT_PUBLIC_FOLDER="/blog-images"
IMAGEKIT_PRIVATE_FOLDER="/client-documents"
```

خصوصی‌بودن اسناد توسط کد و با `isPrivateFile: true` اعمال می‌شود. Private Key را هرگز در GitHub یا کد Client قرار ندهید.

## 5. آماده‌سازی Cloudflare

به‌دلیل اینکه OAuth ممکن است روی بعضی شبکه‌ها با خطای `403` مواجه شود، از API Token استفاده کنید. در Cloudflare یک Token با قالب **Edit Cloudflare Workers** بسازید و سپس:

```bash
export CLOUDFLARE_API_TOKEN="YOUR_TOKEN"
export CLOUDFLARE_ACCOUNT_ID="YOUR_ACCOUNT_ID"
npx wrangler whoami

cp .dev.vars.example .dev.vars
npm run preview
```

برای جلوگیری از ثبت Token در تاریخچه شل، می‌توانید آن را در فایل `.env.wrangler` نگه دارید؛ این فایل از Git خارج نگه داشته شود.

در Preview موارد زیر را تست کنید:

- صفحه اصلی و تمام صفحات عمومی
- ورود و خروج Auth0
- پنل مدیر و موکل
- ایجاد موکل و تعیین رمز
- ایجاد پرونده و آپلود سند
- دانلود سند فقط توسط صاحب پرونده یا مدیر
- درج و انتشار نوشته وبلاگ
- رزرو فقط شنبه تا چهارشنبه، ساعت ۱۷ تا ۲۲
- sitemap.xml و robots.txt

## 6. Secrets در Cloudflare

Secrets را در Dashboard یا با Wrangler ثبت کنید. فایل `.env.local` را هرگز Commit نکنید.

نمونه ثبت تکی:

```bash
npx wrangler secret put AUTH0_CLIENT_SECRET
npx wrangler secret put AUTH0_SECRET
npx wrangler secret put AUTH0_M2M_CLIENT_SECRET
npx wrangler secret put DATABASE_URL
npx wrangler secret put IMAGEKIT_PRIVATE_KEY
```

سایر متغیرها را نیز در Settings > Variables and Secrets وارد کنید.

## 7. Deploy آزمایشی

```bash
npm run upload
```

نسخه Preview را باز کنید و تست کامل انجام دهید. پس از موفقیت:

```bash
npm run deploy
```

تا زمانی که دامنه داخل Cloudflare Active نشده باشد، routeهای custom domain فعال نمی‌شوند؛ Worker همچنان با workers.dev قابل تست است.

## 8. انتقال DNS دامنه ir به Cloudflare

1. دامنه `majidsavarivakil.ir` را در Cloudflare با Plan رایگان Add کنید.
2. قبل از تغییر nameserver، همه رکوردهای فعلی به‌خصوص MX، SPF، DKIM و DMARC را در Cloudflare کپی کنید.
3. Cloudflare دو nameserver نمایش می‌دهد.
4. در پنل ایرنیک یا نماینده ثبت دامنه، کارگزارهای دامنه را به همان دو nameserver تغییر دهید.
5. صبر کنید Cloudflare وضعیت دامنه را Active نشان دهد.
6. اگر DNSSEC در ارائه‌دهنده قبلی فعال است، قبل از تغییر nameserver آن را موقتاً خاموش و پس از فعال‌شدن Cloudflare دوباره تنظیم کنید.

## 9. اتصال دامنه به Worker

فایل `wrangler.jsonc` برای این دو hostname آماده است:

```text
majidsavarivakil.ir
www.majidsavarivakil.ir
```

دامنه `www` در کد با 308 به دامنه اصلی منتقل می‌شود. Cloudflare هنگام افزودن Custom Domain رکورد DNS و گواهی TLS را ایجاد می‌کند.

## 10. بعد از انتشار

- SSL/TLS روی Full (strict)
- Always Use HTTPS فعال
- sitemap در Google Search Console ثبت
- دامنه اصلی به‌عنوان Property ثبت
- URL Inspection برای صفحه اصلی و صفحات خدمات
- Web Analytics رایگان Cloudflare فعال
- اخطار مصرف Workers، Neon، Auth0 و ImageKit فعال
- یک حساب مدیر پشتیبان ساخته و اطلاعات بازیابی در محل امن نگهداری شود

## اطلاعاتی که نباید در چت یا GitHub قرار گیرند

- AUTH0_CLIENT_SECRET
- AUTH0_SECRET
- AUTH0_M2M_CLIENT_SECRET
- DATABASE_URL
- IMAGEKIT_PRIVATE_KEY
- رمز مدیر یا موکل
