import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Avatar from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import { PRACTICE_AREA_ICONS } from '@/lib/icons';
import { breadcrumbJsonLd } from '@/lib/seo';
import { getPracticeAreas, getPracticeAreaBySlug } from '@/lib/content/practice-areas';
import { getLawyersByPracticeArea } from '@/lib/content/lawyers';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const practiceAreas = await getPracticeAreas();
  return practiceAreas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const area = await getPracticeAreaBySlug(slug);
  if (!area) return {};
  return {
    title: area.title,
    description: area.shortDesc,
  };
}

export default async function PracticeAreaDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const area = await getPracticeAreaBySlug(slug);
  if (!area) notFound();

  const relatedLawyers = await getLawyersByPracticeArea(area.slug);
  const AreaIcon = PRACTICE_AREA_ICONS[area.icon];
  const jsonLd = breadcrumbJsonLd([
    { name: 'خانه', path: '/' },
    { name: 'حوزه‌های تخصصی', path: '/practice-areas' },
    { name: area.title, path: `/practice-areas/${area.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-ink relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-14 relative">
          <Link href="/practice-areas" className="inline-flex items-center gap-2 text-sm mb-8 text-parchment/85 hover:text-gold-light transition-colors">
            <ArrowRight size={16} aria-hidden="true" /> بازگشت به حوزه‌های تخصصی
          </Link>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-sm bg-ink-2 flex items-center justify-center shrink-0">
              <AreaIcon size={26} className="text-gold" aria-hidden="true" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-parchment">{area.title}</h1>
          </div>
          <p className="text-parchment/80 max-w-2xl leading-8">{area.shortDesc}</p>
        </div>
      </section>

      <section className="bg-parchment">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-foreground mb-4">درباره این حوزه</h2>
            <p className="text-muted-foreground leading-8 mb-10">{area.longDesc}</p>

            <h2 className="text-xl font-bold text-foreground mb-5">خدمات این حوزه</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {area.topics.map((topic, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-teal shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-sm text-foreground leading-7">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            {relatedLawyers.length > 0 && (
              <div className="bg-card border border-border rounded-sm p-6 mb-6">
                <h3 className="font-bold text-foreground mb-5">وکلای این حوزه</h3>
                <div className="flex flex-col gap-4">
                  {relatedLawyers.map((lw) => (
                    <Link key={lw.slug} href={`/lawyers/${lw.slug}`} className="flex items-center gap-3 text-right">
                      <Avatar initials={lw.initials} size={48} />
                      <span>
                        <span className="block text-sm font-bold text-foreground">{lw.name}</span>
                        <span className="block text-xs text-muted-foreground mt-0.5">{lw.role}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-ink rounded-sm p-6 text-center">
              <p className="text-parchment/85 text-sm mb-5">برای مشاوره در حوزه {area.title} با ما در تماس باشید.</p>
              <Button className="w-full" asChild>
                <Link href="/contact">
                  درخواست مشاوره <ArrowLeft size={16} aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
