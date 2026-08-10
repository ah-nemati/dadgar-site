import PageHero from "@/components/PageHero";
import { getLawyers } from "@/lib/content/lawyers";
import { getPracticeAreas } from "@/lib/content/practice-areas";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
export const metadata: Metadata = {
  alternates: { canonical: "/lawyers" },
  title: "معرفی وکیل",
  description:
    "معرفی مجید سواری، وکیل پایه یک دادگستری و عضو کانون وکلای خوزستان؛ ارائه خدمات آنلاین سراسر ایران و حضوری در اهواز.",
};

export default async function LawyersPage() {
  const lawyers = await getLawyers();
  const practiceAreas = await getPracticeAreas();

  return (
    <>
      <PageHero
        eyebrow="معرفی وکیل"
        title="وکیل پرونده شما"
        description="وکیل پایه یک دادگستری برای بررسی و پیگیری حوزه‌های اصلی حقوقی و کیفری، آنلاین سراسر ایران و حضوری اهواز."
      />
      <section className="bg-parchment">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {lawyers.map((lw) => (
              <Link
                key={lw.slug}
                href={`/lawyers/${lw.slug}`}
                className="bg-card border border-border hover:border-gold hover:-translate-y-0.5 transition-all rounded-sm p-6 text-center flex flex-col items-center"
              >
                <Image
                  src="/images/profile.jpeg"
                  alt={`تصویر ${lw.name}`}
                  width={160}
                  height={160}
                  priority
                  sizes="(max-width: 640px) 144px, 160px"
                  className="object-cover object-center"
                />{" "}
                <h3 className="text-base font-bold text-foreground mt-4 mb-1">
                  {lw.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-4">{lw.role}</p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {lw.specialties.map((sid) => {
                    const a = practiceAreas.find((pa) => pa.slug === sid);
                    return a ? (
                      <span
                        key={sid}
                        className="text-xs px-2.5 py-1 rounded-sm bg-ink text-gold-light"
                      >
                        {a.title}
                      </span>
                    ) : null;
                  })}
                </div>
                <span className="text-teal font-semibold text-xs mt-auto">
                  مشاهده پروفایل
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
