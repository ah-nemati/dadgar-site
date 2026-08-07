
'use server';

import { revalidatePath } from 'next/cache';
import {
  cancelOwnAppointment,
  createAppointment,
  deleteAppointment,
  updateAppointment,
} from '@/lib/appointments';
import { requireAdmin, requireClient } from '@/lib/session';
import type { AppointmentStatus } from '@/types/content';
import { validateAppointmentDateTime } from '@/lib/business-hours';

export interface AppointmentFormState {
  error?: string;
  success?: boolean;
}

export async function createAppointmentAction(
  _prevState: AppointmentFormState | undefined,
  formData: FormData
): Promise<AppointmentFormState> {
  const account = await requireClient();
  const subject = String(formData.get('subject') ?? '').trim();
  const requestedAtInput = String(formData.get('requestedAt') ?? '');

  if (!subject || !requestedAtInput) {
    return { error: 'موضوع و تاریخ پیشنهادی را وارد کنید.' };
  }

  const validation = validateAppointmentDateTime(requestedAtInput);
  if (!validation.ok || !validation.iso) {
    return { error: validation.error ?? 'زمان پیشنهادی معتبر نیست.' };
  }
  const requestedAt = validation.iso;

  try {
    await createAppointment(account.id, subject, requestedAt);
  } catch {
    return { error: 'ثبت درخواست نوبت انجام نشد.' };
  }

  revalidatePath('/portal');
  revalidatePath('/portal/appointments');
  revalidatePath('/admin');
  revalidatePath('/admin/appointments');
  return { success: true };
}

export async function updateAppointmentAction(
  id: number,
  _prevState: AppointmentFormState | undefined,
  formData: FormData
): Promise<AppointmentFormState> {
  await requireAdmin();
  const status = String(formData.get('status') ?? 'pending') as AppointmentStatus;
  const notes = String(formData.get('notes') ?? '').trim() || null;

  try {
    await updateAppointment(id, status, notes);
  } catch {
    return { error: 'بروزرسانی نوبت انجام نشد.' };
  }

  revalidatePath('/admin');
  revalidatePath('/admin/appointments');
  revalidatePath('/portal');
  revalidatePath('/portal/appointments');
  return { success: true };
}

export async function removeAppointmentAction(id: number) {
  await requireAdmin();
  await deleteAppointment(id);
  revalidatePath('/admin');
  revalidatePath('/admin/appointments');
  revalidatePath('/portal/appointments');
}

export async function cancelAppointmentAction(id: number) {
  await requireClient();
  try {
    await cancelOwnAppointment(id);
  } catch {
    return;
  }
  revalidatePath('/portal');
  revalidatePath('/portal/appointments');
  revalidatePath('/admin');
  revalidatePath('/admin/appointments');
}
