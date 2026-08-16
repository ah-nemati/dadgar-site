
'use server';

import { revalidatePath } from 'next/cache';
import {
  cancelOwnAppointment,
  createAppointment,
  deleteAppointment,
  updateAppointment,
} from '@/lib/appointments';
import { requireClient, requireStaff } from '@/lib/session';
import type { AppointmentStatus } from '@/types/content';
import { validateAppointmentDateTime } from '@/lib/business-hours';
import { recordAudit } from '@/lib/audit';
import { getAppointmentSettings } from '@/lib/content/appointment-settings';

export interface AppointmentFormState {
  error?: string;
  success?: boolean;
}

export async function createAppointmentAction(
  _prevState: AppointmentFormState | undefined,
  formData: FormData
): Promise<AppointmentFormState> {
  const account = await requireClient();
  const subject = String(formData.get('subject') ?? '').trim().slice(0, 180);
  const requestedAtInput = String(formData.get('requestedAt') ?? '');

  if (!subject || !requestedAtInput) {
    return { error: 'موضوع و تاریخ پیشنهادی را وارد کنید.' };
  }

  const settings = await getAppointmentSettings();
  const validation = validateAppointmentDateTime(requestedAtInput, Date.now(), settings);
  if (!validation.ok || !validation.iso) {
    return { error: validation.error ?? 'زمان پیشنهادی معتبر نیست.' };
  }
  const requestedAt = validation.iso;

  try {
    await createAppointment(account.id, subject, requestedAt);
    await recordAudit(account.id, 'appointment.request', 'appointment', null, { subject, requestedAt });
  } catch (error) {
    if (error instanceof Error && error.message === 'TOO_MANY_OPEN_APPOINTMENTS') {
      return { error: 'حداکثر پنج نوبت باز می‌توانید داشته باشید. ابتدا وضعیت نوبت‌های قبلی مشخص شود.' };
    }
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
  const account = await requireStaff();
  const status = String(formData.get('status') ?? 'pending') as AppointmentStatus;
  if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
    return { error: 'وضعیت نوبت معتبر نیست.' };
  }
  const notes = String(formData.get('notes') ?? '').trim().slice(0, 1000) || null;
  const requestedAtInput = String(formData.get('requestedAt') ?? '');
  const settings = await getAppointmentSettings();
  const isHistoricalStatus = ['completed', 'cancelled'].includes(status);
  const validationSettings = isHistoricalStatus
    ? { enabled: true, workingDays: [0, 1, 2, 3, 4, 5, 6], openHour: 0, closeHour: 24, slotMinutes: 1, minLeadHours: 0 }
    : { ...settings, enabled: true };
  const validation = validateAppointmentDateTime(
    requestedAtInput,
    isHistoricalStatus ? 0 : Date.now(),
    validationSettings,
  );
  if (!validation.ok || !validation.iso) {
    return { error: validation.error ?? 'زمان نوبت معتبر نیست.' };
  }

  try {
    await updateAppointment(id, status, notes, validation.iso);
    await recordAudit(account.id, 'appointment.update', 'appointment', id, { status });
  } catch (error) {
    if (error instanceof Error && error.message === 'APPOINTMENT_TIME_CONFLICT') {
      return { error: 'در این ساعت یک نوبت تأییدشده دیگر وجود دارد.' };
    }
    return { error: 'بروزرسانی نوبت انجام نشد.' };
  }

  revalidatePath('/admin');
  revalidatePath('/admin/appointments');
  revalidatePath('/portal');
  revalidatePath('/portal/appointments');
  return { success: true };
}

export async function removeAppointmentAction(id: number) {
  const account = await requireStaff();
  await deleteAppointment(id);
  await recordAudit(account.id, 'appointment.delete', 'appointment', id);
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
