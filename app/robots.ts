import type { MetadataRoute } from 'next';
import { getFirm } from '@/lib/content/firm';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const firm = await getFirm();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/account', '/admin', '/portal', '/api/', '/login', '/signup', '/forgot-password', '/reset-password', '/auth/', '/client-login'],
    },
    sitemap: new URL('/sitemap.xml', firm.url).toString(),
    host: new URL(firm.url).origin,
  };
}
