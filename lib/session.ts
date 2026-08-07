import { redirect } from 'next/navigation';
import { auth0 } from '@/lib/auth0';
import { roleFromAuth0Identity } from '@/lib/auth-role';
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

async function ensureProfile(user: SessionUser): Promise<ProfileRow> {
  const id = user.sub;
  if (!id) throw new Error('Auth0 session is missing the sub claim.');

  const email = String(user.email || '').trim().toLowerCase();
  const fullName = String(user.name || user.nickname || email.split('@')[0] || 'کاربر').trim();
  const claimedRole = roleFromAuth0Identity(user);
  const initialRole: UserRole = claimedRole ?? 'client';

  // One round-trip instead of SELECT + UPDATE/INSERT. This matters on the
  // Cloudflare Workers Free CPU budget and also avoids opening two DB clients.
  const [profile] = await db<ProfileRow[]>`
    insert into profiles (id, full_name, email, role)
    values (${id}, ${fullName}, ${email || null}, ${initialRole})
    on conflict (id) do update
    set email = case
          when excluded.email is null or excluded.email = '' then profiles.email
          else excluded.email
        end,
        full_name = case
          when profiles.full_name = '' then excluded.full_name
          else profiles.full_name
        end,
        role = coalesce(${claimedRole}::text, profiles.role)
    returning id, full_name, email, phone, role
  `;

  return profile;
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
  if (!account) redirect('/login?returnTo=/account');
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
