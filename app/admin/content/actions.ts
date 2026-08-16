'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/session';
import { setContentOverride } from '@/lib/content/overrides';
import { getPracticeAreas } from '@/lib/content/practice-areas';
import { getLawyers } from '@/lib/content/lawyers';
import { getFaqs } from '@/lib/content/faqs';
import { getServiceFees } from '@/lib/content/fees';
import type { FaqItem, Lawyer, PracticeArea } from '@/types/content';
import type { ServiceFeeItem } from '@/data/service-fees';
import { PRACTICE_AREA_ICONS, type PracticeAreaIconName } from '@/lib/icons';

function text(fd: FormData, name: string): string {
  return String(fd.get(name) ?? '').trim();
}

function lines(value: string): string[] {
  return value.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
}

function slug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

function done(path: string, kind: 'saved' | 'created' | 'deleted' = 'saved'): never {
  revalidatePath('/');
  revalidatePath('/practice-areas');
  revalidatePath('/lawyers');
  revalidatePath('/faq');
  revalidatePath('/fees');
  revalidatePath('/online-legal-consultation');
  revalidatePath('/lawyer-ahvaz');
  revalidatePath('/sitemap.xml');
  revalidatePath('/admin');
  revalidatePath('/admin/content');
  revalidatePath(path.split('?')[0]);
  redirect(`${path}${path.includes('?') ? '&' : '?'}${kind}=1`);
}

export async function updatePracticeAreaAction(originalSlug: string, formData: FormData) {
  const admin = await requireAdmin();
  const areas = await getPracticeAreas();
  const nextSlug = slug(text(formData, 'slug'));
  if (!nextSlug || !text(formData, 'title')) redirect('/admin/content?error=practice-area');
  if (nextSlug !== originalSlug && areas.some((a) => a.slug === nextSlug)) redirect('/admin/content?error=duplicate-area');

  const iconInput = text(formData, 'icon') as PracticeAreaIconName;
  const icon = iconInput in PRACTICE_AREA_ICONS ? iconInput : 'FileText';
  const next: PracticeArea = {
    slug: nextSlug,
    title: text(formData, 'title'),
    icon,
    shortDesc: text(formData, 'shortDesc'),
    longDesc: text(formData, 'longDesc'),
    topics: lines(text(formData, 'topics')),
    documents: lines(text(formData, 'documents')),
    preparation: lines(text(formData, 'preparation')),
    seoTitle: text(formData, 'seoTitle') || null,
    seoDescription: text(formData, 'seoDescription') || null,
  };
  await setContentOverride('practice_areas', areas.map((a) => a.slug === originalSlug ? next : a), admin.id);
  done('/admin/content');
}

export async function createPracticeAreaAction(formData: FormData) {
  const admin = await requireAdmin();
  const areas = await getPracticeAreas();
  const nextSlug = slug(text(formData, 'slug'));
  const title = text(formData, 'title');
  if (!nextSlug || !title) redirect('/admin/content?error=practice-area');
  if (areas.some((a) => a.slug === nextSlug)) redirect('/admin/content?error=duplicate-area');
  const iconInput = text(formData, 'icon') as PracticeAreaIconName;
  const next: PracticeArea = {
    slug: nextSlug,
    title,
    icon: iconInput in PRACTICE_AREA_ICONS ? iconInput : 'FileText',
    shortDesc: text(formData, 'shortDesc'),
    longDesc: text(formData, 'longDesc'),
    topics: lines(text(formData, 'topics')),
    documents: lines(text(formData, 'documents')),
    preparation: lines(text(formData, 'preparation')),
    seoTitle: text(formData, 'seoTitle') || null,
    seoDescription: text(formData, 'seoDescription') || null,
  };
  await setContentOverride('practice_areas', [...areas, next], admin.id);
  done('/admin/content', 'created');
}

export async function deletePracticeAreaAction(areaSlug: string) {
  const admin = await requireAdmin();
  const areas = await getPracticeAreas();
  await setContentOverride('practice_areas', areas.filter((a) => a.slug !== areaSlug), admin.id);
  const lawyers = await getLawyers();
  await setContentOverride('lawyers', lawyers.map((lawyer) => ({
    ...lawyer,
    specialties: lawyer.specialties.filter((specialty) => specialty !== areaSlug),
  })), admin.id);
  done('/admin/content', 'deleted');
}

