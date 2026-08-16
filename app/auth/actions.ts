'use server';

import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { sha256Hex } from '@/lib/auth/crypto';
import { hashPassword, passwordNeedsRehash, verifyPassword } from '@/lib/auth/password';
import {
  clearRateLimit,
  consumeRateLimit,
  requestRateLimitKey,
} from '@/lib/auth/rate-limit';
import { endCurrentSession, startSession } from '@/lib/auth/sessions';
import {
  isValidEmail,
  isValidIranianPhone,
  normalizeEmail,
  normalizeIranianPhone,
  safeReturnTo,
  validateName,
  validatePassword,
} from '@/lib/auth/validation';
import type { UserRole, UserStatus } from '@/types/content';

interface AuthUserRow {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  fullName: string;
}

const AUTH_SERVICE_UNAVAILABLE =
  'ارتباط با سرویس حساب کاربری برقرار نشد. چند دقیقه دیگر دوباره تلاش کنید.';

function reportAuthServiceError(context: string, error: unknown): void {
  console.error(
    context,
    error instanceof Error ? error.message : 'Unknown authentication service error',
  );
}

export interface LoginState {
  error?: string;
  email?: string;
}

export async function loginAction(
  _previousState: LoginState | undefined,
  formData: FormData,
): Promise<LoginState> {
  const email = normalizeEmail(formData.get('email'));
  const password = String(formData.get('password') ?? '');
  const returnTo = safeReturnTo(formData.get('returnTo'));

  if (!isValidEmail(email) || !password) {
    return { error: 'ایمیل و رمز عبور معتبر را وارد کنید.', email };
  }

  let rateKey: string;
  let blocked: boolean;

  try {
    rateKey = await requestRateLimitKey(email);
    blocked = await consumeRateLimit({
      key: rateKey,
      action: 'login',
      limit: 8,
      windowSeconds: 15 * 60,
      blockSeconds: 15 * 60,
    });
  } catch (error) {
    reportAuthServiceError('Login rate-limit check failed.', error);
    return { error: AUTH_SERVICE_UNAVAILABLE, email };
  }

  if (blocked) {
    return {
      error: 'تعداد تلاش‌ها زیاد است. ۱۵ دقیقه دیگر دوباره امتحان کنید.',
      email,
    };
  }

  let user: AuthUserRow | undefined;

  try {
    [user] = await db<AuthUserRow[]>`
      select id, email, password_hash, role, status, name as full_name
      from users
      where lower(email) = ${email}
      limit 1
    `;
  } catch (error) {
    reportAuthServiceError('Login account lookup failed.', error);
    return { error: AUTH_SERVICE_UNAVAILABLE, email };
  }
  const passwordMatches = await verifyPassword(password, user?.passwordHash);

  if (!user || !passwordMatches) {
    return { error: 'ایمیل یا رمز عبور صحیح نیست.', email };
  }

  if (user.status === 'DISABLED') {
    return { error: 'این حساب غیرفعال شده است. با دفتر تماس بگیرید.', email };
  }

  if (user.status === 'PASSWORD_RESET_REQUIRED') {
    return {
      error: 'برای این حساب ابتدا از بخش فراموشی رمز، رمز تازه تعیین کنید.',
      email,
    };
  }

  if (passwordNeedsRehash(user.passwordHash)) {
    try {
      const upgradedHash = await hashPassword(password);
      await db`update users set password_hash = ${upgradedHash} where id = ${user.id}`;
    } catch (error) {
      reportAuthServiceError('Password hash upgrade failed.', error);
    }
  }

  try {
    await startSession(user);
  } catch (error) {
    reportAuthServiceError('Login session creation failed.', error);
    return { error: AUTH_SERVICE_UNAVAILABLE, email };
  }

  await clearRateLimit(rateKey, 'login').catch((error) => {
    reportAuthServiceError('Login rate-limit cleanup failed.', error);
  });
  await db`
      insert into audit_logs (actor_id, action, entity_type, entity_id)
      values (${user.id}, 'auth.login', 'user', ${user.id})
    `.catch((error) => {
      reportAuthServiceError('Login audit write failed.', error);
    });

  redirect(returnTo);
}

export interface SignupState {
  error?: string;
  values?: { fullName: string; phone: string; email: string };
}

