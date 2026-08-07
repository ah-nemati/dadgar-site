# اصلاح Error 1102 روی Cloudflare Workers Free

این بسته فقط فایل‌های لازم برای سرو صفحات public از Static Assets را شامل می‌شود.

تغییرات:
- فعال‌سازی staticAssetsIncrementalCache
- فعال‌سازی enableCacheInterception
- صریح کردن run_worker_first=false
- Static کردن لیست وبلاگ، جزئیات مقاله‌ها و sitemap در زمان Build
- cache header برای _next/static

نکته: مسیرهای /admin، /portal و /auth/* همچنان Dynamic هستند و از Worker عبور می‌کنند.
