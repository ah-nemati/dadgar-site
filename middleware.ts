import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host")?.split(":")[0]?.toLowerCase();

  // انتقال دائمی www به دامنه اصلی
  if (hostname === "www.majidsavarivakil.ir") {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.hostname = "majidsavarivakil.ir";
    redirectUrl.port = "";

    return NextResponse.redirect(redirectUrl, 308);
  }

  // مدیریت Login، Logout، Callback و Session توسط Auth0
  return auth0.middleware(request);
}

export const config = {
  matcher: [
    /*
     * همه مسیرها به‌جز:
     * - فایل‌های داخلی Next.js
     * - تصاویر و فایل‌های استاتیک
     * - sitemap و robots
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|map|woff|woff2|ttf)$).*)",
  ],
};
