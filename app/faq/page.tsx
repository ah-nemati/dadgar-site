import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { getFaqs } from '@/lib/content/faqs';

export const metadata: Metadata = {
  title: 'سوالات متداول',
  description: 'پاسخ به سوالات پرتکرار موکلین دفتر وکالت مجید سواری درباره مشاوره، هزینه، محرمانگی و روند پرونده.',
};

export default async function FAQPage() {
  const faqs = await getFaqs();

  return (
    <>
      <PageHero
        eyebrow="سوالات متداول"
        title="پاسخ به سوالات پرتکرار موکلین"
        description="اگر پاسخ سوال خود را در این فهرست پیدا نکردید، از طریق فرم تماس با ما در ارتباط باشید."
      />
      <section className="bg-parchment">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <Accordion type="single" collapsible defaultValue="item-0" className="flex flex-col gap-4">
            {faqs.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

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
