import { FIRM } from '@/data/firm';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/client-login'],
    },
    sitemap: `${FIRM.url}/sitemap.xml`,
  };
}
