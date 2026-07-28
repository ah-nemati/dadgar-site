'use server';

import { revalidatePath } from 'next/cache';
import { updateOwnProfile } from '@/lib/profile';

export interface ProfileFormState {
  error?: string;
  success?: boolean;
}

export async function updateProfileAction(
  _prevState: ProfileFormState | undefined,
  formData: FormData
): Promise<ProfileFormState> {
  const fullName = String(formData.get('fullName') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();

  if (!fullName || !phone) {
    return { error: 'لطفاً نام و شماره تماس را کامل کنید.' };
  }

  try {
    await updateOwnProfile({ fullName, phone });
  } catch {
    return { error: 'ذخیره اطلاعات با خطا مواجه شد.' };
  }

  revalidatePath('/portal');
  return { success: true };
}
