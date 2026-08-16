import Link from '@/components/NoPrefetchLink';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, CheckCircle2, FileStack, ListChecks, MessageCircle, MapPin } from 'lucide-react';
import Avatar from '@/components/Avatar';
import Eyebrow from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';
import { PRACTICE_AREA_ICONS } from '@/lib/icons';
import { breadcrumbJsonLd } from '@/lib/seo';
import { getPracticeAreaBySlug } from '@/lib/content/practice-areas';
import { getLawyersByPracticeArea } from '@/lib/content/lawyers';
import { getFirm } from '@/lib/content/firm';

type Params = Promise<{ slug: string }>;

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const area = await getPracticeAreaBySlug(slug);
  if (!area) return {};
  return {
    title: area.seoTitle || `${area.title}؛ مشاوره آنلاین و حضوری اهواز`,
    description: area.seoDescription || `${area.shortDesc} مشاوره غیرحضوری برای سراسر ایران و خدمات حضوری در اهواز.`,
    alternates: { canonical: `/practice-areas/${area.slug}` },
    keywords: [area.title, `${area.title} اهواز`, `مشاوره آنلاین ${area.title}`, `وکیل ${area.title}`, `وکیل ${area.title} اهواز`, 'مجید سواری'],
  };
}

export default async function PracticeAreaDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const area = await getPracticeAreaBySlug(slug);
  if (!area) notFound();

  const [relatedLawyers, firm] = await Promise.all([getLawyersByPracticeArea(area.slug), getFirm()]);
  const AreaIcon = PRACTICE_AREA_ICONS[area.icon];
  const breadcrumb = breadcrumbJsonLd([
    { name: 'خانه', path: '/' },
    { name: 'حوزه‌های تخصصی', path: '/practice-areas' },
    { name: area.title, path: `/practice-areas/${area.slug}` },
  ]);
  const serviceJsonLd = {
    '@context': 'https://schema.org', '@type': 'LegalService', name: `${area.title}؛ آنلاین سراسر ایران و حضوری اهواز`,
    description: area.longDesc, url: new URL(`/practice-areas/${area.slug}`, firm.url).toString(),
    provider: { '@type': 'LegalService', name: firm.name, url: firm.url, telephone: firm.phoneHref.replace('tel:', '') },
    areaServed: [{ '@type': 'Country', name: 'ایران' }, { '@type': 'City', name: 'اهواز' }],
    serviceType: area.title,
    availableChannel: { '@type': 'ServiceChannel', servicePhone: { '@type': 'ContactPoint', telephone: firm.phoneHref.replace('tel:', ''), contactType: 'customer service' }, serviceUrl: new URL('/online-legal-consultation', firm.url).toString() },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd).replace(/</g, '\\u003c') }} />

      <section className="page-hero">
        <div className="page-hero__seal" aria-hidden="true">§</div>
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <Link href="/practice-areas" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-sky-800/70 transition-colors hover:text-sky-600"><ArrowRight size={16} /> حوزه‌های تخصصی</Link>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <div className="eyebrow eyebrow--dark"><AreaIcon size={15} /><span>خدمات حقوقی تخصصی</span></div>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight text-sky-900 md:text-6xl">{area.title}</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-sky-800/70 md:text-lg">{area.shortDesc}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild><Link href="/online-legal-consultation">شروع مشاوره <ArrowLeft size={16} /></Link></Button>
              <Button asChild variant="ghostLight"><Link href="/lawyer-ahvaz">مراجعه حضوری</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_19rem] lg:items-start">
          <div className="space-y-10">
            <section>
              <Eyebrow>درباره این حوزه</Eyebrow>
              <h2 className="section-title">مسئله را قبل از اقدام حقوقی درست صورت‌بندی کنید</h2>
              <p className="mt-5 max-w-4xl text-base leading-9 text-muted-foreground">{area.longDesc}</p>
            </section>

            <section>
              <div className="mb-5 flex items-end justify-between gap-4"><div><Eyebrow>دامنه خدمات</Eyebrow><h2 className="text-2xl font-extrabold md:text-3xl">موضوعاتی که بررسی می‌شوند</h2></div><span className="hidden text-xs font-bold text-muted-foreground md:block">بررسی هر پرونده بر اساس اسناد همان موضوع انجام می‌شود</span></div>
              <div className="grid gap-3 sm:grid-cols-2">
                {area.topics.map((topic) => <div key={topic} className="legal-card flex items-start gap-3 p-4"><CheckCircle2 size={18} className="mt-1 shrink-0 text-accent" /><span className="text-sm font-bold leading-7 text-foreground">{topic}</span></div>)}
              </div>
            </section>

            <section className="grid gap-5 md:grid-cols-2">
              <div className="legal-card p-6"><span className="legal-card__icon"><FileStack size={20} /></span><h2 className="mt-5 text-xl font-extrabold">مدارکی که بهتر است آماده باشند</h2><ul className="mt-5 space-y-3">{area.documents.map((item) => <li key={item} className="flex items-start gap-3 text-sm leading-7 text-muted-foreground"><span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold" />{item}</li>)}</ul></div>
              <div className="legal-card p-6"><span className="legal-card__icon"><ListChecks size={20} /></span><h2 className="mt-5 text-xl font-extrabold">اطلاعاتی که روند بررسی را سریع‌تر می‌کند</h2><ul className="mt-5 space-y-3">{area.preparation.map((item) => <li key={item} className="flex items-start gap-3 text-sm leading-7 text-muted-foreground"><span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold" />{item}</li>)}</ul></div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              <Link href="/online-legal-consultation" className="legal-card group p-6"><MessageCircle className="text-accent" size={22} /><h2 className="mt-5 text-lg font-extrabold">مشاوره آنلاین سراسر ایران</h2><p className="mt-2 text-sm leading-7 text-muted-foreground">شرح موضوع و مدارک را در فضای خصوصی ارسال کنید و پاسخ وکیل را همان‌جا دریافت کنید.</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-primary">ورود به مشاوره <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /></span></Link>
              <Link href="/lawyer-ahvaz" className="legal-card group p-6"><MapPin className="text-accent" size={22} /><h2 className="mt-5 text-lg font-extrabold">مراجعه حضوری در اهواز</h2><p className="mt-2 text-sm leading-7 text-muted-foreground">برای بررسی حضوری اسناد و هماهنگی قبول وکالت، ابتدا زمان مراجعه را هماهنگ کنید.</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-primary">اطلاعات دفتر <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /></span></Link>
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28">
            {relatedLawyers.length > 0 && <div className="legal-card p-5"><p className="text-xs font-extrabold text-muted-foreground">وکیل مرتبط</p><div className="mt-4 space-y-4">{relatedLawyers.map((lw) => <Link key={lw.slug} href={`/lawyers/${lw.slug}`} className="group flex items-center gap-3"><Avatar initials={lw.initials} size={46} /><span><span className="block text-sm font-extrabold text-foreground group-hover:text-accent">{lw.name}</span><span className="mt-0.5 block text-xs text-muted-foreground">{lw.role}</span></span></Link>)}</div></div>}
            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6 text-sky-900"><p className="text-xs font-extrabold text-sky-600">قدم بعدی</p><h2 className="mt-3 text-xl font-extrabold">قبل از هر اقدام، وضعیت پرونده را مشخص کنید</h2><p className="mt-3 text-sm leading-7 text-sky-800/70">شرح کوتاه موضوع برای بررسی اولیه کافی است. ارسال فرم به‌معنای قبول وکالت نیست.</p><Button asChild className="mt-5 w-full"><Link href="/contact">ارسال درخواست بررسی <ArrowLeft size={15} /></Link></Button><Link href="/fees" className="mt-4 block text-center text-xs font-bold text-sky-600 hover:text-sky-700">نحوه تعیین تعرفه</Link></div>
          </aside>
        </div>
      </section>
    </>
  );
}
