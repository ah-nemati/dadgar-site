
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/portal/:path*',
    '/login',
    '/signup',
    '/forgot-password',
    '/client-login',
    '/client-login/signup',
  ],
};
