import 'server-only';

interface ManagementToken {
  access_token: string;
  expires_in: number;
}

interface Auth0UserResponse {
  user_id: string;
  email?: string;
  name?: string;
}

let cachedToken: { value: string; expiresAt: number } | null = null;

function config() {
  const domain = process.env.AUTH0_DOMAIN?.trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');
  const clientId = process.env.AUTH0_M2M_CLIENT_ID?.trim();
  const clientSecret = process.env.AUTH0_M2M_CLIENT_SECRET?.trim();
  const connection =
    process.env.AUTH0_DB_CONNECTION?.trim() ||
    'Username-Password-Authentication';

  if (!domain || !clientId || !clientSecret) {
    throw new Error('Auth0 Management API credentials are not configured.');
  }

  return { domain, clientId, clientSecret, connection };
}

async function fetchWithTimeout(
  input: string | URL,
  init: RequestInit,
  timeoutMs = 10_000,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: init.signal ?? controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function managementToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  const { domain, clientId, clientSecret } = config();
  const response = await fetchWithTimeout(
    `https://${domain}/oauth/token`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        audience: `https://${domain}/api/v2/`,
      }),
      cache: 'no-store',
    },
    8_000,
  );

  if (!response.ok) {
    throw new Error(`Auth0 token request failed (${response.status}).`);
  }

  const data = (await response.json()) as ManagementToken;
  if (!data.access_token || !Number.isFinite(data.expires_in)) {
    throw new Error('Auth0 token response is invalid.');
  }

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + Math.max(60, data.expires_in - 60) * 1000,
  };

  return data.access_token;
}

async function managementFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const { domain } = config();
  const token = await managementToken();
  const headers = new Headers(init.headers);

  headers.set('authorization', `Bearer ${token}`);
  if (init.body) headers.set('content-type', 'application/json');

  const response = await fetchWithTimeout(
    `https://${domain}/api/v2${path}`,
    {
      ...init,
      headers,
      cache: 'no-store',
    },
    10_000,
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Auth0 Management API failed (${response.status}): ${body}`);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export async function createAuth0User(input: {
  email: string;
  password: string;
  fullName: string;
  phone?: string | null;
  role?: 'admin' | 'client';
}): Promise<Auth0UserResponse> {
  const { connection } = config();

  return managementFetch<Auth0UserResponse>('/users', {
    method: 'POST',
    body: JSON.stringify({
      connection,
      email: input.email,
      password: input.password,
      name: input.fullName,
      email_verified: false,
      verify_email: false,
      user_metadata: { phone: input.phone ?? null },
      app_metadata: { role: input.role ?? 'client' },
    }),
  });
}

export async function updateAuth0Password(
  userId: string,
  password: string,
): Promise<void> {
  const { connection } = config();

  await managementFetch(`/users/${encodeURIComponent(userId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ password, connection }),
  });
}

export async function updateAuth0Profile(
  userId: string,
  input: { fullName: string; phone: string },
): Promise<void> {
  await managementFetch(`/users/${encodeURIComponent(userId)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      name: input.fullName,
      user_metadata: { phone: input.phone },
    }),
  });
}

export async function deleteAuth0User(userId: string): Promise<void> {
  await managementFetch(`/users/${encodeURIComponent(userId)}`, {
    method: 'DELETE',
  });
}

export async function requestAuth0PasswordReset(email: string): Promise<void> {
  const domain = process.env.AUTH0_DOMAIN?.trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');
  const clientId = process.env.AUTH0_CLIENT_ID?.trim();
  const connection =
    process.env.AUTH0_DB_CONNECTION?.trim() ||
    'Username-Password-Authentication';

  if (!domain || !clientId) {
    throw new Error('Auth0 application settings are not configured.');
  }

  const response = await fetchWithTimeout(
    `https://${domain}/dbconnections/change_password`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, email, connection }),
      cache: 'no-store',
    },
    8_000,
  );

  if (!response.ok) {
    throw new Error(`Auth0 reset request failed (${response.status}).`);
  }
}
