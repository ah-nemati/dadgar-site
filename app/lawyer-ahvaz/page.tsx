import type { Metadata } from 'next';
import Image from 'next/image';
import Link from '@/components/NoPrefetchLink';
import { ArrowLeft, Award, Clock, MapPin, Phone } from 'lucide-react';
import PageHero from '@/components/PageHero';
import Eyebrow from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';
import { getFirm } from '@/lib/content/firm';
import { getPracticeAreas } from '@/lib/content/practice-areas';
import { PRACTICE_AREA_ICONS } from '@/lib/icons';
import { breadcrumbJsonLd } from '@/lib/seo';
import { getAppointmentSettings } from '@/lib/content/appointment-settings';
import OfficeMap, { officeMapLink } from '@/components/OfficeMap';

export const metadata: Metadata = {
  title: 'وکیل پایه یک دادگستری در اهواز',
  description: 'خدمات حضوری مجید سواری، وکیل پایه یک دادگستری و عضو کانون وکلای خوزستان، در اهواز برای دعاوی حقوقی، کیفری، خانواده، املاک و سایر حوزه‌ها.',
  alternates: { canonical: '/lawyer-ahvaz' },
  keywords: ['وکیل اهواز', 'وکیل پایه یک دادگستری اهواز', 'دفتر وکالت در اهواز', 'مجید سواری وکیل اهواز'],
};

export default async function LawyerAhvazPage() {
  const [firm, practiceAreas, appointmentSettings] = await Promise.all([getFirm(), getPracticeAreas(), getAppointmentSettings()]);
  const breadcrumb = breadcrumbJsonLd([{ name: 'خانه', path: '/' }, { name: 'وکیل در اهواز', path: '/lawyer-ahvaz' }], firm.url);
  const localBusinessJsonLd = {
    '@context': 'https://schema.org', '@type': 'LegalService', name: firm.name,
    url: new URL('/lawyer-ahvaz', firm.url).toString(), image: new URL('/images/profile.jpeg', firm.url).toString(), description: metadata.description,
    telephone: [firm.phoneHref.replace('tel:', ''), firm.phone2Href?.replace('tel:', '')].filter(Boolean), email: firm.email,
    address: { '@type': 'PostalAddress', streetAddress: firm.address, addressLocality: firm.city || 'اهواز', addressRegion: firm.region || 'خوزستان', postalCode: firm.postalCode || undefined, addressCountry: firm.countryCode || 'IR' },
    ...(typeof firm.latitude === 'number' && typeof firm.longitude === 'number' ? { geo: { '@type': 'GeoCoordinates', latitude: firm.latitude, longitude: firm.longitude } } : {}),
    hasMap: officeMapLink(firm), areaServed: { '@type': 'City', name: firm.city || 'اهواز' },
    openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: appointmentSettings.workingDays.map((day) => ({0:'Sunday',1:'Monday',2:'Tuesday',3:'Wednesday',4:'Thursday',5:'Friday',6:'Saturday'} as Record<number,string>)[day]).filter(Boolean), opens: `${String(appointmentSettings.openHour).padStart(2, '0')}:00`, closes: `${String(appointmentSettings.closeHour).padStart(2, '0')}:00` },
    knowsAbout: practiceAreas.map((area) => area.title),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd).replace(/</g, '\\u003c') }} />
      <PageHero eyebrow="خدمات حضوری اهواز" title="وکیل پایه یک دادگستری در اهواز" description="برای مشاوره، بررسی اسناد و هماهنگی پیگیری پرونده می‌توانید پس از تعیین وقت به دفتر مراجعه کنید." />

      <section className="editorial-section">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
          <aside className="lawyer-feature overflow-hidden lg:sticky lg:top-28">
            <div className="relative h-72">
              <Image src="/images/profile.jpeg" alt="مجید سواری، وکیل پایه یک دادگستری در اهواز" fill priority sizes="(max-width: 1024px) 100vw, 420px" className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6"><p className="text-2xl font-extrabold text-parchment">مجید سواری</p><p className="mt-1 text-sm text-parchment/65">وکیل پایه یک دادگستری</p><span className="mt-3 inline-flex rounded-full border border-white/15 bg-black/15 px-3 py-1 text-xs font-bold text-gold-light">پروانه ۲۳۰۶</span></div>
            </div>
            <div className="relative z-10 p-6">
              <div className="space-y-4 text-sm leading-7 text-sky-800/70">
                <div className="flex items-start gap-3"><MapPin className="mt-1 shrink-0 text-gold-light" size={18} /><span>{firm.address}</span></div>
                <div className="flex items-center gap-3"><Clock className="shrink-0 text-gold-light" size={18} /><span>{firm.hours}</span></div>
                <div className="flex items-center gap-3"><Phone className="shrink-0 text-gold-light" size={18} /><a href={firm.phoneHref} dir="ltr" className="hover:text-gold-light">{firm.phone}</a></div>
              </div>
              <Button className="mt-6 w-full" asChild><Link href="/contact">هماهنگی مراجعه حضوری</Link></Button>
            </div>
          </aside>

          <div>
            <Eyebrow>دفتر اهواز</Eyebrow>
            <h2 className="section-title">مراجعه حضوری وقتی ارزشمند است که جلسه از قبل آماده باشد</h2>
            <p className="section-copy">پیش از جلسه می‌توانید نوع مسئله و مدارک اصلی را اعلام کنید تا مشخص شود چه اسنادی همراه داشته باشید و آیا بررسی اولیه آنلاین کافی است یا حضور در دفتر مناسب‌تر خواهد بود.</p>
            <p className="mt-5 text-sm leading-8 text-muted-foreground">دفتر در حوزه‌های حقوقی، کیفری، خانواده، املاک، قرارداد، ارث، مطالبات، امور ثبتی و حقوق کار خدمات ارائه می‌دهد. هر پرونده بر اساس اسناد و شرایط خودش بررسی می‌شود و نتیجه هیچ پرونده‌ای قابل تضمین نیست.</p>

            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {practiceAreas.map((area) => {
                const AreaIcon = PRACTICE_AREA_ICONS[area.icon];
                return <Link key={area.slug} href={`/practice-areas/${area.slug}`} className="legal-card group p-5"><div className="flex items-start gap-3"><span className="legal-card__icon size-10"><AreaIcon size={18} /></span><div><h3 className="font-extrabold text-foreground group-hover:text-accent">{area.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{area.shortDesc}</p></div></div></Link>;
              })}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild><Link href="/online-legal-consultation">صحبت با وکیل <ArrowLeft size={16} /></Link></Button>
              <Button variant="outline" asChild><Link href="/fees">نحوه تعیین تعرفه</Link></Button>
              <Button variant="outline" asChild><Link href="/lawyers/majid-savari"><Award size={16} /> سوابق وکیل</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section--soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-6"><Eyebrow>موقعیت دفتر</Eyebrow><h2 className="text-2xl font-extrabold text-foreground md:text-3xl">آدرس دفتر وکیل در اهواز روی نقشه</h2><p className="mt-2 text-sm leading-7 text-muted-foreground">نشانگر، موقعیت دفتر را مشخص می‌کند. برای بازکردن مسیر در Google Maps از دکمه مسیریابی استفاده کنید.</p></div>
          <OfficeMap firm={firm} />
        </div>
      </section>
    </>
  );
}
