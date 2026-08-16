import 'server-only';

import { unstable_cache, updateTag } from 'next/cache';
import { db } from '@/lib/db';
import { recordAudit } from '@/lib/audit';

interface OverrideRow {
  data: unknown;
}

const CONTENT_CACHE_TAG = 'content-overrides';
const CONTENT_DB_BACKOFF_MS = 15_000;
let contentDbBackoffUntil = 0;

const readContentOverride = unstable_cache(
  async (key: string): Promise<unknown | null> => {
    const [row] = await db<OverrideRow[]>`
      select data from content_overrides where key = ${key} limit 1
    `;
    return row?.data ?? null;
  },
  ['content-overrides-v2'],
  {
    // Cloudflare/OpenNext is intentionally configured without a revalidation
    // queue. Keep this cache indefinitely and invalidate it only after CMS
    // mutations via updateTag()/revalidatePath(). A numeric TTL would trigger
    // time-based ISR/data-cache revalidation and require a real OpenNext queue.
    revalidate: false,
    tags: [CONTENT_CACHE_TAG],
  },
);

export async function getContentOverride<T>(key: string, fallback: T): Promise<T> {
  // If the optional CMS database is temporarily unreachable, do not make every
  // public navigation wait for the connection timeout. Static defaults keep
  // public pages usable while the server retries after a short backoff.
  if (Date.now() < contentDbBackoffUntil) return fallback;

  try {
    const data = await readContentOverride(key);
    return data === null ? fallback : (data as T);
  } catch {
    contentDbBackoffUntil = Date.now() + CONTENT_DB_BACKOFF_MS;
    return fallback;
  }
}

export async function setContentOverride<T>(key: string, data: T, actorId: string): Promise<void> {
  await db`
    insert into content_overrides (key, data, updated_by)
    values (${key}, ${JSON.stringify(data)}::jsonb, ${actorId})
    on conflict (key) do update
      set data = excluded.data,
          updated_by = excluded.updated_by,
          updated_at = now()
  `;

  // All CMS-backed public data is intentionally grouped under one tag so an
  // admin edit becomes visible on the very next request without waiting for TTL.
  contentDbBackoffUntil = 0;
  updateTag(CONTENT_CACHE_TAG);
  await recordAudit(actorId, 'content.update', 'content_override', key);
}
