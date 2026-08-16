import Link from '@/components/NoPrefetchLink';
import type { Metadata } from 'next';
import { ArrowLeft, MapPin, MonitorSmartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHero from '@/components/PageHero';
import Eyebrow from '@/components/Eyebrow';
import { PRACTICE_AREA_ICONS } from '@/lib/icons';
import { getPracticeAreas } from '@/lib/content/practice-areas';

export const metadata: Metadata = {
  alternates: { canonical: '/practice-areas' },
  title: 'حوزه‌های خدمات حقوقی و کیفری',
  description: 'خدمات حقوقی مجید سواری در دعاوی املاک، چک، خانواده، کیفری، قرارداد، ارث، مطالبات، ثبت و حقوق کار؛ آنلاین سراسر ایران و حضوری اهواز.',
};

export default async function PracticeAreasPage() {
  const practiceAreas = await getPracticeAreas();

  return (
    <>
      <PageHero
        eyebrow="حوزه‌های تخصصی"
        title="خدمت حقوقی را بر اساس موضوع پرونده انتخاب کنید"
        description="هر پرونده مسیر متفاوتی دارد. از دسته‌بندی زیر شروع کنید تا توضیحات، مدارک و نکات مرتبط با همان موضوع را ببینید."
      />

      <section className="editorial-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="section-kicker">
            <Eyebrow>خدمات دفتر</Eyebrow>
            <h2 className="section-title">حوزه‌های اصلی دعاوی و امور حقوقی</h2>
            <p className="section-copy">اگر مطمئن نیستید موضوع شما در کدام حوزه قرار می‌گیرد، از بخش مشاوره آنلاین شرح کوتاهی از مسئله ثبت کنید.</p>
          </div>

          <div className="stagger-load grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {practiceAreas.map((area, index) => {
              const AreaIcon = PRACTICE_AREA_ICONS[area.icon];
              return (
                <Link key={area.slug} href={`/practice-areas/${area.slug}`} className="legal-card group p-6 md:p-7">
                  <div className="flex items-start justify-between gap-5">
                    <span className="legal-card__icon"><AreaIcon size={20} aria-hidden="true" /></span>
                    <span className="text-xs font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-extrabold text-foreground">{area.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{area.shortDesc}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-accent transition-transform group-hover:-translate-x-1">
                    مشاهده جزئیات <ArrowLeft size={14} aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section--soft">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-2">
          <div className="legal-card p-5 sm:p-7 md:p-8">
            <span className="legal-card__icon"><MonitorSmartphone size={21} aria-hidden="true" /></span>
            <h2 className="mt-6 text-2xl font-extrabold text-foreground">مشاوره آنلاین برای سراسر ایران</h2>
            <p className="mt-3 max-w-xl text-sm leading-8 text-muted-foreground">موضوع و مدارک اصلی را بدون مراجعه حضوری در حساب خصوصی ارسال کنید و در همان مسیر پاسخ را پیگیری کنید.</p>
            <Button className="mt-6" asChild><Link href="/online-legal-consultation">نحوه دریافت مشاوره <ArrowLeft size={15} /></Link></Button>
          </div>
          <div className="legal-card p-5 sm:p-7 md:p-8">
            <span className="legal-card__icon"><MapPin size={21} aria-hidden="true" /></span>
            <h2 className="mt-6 text-2xl font-extrabold text-foreground">مراجعه حضوری در اهواز</h2>
            <p className="mt-3 max-w-xl text-sm leading-8 text-muted-foreground">برای بررسی اصل اسناد، جلسه حضوری یا هماهنگی قبول وکالت می‌توانید موقعیت دفتر و نحوه مراجعه را ببینید.</p>
            <Button className="mt-6" variant="outline" asChild><Link href="/lawyer-ahvaz">آدرس و اطلاعات دفتر <ArrowLeft size={15} /></Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}
