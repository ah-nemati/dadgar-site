import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
  sessionCookieName,
  verifySessionToken,
} from './lib/auth/session-token';

const ADMIN_ONLY_PREFIXES = ['/admin/clients', '/admin/blog'];

function dashboardFor(role: 'ADMIN' | 'LAWYER' | 'CLIENT'): string {
  return role === 'CLIENT' ? '/portal' : '/admin';
}

function loginRedirect(request: NextRequest, clearCookie = false): NextResponse {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set(
    'returnTo',
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );
  const response = NextResponse.redirect(loginUrl);
  if (clearCookie) response.cookies.delete(sessionCookieName());
  return response;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const cookie = request.cookies.get(sessionCookieName())?.value;
  const session = await verifySessionToken(cookie);
  const hasInvalidCookie = Boolean(cookie && !session);

  if (!session) return loginRedirect(request, hasInvalidCookie);

  if (pathname === '/account') {
    return NextResponse.redirect(
      new URL(dashboardFor(session.role), request.url),
    );
  }

  if (pathname.startsWith('/portal')) {
    return session.role === 'CLIENT'
      ? NextResponse.next()
      : NextResponse.redirect(new URL('/admin', request.url));
  }

  if (pathname.startsWith('/admin')) {
    if (session.role === 'CLIENT') {
      return NextResponse.redirect(new URL('/portal', request.url));
    }

    if (
      session.role !== 'ADMIN' &&
      ADMIN_ONLY_PREFIXES.some((prefix) => pathname.startsWith(prefix))
    ) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

// OpenNext 1.20 supports Edge Middleware but not Next 16's Node.js Proxy.
export const runtime = 'experimental-edge';

export const config = {
  matcher: [
    '/account',
    '/admin/:path*',
    '/portal/:path*',
  ],
};
