# نسخه پاک لایه فایل

در این نسخه:

- تنها پیاده‌سازی فایل در `lib/storage/imagekit.ts` قرار دارد.
- تصاویر عمومی وبلاگ در `/blog-images` ذخیره می‌شوند.
- اسناد موکل در `/client-documents` به‌صورت خصوصی ذخیره می‌شوند.
- حذف فایل فقط با `fileId` انجام می‌شود.
- دانلود سند فقط با URL امضاشده و زمان‌دار انجام می‌شود.
- Adapter استقرار Cloudflare جزو وابستگی‌های دائمی پروژه نیست و هنگام فرمان Deploy به‌صورت موقت اجرا می‌شود.

## نصب تمیز

```bash
rm -rf node_modules package-lock.json .next .open-next
npm install
npm run audit:storage
npm run typecheck
npm run build
```

## بررسی وابستگی‌های مستقیم

```bash
npm pkg get dependencies devDependencies
```

در بخش ذخیره‌سازی فقط `@imagekit/nodejs` باید وجود داشته باشد.
