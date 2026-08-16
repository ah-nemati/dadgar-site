import { NextRequest, NextResponse } from 'next/server';
import { dashboardPath, getCurrentAccountForAuthEntry } from '@/lib/session';
import { safeReturnTo } from '@/lib/auth/validation';

export const dynamic = 'force-dynamic';

const RETURN_COOKIE = 'dadgar_return_to';

function destinationForRole(role: 'ADMIN' | 'LAWYER' | 'CLIENT', requested: string): string {
  const dashboard = dashboardPath(role);
  if (role === 'CLIENT' && (requested === '/portal' || requested.startsWith('/portal/'))) return requested;
  if (role !== 'CLIENT' && (requested === '/admin' || requested.startsWith('/admin/'))) return requested;
  return dashboard;
}

function cleanGuestHref(value: string | null): string {
  if (value === '/signup') return '/signup';
  return '/login';
}

export async function GET(request: NextRequest) {
  const requested = safeReturnTo(request.nextUrl.searchParams.get('returnTo'));
  const guestHref = cleanGuestHref(request.nextUrl.searchParams.get('guestHref'));
  const account = await getCurrentAccountForAuthEntry();
  const href = account ? destinationForRole(account.role, requested) : guestHref;

  const response = NextResponse.json(
    { href },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } },
  );

  if (!account) {
    if (requested !== '/account') {
      response.cookies.set(RETURN_COOKIE, requested, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 10 * 60,
      });
    } else {
      response.cookies.delete(RETURN_COOKIE);
    }
  }

  return response;
}
