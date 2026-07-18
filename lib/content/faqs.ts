import { FAQS } from '@/data/faqs';
import type { FaqItem } from '@/types/content';

/**
 * Returns every FAQ item. Reads from a static array today; swap the body for a
 * database/CMS call in Phase 2 — callers already `await` this.
 */
export async function getFaqs(): Promise<FaqItem[]> {
  return FAQS;
}
