import Eyebrow from "@/components/Eyebrow";
import PatternStrip from "@/components/PatternStrip";
import Seal from "@/components/Seal";
import { Button } from "@/components/ui/button";
import { getBlogPosts } from "@/lib/content/blog";
import { blogPostPath } from "@/lib/blog-slug";
import { getFirm } from "@/lib/content/firm";
import { getLawyers } from "@/lib/content/lawyers";
import { getPracticeAreas } from "@/lib/content/practice-areas";
import { PRACTICE_AREA_ICONS } from "@/lib/icons";
import {
  ArrowLeft,
  Award,
  Calendar,
  MessageSquare,
  Phone,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface InfoPoint {
  icon: LucideIcon;
  title?: string;
  label?: string;
  text?: string;
}

const trustPoints: InfoPoint[] = [
  { icon: Award, label: "تخصص در دعاوی ملکی، چک و خانواده" },
  { icon: ShieldCheck, label: "محرمانگی کامل اطلاعات" },
  { icon: Calendar, label: "مشاوره حضوری، تلفنی و آنلاین" },
  { icon: MessageSquare, label: "پاسخ‌گویی در کمتر از ۲۴ ساعت" },
];

const whyUs: InfoPoint[] = [
  {
    icon: Award,
    title: "تمرکز تخصصی",
    text: "با تمرکز بر دعاوی ملکی، چک و خانواده، راهکار حقوقی متناسب با شرایط خاص شما ارائه می‌شود.",
  },
  {
    icon: ShieldCheck,
    title: "محرمانگی کامل",
    text: "اطلاعات و اسناد پرونده شما با بالاترین استاندارد امنیتی محافظت و صرفاً در اختیار تیم مسئول پرونده قرار می‌گیرد.",
  },
  {
    icon: Search,
    title: "شفافیت در فرآیند",
    text: "از همان جلسه اول، مراحل، زمان‌بندی و هزینه‌های احتمالی پرونده به‌روشنی برای شما تشریح می‌شود.",
  },
  {
    icon: Calendar,
    title: "دسترسی آسان",
    text: "امکان رزرو مشاوره حضوری، تلفنی یا آنلاین، متناسب با زمان و شرایط شما.",
  },
];

export const revalidate = 3600;

export default async function HomePage() {
  const firm = await getFirm();
  const practiceAreas = await getPracticeAreas();
  const lawyers = await getLawyers();
  // Keep the public page available even during a temporary database outage.
  const blogPosts = await getBlogPosts().catch(() => []);

  return (
    <>
      {/* HERO */}
      <section className="bg-ink relative overflow-hidden">
        <div
          className="absolute"
          style={{ left: "-6%", top: "-10%", opacity: 0.07 }}
          aria-hidden="true"
        >
          <Seal size={460} tone="cream" />
        </div>
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 relative animate-fade-up">
          <Eyebrow dark>{firm.name} — دفتر خدمات حقوقی</Eyebrow>
          <h1 className="text-4xl md:text-6xl font-bold text-parchment leading-tight mb-6 max-w-3xl">
            وقتی قانون پیچیده می‌شود، ما راه را روشن می‌کنیم
          </h1>
          <p className="text-parchment/80 max-w-2xl text-base md:text-lg leading-8 mb-10">
            {firm.name} با بیش از یک دهه سابقه در حقوق خانواده، تجاری، کیفری و
            سایر حوزه‌های تخصصی، مشاوره و وکالتی دقیق، شفاف و کاملاً محرمانه
            ارائه می‌دهد.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg" asChild>
              <Link href="/contact">
                درخواست مشاوره
                <ArrowLeft size={18} aria-hidden="true" />
              </Link>
            </Button>
            <Button size="lg" variant="ghostLight" asChild>
              <Link href="/about">آشنایی با موسسه</Link>
            </Button>
          </div>
        </div>
        <PatternStrip id="pattern-hero-bottom" color="#B08D45" />
      </section>

      {/* TRUST STRIP */}
      <section className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((t, i) => (
            <div key={i} className="flex items-center gap-3">
              <t.icon
                size={22}
                className="text-gold shrink-0"
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-foreground">
                {t.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* PRACTICE AREAS */}
      <section className="bg-parchment">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl mb-12">
            <Eyebrow>حوزه‌های تخصصی</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              در کنار شما، در تخصصی‌ترین حوزه‌های حقوقی
            </h2>
            <p className="text-muted-foreground leading-7">
              هر پرونده، ویژگی‌های حقوقی خاص خود را دارد. با تمرکز موضوعی روی هر
              حوزه، راهکاری متناسب با شرایط شما ارائه می‌شود.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {practiceAreas.map((area) => {
              const AreaIcon = PRACTICE_AREA_ICONS[area.icon];
              return (
                <Link
                  key={area.slug}
                  href={`/practice-areas/${area.slug}`}
                  className="bg-card border border-border hover:border-gold hover:-translate-y-0.5 transition-all rounded-sm p-6 text-right flex flex-col items-start"
                >
                  <div className="w-12 h-12 rounded-sm bg-ink flex items-center justify-center mb-5">
                    <AreaIcon
                      size={22}
                      className="text-gold"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {area.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-7 mb-4">
                    {area.shortDesc}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-teal font-semibold text-sm mt-auto">
                    بیشتر بدانید <ArrowLeft size={15} aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-ink">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl mb-12">
            <Eyebrow dark>چرا {firm.name}</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold text-parchment">
              تعهدی که پشت هر پرونده می‌ایستد
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUs.map((w, i) => (
              <div key={i}>
                <w.icon
                  size={26}
                  className="text-gold mb-4"
                  aria-hidden="true"
                />
                <h3 className="text-parchment font-bold mb-2">{w.title}</h3>
                <p className="text-sm leading-7 text-parchment/75">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LAWYER SPOTLIGHT */}
      <section className="bg-parchment">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <Eyebrow>معرفی وکیل</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
            وکیلی که پرونده شما را پیگیری می‌کند
          </h2>
          {lawyers[0] && (
            <div className="bg-card border border-border rounded-sm p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-right">
              <div className="relative w-36 h-36 md:w-40 md:h-40 overflow-hidden rounded-full border-4 border-gold/40 bg-ink-2 shadow-2xl">
                <Image
                  src="/images/profile.jpeg"
                  alt={`تصویر ${lawyers[0].name}`}
                  fill
                  priority
                  sizes="(max-width: 640px) 144px, 160px"
                  className="object-cover object-center"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {lawyers[0].name}
                </h3>
                <p className="text-teal font-semibold text-sm mb-4">
                  {lawyers[0].role} — {lawyers[0].experience}
                </p>
                <p className="text-muted-foreground leading-7 mb-6 max-w-2xl">
                  {lawyers[0].bio}
                </p>
                <Button asChild>
                  <Link href={`/lawyers/${lawyers[0].slug}`}>
                    مشاهده پروفایل کامل{" "}
                    <ArrowLeft size={16} aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* BLOG PREVIEW */}
      {blogPosts.length > 0 && (
        <section className="bg-card">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
              <div className="max-w-2xl">
                <Eyebrow>وبلاگ حقوقی</Eyebrow>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  آخرین مطالب و یادداشت‌های حقوقی
                </h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-teal hover:text-gold font-semibold text-sm transition-colors"
              >
                مشاهده همه مطالب <ArrowLeft size={15} aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.slice(0, 3).map((post) => (
                <Link
                  key={post.slug}
                  href={blogPostPath(post.slug)}
                  className="bg-parchment border border-border hover:border-gold hover:-translate-y-0.5 transition-all rounded-sm p-6 text-right flex flex-col items-start"
                >
                  <span className="text-xs font-semibold text-teal mb-3">
                    {post.category}
                  </span>
                  <h3 className="text-base font-bold text-foreground mb-3 leading-7">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-7 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA BAND */}
      <section className="bg-teal">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-parchment mb-4">
            برای مشاوره حقوقی تخصصی، همین امروز با ما تماس بگیرید
          </h2>
          <p className="mb-8 text-parchment/85">
            کارشناسان ما آماده پاسخ‌گویی به سوالات اولیه شما هستند.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/contact">
                درخواست مشاوره <ArrowLeft size={18} aria-hidden="true" />
              </Link>
            </Button>
            <Button size="lg" variant="ghostLight" asChild>
              <Link href={firm.phoneHref}>
                <Phone size={18} aria-hidden="true" />{" "}
                <span dir="ltr">{firm.phone}</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
