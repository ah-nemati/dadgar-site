import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Refreshes the Supabase session on every request that touches /admin or
 * /portal, and gates access: /admin requires role='admin' (checked via the
 * profiles table), /portal requires any signed-in user. Mirrors Supabase's
 * official Next.js proxy pattern: https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  // getUser() re-validates the token against the Supabase Auth server on every
  // call, so it's safe to use for access control (unlike getSession(), which
  // only reads the cookie and isn't guaranteed to be a valid/current token).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isPortalRoute = pathname.startsWith('/portal');

  if (isAdminRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  if (isPortalRoute && !user) {
    return NextResponse.redirect(new URL('/client-login', request.url));
  }

  if (user && pathname === '/admin/login') {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
    if (profile?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin/messages', request.url));
    }
  }

  return response;
}
