import { pbkdf2, scrypt } from 'node:crypto';
import {
  base64UrlToBytes,
  bytesToBase64Url,
  constantTimeEqual,
} from '@/lib/auth/crypto';

export const CURRENT_ALGORITHM = 'scrypt-v1';
export const LEGACY_PBKDF2_ALGORITHM = 'pbkdf2-sha256';
export const LEGACY_PBKDF2_NATIVE_MAX = 100_000;
const LEGACY_PBKDF2_MIN = 50_000;

const SCRYPT_N = 16_384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_MAXMEM = 32 * 1024 * 1024;

const SALT_BYTES = 16;
const HASH_BYTES = 32;

const DUMMY_SALT = base64UrlToBytes('ZGFkZ2FyLWR1bW15LXNhbHQ');

function deriveScrypt(
  password: string,
  salt: Uint8Array,
  n = SCRYPT_N,
  r = SCRYPT_R,
  p = SCRYPT_P,
): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    scrypt(
      password,
      salt,
      HASH_BYTES,
      { N: n, r, p, maxmem: SCRYPT_MAXMEM },
      (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(new Uint8Array(derivedKey));
      },
    );
  });
}

function derivePbkdf2(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    pbkdf2(
      password,
      salt,
      iterations,
      HASH_BYTES,
      'sha256',
      (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(new Uint8Array(derivedKey));
      },
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = new Uint8Array(SALT_BYTES);
  crypto.getRandomValues(salt);

  const hash = await deriveScrypt(password, salt, SCRYPT_N, SCRYPT_R, SCRYPT_P);

  return [
    CURRENT_ALGORITHM,
    String(SCRYPT_N),
    String(SCRYPT_R),
    String(SCRYPT_P),
    bytesToBase64Url(salt),
    bytesToBase64Url(hash),
  ].join('$');
}

export async function verifyPassword(
  password: string,
  encodedHash: string | null | undefined,
): Promise<boolean> {
  const parts = encodedHash?.split('$') ?? [];
  const algorithm = parts[0];

  if (algorithm === CURRENT_ALGORITHM && parts.length === 6) {
    const n = Number(parts[1]);
    const r = Number(parts[2]);
    const p = Number(parts[3]);
    if (!Number.isInteger(n) || !Number.isInteger(r) || !Number.isInteger(p) || n <= 0 || r <= 0 || p <= 0) {
      await deriveScrypt(password, DUMMY_SALT);
      return false;
    }

    try {
      const salt = base64UrlToBytes(parts[4]);
      const expected = base64UrlToBytes(parts[5]);
      const actual = await deriveScrypt(password, salt, n, r, p);
      return constantTimeEqual(actual, expected);
    } catch {
      await deriveScrypt(password, DUMMY_SALT);
      return false;
    }
  }

  if (algorithm === LEGACY_PBKDF2_ALGORITHM && parts.length === 4) {
    const iterations = Number(parts[1]);
    if (
      !Number.isInteger(iterations) ||
      iterations < LEGACY_PBKDF2_MIN ||
      iterations > LEGACY_PBKDF2_NATIVE_MAX
    ) {
      await derivePbkdf2(password, DUMMY_SALT, LEGACY_PBKDF2_NATIVE_MAX);
      return false;
    }

    try {
      const salt = base64UrlToBytes(parts[2]);
      const expected = base64UrlToBytes(parts[3]);
      const actual = await derivePbkdf2(password, salt, iterations);
      return constantTimeEqual(actual, expected);
    } catch {
      await derivePbkdf2(password, DUMMY_SALT, LEGACY_PBKDF2_NATIVE_MAX);
      return false;
    }
  }

  await deriveScrypt(password, DUMMY_SALT);
  return false;
}

export function passwordNeedsRehash(
  encodedHash: string | null | undefined,
): boolean {
  const parts = encodedHash?.split('$') ?? [];
  if (parts[0] !== CURRENT_ALGORITHM || parts.length !== 6) {
    return true;
  }

  const n = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);

  return n !== SCRYPT_N || r !== SCRYPT_R || p !== SCRYPT_P;
}
