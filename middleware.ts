import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth0 } from './lib/auth0';
import { roleFromAuth0Identity } from './lib/auth-role';

/**
 * Auth0 v4 mounts /auth/* through middleware. /account is also resolved here
 * so the browser reaches the correct dashboard before any public-page loading
 * UI can render.
 */
export async function middleware(request: NextRequest) {
  try {
    if (request.nextUrl.pathname === '/account') {
      const session = await auth0.getSession(request);

      if (!session?.user) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('returnTo', '/account');
        return NextResponse.redirect(loginUrl);
      }

      const role = roleFromAuth0Identity(session.user);
      const dashboardUrl = new URL(role === 'admin' ? '/admin' : '/portal', request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    return await auth0.middleware(request);
  } catch (error) {
    console.error('[auth0-middleware]', {
      pathname: request.nextUrl.pathname,
      message: error instanceof Error ? error.message : String(error),
    });

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('authError', '1');
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/auth/:path*', '/account'],
};
