'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { dashboardPath } from '@/lib/session';
import { authErrorDetails, logAuthError } from '@/lib/auth/errors';
import { getAuthRedirectUrl } from '@/lib/auth/url';
import { getOrCreateAuthProfile } from '@/lib/auth/profile';

export interface AuthState {
  error?: string;
  info?: string;
  errorCode?: string;
  email?: string;
  canResendConfirmation?: boolean;
  canResetPassword?: boolean;
}

function configurationError(): AuthState | null {
  return isSupabaseConfigured()
    ? null
    : { error: 'اتصال Supabase تنظیم نشده است. ابتدا فایل .env.local را تکمیل کنید.' };
}

function authErrorState(
  operation: Parameters<typeof authErrorDetails>[1],
  error: Parameters<typeof authErrorDetails>[0],
  email?: string
): AuthState {
  logAuthError(operation, error, email);
  const details = authErrorDetails(error, operation);

  return {
    error: details.message,
    errorCode: details.code,
    email,
    canResendConfirmation: details.canResendConfirmation,
    canResetPassword: details.canResetPassword,
  };
}

function emailFrom(formData: FormData): string {
  return String(formData.get('email') ?? '').trim().toLowerCase();
}

export async function signIn(
  _prevState: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  const configError = configurationError();
  if (configError) return configError;

  const email = emailFrom(formData);
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'ایمیل و رمز عبور را وارد کنید.', email };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return authErrorState('sign-in', error, email);
  if (!data.user) {
    return { error: 'ورود انجام نشد. دوباره تلاش کنید.', email };
  }

  const profile = await getOrCreateAuthProfile(supabase, data.user);
  if (!profile) {
    await supabase.auth.signOut();
    return {
      error: 'پروفایل این حساب در دیتابیس ساخته نشده است. نسخه جدید supabase/schema.sql را اجرا کنید و دوباره وارد شوید.',
      errorCode: 'profile_missing',
      email,
    };
  }

  redirect(dashboardPath(profile.role));
}

export async function signUp(
  _prevState: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  const configError = configurationError();
  if (configError) return configError;

  const fullName = String(formData.get('fullName') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const email = emailFrom(formData);
  const password = String(formData.get('password') ?? '');
  const passwordConfirm = String(formData.get('passwordConfirm') ?? '');

  if (!fullName || !phone || !email || !password) {
    return { error: 'همه فیلدهای الزامی را کامل کنید.', email };
  }
  if (password.length < 8) {
    return { error: 'رمز عبور باید حداقل ۸ کاراکتر باشد.', email };
  }
  if (password !== passwordConfirm) {
    return { error: 'تکرار رمز عبور با رمز عبور یکسان نیست.', email };
  }

  const supabase = await createClient();
  const emailRedirectTo = await getAuthRedirectUrl('/portal');
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
      data: { full_name: fullName, phone },
    },
  });

  if (error) return authErrorState('sign-up', error, email);

  if (data.session && data.user) {
    const profile = await getOrCreateAuthProfile(supabase, data.user);
    if (!profile) {
      await supabase.auth.signOut();
      return {
        error: 'حساب ساخته شد، اما پروفایل دیتابیس ایجاد نشد. نسخه جدید supabase/schema.sql را اجرا کنید.',
        errorCode: 'profile_missing',
        email,
      };
    }
    redirect(dashboardPath(profile.role));
  }

  return {
    info: 'ثبت‌نام انجام شد. لینک تأیید حساب به ایمیل شما ارسال شده است؛ پوشه هرزنامه را هم بررسی کنید.',
    email,
  };
}

export async function resendConfirmation(
  _prevState: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  const configError = configurationError();
  if (configError) return configError;

  const email = emailFrom(formData);
  if (!email) return { error: 'ایمیل را وارد کنید.' };

  const supabase = await createClient();
  const emailRedirectTo = await getAuthRedirectUrl('/portal');
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo },
  });

  if (error) return authErrorState('resend-confirmation', error, email);

  return {
    info: 'ایمیل تأیید دوباره ارسال شد. صندوق ورودی و پوشه هرزنامه را بررسی کنید.',
    email,
  };
}

export async function requestPasswordReset(
  _prevState: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  const configError = configurationError();
  if (configError) return configError;

  const email = emailFrom(formData);
  if (!email) return { error: 'ایمیل را وارد کنید.' };

  const supabase = await createClient();
  const redirectTo = await getAuthRedirectUrl('/reset-password');
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

  if (error) return authErrorState('request-password-reset', error, email);

  return {
    info: 'اگر حسابی با این ایمیل وجود داشته باشد، لینک بازیابی رمز برای آن ارسال می‌شود.',
    email,
  };
}

export async function updatePassword(
  _prevState: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  const configError = configurationError();
  if (configError) return configError;

  const password = String(formData.get('password') ?? '');
  const passwordConfirm = String(formData.get('passwordConfirm') ?? '');

  if (password.length < 8) {
    return { error: 'رمز عبور باید حداقل ۸ کاراکتر باشد.' };
  }
  if (password !== passwordConfirm) {
    return { error: 'تکرار رمز عبور با رمز عبور جدید یکسان نیست.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: 'جلسه بازیابی رمز معتبر نیست یا منقضی شده است. دوباره درخواست بازیابی ثبت کنید.',
      errorCode: 'session_not_found',
    };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return authErrorState('update-password', error, user.email ?? undefined);

  await supabase.auth.signOut();
  redirect('/login?status=password-updated');
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect('/login');
}
