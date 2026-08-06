
'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { dashboardPath } from '@/lib/session';
import type { UserRole } from '@/types/content';

export interface AuthState {
  error?: string;
  info?: string;
}

function configurationError(): AuthState | null {
  return isSupabaseConfigured()
    ? null
    : { error: 'اتصال Supabase تنظیم نشده است. ابتدا فایل .env.local را تکمیل کنید.' };
}

export async function signIn(
  _prevState: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  const configError = configurationError();
  if (configError) return configError;

  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'ایمیل و رمز عبور را وارد کنید.' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { error: 'ایمیل یا رمز عبور اشتباه است.' };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .maybeSingle();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    return { error: 'پروفایل این حساب کامل نیست. با مدیر سایت تماس بگیرید.' };
  }

  redirect(dashboardPath(profile.role as UserRole));
}

export async function signUp(
  _prevState: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  const configError = configurationError();
  if (configError) return configError;

  const fullName = String(formData.get('fullName') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const passwordConfirm = String(formData.get('passwordConfirm') ?? '');

  if (!fullName || !phone || !email || !password) {
    return { error: 'همه فیلدهای الزامی را کامل کنید.' };
  }
  if (password.length < 8) {
    return { error: 'رمز عبور باید حداقل ۸ کاراکتر باشد.' };
  }
  if (password !== passwordConfirm) {
    return { error: 'تکرار رمز عبور با رمز عبور یکسان نیست.' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, phone } },
  });

  if (error) {
    return { error: 'ثبت‌نام انجام نشد. ممکن است این ایمیل قبلاً ثبت شده باشد.' };
  }

  if (data.session) redirect('/portal');

  return {
    info: 'ثبت‌نام انجام شد. لینک تأیید حساب به ایمیل شما ارسال شده است.',
  };
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect('/login');
}
