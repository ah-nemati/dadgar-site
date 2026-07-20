'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE_NAME, createSessionToken, verifyAdminPassword } from '@/lib/auth';

export async function login(_prevState: { error?: string } | undefined, formData: FormData) {
  const password = String(formData.get('password') ?? '');

  if (!verifyAdminPassword(password)) {
    return { error: 'رمز عبور اشتباه است.' };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect('/admin/messages');
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect('/admin/login');
}
