import Link from "@/components/NoPrefetchLink";
import type { Metadata } from "next";
import { ArrowLeft, MessageCircleQuestion } from "lucide-react";
import PageHero from "@/components/PageHero";
import Eyebrow from "@/components/Eyebrow";
import { Button } from "@/components/ui/button";
import { getFaqs } from "@/lib/content/faqs";

export const metadata: Metadata = {
  alternates: { canonical: "/faq" },
  title: "سوالات متداول",
  description:
    "پاسخ به سوالات پرتکرار موکلین دفتر وکالت   درباره مشاوره، هزینه، محرمانگی و روند پرونده.",
};

export default async function FAQPage() {
  const faqs = await getFaqs();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <PageHero
        eyebrow="سوالات متداول"
        title="پاسخ‌های کوتاه برای پرسش‌های رایج"
        description="درباره نحوه مشاوره، هزینه، محرمانگی و روند پیگیری اطلاعات اولیه را اینجا ببینید."
      />
      <section className="editorial-section">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-8">
            <Eyebrow>راهنمای سریع</Eyebrow>
            <h2 className="text-2xl font-extrabold text-foreground md:text-3xl">
              پیش از تماس، شاید پاسخ همین‌جا باشد
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((item, index) => (
              <details
                key={item.q}
                className="group legal-card overflow-hidden"
              >
                <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-5 text-right outline-none focus-visible:ring-2 focus-visible:ring-ring/40 md:px-6">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-extrabold text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-extrabold text-foreground">
                    {item.q}
                  </span>
                  <span
                    className="text-2xl font-normal text-primary transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <div className="border-t border-border px-5 py-5 md:px-6">
                  <p className="text-sm leading-8 text-muted-foreground">
                    {item.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
          <div className="cta-panel mt-10 flex flex-col gap-5 p-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <MessageCircleQuestion
                className="mt-1 shrink-0 text-gold-light"
                size={21}
              />
              <div>
                <h2 className="font-extrabold text-parchment">
                  پاسخ خود را پیدا نکردید؟
                </h2>
                <p className="mt-1 text-sm text-parchment/55">
                  شرح کوتاهی از موضوع برای دفتر بفرستید.
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href="/contact">
                ارسال درخواست <ArrowLeft size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
