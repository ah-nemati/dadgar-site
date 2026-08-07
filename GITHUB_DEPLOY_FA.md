# انتشار پروژه از GitHub Actions

این روش برای زمانی است که اتصال محلی به `registry.npmjs.org` قطع می‌شود یا Wrangler از Cloudflare پاسخ `403 bot challenge` می‌گیرد.

## ۱. پروژه را در GitHub قرار بده

```bash
git init
git add .
git commit -m "Prepare production deployment"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

## ۲. Secretهای GitHub را ثبت کن

در Repository برو به:

```text
Settings → Secrets and variables → Actions → New repository secret
```

این Secretها را بساز:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
AUTH0_DOMAIN
AUTH0_CLIENT_ID
AUTH0_CLIENT_SECRET
AUTH0_SECRET
AUTH0_ADMIN_EMAILS
AUTH0_M2M_CLIENT_ID
AUTH0_M2M_CLIENT_SECRET
DATABASE_URL
IMAGEKIT_PUBLIC_KEY
IMAGEKIT_PRIVATE_KEY
IMAGEKIT_URL_ENDPOINT
```

توکن Cloudflare باید حداقل مجوز ویرایش Workers و دسترسی به Zone دامنه `majidsavarivakil.ir` را داشته باشد.

## ۳. Secretهای Runtime در Worker

متغیرهای حساس باید در Cloudflare Worker نیز ثبت شوند. در Cloudflare Dashboard برو به:

```text
Workers & Pages → majid-savari-vakil → Settings → Variables and Secrets
```

این موارد را Secret قرار بده:

```text
AUTH0_CLIENT_SECRET
AUTH0_SECRET
AUTH0_M2M_CLIENT_SECRET
DATABASE_URL
IMAGEKIT_PRIVATE_KEY
```

و این موارد را Variable یا Secret قرار بده:

```text
NEXT_PUBLIC_SITE_URL=https://majidsavarivakil.ir
APP_BASE_URL=https://majidsavarivakil.ir
AUTH0_DOMAIN=...
AUTH0_CLIENT_ID=...
AUTH0_ROLE_CLAIM_NAMESPACE=https://majidsavarivakil.ir
AUTH0_ADMIN_EMAILS=...
AUTH0_M2M_CLIENT_ID=...
AUTH0_DB_CONNECTION=Username-Password-Authentication
DATABASE_SSL=true
IMAGEKIT_PUBLIC_KEY=...
IMAGEKIT_URL_ENDPOINT=...
IMAGEKIT_PUBLIC_FOLDER=/blog-images
IMAGEKIT_PRIVATE_FOLDER=/client-documents
```

## ۴. اجرای Workflow

```text
GitHub Repository → Actions → Deploy to Cloudflare Workers → Run workflow
```

Push به شاخه `main` نیز Workflow را اجرا می‌کند.

## ۵. رفع خطای SWC در سیستم محلی

```bash
rm -rf node_modules .next .open-next package-lock.json
npm cache verify
npm install --include=optional --no-audit --no-fund
npm run build
```

فایل `.npmrc` نصب optional dependencyهای SWC و retry شبکه را تنظیم کرده است. اسکریپت Build نیز با `NEXT_IGNORE_INCORRECT_LOCKFILE=1` از تلاش Next.js برای دست‌کاری lockfile هنگام Build جلوگیری می‌کند.

## ۶. نکته شبکه

اگر API Cloudflare از IP محلی صفحه bot challenge برگرداند، تغییر کد پروژه آن را رفع نمی‌کند. انتشار از GitHub-hosted runner درخواست را از شبکه GitHub انجام می‌دهد و به OAuth مرورگر نیاز ندارد.
