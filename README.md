# سامانه دفتر وکالت دادگر

این پروژه با **Next.js 16، React 19، TypeScript، Tailwind CSS 4 و Supabase** ساخته شده و شامل وب‌سایت عمومی، پنل مدیریت و پنل اختصاصی موکل است.

## امکانات اصلی

### احراز هویت یکپارچه
- ورود مدیر و کاربر از یک صفحه: `/login`
- تشخیص خودکار نقش حساب از جدول `profiles`
- هدایت مدیر به `/admin` و کاربر عادی به `/portal`
- حذف دکمه ورود از هدر بعد از ورود و نمایش آیکن پروفایل
- حفظ مسیرهای قدیمی `/admin/login` و `/client-login` به‌صورت Redirect
- محافظت هم‌زمان مسیرها در `proxy.ts` و با RLS دیتابیس

### پنل مدیریت
- داشبورد آماری
- مدیریت درخواست‌های مشاوره
- مدیریت کامل وبلاگ، پیش‌نویس/انتشار، مطلب ویژه و تصویر شاخص
- فهرست و جستجوی موکلین
- ایجاد و مدیریت پرونده
- ثبت گزارش‌های زمانی پرونده
- بارگذاری و حذف امن اسناد موکل
- گفت‌وگوی امن با کاربران
- مدیریت و تأیید نوبت‌های مشاوره

### پنل کاربر
- داشبورد اختصاصی
- مشاهده پرونده‌ها و روند اقدامات
- دانلود زمان‌دار اسناد خصوصی
- ارسال پیام و پاسخ در گفت‌وگوها
- درخواست نوبت مشاوره و مشاهده وضعیت آن
- ویرایش اطلاعات پروفایل

### تجربه کاربری
- لودینگ اختصاصی برای جابه‌جایی بین صفحات
- وضعیت در حال ارسال برای فرم‌ها و عملیات مدیریتی
- غیرفعال شدن نشانگر توسعه Next.js
- منوی موبایل مستقل و دسترس‌پذیر
- صفحات خطای مناسب و طراحی واکنش‌گرا

## پیش‌نیازها

- Node.js `20.9` یا جدیدتر
- یک پروژه Supabase
- npm

## راه‌اندازی

```bash
npm install
cp .env.example .env.local
```

مقادیر پروژه Supabase را در `.env.local` قرار دهید:

```env
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_ANON_OR_PUBLISHABLE_KEY"
```

سپس در **Supabase Dashboard → SQL Editor** فایل زیر را کامل اجرا کنید:

```text
supabase/schema.sql
```

این فایل موارد زیر را ایجاد یا تکمیل می‌کند:

- جدول پروفایل‌ها و نقش‌های `admin` و `client`
- درخواست‌های مشاوره
- نوشته‌های وبلاگ و فیلدهای تصویر
- پرونده‌ها، گزارش‌ها و اسناد
- گفت‌وگوها و پیام‌ها
- نوبت‌های مشاوره
- Trigger ساخت خودکار پروفایل
- توابع امن گفت‌وگو
- تمام RLS Policyها
- Storage Bucketهای `blog-images` و `client-documents`

برای افزودن نوشته‌های نمونه، فایل زیر اختیاری است:

```text
supabase/seed.sql
```

## ساخت حساب مدیر

1. از `/signup` یک حساب بسازید یا در Supabase Authentication کاربر را ایجاد کنید.
2. در SQL Editor، ایمیل مدیر را در دستور زیر قرار دهید:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id
  from auth.users
  where email = 'admin@example.com'
);
```

3. از `/login` وارد شوید. سامانه نقش را تشخیص می‌دهد و حساب را به پنل مدیریت می‌فرستد.

تمام ثبت‌نام‌های عمومی با نقش `client` ساخته می‌شوند و کاربر از سمت فرم ثبت‌نام نمی‌تواند نقش خود را مدیر کند.

## اجرای پروژه

```bash
npm run dev
```

سایت در آدرس زیر اجرا می‌شود:

```text
http://localhost:3000
```

بررسی نسخه Production:

```bash
npm run build
npm run start
```

بررسی کدنویسی:

```bash
npm run lint
```

## مسیرهای مهم

| مسیر | کاربرد |
|---|---|
| `/login` | ورود مشترک مدیر و کاربر |
| `/signup` | ثبت‌نام کاربر |
| `/admin` | داشبورد مدیریت |
| `/admin/blog` | مدیریت وبلاگ و تصاویر |
| `/admin/clients` | موکلین |
| `/admin/cases` | پرونده‌ها و اسناد |
| `/admin/messages` | درخواست‌های فرم تماس |
| `/admin/support` | گفت‌وگوهای کاربران |
| `/admin/appointments` | نوبت‌ها |
| `/portal` | داشبورد کاربر |
| `/portal/cases` | پرونده‌های کاربر |
| `/portal/messages` | پیام‌های کاربر |
| `/portal/appointments` | نوبت‌های کاربر |
| `/portal/profile` | پروفایل کاربر |

## ذخیره‌سازی فایل

### تصاویر وبلاگ
- Bucket: `blog-images`
- عمومی
- حداکثر حجم: ۵ مگابایت
- فرمت‌های مجاز: JPG، PNG، WEBP و GIF
- فقط مدیر اجازه بارگذاری، تغییر و حذف دارد

### اسناد موکل
- Bucket: `client-documents`
- خصوصی
- حداکثر حجم: ۱۰ مگابایت
- مسیر هر فایل با شناسه کاربر آغاز می‌شود
- لینک دانلود به‌صورت Signed URL یک‌ساعته ساخته می‌شود
- هر کاربر فقط اسناد متعلق به خودش را می‌بیند

## نکات امنیتی

- کلید `NEXT_PUBLIC_SUPABASE_ANON_KEY` محرمانه نیست؛ امنیت داده با RLS اعمال می‌شود.
- هیچ Service Role Key در پروژه سمت کاربر قرار ندهید.
- عملیات حساس Server Actionها دوباره نقش کاربر را بررسی می‌کنند.
- مسیرهای پنل علاوه بر `proxy.ts` توسط Policyهای دیتابیس نیز محافظت می‌شوند.
- برای Production، تأیید ایمیل و سیاست رمز عبور مناسب را در Supabase فعال کنید.
- پیش از استقرار، دامنه واقعی را در تنظیمات Authentication و داده‌های دفتر ثبت کنید.

## ساختار مهم پروژه

```text
app/
  auth/actions.ts             ورود، ثبت‌نام و خروج مشترک
  login/                      صفحه ورود مشترک
  admin/                      پنل مدیریت
  portal/                     پنل کاربر
  loading.tsx                 لودینگ Route Segment
components/
  NavigationLoader.tsx        لودینگ اختصاصی جابه‌جایی
  dashboard/DashboardShell.tsx
lib/
  session.ts                  تشخیص حساب و نقش
  cases.ts                    پرونده‌ها و اسناد
  support.ts                  گفت‌وگوها
  appointments.ts             نوبت‌ها
  content/blog-admin.ts       CMS و Storage تصاویر وبلاگ
supabase/
  schema.sql                  Schema، RLS، RPC و Storage
```

## استقرار

پروژه روی Vercel یا هر سرویس Node.js سازگار با Next.js قابل استقرار است. متغیرهای محیطی Supabase را در تنظیمات سرویس استقرار نیز تعریف کنید و آدرس Production را در Supabase Authentication → URL Configuration ثبت کنید.
