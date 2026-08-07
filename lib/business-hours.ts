export const BUSINESS_TIME_ZONE = 'Asia/Tehran';
export const BUSINESS_OPEN_HOUR = 17;
export const BUSINESS_CLOSE_HOUR = 22;
export const BUSINESS_SLOT_MINUTES = 30;
export const BUSINESS_HOURS_LABEL = 'شنبه تا چهارشنبه، ساعت ۱۷ تا ۲۲';

const WORKING_DAYS = new Set([6, 0, 1, 2, 3]); // Saturday through Wednesday
const LOCAL_DATE_TIME_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

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

export function validateAppointmentDateTime(
  value: string,
  now = Date.now()
): AppointmentValidationResult {
  const parts = localParts(value);
  if (!parts) return { ok: false, error: 'تاریخ و ساعت انتخاب‌شده معتبر نیست.' };

  if (!WORKING_DAYS.has(parts.weekDay)) {
    return { ok: false, error: 'رزرو نوبت فقط از شنبه تا چهارشنبه امکان‌پذیر است.' };
  }

  const minutes = parts.hour * 60 + parts.minute;
  const openMinutes = BUSINESS_OPEN_HOUR * 60;
  const closeMinutes = BUSINESS_CLOSE_HOUR * 60;

  if (minutes < openMinutes || minutes >= closeMinutes) {
    return { ok: false, error: 'ساعت نوبت باید بین ۱۷ تا ۲۲ باشد.' };
  }

  if (parts.minute % BUSINESS_SLOT_MINUTES !== 0) {
    return { ok: false, error: 'زمان نوبت را روی بازه‌های نیم‌ساعته انتخاب کنید.' };
  }

  // Iran currently uses UTC+03:30 year-round. datetime-local has no timezone,
  // so the offset is attached explicitly before saving an ISO timestamp.
  const padded = value.length === 16 ? `${value}:00` : value;
  const date = new Date(`${padded}+03:30`);
  if (Number.isNaN(date.getTime())) {
    return { ok: false, error: 'تاریخ و ساعت انتخاب‌شده معتبر نیست.' };
  }

  if (date.getTime() < now + 60 * 60 * 1000) {
    return { ok: false, error: 'زمان پیشنهادی باید حداقل یک ساعت بعد باشد.' };
  }

  return { ok: true, iso: date.toISOString() };
}
