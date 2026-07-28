import { toJalaali } from 'jalaali-js';

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const JALALI_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

function toPersianDigits(n: number): string {
  return String(n)
    .split('')
    .map((ch) => (/\d/.test(ch) ? PERSIAN_DIGITS[Number(ch)] : ch))
    .join('');
}

/** Formats an ISO date string as a Persian (Jalali) date, e.g. "۱۵ تیر ۱۴۰۵". */
export function formatJalaliDate(isoDate: string): string {
  const date = new Date(isoDate);
  const { jy, jm, jd } = toJalaali(date);
  return `${toPersianDigits(jd)} ${JALALI_MONTHS[jm - 1]} ${toPersianDigits(jy)}`;
}

/** Estimates reading time from plain text, e.g. "۴ دقیقه مطالعه" (~180 Persian words/min). */
export function estimateReadTime(content: string): string {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(wordCount / 180));
  return `${toPersianDigits(minutes)} دقیقه مطالعه`;
}