export async function updateLawyerAction(originalSlug: string, formData: FormData) {
  const admin = await requireAdmin();
  const lawyers = await getLawyers();
  const nextSlug = slug(text(formData, 'slug'));
  const name = text(formData, 'name');
  if (!nextSlug || !name) redirect('/admin/content?error=lawyer');
  if (nextSlug !== originalSlug && lawyers.some((x) => x.slug === nextSlug)) redirect('/admin/content?error=duplicate-lawyer');
  const next: Lawyer = {
    slug: nextSlug,
    name,
    role: text(formData, 'role'),
    licenseNumber: text(formData, 'licenseNumber'),
    specialties: lines(text(formData, 'specialties')),
    experience: text(formData, 'experience'),
    initials: text(formData, 'initials'),
    bio: text(formData, 'bio'),
    education: lines(text(formData, 'education')),
    seoTitle: text(formData, 'seoTitle') || null,
    seoDescription: text(formData, 'seoDescription') || null,
  };
  await setContentOverride('lawyers', lawyers.map((x) => x.slug === originalSlug ? next : x), admin.id);
  done('/admin/content');
}

export async function createLawyerAction(formData: FormData) {
  const admin = await requireAdmin();
  const lawyers = await getLawyers();
  const nextSlug = slug(text(formData, 'slug'));
  const name = text(formData, 'name');
  if (!nextSlug || !name) redirect('/admin/content?error=lawyer');
  if (lawyers.some((x) => x.slug === nextSlug)) redirect('/admin/content?error=duplicate-lawyer');
  const next: Lawyer = {
    slug: nextSlug,
    name,
    role: text(formData, 'role'),
    licenseNumber: text(formData, 'licenseNumber'),
    specialties: lines(text(formData, 'specialties')),
    experience: text(formData, 'experience'),
    initials: text(formData, 'initials'),
    bio: text(formData, 'bio'),
    education: lines(text(formData, 'education')),
    seoTitle: text(formData, 'seoTitle') || null,
    seoDescription: text(formData, 'seoDescription') || null,
  };
  await setContentOverride('lawyers', [...lawyers, next], admin.id);
  done('/admin/content', 'created');
}

export async function deleteLawyerAction(lawyerSlug: string) {
  const admin = await requireAdmin();
  await setContentOverride('lawyers', (await getLawyers()).filter((x) => x.slug !== lawyerSlug), admin.id);
  done('/admin/content', 'deleted');
}

export async function updateFaqAction(index: number, formData: FormData) {
  const admin = await requireAdmin();
  const faqs = await getFaqs();
  if (!faqs[index]) redirect('/admin/content?error=faq');
  const q = text(formData, 'q');
  const a = text(formData, 'a');
  if (!q || !a) redirect('/admin/content?error=faq');
  const next = [...faqs];
  next[index] = { q, a };
  await setContentOverride('faqs', next, admin.id);
  done('/admin/content');
}

export async function createFaqAction(formData: FormData) {
  const admin = await requireAdmin();
  const item: FaqItem = { q: text(formData, 'q'), a: text(formData, 'a') };
  if (!item.q || !item.a) redirect('/admin/content?error=faq');
  await setContentOverride('faqs', [...await getFaqs(), item], admin.id);
  done('/admin/content', 'created');
}

export async function deleteFaqAction(index: number) {
  const admin = await requireAdmin();
  await setContentOverride('faqs', (await getFaqs()).filter((_, i) => i !== index), admin.id);
  done('/admin/content', 'deleted');
}

export async function updateFeeAction(index: number, formData: FormData) {
  const admin = await requireAdmin();
  const fees = await getServiceFees();
  if (!fees[index]) redirect('/admin/content?error=fee');
  const nextItem: ServiceFeeItem = {
    title: text(formData, 'title'),
    feeLabel: text(formData, 'feeLabel'),
    description: text(formData, 'description'),
    includes: lines(text(formData, 'includes')),
  };
  if (!nextItem.title || !nextItem.feeLabel) redirect('/admin/content?error=fee');
  const next = [...fees];
  next[index] = nextItem;
  await setContentOverride('service_fees', next, admin.id);
  done('/admin/content');
}

export async function createFeeAction(formData: FormData) {
  const admin = await requireAdmin();
  const item: ServiceFeeItem = {
    title: text(formData, 'title'),
    feeLabel: text(formData, 'feeLabel'),
    description: text(formData, 'description'),
    includes: lines(text(formData, 'includes')),
  };
  if (!item.title || !item.feeLabel) redirect('/admin/content?error=fee');
  await setContentOverride('service_fees', [...await getServiceFees(), item], admin.id);
  done('/admin/content', 'created');
}

export async function deleteFeeAction(index: number) {
  const admin = await requireAdmin();
  await setContentOverride('service_fees', (await getServiceFees()).filter((_, i) => i !== index), admin.id);
  done('/admin/content', 'deleted');
}
