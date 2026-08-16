import { LAWYERS } from '@/data/lawyers';
import type { Lawyer, PracticeAreaSlug } from '@/types/content';
import { getContentOverride } from '@/lib/content/overrides';

export async function getLawyers(): Promise<Lawyer[]> {
  return getContentOverride<Lawyer[]>('lawyers', LAWYERS);
}

export async function getLawyerBySlug(slug: string): Promise<Lawyer | undefined> {
  return (await getLawyers()).find((lawyer) => lawyer.slug === slug);
}

export async function getLawyersByPracticeArea(slug: PracticeAreaSlug): Promise<Lawyer[]> {
  return (await getLawyers()).filter((lawyer) => lawyer.specialties.includes(slug));
}
