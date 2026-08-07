import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import { getFaqs } from '@/lib/content/faqs';

export const metadata: Metadata = {
  alternates: { canonical: '/faq' },
  title: 'سوالات متداول',
  description: 'پاسخ به سوالات پرتکرار موکلین دفتر وکالت مجید سواری درباره مشاوره، هزینه، محرمانگی و روند پرونده.',
};

export default async function FAQPage() {
  const faqs = await getFaqs();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <PageHero
        eyebrow="سوالات متداول"
        title="پاسخ به سوالات پرتکرار موکلین"
        description="اگر پاسخ سوال خود را در این فهرست پیدا نکردید، از طریق فرم تماس با ما در ارتباط باشید."
      />
      <section className="bg-parchment">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="flex flex-col gap-4">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="group overflow-hidden rounded-sm border border-border bg-card"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-right font-bold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
                  {item.q}
                  <span className="text-xl font-normal text-primary group-open:rotate-45 transition-transform" aria-hidden="true">+</span>
                </summary>
                <p className="px-6 pb-5 text-sm leading-7 text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-12 bg-ink rounded-sm p-8 text-center">
            <p className="text-parchment/85 mb-5">پاسخ سوال خود را پیدا نکردید؟</p>
            <Button asChild>
              <Link href="/contact">
                تماس با ما <ArrowLeft size={16} aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
