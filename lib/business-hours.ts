import {
  DEFAULT_APPOINTMENT_SETTINGS,
  appointmentSettingsLabel,
  normalizeJalaliDateKey,
  type AppointmentSettings,
} from '@/lib/appointment-settings-shared';

export const BUSINESS_OPEN_HOUR = DEFAULT_APPOINTMENT_SETTINGS.openHour;
export const BUSINESS_CLOSE_HOUR = DEFAULT_APPOINTMENT_SETTINGS.closeHour;
export const BUSINESS_SLOT_MINUTES = DEFAULT_APPOINTMENT_SETTINGS.slotMinutes;
export const BUSINESS_HOURS_LABEL = appointmentSettingsLabel(DEFAULT_APPOINTMENT_SETTINGS);

const LOCAL_DATE_TIME_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;
const persianDateFormatter = new Intl.DateTimeFormat('en-US-u-ca-persian', {
  timeZone: 'Asia/Tehran',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export interface AppointmentValidationResult {
  ok: boolean;
  iso?: string;
  error?: string;
}

function localParts(value: string) {
  const match = LOCAL_DATE_TIME_RE.exec(value);
  if (!match) return null;

  const [, yearText, monthText, dayText, hourText, minuteText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);

  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day ||
    hour > 23 ||
    minute > 59
  ) {
    return null;
  }

  return { year, month, day, hour, minute, weekDay: date.getUTCDay() };
}

function jalaliDateKey(year: number, month: number, day: number): string | null {
  const localNoon = new Date(`${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T12:00:00+03:30`);
  if (Number.isNaN(localNoon.getTime())) return null;
  const values = Object.fromEntries(
    persianDateFormatter.formatToParts(localNoon).map((part) => [part.type, part.value]),
  );
  return normalizeJalaliDateKey(`${values.year}/${values.month}/${values.day}`);
}

export function validateAppointmentDateTime(
  value: string,
  now = Date.now(),
  settings: AppointmentSettings = DEFAULT_APPOINTMENT_SETTINGS,
): AppointmentValidationResult {
  if (!settings.enabled) {
    return { ok: false, error: 'رزرو آنلاین نوبت موقتاً غیرفعال است.' };
  }

  const parts = localParts(value);
  if (!parts) return { ok: false, error: 'تاریخ و ساعت انتخاب‌شده معتبر نیست.' };

  if (!settings.workingDays.includes(parts.weekDay)) {
    return { ok: false, error: 'روز انتخاب‌شده در برنامه کاری دفتر فعال نیست.' };
  }

  const jalaliKey = jalaliDateKey(parts.year, parts.month, parts.day);
  if (jalaliKey && settings.holidayDates.includes(jalaliKey)) {
    return { ok: false, error: 'روز انتخاب‌شده در تقویم دفتر به‌عنوان تعطیل ثبت شده است.' };
  }

  const minutes = parts.hour * 60 + parts.minute;
  const openMinutes = settings.openHour * 60;
  const closeMinutes = settings.closeHour * 60;

  if (minutes < openMinutes || minutes >= closeMinutes) {
    return { ok: false, error: `ساعت نوبت باید بین ${settings.openHour} تا ${settings.closeHour} باشد.` };
  }

  if (parts.minute % settings.slotMinutes !== 0) {
    return { ok: false, error: `زمان نوبت را روی بازه‌های ${settings.slotMinutes} دقیقه‌ای انتخاب کنید.` };
  }

  const padded = value.length === 16 ? `${value}:00` : value;
  const date = new Date(`${padded}+03:30`);
  if (Number.isNaN(date.getTime())) {
    return { ok: false, error: 'تاریخ و ساعت انتخاب‌شده معتبر نیست.' };
  }

  const minTime = now + settings.minLeadHours * 60 * 60 * 1000;
  if (date.getTime() < minTime) {
    return { ok: false, error: `زمان پیشنهادی باید حداقل ${settings.minLeadHours} ساعت بعد باشد.` };
  }

  const maxTime = now + settings.maxAdvanceDays * 24 * 60 * 60 * 1000;
  if (date.getTime() > maxTime) {
    return { ok: false, error: `رزرو فقط تا ${settings.maxAdvanceDays} روز آینده امکان‌پذیر است.` };
  }

  return { ok: true, iso: date.toISOString() };
}
