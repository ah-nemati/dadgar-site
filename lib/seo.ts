import { FIRM } from '@/data/firm';

export interface BreadcrumbSegment {
  name: string;
  path: string;
}

/** Builds schema.org BreadcrumbList JSON-LD from a list of {name, path} segments. */
export function breadcrumbJsonLd(segments: BreadcrumbSegment[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: segments.map((seg, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: seg.name,
      item: `${FIRM.url}${seg.path}`,
    })),
  };
}
