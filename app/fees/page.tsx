import type { Metadata } from 'next';
import Link from '@/components/NoPrefetchLink';
import { ArrowLeft, CheckCircle2, Info, Phone } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import { FIRM } from '@/data/firm';
import { SERVICE_FEES } from '@/data/service-fees';
import { breadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'تعرفه خدمات حقوقی و مشاوره',
  description:
    'نحوه تعیین هزینه مشاوره آنلاین، مشاوره حضوری در اهواز، تنظیم اوراق قضایی، قرارداد و قبول وکالت در دفتر وکالت مجید سواری.',
  alternates: { canonical: '/fees' },
  keywords: [
    'تعرفه مشاوره حقوقی',
    'هزینه مشاوره حقوقی آنلاین',
    'هزینه وکیل در اهواز',
    'حق الوکاله وکیل',
  ],
};

export default function FeesPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'خانه', path: '/' },
    { name: 'تعرفه خدمات حقوقی', path: '/fees' },
  ]);
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'تعرفه خدمات حقوقی دفتر وکالت مجید سواری',
    description: metadata.description,
    url: new URL('/fees', FIRM.url).toString(),
    provider: {
      '@type': 'LegalService',
      name: FIRM.name,
      telephone: FIRM.phoneHref.replace('tel:', ''),
      url: FIRM.url,
    },
    areaServed: [
      { '@type': 'Country', name: 'ایران' },
      { '@type': 'City', name: 'اهواز' },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumb).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceJsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <PageHero
        eyebrow="تعرفه خدمات"
        title="هزینه خدمات حقوقی چگونه تعیین می‌شود؟"
        description="مبنای تعیین هزینه هر خدمت، حدود کار و اطلاعاتی است که پیش از شروع به‌صورت شفاف به شما اعلام می‌شود."
      />

      <section className="bg-parchment">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10 flex items-start gap-3 rounded-sm border border-gold/35 bg-gold/5 p-5">
            <Info className="mt-1 shrink-0 text-gold" size={20} aria-hidden="true" />
            <div>
              <h2 className="font-bold text-foreground">رزرو و پرداخت اینترنتی فعلاً فعال نیست</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                برای دریافت مبلغ دقیق، موضوع و حجم مدارک باید بررسی شود. مبلغ نهایی و شیوه پرداخت پیش از شروع خدمت به شما اعلام خواهد شد.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {SERVICE_FEES.map((item) => (
              <article key={item.title} className="flex flex-col rounded-sm border border-border bg-card p-6">
                <h2 className="text-lg font-bold text-foreground">{item.title}</h2>
                <p className="mt-3 inline-flex w-fit rounded-sm bg-ink px-3 py-1.5 text-sm font-semibold text-gold-light">
                  {item.feeLabel}
                </p>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.description}</p>
                <ul className="mt-5 space-y-3 border-t border-border pt-5">
                  {item.includes.map((entry) => (
                    <li key={entry} className="flex items-start gap-2 text-sm leading-6 text-foreground">
                      <CheckCircle2 className="mt-1 shrink-0 text-teal" size={16} aria-hidden="true" />
                      <span>{entry}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-teal">
        <div className="mx-auto max-w-4xl px-6 py-14 text-center">
          <h2 className="text-2xl font-bold text-parchment">برای استعلام هزینه، موضوع را کوتاه و دقیق اعلام کنید</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-parchment/80">
            اعلام نوع مسئله، مرحله فعلی پرونده و تعداد تقریبی مدارک کمک می‌کند هزینه با دقت بیشتری مشخص شود.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link href={FIRM.phoneHref}>
                <Phone size={18} aria-hidden="true" />
                تماس با دفتر
              </Link>
            </Button>
            <Button size="lg" variant="ghostLight" asChild>
              <Link href="/contact">
                ارسال درخواست بررسی
                <ArrowLeft size={18} aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
