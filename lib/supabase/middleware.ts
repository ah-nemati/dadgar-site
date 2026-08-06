
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { UserRole } from '@/types/content';

const LOGIN_PATHS = new Set(['/login', '/signup', '/forgot-password', '/client-login', '/client-login/signup', '/admin/login']);

function redirectWithReturn(request: NextRequest, path = '/login') {
  const url = new URL(path, request.url);
  const current = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  if (current !== '/login') url.searchParams.set('next', current);
  return NextResponse.redirect(url);
}

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/client-login' || pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (pathname === '/client-login/signup') {
    return NextResponse.redirect(new URL('/signup', request.url));
  }

  const isAdminRoute = pathname.startsWith('/admin');
  const isPortalRoute = pathname.startsWith('/portal');

  if (!isSupabaseConfigured()) {
    if (isAdminRoute || isPortalRoute) {
      const url = new URL('/login', request.url);
      url.searchParams.set('config', 'missing');
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }

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
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: UserRole | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    role = (profile?.role as UserRole | undefined) ?? null;
  }

  if (isAdminRoute) {
    if (!user || !role) return redirectWithReturn(request);
    if (role !== 'admin') return NextResponse.redirect(new URL('/portal', request.url));
  }

  if (isPortalRoute) {
    if (!user || !role) return redirectWithReturn(request);
    if (role === 'admin') return NextResponse.redirect(new URL('/admin', request.url));
  }

  if (user && role && LOGIN_PATHS.has(pathname)) {
    return NextResponse.redirect(new URL(role === 'admin' ? '/admin' : '/portal', request.url));
  }

  return response;
}
