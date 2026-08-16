import Eyebrow from "@/components/Eyebrow";
import { Button } from "@/components/ui/button";
import { getFirm } from "@/lib/content/firm";
import { getLawyers } from "@/lib/content/lawyers";
import { getPracticeAreas } from "@/lib/content/practice-areas";
import { getBlogPosts } from "@/lib/content/blog";
import {
  ArrowLeft,
  Award,
  CalendarCheck,
  Check,
  FileSearch,
  MapPin,
  MessageSquareText,
  Phone,
  Scale,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import PracticeAreaSwiper from "@/components/home/PracticeAreaSwiper";
import BlogSwiper from "@/components/home/BlogSwiper";
import Link from "@/components/NoPrefetchLink";

export const dynamic = "force-static";

const process = [
  {
    n: "۰۱",
    title: "شرح مسئله و ارسال مدارک",
    text: "موضوع را کوتاه توضیح می‌دهید و در صورت نیاز، مدارک اولیه را از مسیر خصوصی ارسال می‌کنید.",
  },
  {
    n: "۰۲",
    title: "بررسی و تعیین مسیر",
    text: "موضوع از نظر حقوقی بررسی می‌شود تا نوع مشاوره، مدارک تکمیلی و قدم بعدی روشن باشد.",
  },
  {
    n: "۰۳",
    title: "مشاوره یا پیگیری پرونده",
    text: "پس از روشن‌شدن حدود خدمت و هزینه، مشاوره انجام می‌شود یا درباره قبول و پیگیری پرونده تصمیم می‌گیرید.",
  },
];

export default async function HomePage() {
  const [firm, practiceAreas, lawyers, blogPosts] = await Promise.all([
    getFirm(),
    getPracticeAreas(),
    getLawyers(),
    getBlogPosts(),
  ]);

  const lawyer = lawyers[0];
  const trustPoints = [
    { icon: Scale, label: `${practiceAreas.length.toLocaleString("fa-IR")} حوزه اصلی حقوقی و کیفری` },
    { icon: ShieldCheck, label: "محرمانگی اطلاعات و مدارک" },
    { icon: CalendarCheck, label: "مشاوره آنلاین و مراجعه حضوری" },
    { icon: FileSearch, label: "بررسی شفاف مسیر و حدود خدمت" },
  ];

  return (
    <>
      <section className="legal-hero">
        <div className="legal-hero__grid mx-auto max-w-7xl px-6">
          <div className="relative z-10">
            <Eyebrow dark>{firm.name} · دفتر وکالت و خدمات حقوقی</Eyebrow>
            <h1 className="legal-hero__title">
              مسئله حقوقی را با مسیر روشن‌تر و تصمیم دقیق‌تر پیگیری کنید.
            </h1>
            <p className="legal-hero__description">
              مشاوره حقوقی آنلاین برای سراسر ایران و خدمات حضوری در اهواز؛ از بررسی اولیه و تنظیم اوراق تا قبول و پیگیری پرونده‌های حقوقی و کیفری.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/online-legal-consultation">
                  شروع مشاوره حقوقی <ArrowLeft size={17} aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="ghostLight" asChild>
                <Link href="/lawyer-ahvaz">
                  <MapPin size={17} aria-hidden="true" /> مراجعه حضوری در اهواز
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-sky-800/65">
              <span className="inline-flex items-center gap-2"><Check size={14} className="text-gold-light" /> بررسی اولیه موضوع</span>
              <span className="inline-flex items-center gap-2"><Check size={14} className="text-gold-light" /> ارسال امن مدارک</span>
              <span className="inline-flex items-center gap-2"><Check size={14} className="text-gold-light" /> ارتباط مستقیم با دفتر</span>
            </div>
          </div>

          <div className="legal-hero__aside load-reveal">
            <div className="absolute inset-x-5 inset-y-0 overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/5 shadow-2xl">
              <Image
                src="/images/profile.jpeg"
                alt={lawyer ? `تصویر ${lawyer.name}` : "وکیل دفتر"}
                fill
                priority
                sizes="(max-width: 1024px) 0px, 380px"
                className="object-cover object-center opacity-90 grayscale-[12%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-lg font-extrabold text-parchment">{lawyer?.name ?? firm.name}</p>
                <p className="mt-1 text-xs text-parchment/65">{lawyer?.role ?? "وکیل پایه یک دادگستری"}</p>
                {lawyer?.licenseNumber && (
                  <p className="mt-3 inline-flex rounded-full border border-white/15 bg-black/15 px-3 py-1 text-[11px] text-gold-light">
                    پروانه وکالت {lawyer.licenseNumber}
                  </p>
                )}
              </div>
            </div>
            <div className="legal-hero__note">
              <Award size={17} className="mb-2 text-gold-light" aria-hidden="true" />
              بررسی هر موضوع بر اساس اسناد و شرایط اختصاصی همان پرونده انجام می‌شود.
            </div>
          </div>
        </div>
      </section>

      <div className="trust-bar mx-auto max-w-7xl px-4 sm:px-6">
        <div className="trust-bar__inner stagger-load">
          {trustPoints.map(({ icon: Icon, label }) => (
            <div key={label} className="trust-bar__item">
              <span className="legal-card__icon size-10 shrink-0"><Icon size={18} aria-hidden="true" /></span>
              <span className="text-sm font-bold leading-6 text-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="editorial-section">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 lg:grid-cols-[.78fr_1.22fr] lg:items-end">
            <div className="section-kicker mb-0">
              <Eyebrow>از کجا شروع کنم؟</Eyebrow>
              <h2 className="section-title">مسیر کوتاه‌تر برای رسیدن به خدمت مناسب</h2>
              <p className="section-copy">به‌جای جست‌وجوی پراکنده، از نوع نیاز خود شروع کنید.</p>
            </div>
            <div className="quick-services">
              <Link className="quick-services__item" href="/online-legal-consultation"><span>مشاوره حقوقی آنلاین</span><ArrowLeft size={15} /></Link>
              <Link className="quick-services__item" href="/lawyer-ahvaz"><span>مراجعه به دفتر اهواز</span><ArrowLeft size={15} /></Link>
              <Link className="quick-services__item" href="/fees"><span>بررسی نحوه تعیین تعرفه</span><ArrowLeft size={15} /></Link>
              <Link className="quick-services__item" href="/faq"><span>پاسخ پرسش‌های متداول</span><ArrowLeft size={15} /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section--soft">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="section-kicker mb-0">
              <Eyebrow>حوزه‌های خدمات</Eyebrow>
              <h2 className="section-title">موضوع پرونده خود را پیدا کنید</h2>
              <p className="section-copy">خدمات دفتر در حوزه‌های اصلی دعاوی و امور حقوقی دسته‌بندی شده تا سریع‌تر به اطلاعات مرتبط برسید.</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/practice-areas">همه حوزه‌ها <ArrowLeft size={16} /></Link>
            </Button>
          </div>

          <Reveal className="mt-10">
            <PracticeAreaSwiper areas={practiceAreas.slice(0, 9)} />
          </Reveal>
        </div>
      </section>

      <section className="editorial-section">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <div className="section-kicker lg:sticky lg:top-32">
              <Eyebrow>فرآیند همکاری</Eyebrow>
              <h2 className="section-title">از سؤال اولیه تا تصمیم حقوقی</h2>
              <p className="section-copy">فرآیند باید برای موکل قابل فهم باشد؛ قبل از شروع، بدانید مرحله بعدی چیست.</p>
              <Button className="mt-6" variant="secondary" asChild>
                <Link href="/online-legal-consultation">ثبت درخواست مشاوره <ArrowLeft size={16} /></Link>
              </Button>
            </div>

            <div className="space-y-4">
              {process.map((step) => (
                <article key={step.n} className="legal-card grid gap-5 p-6 sm:grid-cols-[4rem_1fr] sm:p-7">
                  <div className="text-3xl font-extrabold text-gold">{step.n}</div>
                  <div>
                    <h3 className="text-lg font-extrabold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{step.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {lawyer && (
        <section className="editorial-section pt-0">
          <div className="mx-auto max-w-7xl px-6">
            <div className="lawyer-feature grid overflow-hidden lg:grid-cols-[.78fr_1.22fr]">
              <div className="relative min-h-[25rem] lg:min-h-[31rem]">
                <Image
                  src="/images/profile.jpeg"
                  alt={`تصویر ${lawyer.name}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/35 to-transparent lg:bg-gradient-to-l" />
              </div>
              <div className="relative z-10 flex flex-col justify-center p-7 sm:p-10 lg:p-14">
                <Eyebrow dark>وکیل پرونده</Eyebrow>
                <h2 className="text-3xl font-extrabold leading-relaxed text-sky-900 md:text-4xl">{lawyer.name}</h2>
                <p className="mt-2 font-bold text-gold-light">{lawyer.role} · {lawyer.experience}</p>
                <p className="mt-6 max-w-2xl text-sm leading-8 text-sky-800/75">{lawyer.bio}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button asChild><Link href={`/lawyers/${lawyer.slug}`}>مشاهده پروفایل کامل <ArrowLeft size={16} /></Link></Button>
                  <Button asChild variant="ghostLight"><Link href="/online-legal-consultation"><MessageSquareText size={16} /> صحبت با وکیل</Link></Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {blogPosts.length > 0 && (
        <section className="editorial-section editorial-section--soft">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="section-kicker mb-0">
                <Eyebrow>مجله حقوقی</Eyebrow>
                <h2 className="section-title">مطالبی برای تصمیم آگاهانه‌تر</h2>
                <p className="section-copy">یادداشت‌ها و راهنماهای حقوقی با هدف توضیح روشن موضوعات رایج.</p>
              </div>
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:text-primary">همه مطالب <ArrowLeft size={15} /></Link>
            </div>

            <Reveal className="mt-10">
              <BlogSwiper posts={blogPosts.slice(0, 6)} />
            </Reveal>
          </div>
        </section>
      )}

      <section className="editorial-section">
        <div className="mx-auto max-w-7xl px-6">
          <div className="cta-panel grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
            <div>
              <p className="text-xs font-bold text-gold-light">قدم بعدی</p>
              <h2 className="mt-2 max-w-2xl text-2xl font-extrabold leading-relaxed text-sky-900 md:text-3xl">موضوع حقوقی خود را توضیح دهید تا مسیر مناسب بررسی مشخص شود.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-sky-800/70">برای شروع لازم نیست تمام جزئیات را بدانید؛ شرح کوتاه مسئله و مدارک اصلی کافی است.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild><Link href="/online-legal-consultation">شروع مشاوره <ArrowLeft size={17} /></Link></Button>
              <Button size="lg" variant="ghostLight" asChild><a href={firm.phoneHref}><Phone size={17} /> <span dir="ltr">{firm.phone}</span></a></Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
