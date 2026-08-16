import type { Metadata } from 'next';
import Link from '@/components/NoPrefetchLink';
import { ArrowLeft, CheckCircle2, Info, Phone } from 'lucide-react';
import PageHero from '@/components/PageHero';
import Eyebrow from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';
import { getFirm } from '@/lib/content/firm';
import { getServiceFees } from '@/lib/content/fees';
import { breadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'تعرفه خدمات حقوقی و مشاوره',
  description: 'نحوه تعیین هزینه مشاوره آنلاین، مشاوره حضوری در اهواز، تنظیم اوراق قضایی، قرارداد و قبول وکالت در دفتر وکالت مجید سواری.',
  alternates: { canonical: '/fees' },
  keywords: ['تعرفه مشاوره حقوقی', 'هزینه مشاوره حقوقی آنلاین', 'هزینه وکیل در اهواز', 'حق الوکاله وکیل'],
};

export default async function FeesPage() {
  const [firm, serviceFees] = await Promise.all([getFirm(), getServiceFees()]);
  const breadcrumb = breadcrumbJsonLd([{ name: 'خانه', path: '/' }, { name: 'تعرفه خدمات حقوقی', path: '/fees' }]);
  const serviceJsonLd = {
    '@context': 'https://schema.org', '@type': 'Service',
    name: 'تعرفه خدمات حقوقی دفتر وکالت مجید سواری', description: metadata.description,
    url: new URL('/fees', firm.url).toString(),
    provider: { '@type': 'LegalService', name: firm.name, telephone: firm.phoneHref.replace('tel:', ''), url: firm.url },
    areaServed: [{ '@type': 'Country', name: 'ایران' }, { '@type': 'City', name: 'اهواز' }],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd).replace(/</g, '\\u003c') }} />
      <PageHero eyebrow="تعرفه خدمات" title="هزینه قبل از شروع، باید قابل فهم باشد" description="مبلغ هر خدمت بر اساس نوع موضوع، حجم مدارک و حدود کار تعیین می‌شود و پیش از شروع به شما اعلام خواهد شد." />

      <section className="editorial-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-9 flex items-start gap-3 rounded-xl border border-gold/25 bg-gold/10 p-5 md:p-6">
            <Info className="mt-1 shrink-0 text-primary" size={20} />
            <div><h2 className="font-extrabold text-foreground">رزرو و پرداخت اینترنتی فعلاً فعال نیست</h2><p className="mt-2 text-sm leading-7 text-muted-foreground">برای مبلغ دقیق، موضوع و مدارک اولیه باید بررسی شود. مبلغ نهایی و شیوه پرداخت قبل از شروع خدمت اعلام می‌شود.</p></div>
          </div>

          <div className="section-kicker"><Eyebrow>ساختار هزینه</Eyebrow><h2 className="section-title">تعرفه بر اساس نوع خدمت</h2><p className="section-copy">این موارد نحوه محاسبه و حدود کلی خدمت را نشان می‌دهند؛ مبلغ نهایی ممکن است با توجه به پیچیدگی موضوع متفاوت باشد.</p></div>

          <div className="stagger-load grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {serviceFees.map((item) => (
              <article key={item.title} className="legal-card flex flex-col p-6 md:p-7">
                <p className="text-xs font-bold text-accent">خدمت حقوقی</p>
                <h2 className="mt-3 text-xl font-extrabold text-foreground">{item.title}</h2>
                <p className="mt-4 inline-flex w-fit rounded-full border border-gold/25 bg-gold/10 px-3 py-1.5 text-sm font-extrabold text-primary">{item.feeLabel}</p>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.description}</p>
                <ul className="mt-6 space-y-3 border-t border-border pt-5">
                  {item.includes.map((entry) => <li key={entry} className="flex items-start gap-2 text-sm leading-6 text-foreground"><CheckCircle2 className="mt-1 shrink-0 text-accent" size={16} /><span>{entry}</span></li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6"><div className="cta-panel grid gap-6 p-5 sm:p-8 md:grid-cols-[1fr_auto] md:items-center md:p-10"><div><p className="text-xs font-bold text-gold-light">استعلام هزینه</p><h2 className="mt-2 text-2xl font-extrabold text-parchment">موضوع را کوتاه و دقیق اعلام کنید</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-parchment/60">مرحله فعلی پرونده و حجم تقریبی مدارک کمک می‌کند حدود خدمت دقیق‌تر مشخص شود.</p></div><div className="flex flex-wrap gap-3"><Button size="lg" asChild><a href={firm.phoneHref}><Phone size={17} /> تماس با دفتر</a></Button><Button size="lg" variant="ghostLight" asChild><Link href="/contact">ارسال درخواست <ArrowLeft size={17} /></Link></Button></div></div></div>
      </section>
    </>
  );
}
