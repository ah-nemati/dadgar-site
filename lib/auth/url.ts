import { headers } from 'next/headers';

function validOrigin(value: string | undefined): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function safeInternalPath(value: string | null | undefined, fallback = '/'): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return fallback;
  return value;
}

export async function getSiteOrigin(): Promise<string> {
  const configured = validOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  if (configured) return configured;

  const headerStore = await headers();
  const forwardedHost = headerStore.get('x-forwarded-host');
  const host = forwardedHost ?? headerStore.get('host');
  const forwardedProto = headerStore.get('x-forwarded-proto');
  const protocol = forwardedProto ?? (host?.includes('localhost') ? 'http' : 'https');
  const inferred = validOrigin(host ? `${protocol}://${host}` : undefined);

  return inferred ?? 'http://localhost:3000';
}

export async function getAuthRedirectUrl(next: string): Promise<string> {
  const origin = await getSiteOrigin();
  const callback = new URL('/auth/callback', origin);
  callback.searchParams.set('next', safeInternalPath(next, '/portal'));
  return callback.toString();
}
