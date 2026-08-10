import { db } from '@/lib/db';
import { requireAccount } from '@/lib/session';
import type { Profile, UserRole, UserStatus } from '@/types/content';

interface ProfileRow {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

function toProfile(row: ProfileRow): Profile {
  return {
    ...row,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const account = await requireAccount();
  const [row] = await db<ProfileRow[]>`
    select id, name as full_name, email, phone, role, status, created_at, updated_at
    from users where id = ${account.id} limit 1
  `;
  return row ? toProfile(row) : null;
}

export async function updateOwnProfile(input: { fullName: string; phone: string }): Promise<void> {
  const account = await requireAccount();
  await db`
    update users set name = ${input.fullName}, phone = ${input.phone}
    where id = ${account.id}
  `;
}
