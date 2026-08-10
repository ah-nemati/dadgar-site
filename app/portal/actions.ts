'use server';

import { revalidatePath } from 'next/cache';
import { updateOwnProfile } from '@/lib/profile';
import { requireClient } from '@/lib/session';
import {
  isValidIranianPhone,
  normalizeIranianPhone,
  validateName,
} from '@/lib/auth/validation';

export interface ProfileFormState { error?: string; success?: boolean }
export async function updateProfileAction(_prev: ProfileFormState | undefined, formData: FormData): Promise<ProfileFormState> {
  await requireClient();
  const fullName = String(formData.get('fullName') ?? '').trim();
  const phone = normalizeIranianPhone(formData.get('phone'));
  const nameError = validateName(fullName);
  if (nameError) return { error: nameError };
  if (!isValidIranianPhone(phone)) return { error: 'شماره موبایل ایران معتبر نیست.' };
  try { await updateOwnProfile({ fullName, phone }); }
  catch { return { error: 'ذخیره اطلاعات با خطا مواجه شد.' }; }
  revalidatePath('/portal');
  revalidatePath('/portal/profile');
  return { success: true };
}
