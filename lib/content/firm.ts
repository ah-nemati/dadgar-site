import { FIRM } from '@/data/firm';
import type { Firm } from '@/types/content';
import { getContentOverride } from '@/lib/content/overrides';

export async function getFirm(): Promise<Firm> {
  return getContentOverride<Firm>('firm', FIRM);
}
