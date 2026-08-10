import {
  base64UrlToBytes,
  bytesToBase64Url,
  constantTimeEqual,
  encodeUtf8,
  toArrayBuffer,
} from '@/lib/auth/crypto';

const ALGORITHM = 'pbkdf2-sha256';
const ITERATIONS = 600_000;
const SALT_BYTES = 16;
const HASH_BYTES = 32;
const DUMMY_SALT = base64UrlToBytes('ZGFkZ2FyLWR1bW15LXNhbHQ');

async function derive(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw',
    toArrayBuffer(encodeUtf8(password)),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: toArrayBuffer(salt),
      iterations,
    },
    key,
    HASH_BYTES * 8,
  );

  return new Uint8Array(bits);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = new Uint8Array(SALT_BYTES);
  crypto.getRandomValues(salt);
  const hash = await derive(password, salt, ITERATIONS);

  return [
    ALGORITHM,
    String(ITERATIONS),
    bytesToBase64Url(salt),
    bytesToBase64Url(hash),
  ].join('$');
}

export async function verifyPassword(
  password: string,
  encodedHash: string | null | undefined,
): Promise<boolean> {
  const parts = encodedHash?.split('$') ?? [];
  const iterations = Number(parts[1]);
  const validFormat =
    parts.length === 4 &&
    parts[0] === ALGORITHM &&
    Number.isInteger(iterations) &&
    iterations >= 100_000 &&
    iterations <= 2_000_000;

  if (!validFormat) {
    await derive(password, DUMMY_SALT, ITERATIONS);
    return false;
  }

  try {
    const salt = base64UrlToBytes(parts[2]);
    const expected = base64UrlToBytes(parts[3]);
    const actual = await derive(password, salt, iterations);

    return constantTimeEqual(actual, expected);
  } catch {
    await derive(password, DUMMY_SALT, ITERATIONS);
    return false;
  }
}
