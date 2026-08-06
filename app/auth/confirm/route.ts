import type { EmailOtpType } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { dashboardPath } from '@/lib/session';
import { authErrorDetails, logAuthError } from '@/lib/auth/errors';
import { getOrCreateAuthProfile } from '@/lib/auth/profile';
import { safeInternalPath } from '@/lib/auth/url';

const EMAIL_OTP_TYPES = new Set<string>([
  'email',
  'recovery',
  'invite',
  'email_change',
  'signup',
  'magiclink',
]);

function loginErrorRedirect(request: NextRequest, code: string) {
  const url = request.nextUrl.clone();
  url.pathname = '/login';
  url.search = '';
  url.searchParams.set('status', 'auth-link-error');
  url.searchParams.set('code', code);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get('token_hash');
  const rawType = request.nextUrl.searchParams.get('type');
  const requestedNext = safeInternalPath(
    request.nextUrl.searchParams.get('next'),
    rawType === 'recovery' ? '/reset-password' : '/portal'
  );

  if (!tokenHash || !rawType || !EMAIL_OTP_TYPES.has(rawType)) {
    return loginErrorRedirect(request, 'invalid_confirmation_link');
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: rawType as EmailOtpType,
  });

  if (error) {
    logAuthError('confirm-email', error);
    return loginErrorRedirect(request, authErrorDetails(error, 'confirm-email').code);
  }

  if (requestedNext === '/reset-password' || rawType === 'recovery') {
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
