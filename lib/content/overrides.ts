import 'server-only';

import { cache } from 'react';
import { db } from '@/lib/db';
import { recordAudit } from '@/lib/audit';

interface OverrideRow {
  data: unknown;
}

const CONTENT_DB_BACKOFF_MS = 15_000;
let contentDbBackoffUntil = 0;

/**
 * Request-scoped deduplication only.
 *
 * Do not use next/cache here while OpenNext is configured with the read-only
 * Workers Static Assets incremental cache. `unstable_cache` needs to write a
 * `fetch` cache entry on a miss, which is exactly what the read-only adapter
 * rejects in production. React `cache()` only deduplicates repeated reads
 * inside the current server request/render and does not require any OpenNext
 * incremental-cache write, queue, R2 or tag cache.
 */
const readContentOverride = cache(async (key: string): Promise<unknown | null> => {
  const [row] = await db<OverrideRow[]>`
    select data from content_overrides where key = ${key} limit 1
  `;
  return row?.data ?? null;
});

export async function getContentOverride<T>(key: string, fallback: T): Promise<T> {
  if (Date.now() < contentDbBackoffUntil) return fallback;

  try {
    const data = await readContentOverride(key);
    return data === null ? fallback : (data as T);
  } catch (error) {
    contentDbBackoffUntil = Date.now() + CONTENT_DB_BACKOFF_MS;
    console.error(
      `CMS override read failed for key=${key}. Falling back to bundled content.`,
      error instanceof Error ? error.message : 'Unknown database error',
    );
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

  // No persistent Next.js data cache is used here, so there is no tag to
  // invalidate. Subsequent requests read the current database value directly.
  contentDbBackoffUntil = 0;
  await recordAudit(actorId, 'content.update', 'content_override', key);
}
