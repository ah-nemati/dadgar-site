import { createHmac, timingSafeEqual } from 'crypto';

export const ADMIN_COOKIE_NAME = 'admin_session';
const SESSION_VALUE = 'admin-ok';

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('SESSION_SECRET is not set — see .env.example.');
  }
  return secret;
}

/** Builds the signed cookie value issued after a correct password login. */
export function createSessionToken(): string {
  const signature = createHmac('sha256', getSecret()).update(SESSION_VALUE).digest('hex');
  return `${SESSION_VALUE}.${signature}`;
}

/** Verifies a session cookie value came from createSessionToken() (not guessed/forged). */
export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [value, signature] = token.split('.');
  if (value !== SESSION_VALUE || !signature) return false;

  const expected = createHmac('sha256', getSecret()).update(SESSION_VALUE).digest('hex');
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function verifyAdminPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error('ADMIN_PASSWORD is not set — see .env.example.');
  }
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
