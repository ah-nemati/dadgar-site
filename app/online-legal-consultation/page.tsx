import type { Metadata } from 'next';
import Link from '@/components/NoPrefetchLink';
import AccountEntryLink from '@/components/AccountEntryLink';
import { ArrowLeft, CalendarCheck2, FileSearch, LockKeyhole, MessageCircle, Paperclip, Phone, ShieldCheck, UserPlus } from 'lucide-react';
import PageHero from '@/components/PageHero';
import Eyebrow from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';
import { getFirm } from '@/lib/content/firm';
import { getPracticeAreas } from '@/lib/content/practice-areas';
import { PRACTICE_AREA_ICONS } from '@/lib/icons';
import { breadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'مشاوره حقوقی آنلاین و صحبت با وکیل',
  description: 'گفت‌وگوی خصوصی با وکیل، ارسال امن مدارک، پیگیری پاسخ و رزرو نوبت مشاوره حقوقی آنلاین برای متقاضیان سراسر ایران.',
  alternates: { canonical: '/online-legal-consultation' },
  keywords: ['مشاوره حقوقی آنلاین', 'صحبت با وکیل آنلاین', 'وکیل آنلاین سراسر ایران', 'ارسال مدارک برای وکیل', 'رزرو مشاوره حقوقی'],
};

const steps = [
  { icon: UserPlus, n: '۰۱', title: 'ورود یا ساخت حساب', text: 'حساب خصوصی باعث می‌شود پیام‌ها و مدارک شما در یک مسیر مشخص و قابل پیگیری بمانند.' },
  { icon: Paperclip, n: '۰۲', title: 'ارسال سؤال و مدارک', text: 'شرح مسئله، مرحله فعلی و مدارک مرتبط را در گفت‌وگوی خصوصی ثبت می‌کنید.' },
  { icon: MessageCircle, n: '۰۳', title: 'دریافت پاسخ دفتر', text: 'پاسخ و درخواست توضیح تکمیلی در همان گفت‌وگو ثبت می‌شود و پراکنده نمی‌ماند.' },
  { icon: CalendarCheck2, n: '۰۴', title: 'رزرو جلسه در صورت نیاز', text: 'اگر موضوع به جلسه نیاز داشته باشد، زمان پیشنهادی را از پنل ثبت و وضعیت را پیگیری می‌کنید.' },
];

export default async function OnlineLegalConsultationPage() {
  const [firm, practiceAreas] = await Promise.all([getFirm(), getPracticeAreas()]);
  const breadcrumb = breadcrumbJsonLd([
    { name: 'خانه', path: '/' },
    { name: 'مشاوره حقوقی آنلاین', path: '/online-legal-consultation' },
  ], firm.url);

  const serviceJsonLd = {
    '@context': 'https://schema.org', '@type': 'Service',
    name: 'مشاوره حقوقی آنلاین و گفت‌وگو با وکیل',
    description: metadata.description,
    url: new URL('/online-legal-consultation', firm.url).toString(),
    serviceType: 'مشاوره حقوقی آنلاین',
    provider: { '@type': 'LegalService', name: firm.name, url: firm.url, telephone: firm.phoneHref.replace('tel:', '') },
    areaServed: { '@type': 'Country', name: 'ایران' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd).replace(/</g, '\\u003c') }} />
      <PageHero eyebrow="مشاوره غیرحضوری" title="صحبت با وکیل، بدون پراکندگی پیام و مدارک" description="سؤال، مدارک، پاسخ دفتر و نوبت مشاوره را در یک فضای خصوصی پیگیری کنید؛ مناسب متقاضیان سراسر ایران." />

      <section className="editorial-section">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <div className="section-kicker lg:sticky lg:top-28">
              <Eyebrow>چطور کار می‌کند؟</Eyebrow>
              <h2 className="section-title">چهار مرحله روشن برای شروع</h2>
              <p className="section-copy">برای شروع لازم نیست همه جزئیات پرونده را بدانید؛ سؤال اصلی و اسناد مرتبط کافی است.</p>
              <div className="mt-7 rounded-xl border border-accent/20 bg-accent/10 p-5">
                <div className="flex items-start gap-3"><ShieldCheck size={19} className="mt-1 shrink-0 text-accent" /><p className="text-sm leading-7 text-muted-foreground">فایل‌های گفت‌وگو از فرم عمومی تماس جدا هستند و داخل حساب خصوصی موکل نگهداری می‌شوند.</p></div>
              </div>
            </div>

            <div className="space-y-4">
              {steps.map(({ icon: Icon, n, title, text }) => (
                <article key={n} className="legal-card grid gap-5 p-6 sm:grid-cols-[4rem_3rem_1fr] sm:items-start md:p-7">
                  <div className="text-3xl font-extrabold text-gold">{n}</div>
                  <span className="legal-card__icon"><Icon size={19} /></span>
                  <div><h3 className="text-lg font-extrabold text-foreground">{title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{text}</p></div>
                </article>
              ))}
            </div>
          </div>

          <div className="cta-panel mt-12 grid gap-7 p-7 md:p-9 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-gold-light"><LockKeyhole size={17} /> گفت‌وگوی خصوصی با دفتر</div>
              <h2 className="mt-3 text-2xl font-extrabold leading-relaxed text-parchment">برای سؤال و ارسال مدارک، مستقیماً وارد بخش «صحبت با وکیل» شوید.</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-parchment/60">اگر حساب ندارید، ابتدا ثبت‌نام می‌کنید و سپس مستقیماً به صفحه گفت‌وگو هدایت می‌شوید.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <Button asChild><AccountEntryLink returnTo="/portal/messages" guestHref="/signup">شروع گفت‌وگوی امن <ArrowLeft size={16} /></AccountEntryLink></Button>
              <Button asChild variant="ghostLight"><AccountEntryLink returnTo="/portal/messages" guestHref="/login">ورود و ادامه گفتگو</AccountEntryLink></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section--soft">
        <div className="mx-auto max-w-7xl px-6">
          <div className="section-kicker">
            <Eyebrow>موضوعات قابل بررسی</Eyebrow>
            <h2 className="section-title">حوزه حقوقی مسئله خود را انتخاب کنید</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {practiceAreas.map((area) => {
              const AreaIcon = PRACTICE_AREA_ICONS[area.icon];
              return <Link key={area.slug} href={`/practice-areas/${area.slug}`} className="legal-card group flex items-center gap-4 p-5"><span className="legal-card__icon size-10"><AreaIcon size={18} /></span><span className="font-extrabold text-foreground group-hover:text-accent">{area.title}</span><ArrowLeft size={14} className="mr-auto text-muted-foreground" /></Link>;
            })}
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="legal-card flex items-start gap-3 p-5"><FileSearch className="mt-1 shrink-0 text-accent" size={18} /><p className="text-sm leading-7 text-muted-foreground">برای پاسخ دقیق‌تر، زمان اتفاق، مرحله فعلی و سؤال اصلی را روشن بنویسید و فقط مدارک مرتبط را پیوست کنید.</p></div>
            <div className="legal-card flex items-start gap-3 p-5"><Phone className="mt-1 shrink-0 text-accent" size={18} /><p className="text-sm leading-7 text-muted-foreground">اگر ترجیح می‌دهید ابتدا تلفنی هماهنگ کنید، از صفحه تماس یا شماره دفتر استفاده کنید.</p></div>
          </div>
        </div>
      </section>
    </>
  );
}
