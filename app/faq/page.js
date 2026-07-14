import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PageHero from '@/components/PageHero';
import FaqAccordion from '@/components/FaqAccordion';
import { FAQS } from '@/data/faqs';

export const metadata = {
  title: 'سوالات متداول',
  description: 'پاسخ به سوالات پرتکرار موکلین موسسه حقوقی دادگر درباره مشاوره، هزینه، محرمانگی و روند پرونده.',
};

export default function FAQPage() {
  return (
    <>
      <PageHero
        eyebrow="سوالات متداول"
        title="پاسخ به سوالات پرتکرار موکلین"
        description="اگر پاسخ سوال خود را در این فهرست پیدا نکردید، از طریق فرم تماس با ما در ارتباط باشید."
      />
      <section className="bg-parchment">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <FaqAccordion items={FAQS} />

          <div className="mt-12 bg-ink rounded-sm p-8 text-center">
            <p className="text-parchment/85 mb-5">پاسخ سوال خود را پیدا نکردید؟</p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-ink font-semibold px-6 py-3 rounded-sm text-sm transition-colors">
              تماس با ما <ArrowLeft size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
