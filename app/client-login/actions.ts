'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export interface ClientAuthState {
  error?: string;
  info?: string;
}

export async function clientSignUp(
  _prevState: ClientAuthState | undefined,
  formData: FormData
): Promise<ClientAuthState> {
  const fullName = String(formData.get('fullName') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!fullName || !phone || !email || password.length < 6) {
    return { error: 'لطفاً همه فیلدها را کامل کنید (رمز عبور حداقل ۶ کاراکتر).' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, phone } },
  });

  if (error) {
    return { error: 'ثبت‌نام ناموفق بود. ممکن است این ایمیل قبلاً ثبت شده باشد.' };
  }

  // If email confirmation is enabled (Supabase's default), there's no active
  // session yet — send them to check their inbox instead of the portal.
  if (data.session) {
    redirect('/portal');
  }
  return { info: 'ثبت‌نام انجام شد. لطفاً ایمیل خود را برای تایید حساب بررسی کنید.' };
}

export async function clientLogIn(
  _prevState: ClientAuthState | undefined,
  formData: FormData
): Promise<ClientAuthState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: 'ایمیل یا رمز عبور اشتباه است.' };
  }

  redirect('/portal');
}

export async function clientLogOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/client-login');
}
