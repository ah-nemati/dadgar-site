import type { Metadata } from 'next';
import Image from 'next/image';
import Link from '@/components/NoPrefetchLink';
import { ArrowLeft, Clock, MapPin, Phone, Scale } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import { FIRM } from '@/data/firm';
import { PRACTICE_AREAS } from '@/data/practice-areas';
import { PRACTICE_AREA_ICONS } from '@/lib/icons';
import { breadcrumbJsonLd } from '@/lib/seo';

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

export default function LawyerAhvazPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'خانه', path: '/' },
    { name: 'وکیل در اهواز', path: '/lawyer-ahvaz' },
  ]);
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: FIRM.name,
    url: new URL('/lawyer-ahvaz', FIRM.url).toString(),
    image: new URL('/images/profile.jpeg', FIRM.url).toString(),
    description: metadata.description,
    telephone: [
      FIRM.phoneHref.replace('tel:', ''),
      FIRM.phone2Href?.replace('tel:', ''),
    ].filter(Boolean),
    email: FIRM.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'بلوار اصلی گلستان، نبش خیابان تربت، روبروی مدیریت بانک کشاورزی',
      addressLocality: 'اهواز',
      addressRegion: 'خوزستان',
      addressCountry: 'IR',
    },
    areaServed: { '@type': 'City', name: 'اهواز' },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'],
      opens: '17:00',
      closes: '22:00',
    },
    knowsAbout: PRACTICE_AREAS.map((area) => area.title),
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
                <span>{FIRM.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="shrink-0 text-gold" size={18} aria-hidden="true" />
                <span>{FIRM.hours}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="shrink-0 text-gold" size={18} aria-hidden="true" />
                <Link href={FIRM.phoneHref} dir="ltr" className="hover:text-gold-light">
                  {FIRM.phone}
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
              مراجعه حضوری برای پرونده‌هایی مناسب است که بررسی اصل اسناد، گفت‌وگوی مفصل یا هماهنگی برای قبول وکالت نیاز دارند. پیش از مراجعه، موضوع و مرحله پرونده را تلفنی اعلام کنید تا مدارک لازم مشخص شود.
            </p>

            <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {PRACTICE_AREAS.map((area) => {
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
      </section>
    </>
  );
}
