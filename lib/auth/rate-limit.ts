import 'server-only';

import { headers } from 'next/headers';
import { sha256Hex } from '@/lib/auth/crypto';
import { db } from '@/lib/db';

interface RateLimitRow {
  attempts: number;
  blockedUntil: Date | null;
}

export async function requestRateLimitKey(identifier: string): Promise<string> {
  const requestHeaders = await headers();
  const ip =
    requestHeaders.get('cf-connecting-ip') ||
    requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';

  return sha256Hex(`${ip}\n${identifier}`);
}

export async function consumeRateLimit(input: {
  key: string;
  action: string;
  limit: number;
  windowSeconds: number;
  blockSeconds: number;
}): Promise<boolean> {
  const [row] = await db<RateLimitRow[]>`
    insert into auth_rate_limits (
      identifier_hash, action, attempts, window_started_at, blocked_until
    ) values (${input.key}, ${input.action}, 1, now(), null)
    on conflict (identifier_hash, action) do update
    set attempts = case
          when auth_rate_limits.window_started_at <= now() - (${input.windowSeconds} * interval '1 second') then 1
          else auth_rate_limits.attempts + 1
        end,
        window_started_at = case
          when auth_rate_limits.window_started_at <= now() - (${input.windowSeconds} * interval '1 second') then now()
          else auth_rate_limits.window_started_at
        end,
        blocked_until = case
          when auth_rate_limits.window_started_at <= now() - (${input.windowSeconds} * interval '1 second') then null
          when auth_rate_limits.blocked_until > now() then now() + (${input.blockSeconds} * interval '1 second')
          when auth_rate_limits.attempts + 1 >= ${input.limit} then now() + (${input.blockSeconds} * interval '1 second')
          else auth_rate_limits.blocked_until
        end,
        updated_at = now()
    returning attempts, blocked_until
  `;

  return Boolean(row.blockedUntil && row.blockedUntil.getTime() > Date.now());
}

export async function clearRateLimit(key: string, action: string): Promise<void> {
  await db`
    delete from auth_rate_limits
    where identifier_hash = ${key} and action = ${action}
  `;
}
