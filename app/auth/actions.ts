'use server';

import { requestAuth0PasswordReset } from '@/lib/auth0-management';

export interface PasswordResetState {
  error?: string;
  info?: string;
  email?: string;
}

export async function requestPasswordReset(
  _previous: PasswordResetState | undefined,
  formData: FormData
): Promise<PasswordResetState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  if (!email || !email.includes('@')) return { error: 'ایمیل معتبر وارد کنید.', email };
  try {
    await requestAuth0PasswordReset(email);
  } catch {
    return { error: 'ارسال لینک بازیابی انجام نشد. تنظیمات Auth0 را بررسی کنید.', email };
  }
  return { info: 'اگر حسابی با این ایمیل وجود داشته باشد، لینک بازیابی ارسال می‌شود.', email };
}

