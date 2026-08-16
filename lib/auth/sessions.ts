import 'server-only';

import { cookies, headers } from 'next/headers';
import { db } from '@/lib/db';
import {
  createSessionToken,
  hashSessionToken,
  privacyHash,
  SESSION_MAX_AGE_SECONDS,
  sessionCookieName,
} from '@/lib/auth/session-token';
import type { UserRole } from '@/types/content';

async function requestMetadata(): Promise<{
  ipHash: string | null;
  userAgentHash: string | null;
}> {
  const requestHeaders = await headers();
  const ip =
    requestHeaders.get('cf-connecting-ip') ||
    requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '';
  const userAgent = requestHeaders.get('user-agent') || '';

  return {
    ipHash: ip ? await privacyHash(ip) : null,
    userAgentHash: userAgent ? await privacyHash(userAgent) : null,
  };
}

export async function startSession(user: {
  id: string;
  role: UserRole;
}): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
  const token = await createSessionToken({
    userId: user.id,
    role: user.role,
    expiresAt,
  });
  const [tokenHash, metadata] = await Promise.all([
    hashSessionToken(token),
    requestMetadata(),
  ]);

  await db.begin(async (tx) => {
    await tx`delete from user_sessions where expires_at <= now()`;
    await tx`
      insert into user_sessions (
        token_hash, user_id, expires_at, ip_hash, user_agent_hash
      ) values (
        ${tokenHash}, ${user.id}, ${expiresAt},
        ${metadata.ipHash}, ${metadata.userAgentHash}
      )
    `;
  });

  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
    expires: expiresAt,
    priority: 'high',
  });
}

export async function endCurrentSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName())?.value;

  // Clear the browser credential first. A temporary database/network outage
  // must never trap the user inside a broken logout flow.
  cookieStore.delete(sessionCookieName());

  if (!token) return;

  try {
    const tokenHash = await hashSessionToken(token);
    await db`delete from user_sessions where token_hash = ${tokenHash}`;
  } catch (error) {
    // The signed token is no longer present in the browser, so the user is
    // logged out locally. The orphaned DB session expires automatically.
    console.error(
      'Failed to remove server session during logout; cookie was cleared.',
      error instanceof Error ? error.message : 'Unknown database error',
    );
  }
}

export async function invalidateUserSessions(userId: string): Promise<void> {
  await db`delete from user_sessions where user_id = ${userId}`;
}
