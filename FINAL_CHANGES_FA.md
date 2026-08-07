# تغییرات نهایی نسخه Cloudflare + Auth0 + ImageKit

این نسخه بر پایه فایل ZIP ارسالی کاربر ساخته شده و تغییرات آخر Auth0/Cloudflare روی همان کد اعمال شده است.

## اصلاح اصلی Auth0

- `middleware.ts` و `proxy.ts` حذف شدند.
- مسیرهای Auth0 به `app/auth/[auth0]/route.ts` منتقل شدند.
- Route Handler فقط درخواست‌های `/auth/*` را پردازش می‌کند؛ Auth0 دیگر روی تمام صفحات اجرا نمی‌شود.
- Timeout درخواست‌های Auth0 روی ۸ ثانیه تنظیم شد.
- Rolling Session غیرفعال و عمر Session روی سه روز ثابت شد.
- Endpoint مرورگری Access Token غیرفعال شد؛ پروژه به آن نیاز ندارد.
- مسیرهای خصوصی همچنان داخل Layoutهای `/admin` و `/portal` با `requireAdmin` و `requireClient` محافظت می‌شوند.

## پایداری Cloudflare

- Redirect دامنه `www` از Middleware به `next.config.ts` منتقل شد.
- Security Headerهای استاندارد اضافه شدند.
- Route سلامت `GET /api/health` اضافه شد.
- `npm run audit:runtime` اضافه شد تا وجود Middleware/Proxy ناسازگار، نبود Route Handler یا فعال‌شدن Rolling Session را تشخیص دهد.
- Preview روی پورت `8787` ثابت شد و `.dev.vars.example` با آن هماهنگ شد.

## Auth0 Management API

- برای Token، ساخت کاربر، تغییر رمز و بازیابی رمز Timeout صریح اضافه شد.
- پاسخ Token قبل از Cacheشدن اعتبارسنجی می‌شود.
- Post Login Action فقط نقش‌های مجاز `admin` و `client` را در ID Token قرار می‌دهد.

## Storage

- فقط ImageKit استفاده می‌شود.
- هیچ پیاده‌سازی S3 یا R2 در کد برنامه وجود ندارد.
- اسناد خصوصی با `isPrivateFile: true` و Signed URL پانزده‌دقیقه‌ای ارائه می‌شوند.
- اشاره نمونه R2 از `open-next.config.ts` حذف شد.

## بررسی‌ها

- Audit ذخیره‌سازی: موفق
- Audit Runtime/Auth0: موفق
- بررسی نحوی ۱۳۷ فایل TypeScript/TSX: موفق
- بررسی importهای داخلی ۱۴۱ فایل: موفق
- بررسی لینک‌های استاتیک داخلی: بدون مسیر شکسته شناسایی‌شده

Build وابستگی‌محور کامل در محیط تولیدکننده فایل به‌دلیل در دسترس نبودن رجیستری عمومی npm اجرا نشده است. روی سیستم مقصد پس از `npm install` این فرمان اجرا شود:

```bash
npm run check
npm run preview
```
