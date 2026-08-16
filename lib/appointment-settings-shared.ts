export interface AppointmentSettings {
  enabled: boolean;
  workingDays: number[];
  openHour: number;
  closeHour: number;
  slotMinutes: number;
  minLeadHours: number;
  maxAdvanceDays: number;
  /** Jalali date keys in YYYY/MM/DD format, stored with ASCII digits. */
  holidayDates: string[];
}

export const DEFAULT_APPOINTMENT_SETTINGS: AppointmentSettings = {
  enabled: true,
  workingDays: [6, 0, 1, 2, 3],
  openHour: 17,
  closeHour: 22,
  slotMinutes: 30,
  minLeadHours: 1,
  maxAdvanceDays: 30,
  holidayDates: [],
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

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

export function asciiDigits(value: string): string {
  return Array.from(value, (character) => {
    const persianIndex = PERSIAN_DIGITS.indexOf(character);
    if (persianIndex >= 0) return String(persianIndex);
    const arabicIndex = ARABIC_DIGITS.indexOf(character);
    return arabicIndex >= 0 ? String(arabicIndex) : character;
  }).join('');
}

/** Normalize a Jalali date entered as 1405/05/25, ۱۴۰۵-۵-۲۵, etc. */
export function normalizeJalaliDateKey(value: string): string | null {
  const normalized = asciiDigits(value.trim())
    .replace(/[.\-\\]/g, '/')
    .replace(/\s+/g, '');
  const match = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/.exec(normalized);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1300 || year > 1600 || month < 1 || month > 12 || day < 1) return null;
  const maxDay = month <= 6 ? 31 : month <= 11 ? 30 : 30;
  if (day > maxDay) return null;

  return `${year.toString().padStart(4, '0')}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
}

export function appointmentSettingsLabel(settings: AppointmentSettings): string {
  const days = settings.workingDays.map((day) => DAY_NAMES[day]).filter(Boolean).join('، ');
  return `${days} — ساعت ${settings.openHour.toString().padStart(2, '0')}:00 تا ${settings.closeHour.toString().padStart(2, '0')}:00`;
}
