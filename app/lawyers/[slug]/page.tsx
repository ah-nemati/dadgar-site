import { Button } from "@/components/ui/button";
import { getLawyerBySlug } from "@/lib/content/lawyers";
import { getPracticeAreas } from "@/lib/content/practice-areas";
import { getFirm } from "@/lib/content/firm";
import { breadcrumbJsonLd } from "@/lib/seo";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  GraduationCap,
  MessageCircle,
  Scale,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/NoPrefetchLink";
import { notFound } from "next/navigation";
import Eyebrow from "@/components/Eyebrow";

type Params = Promise<{ slug: string }>;
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const lawyer = await getLawyerBySlug(slug);
  if (!lawyer) return {};
  return {
    title: lawyer.seoTitle || lawyer.name,
    description: lawyer.seoDescription || lawyer.bio,
    alternates: { canonical: `/lawyers/${lawyer.slug}` },
  };
}

export default async function LawyerDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const lawyer = await getLawyerBySlug(slug);
  if (!lawyer) notFound();
  const [practiceAreas, firm] = await Promise.all([
    getPracticeAreas(),
    getFirm(),
  ]);
  const specialtyAreas = practiceAreas.filter((a) =>
    lawyer.specialties.includes(a.slug),
  );
  const breadcrumb = breadcrumbJsonLd([
    { name: "خانه", path: "/" },
    { name: "معرفی وکیل", path: "/lawyers" },
    { name: lawyer.name, path: `/lawyers/${lawyer.slug}` },
  ]);
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: lawyer.name,
    jobTitle: lawyer.role,
    identifier: lawyer.licenseNumber,
    description: lawyer.bio,
    url: new URL(`/lawyers/${lawyer.slug}`, firm.url).toString(),
    //fucked majid image: new URL("/images/profile.jpeg", firm.url).toString(),
    knowsAbout: specialtyAreas.map((area) => area.title),
    memberOf: { "@type": "Organization", name: "کانون وکلای دادگستری خوزستان" },
    worksFor: { "@type": "LegalService", name: firm.name, url: firm.url },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="page-hero overflow-hidden">
        <div className="page-hero__seal" aria-hidden="true">
          §
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 md:py-14">
          <Link
            href="/lawyers"
            className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-sky-800/70 hover:text-sky-600"
          >
            <ArrowRight size={16} /> معرفی وکیل
          </Link>
          <div className="grid gap-8 lg:grid-cols-[15rem_1fr] lg:items-end">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[15rem] overflow-hidden rounded-[1.4rem] border border-white/10 bg-ink-2 shadow-2xl lg:mx-0">
              <Image
                src="/images/profil.jpeg"
                alt={`تصویر ${lawyer.name}`}
                fill
                priority
                sizes="240px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <span className="absolute bottom-4 right-4 rounded-full border border-white/15 bg-black/20 px-3 py-1 text-xs font-bold text-sky-600">
                پروانه {lawyer.licenseNumber}
              </span>
            </div>
            <div className="pb-2">
              <div className="eyebrow eyebrow--dark">
                <Award size={15} />
                <span>{lawyer.role}</span>
              </div>
              <h1 className="mt-5 text-4xl font-extrabold text-sky-900 md:text-6xl">
                {lawyer.name}
              </h1>
              <p className="mt-4 text-base font-bold text-sky-600">
                {lawyer.experience}
              </p>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-sky-800/70 md:text-base">
                {lawyer.bio}
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {specialtyAreas.map((area) => (
                  <Link
                    key={area.slug}
                    href={`/practice-areas/${area.slug}`}
                    className="rounded-full border border-sky-200 bg-white/70 px-3.5 py-2 text-xs font-bold text-sky-800 transition-colors hover:border-sky-300 hover:text-sky-600"
                  >
                    {area.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_20rem] lg:items-start">
          <div className="space-y-10">
            <section>
              <Eyebrow>پروفایل حرفه‌ای</Eyebrow>
              <h2 className="section-title">
                تمرکز بر تحلیل مسئله، اسناد و مسیر قابل اجرا
              </h2>
              <p className="mt-5 max-w-4xl text-base leading-9 text-muted-foreground">
                {lawyer.bio}
              </p>
            </section>
            <section>
              <Eyebrow>حوزه‌های فعالیت</Eyebrow>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {specialtyAreas.map((area) => (
                  <Link
                    key={area.slug}
                    href={`/practice-areas/${area.slug}`}
                    className="legal-card group p-5"
                  >
                    <Scale size={20} className="text-accent" />
                    <h3 className="mt-4 text-lg font-extrabold">
                      {area.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-7 text-muted-foreground">
                      {area.shortDesc}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold text-primary">
                      مشاهده حوزه{" "}
                      <ArrowLeft
                        size={13}
                        className="transition-transform group-hover:-translate-x-1"
                      />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
            <section className="legal-card p-6 md:p-8">
              <div className="flex items-start gap-4">
                <span className="legal-card__icon shrink-0">
                  <GraduationCap size={20} />
                </span>
                <div>
                  <h2 className="text-xl font-extrabold">سوابق تحصیلی</h2>
                  <ul className="mt-5 space-y-3">
                    {lawyer.education.map((edu) => (
                      <li
                        key={edu}
                        className="flex items-start gap-3 text-sm leading-7 text-muted-foreground"
                      >
                        <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold" />
                        {edu}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28">
            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6 text-sky-900">
              <MessageCircle className="text-sky-600" size={23} />
              <h2 className="mt-4 text-xl font-extrabold">
                برای بررسی موضوع شما
              </h2>
              <p className="mt-3 text-sm leading-7 text-sky-800/70">
                شرح مسئله و در صورت نیاز مدارک را از کانال خصوصی مشاوره ارسال
                کنید.
              </p>
              <Button asChild className="mt-5 w-full">
                <Link href="/online-legal-consultation">
                  صحبت با وکیل <ArrowLeft size={15} />
                </Link>
              </Button>
            </div>
            <div className="legal-card p-5">
              <p className="text-xs font-extrabold text-muted-foreground">
                راه‌های دیگر
              </p>
              <Link
                href="/lawyer-ahvaz"
                className="mt-4 flex items-center justify-between rounded-lg border border-border p-3 text-sm font-extrabold hover:border-sky-300"
              >
                مراجعه حضوری در <ArrowLeft size={14} />
              </Link>
              <Link
                href="/fees"
                className="mt-2 flex items-center justify-between rounded-lg border border-border p-3 text-sm font-extrabold hover:border-sky-300"
              >
                نحوه تعیین تعرفه <ArrowLeft size={14} />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
