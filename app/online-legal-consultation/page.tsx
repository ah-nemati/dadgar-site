import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  FileSearch,
  MapPinned,
  Phone,
  Scale,
} from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import { FIRM } from '@/data/firm';
import { PRACTICE_AREAS } from '@/data/practice-areas';
import { PRACTICE_AREA_ICONS } from '@/lib/icons';
import { breadcrumbJsonLd } from '@/lib/seo';
import { toPersianDigits } from '@/lib/format';

export const metadata: Metadata = {
  title: 'مشاوره حقوقی آنلاین سراسر ایران',
  description:
    'دریافت مشاوره حقوقی آنلاین از مجید سواری، وکیل پایه یک دادگستری، برای متقاضیان سراسر ایران در حوزه‌های حقوقی و کیفری.',
  alternates: { canonical: '/online-legal-consultation' },
  keywords: [
    'مشاوره حقوقی آنلاین',
    'وکیل آنلاین سراسر ایران',
    'مشاوره با وکیل پایه یک',
    'مشاوره حقوقی تلفنی',
  ],
};

const steps = [
  {
    icon: FileSearch,
    title: 'اعلام موضوع و مدارک اصلی',
    text: 'شرح کوتاه مسئله، مرحله فعلی و مدارک مؤثر را از طریق فرم تماس یا تماس تلفنی اعلام می‌کنید.',
  },
  {
    icon: Scale,
    title: 'تعیین حدود بررسی و هزینه',
    text: 'پس از بررسی اولیه مشخص می‌شود جلسه برای چه موضوعاتی و با چه مدت و هزینه‌ای انجام خواهد شد.',
  },
  {
    icon: Phone,
    title: 'انجام جلسه غیرحضوری',
    text: 'جلسه در زمان هماهنگ‌شده به‌صورت تلفنی یا بستر آنلاین مورد توافق انجام می‌شود؛ چت عمومی در سایت وجود ندارد.',
  },
];

export default function OnlineLegalConsultationPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'خانه', path: '/' },
    { name: 'مشاوره حقوقی آنلاین', path: '/online-legal-consultation' },
  ]);
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'مشاوره حقوقی آنلاین سراسر ایران',
    description: metadata.description,
    url: new URL('/online-legal-consultation', FIRM.url).toString(),
    serviceType: 'مشاوره حقوقی آنلاین',
    provider: {
      '@type': 'LegalService',
      name: FIRM.name,
      url: FIRM.url,
      telephone: FIRM.phoneHref.replace('tel:', ''),
    },
    areaServed: { '@type': 'Country', name: 'ایران' },
    availableChannel: {
      '@type': 'ServiceChannel',
      servicePhone: {
        '@type': 'ContactPoint',
        telephone: FIRM.phoneHref.replace('tel:', ''),
        contactType: 'legal consultation',
        areaServed: 'IR',
        availableLanguage: 'fa',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd).replace(/</g, '\\u003c') }}
      />

      <PageHero
        eyebrow="خدمات غیرحضوری"
        title="مشاوره حقوقی آنلاین برای سراسر ایران"
        description="بدون نیاز به مراجعه به اهواز، موضوع و مدارک اصلی پرونده بررسی می‌شود و جلسه حقوقی در زمان هماهنگ‌شده انجام خواهد شد."
      />

      <section className="bg-parchment">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <article key={title} className="rounded-sm border border-border bg-card p-6">
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-sm bg-ink text-gold">
                    <Icon size={21} aria-hidden="true" />
                  </span>
                  <span className="font-display text-2xl text-gold">
                    {toPersianDigits(index + 1).padStart(2, '۰')}
                  </span>
                </div>
                <h2 className="font-bold text-foreground">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <div className="flex size-12 items-center justify-center rounded-sm bg-teal text-parchment">
                <MapPinned size={23} aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-2xl font-bold text-foreground">محدوده خدمت، سراسر ایران است</h2>
              <p className="mt-4 text-sm leading-8 text-muted-foreground">
                محل سکونت شما مانع دریافت بررسی اولیه و مشاوره غیرحضوری نیست. اگر پرونده به حضور در مرجع قضایی یا اقدام محلی نیاز داشته باشد، امکان و حدود پیگیری پس از مطالعه مدارک جداگانه اعلام می‌شود.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/contact">
                    ارسال درخواست بررسی
                    <ArrowLeft size={17} aria-hidden="true" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/fees">مشاهده تعرفه‌ها</Link>
                </Button>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground">حوزه‌های قابل بررسی</h2>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {PRACTICE_AREAS.map((area) => {
                  const AreaIcon = PRACTICE_AREA_ICONS[area.icon];
                  return (
                    <Link
                      key={area.slug}
                      href={`/practice-areas/${area.slug}`}
                      className="flex items-center gap-3 rounded-sm border border-border bg-card p-4 text-sm font-semibold text-foreground transition-colors hover:border-gold"
                    >
                      <AreaIcon className="shrink-0 text-teal" size={18} aria-hidden="true" />
                      <span>{area.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-14 flex items-start gap-3 rounded-sm border border-border bg-muted/40 p-5 text-sm leading-7 text-muted-foreground">
            <CheckCircle2 className="mt-1 shrink-0 text-teal" size={18} aria-hidden="true" />
            <p>
              مشاوره بر پایه اطلاعات و مدارکی انجام می‌شود که ارائه می‌کنید. نتیجه هیچ پرونده‌ای قابل تضمین نیست و برای قبول وکالت، بررسی مستقل و توافق کتبی لازم است.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
