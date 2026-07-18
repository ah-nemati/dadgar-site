import { PRACTICE_AREAS } from '@/data/practice-areas';
import type { PracticeArea, PracticeAreaSlug } from '@/types/content';

/**
 * Returns every practice area. Reads from a static array today; swap the body for
 * a database/CMS call in Phase 2 — callers already `await` this.
 */
export async function getPracticeAreas(): Promise<PracticeArea[]> {
  return PRACTICE_AREAS;
}

export async function getPracticeAreaBySlug(slug: string): Promise<PracticeArea | undefined> {
  return PRACTICE_AREAS.find((area) => area.slug === slug);
}

export async function getPracticeAreaSlugs(): Promise<PracticeAreaSlug[]> {
  return PRACTICE_AREAS.map((area) => area.slug);
}
