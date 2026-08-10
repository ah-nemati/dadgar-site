'use server';

import { db } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { startSession } from '@/lib/auth/sessions';
import { validatePassword } from '@/lib/auth/validation';
import { requireAccount } from '@/lib/session';

export interface PasswordFormState {
  error?: string;
  success?: boolean;
}

export async function changePasswordAction(
  _previousState: PasswordFormState | undefined,
  formData: FormData,
): Promise<PasswordFormState> {
  const account = await requireAccount();
  const currentPassword = String(formData.get('currentPassword') ?? '');
  const newPassword = String(formData.get('newPassword') ?? '');
  const newPasswordConfirm = String(formData.get('newPasswordConfirm') ?? '');

  if (!currentPassword || !newPassword || !newPasswordConfirm) {
    return { error: 'رمز فعلی، رمز جدید و تکرار آن را کامل کنید.' };
  }
  const passwordError = validatePassword(newPassword);
  if (passwordError) return { error: passwordError };
  if (newPassword !== newPasswordConfirm) {
    return { error: 'تکرار رمز عبور جدید یکسان نیست.' };
  }

  const [user] = await db<{ passwordHash: string }[]>`
    select password_hash from users where id = ${account.id} limit 1
  `;
  if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) {
    return { error: 'رمز عبور فعلی صحیح نیست.' };
  }
  if (await verifyPassword(newPassword, user.passwordHash)) {
    return { error: 'رمز جدید باید با رمز فعلی متفاوت باشد.' };
  }

  const passwordHash = await hashPassword(newPassword);
  try {
    await db.begin(async (tx) => {
      await tx`
        update users
        set password_hash = ${passwordHash}, password_changed_at = now()
        where id = ${account.id}
      `;
      await tx`delete from user_sessions where user_id = ${account.id}`;
      await tx`delete from password_reset_tokens where user_id = ${account.id}`;
      await tx`
        insert into audit_logs (actor_id, action, entity_type, entity_id)
        values (${account.id}, 'auth.password.change', 'user', ${account.id})
      `;
    });
    await startSession(account);
  } catch {
    return { error: 'تغییر رمز عبور انجام نشد.' };
  }

  return { success: true };
}
