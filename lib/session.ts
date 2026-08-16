import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import {
  hashSessionToken,
  sessionCookieName,
  verifySessionToken,
} from '@/lib/auth/session-token';
import type {
  CurrentAccount,
  UserRole,
  UserStatus,
} from '@/types/content';

interface AccountRow {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
}

export function dashboardPath(role: UserRole): '/admin' | '/portal' {
  return role === 'CLIENT' ? '/portal' : '/admin';
}

const loadCurrentAccount = cache(async (): Promise<CurrentAccount | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName())?.value;
  const ticket = await verifySessionToken(token);

  if (!ticket || !token) return null;

  const tokenHash = await hashSessionToken(token);
  const [account] = await db<AccountRow[]>`
    select
      u.id,
      u.email,
      u.name as full_name,
      u.phone,
      u.role,
      u.status
    from user_sessions s
    join users u on u.id = s.user_id
    where s.token_hash = ${tokenHash}
      and s.expires_at > now()
      and u.status = 'ACTIVE'
    limit 1
  `;

  if (
    !account ||
    account.id !== ticket.userId ||
    account.role !== ticket.role
  ) {
    return null;
  }

  return account;
});

export function getCurrentAccount(): Promise<CurrentAccount | null> {
  return loadCurrentAccount();
}

/**
 * Public authentication pages must remain reachable even if PostgreSQL or
 * Hyperdrive is temporarily unavailable. Protected pages still use the strict
 * getCurrentAccount/require* path and therefore never bypass database-backed
 * session revocation or role checks.
 */
export async function getCurrentAccountForAuthEntry(): Promise<CurrentAccount | null> {
  try {
    return await getCurrentAccount();
  } catch (error) {
    console.error(
      'Could not validate an existing session while rendering an auth entry page.',
      error instanceof Error ? error.message : 'Unknown database error',
    );
    return null;
  }
}

export async function requireAccount(): Promise<CurrentAccount> {
  const account = await getCurrentAccount();
  if (!account) redirect('/login');
  return account;
}

export async function requireAdmin(): Promise<CurrentAccount> {
  const account = await requireAccount();
  if (account.role !== 'ADMIN') redirect(dashboardPath(account.role));
  return account;
}

export async function requireStaff(): Promise<CurrentAccount> {
  const account = await requireAccount();
  if (account.role === 'CLIENT') redirect('/portal');
  return account;
}

export async function requireClient(): Promise<CurrentAccount> {
  const account = await requireAccount();
  if (account.role !== 'CLIENT') redirect('/admin');
  return account;
}
