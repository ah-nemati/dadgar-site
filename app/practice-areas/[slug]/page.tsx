import Link from '@/components/NoPrefetchLink';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowRight, ArrowLeft, CheckCircle2, FileStack, ListChecks } from 'lucide-react';
import Avatar from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import { PRACTICE_AREA_ICONS } from '@/lib/icons';
import { breadcrumbJsonLd } from '@/lib/seo';
import { getPracticeAreas, getPracticeAreaBySlug } from '@/lib/content/practice-areas';
import { getLawyersByPracticeArea } from '@/lib/content/lawyers';
import { getFirm } from '@/lib/content/firm';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const practiceAreas = await getPracticeAreas();
  return practiceAreas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const area = await getPracticeAreaBySlug(slug);
  if (!area) return {};
  return {
    title: `${area.title}؛ مشاوره آنلاین و حضوری اهواز`,
    description: `${area.shortDesc} مشاوره غیرحضوری برای سراسر ایران و خدمات حضوری در اهواز.`,
    alternates: { canonical: `/practice-areas/${area.slug}` },
    keywords: [area.title, `${area.title} اهواز`, `مشاوره آنلاین ${area.title}`, `وکیل ${area.title}`, `وکیل ${area.title} اهواز`, 'مجید سواری'],
  };
}

export default async function PracticeAreaDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const area = await getPracticeAreaBySlug(slug);
  if (!area) notFound();

  const [relatedLawyers, firm] = await Promise.all([
    getLawyersByPracticeArea(area.slug),
    getFirm(),
  ]);
  const AreaIcon = PRACTICE_AREA_ICONS[area.icon];
  const breadcrumb = breadcrumbJsonLd([
    { name: 'خانه', path: '/' },
    { name: 'حوزه‌های تخصصی', path: '/practice-areas' },
    { name: area.title, path: `/practice-areas/${area.slug}` },
  ]);
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: `${area.title}؛ آنلاین سراسر ایران و حضوری اهواز`,
    description: area.longDesc,
    url: new URL(`/practice-areas/${area.slug}`, firm.url).toString(),
    provider: {
      '@type': 'LegalService',
      name: firm.name,
      url: firm.url,
      telephone: firm.phoneHref.replace('tel:', ''),
    },
    areaServed: [
      { '@type': 'Country', name: 'ایران' },
      { '@type': 'City', name: 'اهواز' },
    ],
    serviceType: area.title,
    availableChannel: {
      '@type': 'ServiceChannel',
      servicePhone: { '@type': 'ContactPoint', telephone: firm.phoneHref.replace('tel:', ''), contactType: 'customer service' },
      serviceUrl: new URL('/online-legal-consultation', firm.url).toString(),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd).replace(/</g, '\\u003c') }} />
      <section className="bg-ink relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-14 relative">
          <Link href="/practice-areas" className="inline-flex items-center gap-2 text-sm mb-8 text-parchment/85 hover:text-gold-light transition-colors">
            <ArrowRight size={16} aria-hidden="true" /> بازگشت به حوزه‌های تخصصی
          </Link>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-sm bg-ink-2 flex items-center justify-center shrink-0">
              <AreaIcon size={26} className="text-gold" aria-hidden="true" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-parchment">{area.title}</h1>
          </div>
          <p className="text-parchment/80 max-w-2xl leading-8">{area.shortDesc}</p>
        </div>
      </section>

      <section className="bg-parchment">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-foreground mb-4">درباره این حوزه</h2>
            <p className="text-muted-foreground leading-8 mb-10">{area.longDesc}</p>

            <h2 className="text-xl font-bold text-foreground mb-5">خدمات این حوزه</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {area.topics.map((topic, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-teal shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-sm text-foreground leading-7">{topic}</span>
                </div>
              ))}
            </div>

            <h2 className="mt-10 text-xl font-bold text-foreground">آمادگی برای بررسی اولیه</h2>
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              <section className="rounded-sm border border-border bg-card p-5">
                <h3 className="flex items-center gap-2 font-bold text-foreground">
                  <FileStack className="text-gold" size={19} aria-hidden="true" />
                  مدارک پیشنهادی
                </h3>
                <ul className="mt-4 space-y-3">
                  {area.documents.map((document) => (
                    <li key={document} className="flex items-start gap-2 text-sm leading-7 text-muted-foreground">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-teal" aria-hidden="true" />
                      <span>{document}</span>
                    </li>
                  ))}
                </ul>
              </section>
              <section className="rounded-sm border border-border bg-card p-5">
                <h3 className="flex items-center gap-2 font-bold text-foreground">
                  <ListChecks className="text-gold" size={19} aria-hidden="true" />
                  اطلاعاتی که آماده کنید
                </h3>
                <ul className="mt-4 space-y-3">
                  {area.preparation.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm leading-7 text-muted-foreground">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-teal" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <h2 className="mt-10 text-xl font-bold text-foreground">نحوه دریافت خدمت</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Link href="/online-legal-consultation" className="rounded-sm border border-border bg-card p-5 transition-colors hover:border-gold">
                <span className="font-bold text-foreground">مشاوره آنلاین سراسر ایران</span>
                <span className="mt-2 block text-sm leading-7 text-muted-foreground">بررسی اولیه موضوع و مدارک بدون مراجعه به اهواز</span>
              </Link>
              <Link href="/lawyer-ahvaz" className="rounded-sm border border-border bg-card p-5 transition-colors hover:border-gold">
                <span className="font-bold text-foreground">مراجعه حضوری در اهواز</span>
                <span className="mt-2 block text-sm leading-7 text-muted-foreground">بررسی حضوری اسناد و هماهنگی برای قبول وکالت</span>
              </Link>
            </div>
          </div>

          <div>
            {relatedLawyers.length > 0 && (
              <div className="bg-card border border-border rounded-sm p-6 mb-6">
                <h3 className="font-bold text-foreground mb-5">وکلای این حوزه</h3>
                <div className="flex flex-col gap-4">
                  {relatedLawyers.map((lw) => (
                    <Link key={lw.slug} href={`/lawyers/${lw.slug}`} className="flex items-center gap-3 text-right">
                      <Avatar initials={lw.initials} size={48} />
                      <span>
                        <span className="block text-sm font-bold text-foreground">{lw.name}</span>
                        <span className="block text-xs text-muted-foreground mt-0.5">{lw.role}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-ink rounded-sm p-6 text-center">
              <p className="text-parchment/85 text-sm mb-5">برای مشاوره در حوزه {area.title} با ما در تماس باشید.</p>
              <Button className="w-full" asChild>
                <Link href="/contact">
                  ارسال درخواست بررسی <ArrowLeft size={16} aria-hidden="true" />
                </Link>
              </Button>
              <Link href="/fees" className="mt-4 block text-sm font-semibold text-gold-light hover:text-gold">
                مشاهده نحوه تعیین تعرفه
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
