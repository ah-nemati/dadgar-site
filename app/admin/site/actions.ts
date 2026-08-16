'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/session';
import { setContentOverride } from '@/lib/content/overrides';
import type { Firm } from '@/types/content';

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

function optionalCoordinate(formData: FormData, key: string, min: number, max: number): number | undefined {
  const raw = value(formData, key);
  if (!raw) return undefined;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) throw new Error('INVALID_COORDINATE');
  return parsed;
}

function validOptionalUrl(raw?: string): boolean {
  if (!raw) return true;
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export async function saveFirmAction(formData: FormData) {
  const admin = await requireAdmin();
  let latitude: number | undefined;
  let longitude: number | undefined;
  try {
    latitude = optionalCoordinate(formData, 'latitude', -90, 90);
    longitude = optionalCoordinate(formData, 'longitude', -180, 180);
  } catch {
    redirect('/admin/site?error=coordinates');
  }

  const firm: Firm = {
    name: value(formData, 'name'),
    shortName: value(formData, 'shortName'),
    tagline: value(formData, 'tagline'),
    description: value(formData, 'description'),
    phone: value(formData, 'phone'),
    phoneHref: value(formData, 'phoneHref'),
    phone2: value(formData, 'phone2') || undefined,
    phone2Href: value(formData, 'phone2Href') || undefined,
    email: value(formData, 'email'),
    address: value(formData, 'address'),
    hours: value(formData, 'hours'),
    established: value(formData, 'established'),
    url: value(formData, 'url'),
    city: value(formData, 'city') || undefined,
    region: value(formData, 'region') || undefined,
    countryCode: value(formData, 'countryCode') || 'IR',
    postalCode: value(formData, 'postalCode') || undefined,
    instagramUrl: value(formData, 'instagramUrl') || undefined,
    googleMapsUrl: value(formData, 'googleMapsUrl') || undefined,
    googleMapsEmbedUrl: value(formData, 'googleMapsEmbedUrl') || undefined,
    latitude,
    longitude,
  };

  if (!firm.name || !firm.shortName || !firm.phone || !firm.phoneHref || !firm.url || !firm.address) {
    redirect('/admin/site?error=required');
  }
  try { new URL(firm.url); } catch { redirect('/admin/site?error=url'); }
  if (!validOptionalUrl(firm.instagramUrl) || !validOptionalUrl(firm.googleMapsUrl) || !validOptionalUrl(firm.googleMapsEmbedUrl)) {
    redirect('/admin/site?error=mapUrl');
  }

  await setContentOverride('firm', firm, admin.id);
  for (const path of ['/', '/about', '/contact', '/fees', '/lawyer-ahvaz', '/online-legal-consultation', '/sitemap.xml', '/robots.txt', '/admin/site']) {
    revalidatePath(path);
  }
  redirect('/admin/site?saved=1');
}
