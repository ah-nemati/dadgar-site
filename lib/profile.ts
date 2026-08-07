import { db } from '@/lib/db';
import { updateAuth0Profile } from '@/lib/auth0-management';
import { requireAccount } from '@/lib/session';
import type { Profile } from '@/types/content';

interface ProfileRow {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  role: 'admin' | 'client';
  createdAt: Date;
}

function toProfile(row: ProfileRow): Profile {
  return { ...row, createdAt: row.createdAt.toISOString() };
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const account = await requireAccount();
  const [row] = await db<ProfileRow[]>`
    select id, full_name, email, phone, role, created_at
    from profiles where id = ${account.id} limit 1
  `;
  return row ? toProfile(row) : null;
}

export async function updateOwnProfile(input: { fullName: string; phone: string }): Promise<void> {
  const account = await requireAccount();
  await db`
    update profiles set full_name = ${input.fullName}, phone = ${input.phone}
    where id = ${account.id}
  `;
  try {
    await updateAuth0Profile(account.id, input);
  } catch {
    // The local profile remains authoritative for application display.
  }
}
