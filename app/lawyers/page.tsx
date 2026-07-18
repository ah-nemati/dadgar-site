import Link from 'next/link';
import type { Metadata } from 'next';
import Avatar from '@/components/Avatar';
import PageHero from '@/components/PageHero';
import { getLawyers } from '@/lib/content/lawyers';
import { getPracticeAreas } from '@/lib/content/practice-areas';

export const metadata: Metadata = {
  title: 'معرفی وکیل',
  description: 'مجید سواری، وکیل پایه یک دادگستری و عضو کانون وکلای خوزستان، متخصص در دعاوی ملکی، چک و خانواده در اهواز.',
};

export default async function LawyersPage() {
  const lawyers = await getLawyers();
  const practiceAreas = await getPracticeAreas();

  return (
    <>
      <PageHero eyebrow="معرفی وکیل" title="وکیل پرونده شما" description="وکیل پایه یک دادگستری، با تمرکز موضوعی بر دعاوی ملکی، چک و خانواده." />
      <section className="bg-parchment">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {lawyers.map((lw) => (
              <Link
                key={lw.slug}
                href={`/lawyers/${lw.slug}`}
                className="bg-card border border-border hover:border-gold hover:-translate-y-0.5 transition-all rounded-sm p-6 text-center flex flex-col items-center"
              >
                <Avatar initials={lw.initials} size={84} />
                <h3 className="text-base font-bold text-foreground mt-4 mb-1">{lw.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{lw.role}</p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {lw.specialties.map((sid) => {
                    const a = practiceAreas.find((pa) => pa.slug === sid);
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