export async function signupAction(
  _previousState: SignupState | undefined,
  formData: FormData,
): Promise<SignupState> {
  const fullName = String(formData.get('fullName') ?? '').trim();
  const phone = normalizeIranianPhone(formData.get('phone'));
  const email = normalizeEmail(formData.get('email'));
  const password = String(formData.get('password') ?? '');
  const passwordConfirm = String(formData.get('passwordConfirm') ?? '');
  const returnTo = safeReturnTo(formData.get('returnTo'));
  const values = { fullName, phone, email };

  const nameError = validateName(fullName);
  if (nameError) return { error: nameError, values };
  if (!isValidIranianPhone(phone)) {
    return { error: 'شماره موبایل ایران را با قالب ۰۹xxxxxxxxx وارد کنید.', values };
  }
  if (!isValidEmail(email)) return { error: 'ایمیل معتبر وارد کنید.', values };
  const passwordError = validatePassword(password);
  if (passwordError) return { error: passwordError, values };
  if (password !== passwordConfirm) {
    return { error: 'تکرار رمز عبور یکسان نیست.', values };
  }

  let rateKey: string;
  let blocked: boolean;

  try {
    rateKey = await requestRateLimitKey(email);
    blocked = await consumeRateLimit({
      key: rateKey,
      action: 'signup',
      limit: 5,
      windowSeconds: 60 * 60,
      blockSeconds: 60 * 60,
    });
  } catch (error) {
    reportAuthServiceError('Signup rate-limit check failed.', error);
    return { error: AUTH_SERVICE_UNAVAILABLE, values };
  }
  if (blocked) {
    return { error: 'تعداد درخواست‌ها زیاد است. کمی بعد دوباره تلاش کنید.', values };
  }

  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(password);

  try {
    await db.begin(async (tx) => {
      await tx`
        insert into users (
          id, email, password_hash, name, phone, role, status
        ) values (
          ${id}, ${email}, ${passwordHash}, ${fullName}, ${phone},
          'CLIENT', 'ACTIVE'
        )
      `;
      await tx`
        insert into audit_logs (actor_id, action, entity_type, entity_id)
        values (${id}, 'auth.signup', 'user', ${id})
      `;
    });
  } catch (error) {
    const code =
      typeof error === 'object' && error && 'code' in error
        ? String(error.code)
        : '';
    if (code === '23505') {
      return { error: 'برای این ایمیل قبلاً حساب ساخته شده است.', values };
    }
    reportAuthServiceError('Signup account creation failed.', error);
    return { error: AUTH_SERVICE_UNAVAILABLE, values };
  }

  try {
    await startSession({ id, role: 'CLIENT' });
  } catch (error) {
    reportAuthServiceError('Signup session creation failed.', error);
    redirect('/login?registered=1');
  }

  await clearRateLimit(rateKey, 'signup').catch((error) => {
    reportAuthServiceError('Signup rate-limit cleanup failed.', error);
  });
  redirect(returnTo);
}

export interface ResetPasswordState {
  error?: string;
}

export async function resetPasswordAction(
  _previousState: ResetPasswordState | undefined,
  formData: FormData,
): Promise<ResetPasswordState> {
  const token = String(formData.get('token') ?? '');
  const password = String(formData.get('password') ?? '');
  const passwordConfirm = String(formData.get('passwordConfirm') ?? '');
  const passwordError = validatePassword(password);

  if (!token || token.length > 256) return { error: 'لینک بازیابی معتبر نیست.' };
  if (passwordError) return { error: passwordError };
  if (password !== passwordConfirm) {
    return { error: 'تکرار رمز عبور یکسان نیست.' };
  }

  const [tokenHash, passwordHash] = await Promise.all([
    sha256Hex(token),
    hashPassword(password),
  ]);

  const changed = await db.begin(async (tx) => {
    const [reset] = await tx<{ userId: string }[]>`
      select user_id
      from password_reset_tokens
      where token_hash = ${tokenHash}
        and used_at is null
        and expires_at > now()
      for update
    `;

    if (!reset) return false;

    const [user] = await tx<{ id: string }[]>`
      update users
      set password_hash = ${passwordHash},
          password_changed_at = now(),
          status = case
            when status = 'PASSWORD_RESET_REQUIRED' then 'ACTIVE'
            else status
          end
      where id = ${reset.userId} and status <> 'DISABLED'
      returning id
    `;
    if (!user) return false;

    await tx`
      update password_reset_tokens set used_at = now()
      where token_hash = ${tokenHash}
    `;
    await tx`delete from user_sessions where user_id = ${reset.userId}`;
    await tx`
      delete from password_reset_tokens
      where user_id = ${reset.userId} and token_hash <> ${tokenHash}
    `;
    await tx`
      insert into audit_logs (actor_id, action, entity_type, entity_id)
      values (${reset.userId}, 'auth.password.reset', 'user', ${reset.userId})
    `;

    return true;
  });

  if (!changed) {
    return { error: 'این لینک منقضی یا قبلاً استفاده شده است.' };
  }

  redirect('/login?reset=success');
}

export async function logoutAction(): Promise<void> {
  await endCurrentSession();
  redirect('/login?loggedOut=1');
}
