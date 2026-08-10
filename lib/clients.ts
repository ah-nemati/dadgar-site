import { db } from '@/lib/db';
import type { Profile, UserRole, UserStatus } from '@/types/content';

interface UserRow {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  licenseNumber: string | null;
  education: string[] | null;
}

function toProfile(row: UserRow): Profile {
  return {
    ...row,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    education: row.education ?? [],
  };
}

const USER_COLUMNS = `
  u.id,
  u.name as full_name,
  u.email,
  u.phone,
  u.role,
  u.status,
  u.created_at,
  u.updated_at,
  lp.license_number,
  lp.education
`;

export async function getUsers(): Promise<Profile[]> {
  const rows = await db.unsafe<UserRow[]>(`
    select ${USER_COLUMNS}
    from users u
    left join lawyer_profiles lp on lp.user_id = u.id
    order by u.created_at desc
  `);
  return rows.map(toProfile);
}

export async function getUserById(id: string): Promise<Profile | null> {
  const rows = await db.unsafe<UserRow[]>(
    `
      select ${USER_COLUMNS}
      from users u
      left join lawyer_profiles lp on lp.user_id = u.id
      where u.id = $1
      limit 1
    `,
    [id],
  );
  return rows[0] ? toProfile(rows[0]) : null;
}

export async function getClients(): Promise<Profile[]> {
  const rows = await db.unsafe<UserRow[]>(`
    select ${USER_COLUMNS}
    from users u
    left join lawyer_profiles lp on lp.user_id = u.id
    where u.role = 'CLIENT' and u.status = 'ACTIVE'
    order by u.created_at desc
  `);
  return rows.map(toProfile);
}

export async function getClientById(id: string): Promise<Profile | null> {
  const user = await getUserById(id);
  return user?.role === 'CLIENT' ? user : null;
}
