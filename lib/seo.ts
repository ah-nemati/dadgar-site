import { FIRM } from '@/data/firm';

export interface BreadcrumbSegment {
  name: string;
  path: string;
}

/** Builds schema.org BreadcrumbList JSON-LD with normalized absolute URLs. */
export function breadcrumbJsonLd(segments: BreadcrumbSegment[], baseUrl = FIRM.url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: segments.map((seg, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: seg.name,
      item: new URL(seg.path || '/', baseUrl).toString(),
    })),
  };
}
