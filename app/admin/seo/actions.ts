'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/session';
import { setContentOverride } from '@/lib/content/overrides';
import type { SeoSettings } from '@/lib/content/seo-settings';

function text(fd: FormData, key: string) { return String(fd.get(key) ?? '').trim(); }
function lines(value: string) { return value.split(/\r?\n|,/).map((x) => x.trim()).filter(Boolean); }

export async function saveSeoSettingsAction(formData: FormData) {
  const admin = await requireAdmin();
  const settings: SeoSettings = {
    defaultTitle: text(formData, 'defaultTitle'),
    titleTemplate: text(formData, 'titleTemplate') || '%s',
    defaultDescription: text(formData, 'defaultDescription'),
    keywords: lines(text(formData, 'keywords')),
    googleSiteVerification: text(formData, 'googleSiteVerification'),
    ogImage: text(formData, 'ogImage') || '/opengraph-image',
  };
  if (!settings.defaultTitle || !settings.defaultDescription) redirect('/admin/seo?error=required');
  await setContentOverride('seo_settings', settings, admin.id);
  revalidatePath('/', 'layout');
  revalidatePath('/admin/seo');
  redirect('/admin/seo?saved=1');
}
