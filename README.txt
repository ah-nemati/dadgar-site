این بسته فقط اصلاح مرز Loading صفحه اصلی و پنل ادمین است.

پس از Extract در ریشه پروژه، این دو فایل قدیمی را حذف کنید:
  app/page.tsx
  app/loading.tsx

فایل‌های جایگزین داخل Route Group قرار می‌گیرند:
  app/(home)/page.tsx
  app/(home)/loading.tsx

Route Group در Next.js وارد URL نمی‌شود؛ بنابراین صفحه اصلی همچنان / است.
