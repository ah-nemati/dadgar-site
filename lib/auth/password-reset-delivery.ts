import 'server-only';

export interface PasswordResetDelivery {
  email: string;
  name: string;
  resetUrl: string;
  expiresInMinutes: number;
}

export async function deliverPasswordReset(
  message: PasswordResetDelivery,
): Promise<boolean> {
  const endpoint = process.env.PASSWORD_RESET_WEBHOOK_URL?.trim();
  const secret = process.env.PASSWORD_RESET_WEBHOOK_SECRET?.trim();

  if (!endpoint || !secret) return false;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({
        type: 'password-reset',
        ...message,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    return response.ok;
  } catch {
    return false;
  }
}
