import { PRACTICE_AREAS } from '@/data/practice-areas';
import type { PracticeArea, PracticeAreaSlug } from '@/types/content';
import { getContentOverride } from '@/lib/content/overrides';

export async function getPracticeAreas(): Promise<PracticeArea[]> {
  return getContentOverride<PracticeArea[]>('practice_areas', PRACTICE_AREAS);
}

export async function getPracticeAreaBySlug(slug: string): Promise<PracticeArea | undefined> {
  return (await getPracticeAreas()).find((area) => area.slug === slug);
}

export async function getPracticeAreaSlugs(): Promise<PracticeAreaSlug[]> {
  return (await getPracticeAreas()).map((area) => area.slug);
}
