const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

function asciiDigits(value: string): string {
  return Array.from(value, (character) => {
    const persianIndex = PERSIAN_DIGITS.indexOf(character);
    if (persianIndex >= 0) return String(persianIndex);
    const arabicIndex = ARABIC_DIGITS.indexOf(character);
    return arabicIndex >= 0 ? String(arabicIndex) : character;
  }).join('');
}

export function normalizeEmail(value: FormDataEntryValue | string | null): string {
  return String(value ?? '').trim().toLowerCase();
}

export function isValidEmail(value: string): boolean {
  return value.length <= 254 && EMAIL_PATTERN.test(value);
}

export function normalizeIranianPhone(
  value: FormDataEntryValue | string | null,
): string {
  let phone = asciiDigits(String(value ?? ''))
    .replace(/[\s()-]/g, '')
    .replace(/^0098/, '+98');

  if (phone.startsWith('+98')) phone = `0${phone.slice(3)}`;
  if (phone.startsWith('98') && phone.length === 12) phone = `0${phone.slice(2)}`;

  return phone;
}

export function isValidIranianPhone(value: string): boolean {
  return /^09\d{9}$/.test(value);
}

export function validateName(value: string): string | null {
  if (value.length < 2 || value.length > 100) {
    return 'نام باید بین ۲ تا ۱۰۰ کاراکتر باشد.';
  }
  return null;
}

export function validatePassword(value: string): string | null {
  if (value.length < 12) return 'رمز عبور باید حداقل ۱۲ کاراکتر باشد.';
  if (value.length > 128) return 'رمز عبور نباید بیشتر از ۱۲۸ کاراکتر باشد.';
  return null;
}

export function safeReturnTo(
  value: FormDataEntryValue | string | null | undefined,
): string {
  const path = String(value ?? '');
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) {
    return '/account';
  }

  try {
    const url = new URL(path, 'https://local.invalid');
    const destination = `${url.pathname}${url.search}${url.hash}`;
    return ['/account', '/admin', '/portal'].some(
      (prefix) =>
        url.pathname === prefix || url.pathname.startsWith(`${prefix}/`),
    )
      ? destination
      : '/account';
  } catch {
    return '/account';
  }
}
