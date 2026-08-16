export interface AppointmentSettings {
  enabled: boolean;
  workingDays: number[];
  openHour: number;
  closeHour: number;
  slotMinutes: number;
  minLeadHours: number;
}

export const DEFAULT_APPOINTMENT_SETTINGS: AppointmentSettings = {
  enabled: true,
  workingDays: [6, 0, 1, 2, 3],
  openHour: 17,
  closeHour: 22,
  slotMinutes: 30,
  minLeadHours: 1,
};

const DAY_NAMES: Record<number, string> = {
  0: 'یکشنبه',
  1: 'دوشنبه',
  2: 'سه‌شنبه',
  3: 'چهارشنبه',
  4: 'پنجشنبه',
  5: 'جمعه',
  6: 'شنبه',
};

export function appointmentSettingsLabel(settings: AppointmentSettings): string {
  const days = settings.workingDays.map((day) => DAY_NAMES[day]).filter(Boolean).join('، ');
  return `${days} — ساعت ${settings.openHour.toString().padStart(2, '0')}:00 تا ${settings.closeHour.toString().padStart(2, '0')}:00`;
}
