import { FAQS } from '@/data/faqs';
import type { FaqItem } from '@/types/content';
import { getContentOverride } from '@/lib/content/overrides';

export async function getFaqs(): Promise<FaqItem[]> {
  return getContentOverride<FaqItem[]>('faqs', FAQS);
}
