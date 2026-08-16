import type { Metadata } from 'next';
import { Clock, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import PageHero from '@/components/PageHero';
import Eyebrow from '@/components/Eyebrow';
import ContactForm from '@/components/ContactForm';
import OfficeMap from '@/components/OfficeMap';
import { getFirm } from '@/lib/content/firm';
import { getPracticeAreas } from '@/lib/content/practice-areas';

export const metadata: Metadata = {
  alternates: { canonical: '/contact' },
  title: 'تماس با ما',
  description: 'ارسال درخواست بررسی حقوقی برای مشاوره آنلاین سراسر ایران یا مراجعه حضوری به دفتر مجید سواری در اهواز؛ فرم تماس، تلفن و نشانی دفتر.',
  keywords: ['تماس با وکیل اهواز', 'مشاوره حقوقی آنلاین', 'مشاوره حقوقی اهواز', 'آدرس دفتر وکالت اهواز'],
};

export default async function ContactPage() {
  const [firm, practiceAreas] = await Promise.all([getFirm(), getPracticeAreas()]);

  const contacts: Array<{ icon: typeof Phone; title: string; value: string; href?: string; dir?: 'ltr' }> = [
    { icon: Phone, title: 'تلفن دفتر', value: firm.phone, href: firm.phoneHref, dir: 'ltr' as const },
    ...(firm.phone2 ? [{ icon: Phone, title: 'تلفن همراه', value: firm.phone2, href: firm.phone2Href ?? '#', dir: 'ltr' as const }] : []),
    { icon: Mail, title: 'ایمیل', value: firm.email, href: `mailto:${firm.email}`, dir: 'ltr' as const },
    { icon: Clock, title: 'ساعات پاسخ‌گویی', value: firm.hours },
  ];

  return (
    <>
      <PageHero eyebrow="تماس با دفتر" title="موضوع را توضیح دهید؛ مسیر ارتباط را انتخاب کنید" description="برای بررسی اولیه می‌توانید فرم را تکمیل کنید، مستقیم تماس بگیرید یا برای مراجعه حضوری موقعیت دفتر را روی نقشه ببینید." />

      <section className="editorial-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_.75fr] lg:items-start">
            <div>
              <div className="mb-7">
                <Eyebrow>ارسال درخواست</Eyebrow>
                <h2 className="text-2xl font-extrabold text-foreground md:text-3xl">شرح کوتاهی از مسئله ثبت کنید</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">این فرم برای تماس اولیه است. برای ارسال مدارک پرونده از بخش «صحبت با وکیل» در حساب کاربری استفاده کنید.</p>
              </div>
              <ContactForm practiceAreas={practiceAreas} />
            </div>

            <aside className="space-y-4 lg:sticky lg:top-28">
              <div className="legal-card p-6 md:p-7">
                <span className="legal-card__icon"><ShieldCheck size={20} /></span>
                <h2 className="mt-5 text-xl font-extrabold text-foreground">راه‌های ارتباط مستقیم</h2>
                <div className="mt-5 divide-y divide-border">
                  {contacts.map(({ icon: Icon, title, value, href, dir }) => (
                    <div key={title} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
                      <Icon size={18} className="mt-1 shrink-0 text-accent" aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-muted-foreground">{title}</p>
                        {href ? <a href={href} dir={dir} className="mt-1 block break-all text-sm font-extrabold text-foreground hover:text-accent">{value}</a> : <p className="mt-1 text-sm font-extrabold text-foreground">{value}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6 text-sky-900 shadow-sm">
                <MapPin className="text-sky-500" size={21} aria-hidden="true" />
                <h2 className="mt-4 text-lg font-extrabold">مراجعه حضوری</h2>
                <p className="mt-3 text-sm leading-7 text-sky-800/70">{firm.address}</p>
                <p className="mt-4 text-xs leading-6 text-sky-700/60">پیش از مراجعه، برای زمان جلسه و مدارک مورد نیاز هماهنگ کنید.</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section--soft pt-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-6">
            <Eyebrow>موقعیت دفتر</Eyebrow>
            <h2 className="text-2xl font-extrabold text-foreground md:text-3xl">آدرس دفتر روی نقشه</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">نشانگر روی نقشه محل دفتر را مشخص می‌کند و از دکمه مسیریابی می‌توانید مسیر را در Google Maps باز کنید.</p>
          </div>
          <OfficeMap firm={firm} />
        </div>
      </section>
    </>
  );
}
