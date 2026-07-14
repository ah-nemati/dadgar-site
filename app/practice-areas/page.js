import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { PRACTICE_AREAS } from '@/data/practiceAreas';

export const metadata = {
  title: 'حوزه‌های تخصصی',
  description: 'حوزه‌های تخصصی موسسه حقوقی دادگر: خانواده، تجاری و شرکت‌ها، کیفری، ملک و املاک، کار و قراردادها.',
};

export default function PracticeAreasPage() {
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
            {PRACTICE_AREAS.map((area) => (
              <Link
                key={area.slug}
                href={`/practice-areas/${area.slug}`}
                className="bg-card border border-sand hover:border-gold hover:-translate-y-0.5 transition-all rounded-sm p-6 text-right flex flex-col items-start"
              >
                <div className="w-12 h-12 rounded-sm bg-ink flex items-center justify-center mb-5">
                  <area.icon size={22} className="text-gold" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-charcoal mb-2">{area.title}</h3>
                <p className="text-sm text-muted leading-7 mb-4">{area.shortDesc}</p>
                <span className="inline-flex items-center gap-1.5 text-teal font-semibold text-sm mt-auto">
                  بیشتر بدانید <ArrowLeft size={15} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
