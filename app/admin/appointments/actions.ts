'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/session';
import { setContentOverride } from '@/lib/content/overrides';
import type { AppointmentSettings } from '@/lib/appointment-settings-shared';

const ALLOWED_SLOT_MINUTES = new Set([15, 30, 60]);

function numberValue(formData: FormData, key: string): number {
  return Number(String(formData.get(key) ?? ''));
}

export async function saveAppointmentSettingsAction(formData: FormData) {
  const admin = await requireAdmin();
  const workingDays = formData.getAll('workingDays').map(Number).filter((value) => Number.isInteger(value) && value >= 0 && value <= 6);
  const openHour = numberValue(formData, 'openHour');
  const closeHour = numberValue(formData, 'closeHour');
  const slotMinutes = numberValue(formData, 'slotMinutes');
  const minLeadHours = numberValue(formData, 'minLeadHours');

  if (
    workingDays.length === 0 ||
    !Number.isInteger(openHour) || openHour < 0 || openHour > 23 ||
    !Number.isInteger(closeHour) || closeHour < 1 || closeHour > 24 || closeHour <= openHour ||
    !ALLOWED_SLOT_MINUTES.has(slotMinutes) ||
    !Number.isFinite(minLeadHours) || minLeadHours < 0 || minLeadHours > 168
  ) {
    redirect('/admin/appointments?settingsError=1');
  }

  const settings: AppointmentSettings = {
    enabled: formData.get('enabled') === 'on',
    workingDays: Array.from(new Set(workingDays)),
    openHour,
    closeHour,
    slotMinutes,
    minLeadHours,
  };

  await setContentOverride('appointment_settings', settings, admin.id);
  revalidatePath('/admin/appointments');
  revalidatePath('/portal/appointments');
  redirect('/admin/appointments?settingsSaved=1');
}
