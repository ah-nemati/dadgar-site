import Link from 'next/link';
import PageHero from '@/components/PageHero';
import Avatar from '@/components/Avatar';
import { LAWYERS } from '@/data/lawyers';
import { PRACTICE_AREAS } from '@/data/practiceAreas';

export const metadata = {
  title: 'تیم حقوقی',
  description: 'وکلای موسسه حقوقی دادگر: تیمی از وکلای پایه یک دادگستری، هرکدام با تمرکز موضوعی روی حوزه‌ای مشخص.',
};

export default function LawyersPage() {
  return (
    <>
      <PageHero eyebrow="تیم حقوقی" title="وکلای موسسه" description="تیمی از وکلای پایه یک دادگستری، هرکدام با تمرکز موضوعی روی حوزه‌ای مشخص." />
      <section className="bg-parchment">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LAWYERS.map((lw) => (
              <Link
                key={lw.slug}
                href={`/lawyers/${lw.slug}`}
                className="bg-card border border-sand hover:border-gold hover:-translate-y-0.5 transition-all rounded-sm p-6 text-center flex flex-col items-center"
              >
                <Avatar initials={lw.initials} size={84} />
                <h3 className="text-base font-bold text-charcoal mt-4 mb-1">{lw.name}</h3>
                <p className="text-xs text-muted mb-4">{lw.role}</p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {lw.specialties.map((sid) => {
                    const a = PRACTICE_AREAS.find((pa) => pa.slug === sid);
                    return a ? (
                      <span key={sid} className="text-xs px-2.5 py-1 rounded-sm bg-ink text-gold-light">
                        {a.title}
                      </span>
                    ) : null;
                  })}
                </div>
                <span className="text-teal font-semibold text-xs mt-auto">مشاهده پروفایل</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
