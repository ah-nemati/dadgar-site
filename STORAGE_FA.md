# ذخیره‌سازی فایل‌ها

این پروژه برای تمام فایل‌های عمومی و خصوصی فقط از ImageKit استفاده می‌کند.

## متغیرهای لازم

```env
IMAGEKIT_PUBLIC_KEY="public_xxxxxxxxx"
IMAGEKIT_PRIVATE_KEY="private_xxxxxxxxx"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_imagekit_id"
IMAGEKIT_PUBLIC_FOLDER="/blog-images"
IMAGEKIT_PRIVATE_FOLDER="/client-documents"
```

- تصاویر وبلاگ در پوشه عمومی ذخیره می‌شوند.
- اسناد موکل با `isPrivateFile: true` آپلود می‌شوند.
- لینک دانلود اسناد پس از کنترل دسترسی و به‌صورت امضاشده و زمان‌دار ساخته می‌شود.
- شناسه `fileId` برای حذف فایل و مسیر `filePath` برای تولید URL در PostgreSQL ذخیره می‌شوند.

## بررسی پاکی کد

```bash
npm run audit:storage
```

این دستور کد منبع، تنظیمات محیطی و وابستگی‌های مستقیم پروژه را بررسی می‌کند و در صورت بازگشت هر کد قدیمی ذخیره‌سازی با خطا متوقف می‌شود.
