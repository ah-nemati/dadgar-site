import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, MapPin, MonitorSmartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHero from '@/components/PageHero';
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
        title="حوزه‌های خدمات حقوقی و کیفری"
        description="موضوع پرونده را در یکی از حوزه‌های زیر بررسی کنید؛ مشاوره غیرحضوری برای سراسر ایران و مراجعه حضوری در اهواز در دسترس است."
      />
      <section className="bg-parchment">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {practiceAreas.map((area) => {
              const AreaIcon = PRACTICE_AREA_ICONS[area.icon];
              return (
              <Link
                key={area.slug}
                href={`/practice-areas/${area.slug}`}
                className="bg-card border border-border hover:border-gold hover:-translate-y-0.5 transition-all rounded-sm p-6 text-right flex flex-col items-start"
              >
                <div className="w-12 h-12 rounded-sm bg-ink flex items-center justify-center mb-5">
                  <AreaIcon size={22} className="text-gold" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{area.title}</h3>
                <p className="text-sm text-muted-foreground leading-7 mb-4">{area.shortDesc}</p>
                <span className="inline-flex items-center gap-1.5 text-teal font-semibold text-sm mt-auto">
                  بیشتر بدانید <ArrowLeft size={15} aria-hidden="true" />
                </span>
              </Link>
              );
            })}
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-sm bg-ink p-6 text-parchment">
              <MonitorSmartphone className="text-gold" size={24} aria-hidden="true" />
              <h2 className="mt-4 text-lg font-bold">مشاوره آنلاین سراسر ایران</h2>
              <p className="mt-3 text-sm leading-7 text-parchment/75">موضوع و مدارک اصلی بدون نیاز به مراجعه حضوری بررسی می‌شود.</p>
              <Button className="mt-5" asChild>
                <Link href="/online-legal-consultation">نحوه دریافت مشاوره آنلاین</Link>
              </Button>
            </div>
            <div className="rounded-sm border border-border bg-card p-6">
              <MapPin className="text-teal" size={24} aria-hidden="true" />
              <h2 className="mt-4 text-lg font-bold text-foreground">خدمات حضوری در اهواز</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">برای بررسی اصل اسناد و هماهنگی قبول وکالت می‌توانید به دفتر اهواز مراجعه کنید.</p>
              <Button className="mt-5" variant="outline" asChild>
                <Link href="/lawyer-ahvaz">نشانی و خدمات دفتر اهواز</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
