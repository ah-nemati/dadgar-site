import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Avatar from '@/components/Avatar';
import { PRACTICE_AREAS, getPracticeAreaBySlug } from '@/data/practiceAreas';
import { LAWYERS } from '@/data/lawyers';

export function generateStaticParams() {
  return PRACTICE_AREAS.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const area = getPracticeAreaBySlug(slug);
  if (!area) return {};
  return {
    title: area.title,
    description: area.shortDesc,
  };
}

export default async function PracticeAreaDetailPage({ params }) {
  const { slug } = await params;
  const area = getPracticeAreaBySlug(slug);
  if (!area) notFound();

  const relatedLawyers = LAWYERS.filter((lw) => lw.specialties.includes(area.slug));

  return (
    <>
      <section className="bg-ink relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-14 relative">
          <Link href="/practice-areas" className="inline-flex items-center gap-2 text-sm mb-8 text-parchment/85 hover:text-gold-light transition-colors">
            <ArrowRight size={16} aria-hidden="true" /> بازگشت به حوزه‌های تخصصی
          </Link>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-sm bg-ink-2 flex items-center justify-center shrink-0">
              <area.icon size={26} className="text-gold" aria-hidden="true" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-parchment">{area.title}</h1>
          </div>
          <p className="text-parchment/80 max-w-2xl leading-8">{area.shortDesc}</p>
        </div>
      </section>

      <section className="bg-parchment">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-charcoal mb-4">درباره این حوزه</h2>
            <p className="text-muted leading-8 mb-10">{area.longDesc}</p>

            <h2 className="text-xl font-bold text-charcoal mb-5">خدمات این حوزه</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {area.topics.map((topic, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-teal shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-sm text-charcoal leading-7">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            {relatedLawyers.length > 0 && (
              <div className="bg-card border border-sand rounded-sm p-6 mb-6">
                <h3 className="font-bold text-charcoal mb-5">وکلای این حوزه</h3>
                <div className="flex flex-col gap-4">
                  {relatedLawyers.map((lw) => (
                    <Link key={lw.slug} href={`/lawyers/${lw.slug}`} className="flex items-center gap-3 text-right">
                      <Avatar initials={lw.initials} size={48} />
                      <span>
                        <span className="block text-sm font-bold text-charcoal">{lw.name}</span>
                        <span className="block text-xs text-muted mt-0.5">{lw.role}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-ink rounded-sm p-6 text-center">
              <p className="text-parchment/85 text-sm mb-5">برای مشاوره در حوزه {area.title} با ما در تماس باشید.</p>
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-ink font-semibold px-5 py-3 rounded-sm text-sm transition-colors"
              >
                درخواست مشاوره <ArrowLeft size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
