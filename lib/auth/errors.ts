import type { AuthError } from '@supabase/supabase-js';

export type AuthOperation =
  | 'sign-in'
  | 'sign-up'
  | 'resend-confirmation'
  | 'request-password-reset'
  | 'update-password'
  | 'confirm-email';

export interface AuthErrorDetails {
  code: string;
  message: string;
  canResendConfirmation?: boolean;
  canResetPassword?: boolean;
}

function errorCode(error: AuthError): string {
  const code = typeof error.code === 'string' ? error.code.trim() : '';
  if (code) return code;

  const message = error.message.toLowerCase();
  if (message.includes('email not confirmed')) return 'email_not_confirmed';
  if (message.includes('invalid login credentials')) return 'invalid_credentials';
  if (message.includes('user already registered')) return 'user_already_exists';
  if (message.includes('password')) return 'weak_password';
  return 'auth_error';
}

export function authErrorDetails(
  error: AuthError,
  operation: AuthOperation
): AuthErrorDetails {
  const code = errorCode(error);

  switch (code) {
    case 'invalid_credentials':
      return {
        code,
        message: 'ایمیل یا رمز عبور صحیح نیست. در صورت فراموشی رمز، از بازیابی رمز عبور استفاده کنید.',
        canResetPassword: true,
      };
    case 'email_not_confirmed':
      return {
        code,
        message: 'ایمیل این حساب هنوز تأیید نشده است. صندوق ورودی و پوشه هرزنامه را بررسی کنید یا ایمیل تأیید را دوباره بفرستید.',
        canResendConfirmation: true,
      };
    case 'email_address_not_authorized':
      return {
        code,
        message: 'ارسال ایمیل ثبت‌نام برای این آدرس مجاز نیست؛ سرویس ایمیل پروژه هنوز برای ثبت‌نام عمومی تنظیم نشده است. مدیر سایت باید Custom SMTP را در Supabase فعال کند.',
      };
    case 'email_address_invalid':
      return {
        code,
        message: 'آدرس ایمیل معتبر نیست یا از دامنه‌های آزمایشی پشتیبانی‌نشده استفاده شده است.',
      };
    case 'email_provider_disabled':
      return {
        code,
        message: 'ورود و ثبت‌نام با ایمیل در تنظیمات Supabase غیرفعال است. Email Provider را فعال کنید.',
      };
    case 'signup_disabled':
      return {
        code,
        message: 'ثبت‌نام کاربران جدید در تنظیمات Supabase غیرفعال است.',
      };
    case 'email_exists':
    case 'user_already_exists':
      return {
        code,
        message: 'برای این ایمیل قبلاً حساب ساخته شده است. وارد شوید یا رمز عبور را بازیابی کنید.',
        canResetPassword: true,
      };
    case 'weak_password':
      return {
        code,
        message: 'رمز عبور با سیاست امنیتی پروژه مطابقت ندارد. از ترکیب حروف بزرگ و کوچک، عدد و نشانه و حداقل ۸ کاراکتر استفاده کنید.',
      };
    case 'over_email_send_rate_limit':
      return {
        code,
        message: 'تعداد ایمیل‌های ارسالی برای این آدرس بیش از حد مجاز شده است. کمی بعد دوباره تلاش کنید.',
      };
    case 'over_request_rate_limit':
      return {
        code,
        message: 'تعداد درخواست‌ها بیش از حد مجاز است. چند دقیقه بعد دوباره تلاش کنید.',
      };
    case 'captcha_failed':
      return {
        code,
        message: 'اعتبارسنجی امنیتی ناموفق بود. صفحه را تازه‌سازی و دوباره تلاش کنید.',
      };
    case 'user_banned':
      return {
        code,
        message: 'این حساب موقتاً غیرفعال شده است. با مدیر سایت تماس بگیرید.',
      };
    case 'same_password':
      return {
        code,
        message: 'رمز عبور جدید نباید با رمز قبلی یکسان باشد.',
      };
    case 'session_not_found':
    case 'session_expired':
      return {
        code,
        message: 'جلسه بازیابی رمز منقضی شده است. دوباره درخواست بازیابی رمز عبور ثبت کنید.',
      };
    case 'otp_expired':
    case 'flow_state_expired':
    case 'flow_state_not_found':
    case 'bad_code_verifier':
      return {
        code,
        message: 'لینک احراز هویت معتبر نیست یا منقضی شده است. یک لینک جدید درخواست کنید.',
      };
    case 'validation_failed':
      return {
        code,
        message: 'اطلاعات واردشده معتبر نیست. ایمیل و رمز عبور را بررسی کنید.',
      };
    case 'request_timeout':
      return {
        code,
        message: 'پاسخ سرویس احراز هویت طول کشید. دوباره تلاش کنید.',
      };
    case 'unexpected_failure':
      return {
        code,
        message: 'سرویس احراز هویت موقتاً با مشکل روبه‌رو است. کمی بعد دوباره تلاش کنید.',
      };
    default:
      return {
        code,
        message:
          operation === 'sign-in'
            ? 'ورود انجام نشد. اطلاعات حساب و تنظیمات احراز هویت را بررسی کنید.'
            : 'عملیات احراز هویت انجام نشد. تنظیمات Supabase را بررسی کنید.',
      };
  }
}

export function logAuthError(
  operation: AuthOperation,
  error: AuthError,
  email?: string
): void {
  const domain = email?.split('@')[1] ?? null;
  console.error('[auth]', {
    operation,
    code: errorCode(error),
    status: error.status,
    message: error.message,
    emailDomain: domain,
  });
}
