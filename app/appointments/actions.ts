
'use server';

import { revalidatePath } from 'next/cache';
import {
  createAppointment,
  deleteAppointment,
  updateAppointment,
} from '@/lib/appointments';
import { requireAdmin, requireClient } from '@/lib/session';
import type { AppointmentStatus } from '@/types/content';

export interface AppointmentFormState {
  error?: string;
  success?: boolean;
}

function parseRequestedAt(value: string): string | null {
  if (!value) return null;
  const date = new Date(`${value}:00+03:30`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export async function createAppointmentAction(
  _prevState: AppointmentFormState | undefined,
  formData: FormData
): Promise<AppointmentFormState> {
  const account = await requireClient();
  const subject = String(formData.get('subject') ?? '').trim();
  const requestedAt = parseRequestedAt(String(formData.get('requestedAt') ?? ''));

  if (!subject || !requestedAt) return { error: 'موضوع و تاریخ پیشنهادی را وارد کنید.' };
  if (new Date(requestedAt).getTime() < Date.now() + 60 * 60 * 1000) {
    return { error: 'زمان پیشنهادی باید حداقل یک ساعت بعد باشد.' };
  }

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
