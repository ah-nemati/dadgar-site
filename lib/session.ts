import { redirect } from 'next/navigation';
import { auth0 } from '@/lib/auth0';
import { db } from '@/lib/db';
import type { CurrentAccount, UserRole } from '@/types/content';

interface SessionUser {
  sub?: string;
  email?: string;
  name?: string;
  nickname?: string;
  [key: string]: unknown;
}

interface ProfileRow {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
}

export function dashboardPath(role: UserRole): '/admin' | '/portal' {
  return role === 'admin' ? '/admin' : '/portal';
}

function roleFromAuth0(user: SessionUser, email: string): UserRole | null {
  const namespace = (process.env.AUTH0_ROLE_CLAIM_NAMESPACE || 'https://dadgar.example.com').replace(/\/$/, '');
  const claim = user[`${namespace}/role`];
  if (claim === 'admin' || claim === 'client') return claim;

  const admins = (process.env.AUTH0_ADMIN_EMAILS || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase()) ? 'admin' : null;
}

async function ensureProfile(user: SessionUser): Promise<ProfileRow> {
  const id = user.sub;
  if (!id) throw new Error('Auth0 session is missing the sub claim.');
  const email = String(user.email || '').trim().toLowerCase();
  const fullName = String(user.name || user.nickname || email.split('@')[0] || 'کاربر').trim();
  const claimedRole = roleFromAuth0(user, email);

  const [existing] = await db<ProfileRow[]>`
    select id, full_name, email, phone, role
    from profiles
    where id = ${id}
    limit 1
  `;

  if (existing) {
    // A namespaced Auth0 claim is authoritative. When the Action has not yet
    // been installed, preserve the database role instead of silently demoting users.
    const role = claimedRole ?? existing.role;
    const [updated] = await db<ProfileRow[]>`
      update profiles
      set email = ${email || existing.email},
          full_name = case when full_name = '' then ${fullName} else full_name end,
          role = ${role}
      where id = ${id}
      returning id, full_name, email, phone, role
    `;
    return updated;
  }

  const [created] = await db<ProfileRow[]>`
    insert into profiles (id, full_name, email, role)
    values (${id}, ${fullName}, ${email || null}, ${claimedRole ?? 'client'})
    returning id, full_name, email, phone, role
  `;
  return created;
}

export async function getCurrentAccount(): Promise<CurrentAccount | null> {
  const session = await auth0.getSession();
  if (!session?.user) return null;
  const profile = await ensureProfile(session.user as SessionUser);
  return {
    id: profile.id,
    email: profile.email ?? String((session.user as SessionUser).email || ''),
    fullName: profile.fullName,
    phone: profile.phone,
    role: profile.role,
  };
}

export async function requireAccount(): Promise<CurrentAccount> {
  const account = await getCurrentAccount();
  if (!account) redirect('/auth/login?returnTo=/account');
  return account;
}

export async function requireAdmin(): Promise<CurrentAccount> {
  const account = await requireAccount();
  if (account.role !== 'admin') redirect('/portal');
  return account;
}

export async function requireClient(): Promise<CurrentAccount> {
  const account = await requireAccount();
  if (account.role === 'admin') redirect('/admin');
  return account;
}
