'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { randomBase64Url, sha256Hex } from '@/lib/auth/crypto';
import { hashPassword } from '@/lib/auth/password';
import {
  isValidEmail,
  isValidIranianPhone,
  normalizeEmail,
  normalizeIranianPhone,
  validateName,
  validatePassword,
} from '@/lib/auth/validation';
import { requireAdmin } from '@/lib/session';
import { deleteAsset } from '@/lib/storage/imagekit';
import type { UserRole, UserStatus } from '@/types/content';
import type postgres from 'postgres';

interface ManagedUserRow {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface UserActionState {
  error?: string;
  success?: boolean;
}

export interface PasswordResetLinkState extends UserActionState {
  resetUrl?: string;
}

function readRole(value: FormDataEntryValue | null): UserRole | null {
  return value === 'ADMIN' || value === 'LAWYER' || value === 'CLIENT'
    ? value
    : null;
}

function readStatus(value: FormDataEntryValue | null): UserStatus | null {
  return value === 'ACTIVE' ||
    value === 'DISABLED' ||
    value === 'PASSWORD_RESET_REQUIRED'
    ? value
    : null;
}

function readEducation(value: FormDataEntryValue | null): string[] {
  return String(value ?? '')
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 10);
}

function toTextArrayLiteral(items: string[] | undefined | null): string {
  if (!items || items.length === 0) return '{}';
  const escaped = items.map((item) => `"${item.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`);
  return `{${escaped.join(',')}}`;
}

function databaseError(error: unknown): string {
  const code =
    typeof error === 'object' && error && 'code' in error
      ? String(error.code)
      : '';
  const message = error instanceof Error ? error.message : '';
  if (code === '23505') return 'برای این ایمیل قبلاً حساب ساخته شده است.';
  if (message === 'LAST_ACTIVE_ADMIN') return 'حداقل یک مدیر فعال باید در سامانه باقی بماند.';
  return 'ذخیره اطلاعات کاربر انجام نشد.';
}

async function activeAdminCanBeChanged(
  tx: postgres.TransactionSql,
  user: ManagedUserRow,
  nextRole: UserRole,
  nextStatus: UserStatus,
): Promise<boolean> {
  if (
    user.role !== 'ADMIN' ||
    user.status !== 'ACTIVE' ||
    (nextRole === 'ADMIN' && nextStatus === 'ACTIVE')
  ) {
    return true;
  }

  const [row] = await tx<{ count: number }[]>`
    select count(*)::int as count
    from users
    where role = 'ADMIN' and status = 'ACTIVE' and id <> ${user.id}
  `;
  return Number(row.count) > 0;
}

