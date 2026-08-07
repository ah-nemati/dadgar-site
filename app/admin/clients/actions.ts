'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { createAuth0User, deleteAuth0User, updateAuth0Password } from '@/lib/auth0-management';
import { requireAdmin } from '@/lib/session';

export interface CreateClientState { error?: string; success?: boolean }
export async function createClientAccountAction(_prev: CreateClientState | undefined, formData: FormData): Promise<CreateClientState> {
  const admin = await requireAdmin();
  const fullName = String(formData.get('fullName') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  if (!fullName || !phone || !email || !password) return { error: 'نام، شماره تماس، ایمیل و رمز موقت را کامل کنید.' };
  if (password.length < 8) return { error: 'رمز موقت باید حداقل ۸ کاراکتر باشد.' };

  let authUserId: string | null = null;
  try {
    const user = await createAuth0User({ email, password, fullName, phone, role: 'client' });
    authUserId = user.user_id;
    await db.begin(async (tx) => {
      await tx`
        insert into profiles (id, full_name, email, phone, role)
        values (${user.user_id}, ${fullName}, ${email}, ${phone}, 'client')
        on conflict (id) do update set full_name = excluded.full_name, email = excluded.email, phone = excluded.phone
      `;
      await tx`
        insert into audit_logs (actor_id, action, entity_type, entity_id, metadata)
        values (${admin.id}, 'client.create', 'profile', ${user.user_id}, ${JSON.stringify({ email })}::jsonb)
      `;
    });
  } catch (error) {
    if (authUserId) await deleteAuth0User(authUserId).catch(() => undefined);
    const message = error instanceof Error ? error.message : '';
    if (/409|already exists|user_exists/i.test(message)) return { error: 'برای این ایمیل قبلاً حساب ساخته شده است.' };
    return { error: 'ساخت حساب در Auth0 انجام نشد. دسترسی‌های Management API را بررسی کنید.' };
  }
  revalidatePath('/admin');
  revalidatePath('/admin/clients');
  return { success: true };
}

export interface ResetClientPasswordState { error?: string; success?: boolean }
export async function resetClientPasswordAction(clientId: string, _prev: ResetClientPasswordState | undefined, formData: FormData): Promise<ResetClientPasswordState> {
  const admin = await requireAdmin();
  const password = String(formData.get('password') ?? '');
  const passwordConfirm = String(formData.get('passwordConfirm') ?? '');
  if (password.length < 8) return { error: 'رمز موقت باید حداقل ۸ کاراکتر باشد.' };
  if (password !== passwordConfirm) return { error: 'تکرار رمز موقت یکسان نیست.' };
  try {
    const [client] = await db<{ id: string }[]>`
      select id from profiles where id = ${clientId} and role = 'client' limit 1
    `;
    if (!client || !clientId.startsWith('auth0|')) return { error: 'این حساب قابلیت تعیین رمز محلی ندارد.' };
    await updateAuth0Password(clientId, password);
    await db`insert into audit_logs (actor_id, action, entity_type, entity_id) values (${admin.id}, 'client.password.reset', 'profile', ${clientId})`;
  } catch { return { error: 'تغییر رمز موکل در Auth0 انجام نشد.' }; }
  return { success: true };
}
