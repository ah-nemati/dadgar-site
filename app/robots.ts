import type { MetadataRoute } from 'next';
import { getFirm } from '@/lib/content/firm';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const firm = await getFirm();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/client-login'],
    },
    sitemap: `${firm.url}/sitemap.xml`,
  };
}
