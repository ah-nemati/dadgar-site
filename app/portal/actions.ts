'use server';

import { revalidatePath } from 'next/cache';
import { updateOwnProfile } from '@/lib/profile';
import { requireClient } from '@/lib/session';
import { updateAuth0Password } from '@/lib/auth0-management';

export interface ProfileFormState { error?: string; success?: boolean }
export async function updateProfileAction(_prev: ProfileFormState | undefined, formData: FormData): Promise<ProfileFormState> {
  await requireClient();
  const fullName = String(formData.get('fullName') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  if (!fullName || !phone) return { error: 'لطفاً نام و شماره تماس را کامل کنید.' };
  try { await updateOwnProfile({ fullName, phone }); }
  catch { return { error: 'ذخیره اطلاعات با خطا مواجه شد.' }; }
  revalidatePath('/portal');
  revalidatePath('/portal/profile');
  return { success: true };
}

export interface PasswordFormState { error?: string; success?: boolean }
export async function changePasswordAction(_prev: PasswordFormState | undefined, formData: FormData): Promise<PasswordFormState> {
  const account = await requireClient();
  const newPassword = String(formData.get('newPassword') ?? '');
  const newPasswordConfirm = String(formData.get('newPasswordConfirm') ?? '');
  if (!newPassword || !newPasswordConfirm) return { error: 'رمز جدید و تکرار آن را کامل کنید.' };
  if (newPassword.length < 8) return { error: 'رمز عبور جدید باید حداقل ۸ کاراکتر باشد.' };
  if (newPassword !== newPasswordConfirm) return { error: 'تکرار رمز عبور جدید یکسان نیست.' };
  try { await updateAuth0Password(account.id, newPassword); }
  catch { return { error: 'تغییر رمز در Auth0 انجام نشد. تنظیمات Management API را بررسی کنید.' }; }
  return { success: true };
}
