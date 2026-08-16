import Link from '@/components/NoPrefetchLink';
import { ArrowLeft, Clock, Mail, MapPin, Phone } from 'lucide-react';
import Seal from './Seal';
import { Button } from '@/components/ui/button';
import { getFirm } from '@/lib/content/firm';
import { getPracticeAreas } from '@/lib/content/practice-areas';
import { officeMapLink } from './OfficeMap';

export default async function Footer() {
  const firm = await getFirm();
  const practiceAreas = await getPracticeAreas();

  return (
    <footer className="site-footer">
      <div className="site-footer__cta">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 py-10 md:grid-cols-[1fr_auto] md:items-center md:py-12">
          <div>
            <p className="text-xs font-bold text-gold-light">برای تصمیم حقوقی عجله نکنید</p>
            <h2 className="mt-2 max-w-2xl text-2xl font-extrabold leading-relaxed text-parchment md:text-3xl">
              موضوع را توضیح دهید؛ مسیر مناسب مشاوره یا پیگیری مشخص می‌شود.
            </h2>
          </div>
          <div className="footer-cta-actions flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg">
              <Link href="/online-legal-consultation">
                شروع مشاوره <ArrowLeft size={17} aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghostLight">
              <a href={firm.phoneHref}>
                <Phone size={17} aria-hidden="true" /> <span dir="ltr">{firm.phone}</span>
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_.8fr_.9fr_1.1fr] lg:gap-12">
          <div>
            <div className="flex items-center gap-3">
              <Seal size={46} />
              <div>
                <p className="text-lg font-extrabold text-parchment">{firm.name}</p>
                <p className="mt-1 text-xs text-parchment/50">دفتر خدمات حقوقی و وکالت</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-8 text-parchment/65">{firm.tagline}</p>
            <p className="mt-5 max-w-sm border-r border-gold/35 pr-4 text-xs leading-7 text-parchment/50">
              محتوای سایت برای آگاهی عمومی است و جایگزین بررسی اختصاصی اسناد و شرایط هر پرونده نیست.
            </p>
          </div>

          <div>
            <h2 className="mb-5 text-sm font-extrabold text-parchment">دسترسی سریع</h2>
            <ul className="space-y-3 text-sm">
              <li><Link href="/online-legal-consultation" className="site-footer__link">مشاوره حقوقی آنلاین</Link></li>
              <li><Link href="/lawyer-ahvaz" className="site-footer__link">وکیل در اهواز</Link></li>
              <li><Link href="/fees" className="site-footer__link">تعرفه خدمات</Link></li>
              <li><Link href="/about" className="site-footer__link">درباره دفتر</Link></li>
              <li><Link href="/faq" className="site-footer__link">سوالات متداول</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="mb-5 text-sm font-extrabold text-parchment">حوزه‌های حقوقی</h2>
            <ul className="space-y-3 text-sm">
              {practiceAreas.slice(0, 6).map((area) => (
                <li key={area.slug}>
                  <Link href={`/practice-areas/${area.slug}`} className="site-footer__link">{area.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-5 text-sm font-extrabold text-parchment">دفتر و ارتباط</h2>
            <ul className="space-y-4 text-sm text-parchment/65">
              <li className="flex items-start gap-3">
                <MapPin size={17} className="mt-1 shrink-0 text-gold-light" aria-hidden="true" />
                <a href={officeMapLink(firm)} target="_blank" rel="noreferrer" className="site-footer__link leading-7">{firm.address}</a>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={17} className="shrink-0 text-gold-light" aria-hidden="true" />
                <span>{firm.hours}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={17} className="shrink-0 text-gold-light" aria-hidden="true" />
                <a href={firm.phoneHref} dir="ltr" className="site-footer__link">{firm.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={17} className="shrink-0 text-gold-light" aria-hidden="true" />
                <a href={`mailto:${firm.email}`} dir="ltr" className="site-footer__link break-all">{firm.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-center text-xs text-parchment/45 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:text-right">
          <span>© ۱۴۰۵ {firm.name}. تمامی حقوق محفوظ است.</span>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 sm:justify-start">
            <Link href="/privacy" className="site-footer__link">حریم خصوصی</Link>
            <Link href="/terms" className="site-footer__link">شرایط استفاده</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
