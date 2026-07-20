import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowRight, ArrowLeft, GraduationCap } from 'lucide-react';
import Avatar from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import { breadcrumbJsonLd } from '@/lib/seo';
import { getLawyers, getLawyerBySlug } from '@/lib/content/lawyers';
import { getPracticeAreas } from '@/lib/content/practice-areas';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const lawyers = await getLawyers();
  return lawyers.map((lw) => ({ slug: lw.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const lawyer = await getLawyerBySlug(slug);
  if (!lawyer) return {};
  return {
    title: lawyer.name,
    description: lawyer.bio,
  };
}

export default async function LawyerDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const lawyer = await getLawyerBySlug(slug);
  if (!lawyer) notFound();

  const practiceAreas = await getPracticeAreas();
  const specialtyAreas = practiceAreas.filter((a) => lawyer.specialties.includes(a.slug));
  const firstName = lawyer.name.split(' ')[0];
  const jsonLd = breadcrumbJsonLd([
    { name: 'خانه', path: '/' },
    { name: 'معرفی وکیل', path: '/lawyers' },
    { name: lawyer.name, path: `/lawyers/${lawyer.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-ink">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <Link href="/lawyers" className="inline-flex items-center gap-2 text-sm mb-10 text-parchment/85 hover:text-gold-light transition-colors">
            <ArrowRight size={16} aria-hidden="true" /> بازگشت به معرفی وکیل
          </Link>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-right">
            <Avatar initials={lawyer.initials} size={120} />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-parchment mb-2">{lawyer.name}</h1>
              <p className="text-gold-light mb-3">{lawyer.role}</p>
              <p className="text-sm text-parchment/75">{lawyer.experience}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-5">
                {specialtyAreas.map((a) => (
                  <Link key={a.slug} href={`/practice-areas/${a.slug}`} className="text-xs px-3 py-1.5 rounded-sm bg-ink-2 text-gold-light hover:text-gold transition-colors">
                    {a.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-parchment">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-foreground mb-4">درباره {firstName}</h2>
            <p className="text-muted-foreground leading-8">{lawyer.bio}</p>
          </div>
          <div>
            <div className="bg-card border border-border rounded-sm p-6 mb-6">
              <h3 className="font-bold text-foreground mb-5 flex items-center gap-2">
                <GraduationCap size={18} className="text-gold" aria-hidden="true" /> سوابق تحصیلی
              </h3>
              <ul className="flex flex-col gap-3">
                {lawyer.education.map((edu, i) => (
                  <li key={i} className="text-sm text-muted-foreground leading-6 flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>{edu}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-ink rounded-sm p-6 text-center">
              <p className="text-parchment/85 text-sm mb-5">برای رزرو مشاوره با {lawyer.name}، درخواست خود را ثبت کنید.</p>
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
