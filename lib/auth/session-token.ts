import {
  base64UrlToBytes,
  bytesToBase64Url,
  encodeUtf8,
  hmacSha256,
  randomBase64Url,
  sha256Hex,
  verifyHmacSha256,
} from '@/lib/auth/crypto';
import type { UserRole } from '@/types/content';

export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

interface SessionTicketPayload {
  version: 1;
  sessionId: string;
  userId: string;
  role: UserRole;
  expiresAt: number;
}

function sessionSecret(): string {
  const value = process.env.SESSION_SECRET?.trim();

  if (
    !value ||
    value.length < 32 ||
    value.startsWith('replace-with-')
  ) {
    throw new Error(
      'SESSION_SECRET must contain at least 32 random, non-placeholder characters.',
    );
  }

  return value;
}

function isRole(value: unknown): value is UserRole {
  return value === 'ADMIN' || value === 'LAWYER' || value === 'CLIENT';
}

export function sessionCookieName(): string {
  return process.env.NODE_ENV === 'production'
    ? '__Host-dadgar_session'
    : 'dadgar_session';
}

export async function createSessionToken(input: {
  userId: string;
  role: UserRole;
  expiresAt: Date;
}): Promise<string> {
  const payload: SessionTicketPayload = {
    version: 1,
    sessionId: randomBase64Url(32),
    userId: input.userId,
    role: input.role,
    expiresAt: input.expiresAt.getTime(),
  };
  const encodedPayload = bytesToBase64Url(
    encodeUtf8(JSON.stringify(payload)),
  );
  const signedValue = `v1.${encodedPayload}`;
  const signature = await hmacSha256(sessionSecret(), signedValue);

  return `${signedValue}.${bytesToBase64Url(signature)}`;
}

export async function verifySessionToken(
  token: string | null | undefined,
): Promise<SessionTicketPayload | null> {
  if (!token || token.length > 2048) return null;

  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'v1') return null;

  try {
    const signedValue = `${parts[0]}.${parts[1]}`;
    const signature = base64UrlToBytes(parts[2]);
    const verified = await verifyHmacSha256(
      sessionSecret(),
      signedValue,
      signature,
    );

    if (!verified) return null;

    const payload = JSON.parse(
      new TextDecoder().decode(base64UrlToBytes(parts[1])),
    ) as Partial<SessionTicketPayload>;

    if (
      payload.version !== 1 ||
      typeof payload.sessionId !== 'string' ||
      payload.sessionId.length < 32 ||
      typeof payload.userId !== 'string' ||
      !payload.userId ||
      !isRole(payload.role) ||
      typeof payload.expiresAt !== 'number' ||
      !Number.isFinite(payload.expiresAt) ||
      payload.expiresAt <= Date.now()
    ) {
      return null;
    }

    return payload as SessionTicketPayload;
  } catch {
    return null;
  }
}

export function hashSessionToken(token: string): Promise<string> {
  return sha256Hex(token);
}

export async function privacyHash(value: string): Promise<string> {
  const signature = await hmacSha256(sessionSecret(), value);
  return bytesToBase64Url(signature);
}
