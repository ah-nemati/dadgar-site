import { getContentOverride } from '@/lib/content/overrides';
import {
  DEFAULT_APPOINTMENT_SETTINGS,
  normalizeJalaliDateKey,
  type AppointmentSettings,
} from '@/lib/appointment-settings-shared';

export type { AppointmentSettings } from '@/lib/appointment-settings-shared';
export { DEFAULT_APPOINTMENT_SETTINGS, appointmentSettingsLabel } from '@/lib/appointment-settings-shared';

function normalizeAppointmentSettings(value: Partial<AppointmentSettings> | null | undefined): AppointmentSettings {
  const merged = { ...DEFAULT_APPOINTMENT_SETTINGS, ...(value ?? {}) };
  const workingDays = Array.isArray(merged.workingDays)
    ? Array.from(new Set(merged.workingDays.filter((day) => Number.isInteger(day) && day >= 0 && day <= 6)))
    : DEFAULT_APPOINTMENT_SETTINGS.workingDays;
  const holidayDates = Array.isArray(merged.holidayDates)
    ? Array.from(new Set(merged.holidayDates.map((date) => normalizeJalaliDateKey(String(date))).filter((date): date is string => Boolean(date))))
    : [];

  return {
    enabled: Boolean(merged.enabled),
    workingDays: workingDays.length ? workingDays : DEFAULT_APPOINTMENT_SETTINGS.workingDays,
    openHour: Number.isInteger(merged.openHour) && merged.openHour >= 0 && merged.openHour <= 23 ? merged.openHour : DEFAULT_APPOINTMENT_SETTINGS.openHour,
    closeHour: Number.isInteger(merged.closeHour) && merged.closeHour >= 1 && merged.closeHour <= 24 ? merged.closeHour : DEFAULT_APPOINTMENT_SETTINGS.closeHour,
    slotMinutes: [15, 30, 60].includes(merged.slotMinutes) ? merged.slotMinutes : DEFAULT_APPOINTMENT_SETTINGS.slotMinutes,
    minLeadHours: Number.isFinite(merged.minLeadHours) && merged.minLeadHours >= 0 ? merged.minLeadHours : DEFAULT_APPOINTMENT_SETTINGS.minLeadHours,
    maxAdvanceDays: Number.isInteger(merged.maxAdvanceDays) && merged.maxAdvanceDays >= 1 && merged.maxAdvanceDays <= 180 ? merged.maxAdvanceDays : DEFAULT_APPOINTMENT_SETTINGS.maxAdvanceDays,
    holidayDates,
  };
}

export async function getAppointmentSettings(): Promise<AppointmentSettings> {
  const override = await getContentOverride<Partial<AppointmentSettings>>('appointment_settings', DEFAULT_APPOINTMENT_SETTINGS);
  return normalizeAppointmentSettings(override);
}
