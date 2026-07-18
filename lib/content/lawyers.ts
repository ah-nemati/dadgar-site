import { LAWYERS } from '@/data/lawyers';
import type { Lawyer, PracticeAreaSlug } from '@/types/content';

/**
 * Returns every lawyer. Reads from a static array today; swap the body for a
 * database/CMS call in Phase 2 — callers already `await` this.
 */
export async function getLawyers(): Promise<Lawyer[]> {
  return LAWYERS;
}

export async function getLawyerBySlug(slug: string): Promise<Lawyer | undefined> {
  return LAWYERS.find((lawyer) => lawyer.slug === slug);
}

export async function getLawyersByPracticeArea(slug: PracticeAreaSlug): Promise<Lawyer[]> {
  return LAWYERS.filter((lawyer) => lawyer.specialties.includes(slug));
}
