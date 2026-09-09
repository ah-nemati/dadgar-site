import PageHero from "@/components/PageHero";
import Eyebrow from "@/components/Eyebrow";
import { getLawyers } from "@/lib/content/lawyers";
import { getPracticeAreas } from "@/lib/content/practice-areas";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/NoPrefetchLink";
import { ArrowLeft, Award } from "lucide-react";

export const metadata: Metadata = {
  alternates: { canonical: "/lawyers" },
  title: "معرفی وکیل",
  description:
    "معرفی  ، وکیل پایه یک دادگستری و عضو کانون وکلای خوزستان؛ ارائه خدمات آنلاین سراسر ایران و حضوری در  .",
};

export default async function LawyersPage() {
  const [lawyers, practiceAreas] = await Promise.all([
    getLawyers(),
    getPracticeAreas(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="معرفی وکیل"
        title="فردی که مسئول بررسی و پیگیری پرونده شماست"
        description="سوابق، حوزه‌های فعالیت و اطلاعات حرفه‌ای وکیل را پیش از شروع همکاری بررسی کنید."
      />
      <section className="editorial-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="section-kicker">
            <Eyebrow>پروفایل حرفه‌ای</Eyebrow>
            <h2 className="section-title">آشنایی پیش از شروع همکاری</h2>
          </div>

          <div className="space-y-6">
            {lawyers.map((lw) => (
              <Link
                key={lw.slug}
                href={`/lawyers/${lw.slug}`}
                className="legal-card group grid overflow-hidden md:grid-cols-[15rem_1fr]"
              >
                <div className="relative min-h-72 md:min-h-[22rem]">
                  <Image
                    src="/images/profile.jpeg"
                    alt={`تصویر ${lw.name}`}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 240px"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/28 to-transparent" />
                </div>
                <div className="flex flex-col justify-center p-7 md:p-10">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-bold text-primary">
                      <Award size={13} /> {lw.role}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      پروانه {lw.licenseNumber}
                    </span>
                  </div>
                  <h2 className="mt-5 text-3xl font-extrabold text-foreground">
                    {lw.name}
                  </h2>
                  <p className="mt-2 text-sm font-bold text-accent">
                    {lw.experience}
                  </p>
                  <p className="mt-5 max-w-3xl text-sm leading-8 text-muted-foreground">
                    {lw.bio}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {lw.specialties.slice(0, 6).map((sid) => {
                      const area = practiceAreas.find(
                        (item) => item.slug === sid,
                      );
                      return area ? (
                        <span
                          key={sid}
                          className="rounded-full border border-border bg-muted/55 px-3 py-1 text-xs font-bold text-foreground"
                        >
                          {area.title}
                        </span>
                      ) : null;
                    })}
                  </div>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-accent transition-transform group-hover:-translate-x-1">
                    مشاهده پروفایل کامل <ArrowLeft size={15} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
