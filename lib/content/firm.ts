import { FIRM } from '@/data/firm';
import type { Firm } from '@/types/content';

/**
 * Returns the firm profile.
 *
 * Reads from a static object today. When Phase 2 adds the admin panel, swap the
 * body of this function for a database/CMS call — every page already `await`s it,
 * so no call site needs to change.
 */
export async function getFirm(): Promise<Firm> {
  return FIRM;
}
