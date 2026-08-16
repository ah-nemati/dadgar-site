import type { Metadata } from 'next';
import Image from 'next/image';
import Link from '@/components/NoPrefetchLink';
import { ArrowLeft, Clock, MapPin, Phone, Scale } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import { getFirm } from '@/lib/content/firm';
import { getPracticeAreas } from '@/lib/content/practice-areas';
import { PRACTICE_AREA_ICONS } from '@/lib/icons';
import { breadcrumbJsonLd } from '@/lib/seo';
import { getAppointmentSettings } from '@/lib/content/appointment-settings';
import OfficeMap, { officeMapLink } from '@/components/OfficeMap';

export const metadata: Metadata = {
  title: 'وکیل پایه یک دادگستری در اهواز',
  description:
    'خدمات حضوری مجید سواری، وکیل پایه یک دادگستری و عضو کانون وکلای خوزستان، در اهواز برای دعاوی حقوقی، کیفری، خانواده، املاک و سایر حوزه‌ها.',
  alternates: { canonical: '/lawyer-ahvaz' },
  keywords: [
    'وکیل اهواز',
    'وکیل پایه یک دادگستری اهواز',
    'دفتر وکالت در اهواز',
    'مجید سواری وکیل اهواز',
  ],
};

export default async function LawyerAhvazPage() {
  const [firm, practiceAreas, appointmentSettings] = await Promise.all([getFirm(), getPracticeAreas(), getAppointmentSettings()]);
  const breadcrumb = breadcrumbJsonLd([
    { name: 'خانه', path: '/' },
    { name: 'وکیل در اهواز', path: '/lawyer-ahvaz' },
  ], firm.url);
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: firm.name,
    url: new URL('/lawyer-ahvaz', firm.url).toString(),
    image: new URL('/images/profile.jpeg', firm.url).toString(),
    description: metadata.description,
    telephone: [
      firm.phoneHref.replace('tel:', ''),
      firm.phone2Href?.replace('tel:', ''),
    ].filter(Boolean),
    email: firm.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: firm.address,
      addressLocality: firm.city || 'اهواز',
      addressRegion: firm.region || 'خوزستان',
      postalCode: firm.postalCode || undefined,
      addressCountry: firm.countryCode || 'IR',
    },
    ...(typeof firm.latitude === 'number' && typeof firm.longitude === 'number' ? {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: firm.latitude,
        longitude: firm.longitude,
      },
    } : {}),
    hasMap: officeMapLink(firm),
    areaServed: { '@type': 'City', name: firm.city || 'اهواز' },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: appointmentSettings.workingDays.map((day) => ({
        0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday',
      } as Record<number, string>)[day]).filter(Boolean),
      opens: `${String(appointmentSettings.openHour).padStart(2, '0')}:00`,
      closes: `${String(appointmentSettings.closeHour).padStart(2, '0')}:00`,
    },
    knowsAbout: practiceAreas.map((area) => area.title),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd).replace(/</g, '\\u003c') }}
      />

      <PageHero
        eyebrow="خدمات حضوری اهواز"
        title="وکیل پایه یک دادگستری در اهواز"
        description="مشاوره و پیگیری حضوری پرونده‌های حقوقی و کیفری در دفتر وکالت مجید سواری در منطقه گلستان اهواز."
      />

      <section className="bg-parchment">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="h-fit rounded-sm bg-ink p-7 text-parchment lg:sticky lg:top-28">
            <div className="flex items-center gap-4">
              <Image
                src="/images/profile.jpeg"
                alt="مجید سواری، وکیل پایه یک دادگستری در اهواز"
                width={88}
                height={88}
                priority
                className="size-[88px] rounded-full border-2 border-gold/50 object-cover"
              />
              <div>
                <h2 className="font-bold">مجید سواری</h2>
                <p className="mt-1 text-sm text-parchment/70">وکیل پایه یک دادگستری</p>
                <p className="mt-1 text-xs text-gold-light">شماره پروانه ۲۳۰۶</p>
              </div>
            </div>

            <div className="mt-7 space-y-5 border-t border-white/10 pt-6 text-sm leading-7 text-parchment/80">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 shrink-0 text-gold" size={18} aria-hidden="true" />
                <span>{firm.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="shrink-0 text-gold" size={18} aria-hidden="true" />
                <span>{firm.hours}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="shrink-0 text-gold" size={18} aria-hidden="true" />
                <Link href={firm.phoneHref} dir="ltr" className="hover:text-gold-light">
                  {firm.phone}
                </Link>
              </div>
            </div>

            <Button className="mt-7 w-full" asChild>
              <Link href="/contact">هماهنگی مراجعه حضوری</Link>
            </Button>
          </aside>

          <div>
            <div className="flex size-12 items-center justify-center rounded-sm bg-teal text-parchment">
              <Scale size={23} aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-foreground">خدمات حقوقی حضوری در اهواز</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              برای دریافت مشاوره حقوقی در اهواز، بررسی اسناد یا هماهنگی قبول وکالت می‌توانید پیش از مراجعه موضوع و مرحله پرونده را اعلام کنید. خدمات دفتر بر اساس حوزه پرونده شامل دعاوی حقوقی، کیفری، خانواده، املاک، قراردادها و سایر موضوعات درج‌شده در همین سایت است و هر پرونده پیش از اعلام مسیر اقدام به‌صورت مستقل بررسی می‌شود.
            </p>
            <p className="mt-4 leading-8 text-muted-foreground">
              اگر به دنبال وکیل در اهواز برای یک موضوع مشخص هستید، ابتدا حوزه تخصصی مرتبط را انتخاب کنید؛ سپس از بخش «صحبت با وکیل» مدارک اولیه را به‌صورت خصوصی ارسال کنید یا برای مراجعه حضوری به دفتر وکالت در اهواز نوبت بگیرید.
            </p>

            <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {practiceAreas.map((area) => {
                const AreaIcon = PRACTICE_AREA_ICONS[area.icon];
                return (
                  <Link
                    key={area.slug}
                    href={`/practice-areas/${area.slug}`}
                    className="group rounded-sm border border-border bg-card p-5 transition-colors hover:border-gold"
                  >
                    <AreaIcon className="text-teal" size={20} aria-hidden="true" />
                    <h3 className="mt-3 font-bold text-foreground">{area.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{area.shortDesc}</p>
                  </Link>
                );
              })}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/contact">
                  ارسال درخواست بررسی
                  <ArrowLeft size={17} aria-hidden="true" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/fees">مشاهده نحوه تعیین تعرفه</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/lawyers/majid-savari">مشاهده سوابق وکیل</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 pb-12">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <section className="rounded-sm border border-border bg-card p-5">
              <h2 className="font-bold text-foreground">مشاوره با وکیل در اهواز</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">برای بررسی اولیه، شرح موضوع و مدارک اصلی را از بخش صحبت با وکیل ارسال کنید تا مشخص شود مشاوره آنلاین کافی است یا مراجعه حضوری مناسب‌تر است.</p>
            </section>
            <section className="rounded-sm border border-border bg-card p-5">
              <h2 className="font-bold text-foreground">مراجعه حضوری به دفتر وکالت</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">پیش از مراجعه، نوبت و مدارک لازم را هماهنگ کنید تا زمان جلسه برای مطالعه اسناد و بررسی وضعیت پرونده استفاده شود.</p>
            </section>
            <section className="rounded-sm border border-border bg-card p-5">
              <h2 className="font-bold text-foreground">مشاوره حقوقی آنلاین</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">برای کاربرانی که امکان مراجعه به اهواز ندارند، ارسال پیام و مدارک خصوصی از حساب موکل در سایت در دسترس است.</p>
            </section>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-16">
          <h2 className="text-2xl font-bold text-foreground">آدرس دفتر وکیل در اهواز روی نقشه</h2>
          <p className="mt-2 mb-5 text-sm leading-7 text-muted-foreground">موقعیت دفتر در گلستان اهواز و مسیر مراجعه حضوری را روی نقشه مشاهده کنید.</p>
          <OfficeMap firm={firm} />
        </div>
      </section>
    </>
  );
}
