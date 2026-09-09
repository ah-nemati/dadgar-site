import Link from "@/components/NoPrefetchLink";
import type { Metadata } from "next";
import { ArrowLeft, BookOpen, FileText, Lock, Users } from "lucide-react";
import PageHero from "@/components/PageHero";
import Eyebrow from "@/components/Eyebrow";
import Seal from "@/components/Seal";
import { Button } from "@/components/ui/button";
import { getFirm } from "@/lib/content/firm";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "درباره ما",
  description:
    "آشنایی با  ، وکیل پایه یک دادگستری، روش کاری دفتر و خدمات آنلاین سراسر ایران و حضوری در  .",
  keywords: [
    " ",
    "وکیل پایه یک دادگستری  ",
    "کانون وکلای خوزستان",
    "درباره وکیل  ",
  ],
};

const values = [
  {
    icon: Users,
    title: "تعهد به موکل",
    text: "تصمیم حقوقی باید با فهم دقیق شرایط موکل و هدف واقعی پرونده گرفته شود.",
  },
  {
    icon: Lock,
    title: "محرمانگی",
    text: "اطلاعات و اسناد هر پرونده فقط در مسیرهای مشخص و برای افراد مجاز دفتر قابل دسترسی است.",
  },
  {
    icon: FileText,
    title: "شفافیت",
    text: "حدود خدمت، مرحله بعدی و نحوه تعیین هزینه پیش از شروع برای موکل روشن می‌شود.",
  },
  {
    icon: BookOpen,
    title: "مطالعه مستمر",
    text: "بررسی قانون، رویه و اسناد پرونده بخشی از تصمیم‌گیری حقوقی در هر موضوع است.",
  },
];

const steps = [
  {
    n: "۰۱",
    title: "بررسی اولیه",
    text: "شرح مسئله، مدارک موجود و هدف شما بررسی می‌شود.",
  },
  {
    n: "۰۲",
    title: "تحلیل مسیرها",
    text: "راه‌های حقوقی ممکن، ریسک‌ها و مدارک تکمیلی مشخص می‌شود.",
  },
  {
    n: "۰۳",
    title: "انتخاب اقدام",
    text: "پس از روشن‌شدن حدود خدمت، درباره مشاوره یا پیگیری پرونده تصمیم گرفته می‌شود.",
  },
  {
    n: "۰۴",
    title: "پیگیری و گزارش",
    text: "در صورت قبول وکالت، اقدامات و وضعیت پرونده در مسیر مشخص پیگیری می‌شود.",
  },
];

export default async function AboutPage() {
  const firm = await getFirm();

  return (
    <>
      <PageHero
        eyebrow="درباره دفتر"
        title="دقت حقوقی، ارتباط روشن و پیگیری منظم"
        description="آشنایی با رویکرد کاری دفتر وکالت  ؛ مشاوره آنلاین سراسر ایران و خدمات حضوری در  ."
      />

      <section className="editorial-section">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_.8fr] lg:items-start">
          <div>
            <Eyebrow>رویکرد کاری</Eyebrow>
            <h2 className="section-title">
              هر پرونده باید قبل از اقدام، درست فهمیده شود
            </h2>
            <p className="section-copy">
              {firm.name} با تمرکز بر شفافیت در ارتباط، مطالعه اسناد و توضیح
              روشن مسیرهای حقوقی فعالیت می‌کند. خدمات دفتر حوزه‌های اصلی حقوقی و
              کیفری را پوشش می‌دهد و برای متقاضیان سراسر ایران به‌صورت غیرحضوری
              و برای مراجعه‌کنندگان به‌صورت حضوری ارائه می‌شود.
            </p>
            <p className="mt-5 text-sm leading-8 text-muted-foreground">
              هدف این نیست که برای هر مسئله سریعاً یک اقدام قضایی پیشنهاد شود؛
              ابتدا باید مشخص شود بهترین قدم، مشاوره، تکمیل مدارک، مذاکره، تنظیم
              سند یا ورود به فرایند قضایی است.
            </p>
          </div>

          <aside className="rounded-[1.25rem] border border-sky-200 bg-sky-50 p-7 text-sky-900 shadow-[0_22px_60px_rgba(2,132,199,.10)] lg:sticky lg:top-28">
            <Seal size={46} tone="cream" />
            <div className="mt-7 divide-y divide-white/10">
              <div className="py-4 first:pt-0">
                <p className="text-2xl font-extrabold text-sky-600">پایه یک</p>
                <p className="mt-1 text-xs text-sky-800/65">
                  پروانه وکالت دادگستری
                </p>
              </div>
              <div className="py-4">
                <p className="text-2xl font-extrabold text-sky-600">+ آنلاین</p>
                <p className="mt-1 text-xs text-sky-800/65">
                  خدمات حضوری و غیرحضوری
                </p>
              </div>
              <div className="py-4 last:pb-0">
                <p className="text-lg font-extrabold text-sky-600">
                  {firm.hours}
                </p>
                <p className="mt-1 text-xs text-sky-800/65">
                  ساعات پاسخ‌گویی دفتر
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="editorial-section editorial-section--soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="section-kicker">
            <Eyebrow>اصول همکاری</Eyebrow>
            <h2 className="section-title">
              چه چیزهایی در تجربه موکل باید ثابت بماند؟
            </h2>
          </div>
          <div className="stagger-load grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, text }) => (
              <article key={title} className="legal-card p-6">
                <span className="legal-card__icon">
                  <Icon size={19} />
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-foreground">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="section-kicker">
            <Eyebrow>فرآیند</Eyebrow>
            <h2 className="section-title">از بررسی اولیه تا پیگیری</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <article key={step.n} className="border-t border-gold/45 pt-5">
                <p className="text-3xl font-extrabold text-sky-500">{step.n}</p>
                <h3 className="mt-4 font-extrabold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section pt-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="cta-panel flex flex-col gap-6 p-5 sm:p-8 md:flex-row md:items-center md:justify-between md:p-10">
            <div>
              <p className="text-xs font-bold text-sky-600">آشنایی بیشتر</p>
              <h2 className="mt-2 text-2xl font-extrabold text-parchment">
                سوابق و حوزه‌های فعالیت وکیل را ببینید
              </h2>
            </div>
            <Button asChild>
              <Link href="/lawyers">
                مشاهده پروفایل وکیل <ArrowLeft size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
