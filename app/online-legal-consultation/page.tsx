import type { Metadata } from 'next';
import Link from '@/components/NoPrefetchLink';
import {
  ArrowLeft,
  CalendarCheck2,
  FileSearch,
  MapPinned,
  MessageCircle,
  Paperclip,
  Phone,
  Scale,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import { getFirm } from '@/lib/content/firm';
import { getPracticeAreas } from '@/lib/content/practice-areas';
import { PRACTICE_AREA_ICONS } from '@/lib/icons';
import { breadcrumbJsonLd } from '@/lib/seo';
import { toPersianDigits } from '@/lib/format';

export const metadata: Metadata = {
  title: 'مشاوره حقوقی آنلاین و صحبت با وکیل',
  description:
    'گفت‌وگوی خصوصی با وکیل، ارسال امن مدارک، پیگیری پاسخ و رزرو نوبت مشاوره حقوقی آنلاین برای متقاضیان سراسر ایران.',
  alternates: { canonical: '/online-legal-consultation' },
  keywords: [
    'مشاوره حقوقی آنلاین',
    'صحبت با وکیل آنلاین',
    'وکیل آنلاین سراسر ایران',
    'ارسال مدارک برای وکیل',
    'رزرو مشاوره حقوقی',
  ],
};

const steps = [
  {
    icon: UserPlus,
    title: 'ایجاد حساب خصوصی',
    text: 'برای اینکه پیام‌ها و مدارک فقط در حساب خودتان قابل دسترسی باشد، یک حساب کاربری ایجاد می‌کنید.',
  },
  {
    icon: Paperclip,
    title: 'ارسال موضوع و مدارک',
    text: 'حوزه حقوقی، سؤال اصلی و در صورت نیاز فایل‌های PDF، تصویر یا Word را داخل گفت‌وگوی خصوصی می‌فرستید.',
  },
  {
    icon: MessageCircle,
    title: 'دریافت پاسخ و ادامه گفتگو',
    text: 'پاسخ دفتر در همان گفت‌وگو ثبت می‌شود و می‌توانید توضیح تکمیلی یا مدارک بعدی را بدون پراکندگی ارسال کنید.',
  },
  {
    icon: CalendarCheck2,
    title: 'رزرو جلسه در صورت نیاز',
    text: 'اگر موضوع به جلسه تلفنی یا بررسی دقیق‌تر نیاز داشته باشد، نوبت پیشنهادی را از پنل ثبت و وضعیت آن را پیگیری می‌کنید.',
  },
];

export default async function OnlineLegalConsultationPage() {
  const [firm, practiceAreas] = await Promise.all([getFirm(), getPracticeAreas()]);
  const breadcrumb = breadcrumbJsonLd([
    { name: 'خانه', path: '/' },
    { name: 'مشاوره حقوقی آنلاین', path: '/online-legal-consultation' },
  ], firm.url);
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'مشاوره حقوقی آنلاین و گفت‌وگو با وکیل',
    description: metadata.description,
    url: new URL('/online-legal-consultation', firm.url).toString(),
    serviceType: 'مشاوره حقوقی آنلاین',
    provider: {
      '@type': 'LegalService',
      name: firm.name,
      url: firm.url,
      telephone: firm.phoneHref.replace('tel:', ''),
    },
    areaServed: { '@type': 'Country', name: 'ایران' },
    availableChannel: [
      {
        '@type': 'ServiceChannel',
        serviceUrl: new URL('/portal/messages', firm.url).toString(),
        availableLanguage: 'fa',
      },
      {
        '@type': 'ServiceChannel',
        servicePhone: {
          '@type': 'ContactPoint',
          telephone: firm.phoneHref.replace('tel:', ''),
          contactType: 'legal consultation',
          areaServed: 'IR',
          availableLanguage: 'fa',
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd).replace(/</g, '\\u003c') }} />

      <PageHero
        eyebrow="مشاوره غیرحضوری"
        title="صحبت با وکیل، ارسال مدارک و پیگیری پاسخ در یک مسیر"
        description="برای شروع لازم نیست حضوری مراجعه کنید. سؤال و مدارک را در حساب خصوصی خود بفرستید، پاسخ دفتر را همان‌جا دریافت کنید و در صورت نیاز نوبت مشاوره رزرو کنید."
      />

      <section className="bg-parchment">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <article key={title} className="rounded-sm border border-border bg-card p-6">
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-sm bg-ink text-gold"><Icon size={21} aria-hidden="true" /></span>
                  <span className="font-display text-2xl text-gold">{toPersianDigits(index + 1).padStart(2, '۰')}</span>
                </div>
                <h2 className="font-bold text-foreground">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-sm bg-ink p-6 md:p-8 text-parchment">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <div className="flex items-center gap-2 text-gold-light text-sm font-semibold"><ShieldCheck size={18} /> گفت‌وگوی خصوصی با دفتر</div>
                <h2 className="mt-3 text-2xl font-bold">برای سؤال و ارسال مدارک، از «صحبت با وکیل» استفاده کنید</h2>
                <p className="mt-3 max-w-3xl text-sm leading-8 text-parchment/75">پیام‌ها و فایل‌های این بخش داخل حساب کاربری شما قرار می‌گیرند و با فرم عمومی تماس یکی نیستند. برای مدارک پرونده از همین مسیر استفاده کنید.</p>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                <Button asChild className="min-w-48"><Link href="/signup?returnTo=%2Fportal%2Fmessages">شروع گفت‌وگوی امن <ArrowLeft size={16} /></Link></Button>
                <Button asChild variant="ghostLight"><Link href="/login?returnTo=%2Fportal%2Fmessages">ورود و ادامه گفت‌وگو</Link></Button>
              </div>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <div className="flex size-12 items-center justify-center rounded-sm bg-teal text-parchment"><MapPinned size={23} aria-hidden="true" /></div>
              <h2 className="mt-5 text-2xl font-bold text-foreground">مشاوره غیرحضوری برای سراسر ایران</h2>
              <p className="mt-4 text-sm leading-8 text-muted-foreground">محل سکونت شما مانع بررسی اولیه نیست. اگر پرونده به حضور در مرجع قضایی یا اقدام محلی نیاز داشته باشد، حدود پیگیری پس از مطالعه اطلاعات و مدارک مشخص می‌شود.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="outline"><Link href="/login?returnTo=%2Fportal%2Fappointments"><CalendarCheck2 size={16} /> رزرو نوبت</Link></Button>
                <Button variant="outline" asChild><Link href="/contact"><Phone size={16} /> درخواست تماس اولیه</Link></Button>
                <Button variant="ghost" asChild><Link href="/fees">مشاهده تعرفه‌ها</Link></Button>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground">حوزه‌های قابل بررسی</h2>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {practiceAreas.map((area) => {
                  const AreaIcon = PRACTICE_AREA_ICONS[area.icon];
                  return (
                    <Link key={area.slug} href={`/practice-areas/${area.slug}`} className="flex items-center gap-3 rounded-sm border border-border bg-card p-4 text-sm font-semibold text-foreground transition-colors hover:border-gold">
                      <AreaIcon className="shrink-0 text-teal" size={18} aria-hidden="true" />
                      <span>{area.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 rounded-sm border border-border bg-muted/40 p-5 text-sm leading-7 text-muted-foreground">
              <FileSearch className="mt-1 shrink-0 text-teal" size={18} aria-hidden="true" />
              <p>برای پاسخ دقیق‌تر، شرح مسئله را کوتاه و زمان‌مند بنویسید و فقط مدارکی را ارسال کنید که مستقیماً به سؤال شما مربوط‌اند.</p>
            </div>
            <div className="flex items-start gap-3 rounded-sm border border-border bg-muted/40 p-5 text-sm leading-7 text-muted-foreground">
              <Scale className="mt-1 shrink-0 text-teal" size={18} aria-hidden="true" />
              <p>مشاوره بر پایه اطلاعات و مدارک ارائه‌شده انجام می‌شود. نتیجه هیچ پرونده‌ای قابل تضمین نیست و قبول وکالت نیازمند بررسی مستقل و توافق کتبی است.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
