import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { dashboardPath } from '@/lib/session';
import { authErrorDetails, logAuthError } from '@/lib/auth/errors';
import { getOrCreateAuthProfile } from '@/lib/auth/profile';
import { safeInternalPath } from '@/lib/auth/url';

function loginErrorRedirect(request: NextRequest, code: string) {
  const url = request.nextUrl.clone();
  url.pathname = '/login';
  url.search = '';
  url.searchParams.set('status', 'auth-link-error');
  url.searchParams.set('code', code);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const requestedNext = safeInternalPath(
    request.nextUrl.searchParams.get('next'),
    '/portal'
  );

  if (!code) return loginErrorRedirect(request, 'missing_code');

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    logAuthError('confirm-email', error);
    return loginErrorRedirect(request, authErrorDetails(error, 'confirm-email').code);
  }

  if (requestedNext === '/reset-password') {
    const url = request.nextUrl.clone();
    url.pathname = '/reset-password';
    url.search = '';
    return NextResponse.redirect(url);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return loginErrorRedirect(request, 'session_not_found');

  const profile = await getOrCreateAuthProfile(supabase, user);
  if (!profile) return loginErrorRedirect(request, 'profile_missing');

  const url = request.nextUrl.clone();
  url.pathname = dashboardPath(profile.role);
  url.search = '';
  return NextResponse.redirect(url);
}
