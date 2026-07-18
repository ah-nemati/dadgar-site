import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { PRACTICE_AREA_ICONS } from '@/lib/icons';
import { getPracticeAreas } from '@/lib/content/practice-areas';

export const metadata: Metadata = {
  title: 'حوزه‌های تخصصی',
  description: 'حوزه‌های تخصصی دفتر وکالت مجید سواری در اهواز: حقوق ملک و املاک، دعاوی چک، و حقوق خانواده.',
};

export default async function PracticeAreasPage() {
  const practiceAreas = await getPracticeAreas();

  return (
    <>
      <PageHero
        eyebrow="حوزه‌های تخصصی"
        title="حوزه‌های تخصصی موسسه"
        description="با تمرکز موضوعی روی هر حوزه، راهکاری متناسب با شرایط خاص پرونده شما ارائه می‌دهیم."
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
        </div>
      </section>
    </>
  );
}