export async function createUserAccountAction(
  _previousState: UserActionState | undefined,
  formData: FormData,
): Promise<UserActionState> {
  const admin = await requireAdmin();
  const fullName = String(formData.get('fullName') ?? '').trim();
  const phone = normalizeIranianPhone(formData.get('phone'));
  const email = normalizeEmail(formData.get('email'));
  const password = String(formData.get('password') ?? '');
  const passwordConfirm = String(formData.get('passwordConfirm') ?? '');
  const role = readRole(formData.get('role'));
  const licenseNumber = String(formData.get('licenseNumber') ?? '').trim();
  const education = readEducation(formData.get('education'));

  const nameError = validateName(fullName);
  if (nameError) return { error: nameError };
  if (!isValidIranianPhone(phone)) return { error: 'شماره موبایل ایران معتبر نیست.' };
  if (!isValidEmail(email)) return { error: 'ایمیل معتبر وارد کنید.' };
  const passwordError = validatePassword(password);
  if (passwordError) return { error: passwordError };
  if (password !== passwordConfirm) return { error: 'تکرار رمز عبور یکسان نیست.' };
  if (!role) return { error: 'نقش کاربر معتبر نیست.' };
  if (role === 'LAWYER' && !licenseNumber) {
    return { error: 'برای نقش وکیل، شماره پروانه را وارد کنید.' };
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
          ${role}, 'ACTIVE'
        )
      `;
      if (role === 'LAWYER') {
        const educationLiteral = toTextArrayLiteral(education);
        await tx`
          insert into lawyer_profiles (user_id, license_number, education)
          values (${id}, ${licenseNumber}, ${educationLiteral}::text[])
        `;
      }
      await tx`
        insert into audit_logs (actor_id, action, entity_type, entity_id, metadata)
        values (
          ${admin.id}, 'user.create', 'user', ${id},
          ${JSON.stringify({ email, role })}::jsonb
        )
      `;
    });
  } catch (error) {
    return { error: databaseError(error) };
  }

  revalidatePath('/admin');
  revalidatePath('/admin/clients');
  return { success: true };
}

export async function updateUserAction(
  userId: string,
  _previousState: UserActionState | undefined,
  formData: FormData,
): Promise<UserActionState> {
  const admin = await requireAdmin();
  const fullName = String(formData.get('fullName') ?? '').trim();
  const phone = normalizeIranianPhone(formData.get('phone'));
  const email = normalizeEmail(formData.get('email'));
  const role = readRole(formData.get('role'));
  const status = readStatus(formData.get('status'));
  const licenseNumber = String(formData.get('licenseNumber') ?? '').trim();
  const education = readEducation(formData.get('education'));

  const nameError = validateName(fullName);
  if (nameError) return { error: nameError };
  if (!isValidIranianPhone(phone)) return { error: 'شماره موبایل ایران معتبر نیست.' };
  if (!isValidEmail(email)) return { error: 'ایمیل معتبر وارد کنید.' };
  if (!role || !status) return { error: 'نقش یا وضعیت انتخاب‌شده معتبر نیست.' };
  if (role === 'LAWYER' && !licenseNumber) {
    return { error: 'برای نقش وکیل، شماره پروانه را وارد کنید.' };
  }

  try {
    await db.begin(async (tx) => {
      const [user] = await tx<ManagedUserRow[]>`
        select id, email, role, status from users where id = ${userId} for update
      `;
      if (!user) throw new Error('USER_NOT_FOUND');
      if (user.id === admin.id && (role !== user.role || status !== user.status)) {
        throw new Error('SELF_ROLE_STATUS');
      }
      if (!(await activeAdminCanBeChanged(tx, user, role, status))) {
        throw new Error('LAST_ACTIVE_ADMIN');
      }

      await tx`
        update users
        set name = ${fullName}, email = ${email}, phone = ${phone},
            role = ${role}, status = ${status}
        where id = ${userId}
      `;

      if (role === 'LAWYER') {
        const educationLiteral = toTextArrayLiteral(education);
        await tx`
          insert into lawyer_profiles (user_id, license_number, education)
          values (${userId}, ${licenseNumber}, ${educationLiteral}::text[])
          on conflict (user_id) do update
          set license_number = excluded.license_number,
              education = excluded.education
        `;
      } else {
        await tx`delete from lawyer_profiles where user_id = ${userId}`;
      }

      if (role !== user.role || status !== user.status) {
        await tx`delete from user_sessions where user_id = ${userId}`;
      }
      await tx`
        insert into audit_logs (actor_id, action, entity_type, entity_id, metadata)
        values (
          ${admin.id}, 'user.update', 'user', ${userId},
          ${JSON.stringify({ email, role, status })}::jsonb
        )
      `;
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message === 'USER_NOT_FOUND') return { error: 'کاربر پیدا نشد.' };
    if (message === 'SELF_ROLE_STATUS') {
      return { error: 'نقش یا وضعیت حساب فعلی را از همین نشست نمی‌توان تغییر داد.' };
    }
    return { error: databaseError(error) };
  }

  revalidatePath('/admin');
  revalidatePath('/admin/clients');
  revalidatePath(`/admin/clients/${encodeURIComponent(userId)}`);
  return { success: true };
}

export async function createUserPasswordResetLinkAction(
  userId: string,
  _previousState: PasswordResetLinkState | undefined,
  _formData: FormData,
): Promise<PasswordResetLinkState> {
  void _previousState;
  void _formData;
  const admin = await requireAdmin();
  const token = randomBase64Url(32);
  const tokenHash = await sha256Hex(token);
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  const baseUrl =
    process.env.APP_BASE_URL?.trim() ||
    (process.env.NODE_ENV === 'production'
      ? 'https://majidsavarivakil.ir'
      : 'http://localhost:3000');
  let resetUrl: URL;
  try {
    resetUrl = new URL('/reset-password', baseUrl);
  } catch {
    return { error: 'آدرس اصلی سایت در APP_BASE_URL معتبر نیست.' };
  }
  resetUrl.searchParams.set('token', token);

  try {
    await db.begin(async (tx) => {
      const [target] = await tx<ManagedUserRow[]>`
        select id, email, role, status from users where id = ${userId} for update
      `;
      if (!target) throw new Error('USER_NOT_FOUND');
      if (target.id === admin.id) throw new Error('SELF_RESET_LINK');
      if (target.status === 'DISABLED') throw new Error('USER_DISABLED');

      await tx`
        update users set status = 'PASSWORD_RESET_REQUIRED'
        where id = ${userId}
      `;
      await tx`delete from user_sessions where user_id = ${userId}`;
      await tx`
        delete from password_reset_tokens
        where user_id = ${userId} and used_at is null
      `;
      await tx`
        insert into password_reset_tokens (token_hash, user_id, expires_at)
        values (${tokenHash}, ${userId}, ${expiresAt})
      `;
      await tx`
        insert into audit_logs (actor_id, action, entity_type, entity_id, metadata)
        values (
          ${admin.id}, 'user.password.reset_link.create', 'user', ${userId},
          ${JSON.stringify({ expiresAt: expiresAt.toISOString() })}::jsonb
        )
      `;
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    return {
      error:
        message === 'USER_NOT_FOUND'
          ? 'کاربر پیدا نشد.'
          : message === 'SELF_RESET_LINK'
            ? 'برای حساب فعلی از صفحه «امنیت حساب» رمز را تغییر دهید.'
          : message === 'USER_DISABLED'
            ? 'حساب غیرفعال است؛ ابتدا وضعیت آن را فعال کنید.'
            : 'ساخت لینک بازنشانی انجام نشد.',
    };
  }

  revalidatePath('/admin/clients');
  revalidatePath(`/admin/clients/${encodeURIComponent(userId)}`);
  return { success: true, resetUrl: resetUrl.toString() };
}

export async function deleteUserAction(
  userId: string,
  _previousState: UserActionState | undefined,
  _formData: FormData,
): Promise<UserActionState> {
  void _previousState;
  void _formData;
  const admin = await requireAdmin();
  if (userId === admin.id) return { error: 'حسابی که با آن وارد شده‌اید قابل حذف نیست.' };

  let fileIds: Array<string | null> = [];
  try {
    await db.begin(async (tx) => {
      const [user] = await tx<ManagedUserRow[]>`
        select id, email, role, status from users where id = ${userId} for update
      `;
      if (!user) throw new Error('USER_NOT_FOUND');
      if (!(await activeAdminCanBeChanged(tx, user, 'CLIENT', 'DISABLED'))) {
        throw new Error('LAST_ACTIVE_ADMIN');
      }

      const [documents, supportFiles] = await Promise.all([
        tx<{ fileId: string | null }[]>`
          select file_id from client_documents where client_id = ${userId}
        `,
        tx<{ fileId: string | null }[]>`
          select sa.file_id from support_attachments sa join support_threads st on st.id = sa.thread_id where st.client_id = ${userId}
        `,
      ]);
      fileIds = [...documents, ...supportFiles].map((document) => document.fileId);

      await tx`delete from users where id = ${userId}`;
      await tx`
        insert into audit_logs (actor_id, action, entity_type, entity_id, metadata)
        values (
          ${admin.id}, 'user.delete', 'user', ${userId},
          ${JSON.stringify({ email: user.email, role: user.role })}::jsonb
        )
      `;
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message === 'USER_NOT_FOUND') return { error: 'کاربر پیدا نشد.' };
    return { error: databaseError(error) };
  }

  await Promise.allSettled(fileIds.map((fileId) => deleteAsset(fileId)));
  revalidatePath('/admin');
  revalidatePath('/admin/clients');
  redirect('/admin/clients');
}
