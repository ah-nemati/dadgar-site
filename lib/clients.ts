import { db } from '@/lib/db';
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

export async function getClients(): Promise<Profile[]> {
  const rows = await db<ProfileRow[]>`
    select id, full_name, email, phone, role, created_at
    from profiles where role = 'client' order by created_at desc
  `;
  return rows.map(toProfile);
}

export async function getClientById(id: string): Promise<Profile | null> {
  const [row] = await db<ProfileRow[]>`
    select id, full_name, email, phone, role, created_at
    from profiles where id = ${id} and role = 'client' limit 1
  `;
  return row ? toProfile(row) : null;
}
