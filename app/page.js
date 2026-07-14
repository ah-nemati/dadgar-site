import Link from 'next/link';
import { Award, ShieldCheck, Search, Calendar, MessageSquare, ArrowLeft, Phone } from 'lucide-react';
import Seal from '@/components/Seal';
import PatternStrip from '@/components/PatternStrip';
import Eyebrow from '@/components/Eyebrow';
import Avatar from '@/components/Avatar';
import { FIRM } from '@/data/firm';
import { PRACTICE_AREAS } from '@/data/practiceAreas';
import { LAWYERS } from '@/data/lawyers';
import { BLOG_POSTS } from '@/data/blogPosts';

const trustPoints = [
  { icon: Award, label: 'تخصص در ۶ حوزه حقوقی' },
  { icon: ShieldCheck, label: 'محرمانگی کامل اطلاعات' },
  { icon: Calendar, label: 'مشاوره حضوری، تلفنی و آنلاین' },
  { icon: MessageSquare, label: 'پاسخ‌گویی در کمتر از ۲۴ ساعت' },
];

const whyUs = [
  { icon: Award, title: 'تخصص چندحوزه‌ای', text: 'تیمی از وکلای متخصص در حوزه‌های گوناگون، راهکار حقوقی متناسب با شرایط خاص شما ارائه می‌دهند.' },
  { icon: ShieldCheck, title: 'محرمانگی کامل', text: 'اطلاعات و اسناد پرونده شما با بالاترین استاندارد امنیتی محافظت و صرفاً در اختیار تیم مسئول پرونده قرار می‌گیرد.' },
  { icon: Search, title: 'شفافیت در فرآیند', text: 'از همان جلسه اول، مراحل، زمان‌بندی و هزینه‌های احتمالی پرونده به‌روشنی برای شما تشریح می‌شود.' },
  { icon: Calendar, title: 'دسترسی آسان', text: 'امکان رزرو مشاوره حضوری، تلفنی یا آنلاین، متناسب با زمان و شرایط شما.' },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-ink relative overflow-hidden">
        <div className="absolute" style={{ left: '-6%', top: '-10%', opacity: 0.07 }} aria-hidden="true">
          <Seal size={460} tone="cream" />
        </div>
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 relative animate-fade-up">
          <Eyebrow dark>{FIRM.name} — دفتر خدمات حقوقی</Eyebrow>
          <h1 className="text-4xl md:text-6xl font-bold text-parchment leading-tight mb-6 max-w-3xl">
            وقتی قانون پیچیده می‌شود، ما راه را روشن می‌کنیم
          </h1>
          <p className="text-parchment/80 max-w-2xl text-base md:text-lg leading-8 mb-10">
            {FIRM.name} با بیش از یک دهه سابقه در حقوق خانواده، تجاری، کیفری و سایر حوزه‌های تخصصی، مشاوره و وکالتی
            دقیق، شفاف و کاملاً محرمانه ارائه می‌دهد.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-ink font-semibold px-7 py-3.5 rounded-sm transition-colors">
              درخواست مشاوره
              <ArrowLeft size={18} aria-hidden="true" />
            </Link>
            <Link href="/about" className="inline-flex items-center gap-2 border border-parchment/35 hover:bg-parchment hover:text-ink text-parchment px-7 py-3.5 rounded-sm transition-colors">
              آشنایی با موسسه
            </Link>
          </div>
        </div>
        <PatternStrip id="pattern-hero-bottom" color="#B08D45" />
      </section>

      {/* TRUST STRIP */}
      <section className="bg-card border-b border-sand">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((t, i) => (
            <div key={i} className="flex items-center gap-3">
              <t.icon size={22} className="text-gold shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium text-charcoal">{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PRACTICE AREAS */}
      <section className="bg-parchment">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl mb-12">
            <Eyebrow>حوزه‌های تخصصی</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">در کنار شما، در تخصصی‌ترین حوزه‌های حقوقی</h2>
            <p className="text-muted leading-7">هر پرونده، ویژگی‌های حقوقی خاص خود را دارد. تیم ما با تمرکز موضوعی روی هر حوزه، راهکاری متناسب با شرایط شما ارائه می‌دهد.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRACTICE_AREAS.map((area) => (
              <Link
                key={area.slug}
                href={`/practice-areas/${area.slug}`}
                className="bg-card border border-sand hover:border-gold hover:-translate-y-0.5 transition-all rounded-sm p-6 text-right flex flex-col items-start"
              >
                <div className="w-12 h-12 rounded-sm bg-ink flex items-center justify-center mb-5">
                  <area.icon size={22} className="text-gold" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-charcoal mb-2">{area.title}</h3>
                <p className="text-sm text-muted leading-7 mb-4">{area.shortDesc}</p>
                <span className="inline-flex items-center gap-1.5 text-teal font-semibold text-sm mt-auto">
                  بیشتر بدانید <ArrowLeft size={15} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-ink">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl mb-12">
            <Eyebrow dark>چرا {FIRM.name}</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold text-parchment">تعهدی که پشت هر پرونده می‌ایستد</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUs.map((w, i) => (
              <div key={i}>
                <w.icon size={26} className="text-gold mb-4" aria-hidden="true" />
                <h3 className="text-parchment font-bold mb-2">{w.title}</h3>
                <p className="text-sm leading-7 text-parchment/75">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED LAWYERS */}
      <section className="bg-parchment">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <Eyebrow>تیم حقوقی</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-bold text-charcoal">وکلایی که پرونده شما را پیگیری می‌کنند</h2>
            </div>
            <Link href="/lawyers" className="inline-flex items-center gap-1.5 text-teal hover:text-gold font-semibold text-sm transition-colors">
              مشاهده همه وکلا <ArrowLeft size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LAWYERS.map((lw) => (
              <Link
                key={lw.slug}
                href={`/lawyers/${lw.slug}`}
                className="bg-card border border-sand hover:border-gold hover:-translate-y-0.5 transition-all rounded-sm p-6 text-center flex flex-col items-center"
              >
                <Avatar initials={lw.initials} size={72} />
                <h3 className="text-base font-bold text-charcoal mt-4 mb-1">{lw.name}</h3>
                <p className="text-xs text-muted mb-3">{lw.role}</p>
                <span className="text-teal font-semibold text-xs mt-auto">مشاهده پروفایل</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section className="bg-card">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <Eyebrow>وبلاگ حقوقی</Eyebrow>
              <h2 className="text-3xl md:text-4xl font-bold text-charcoal">آخرین مطالب و یادداشت‌های حقوقی</h2>
            </div>
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-teal hover:text-gold font-semibold text-sm transition-colors">
              مشاهده همه مطالب <ArrowLeft size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BLOG_POSTS.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="bg-parchment border border-sand hover:border-gold hover:-translate-y-0.5 transition-all rounded-sm p-6 text-right flex flex-col items-start"
              >
                <span className="text-xs font-semibold text-teal mb-3">{post.category}</span>
                <h3 className="text-base font-bold text-charcoal mb-3 leading-7">{post.title}</h3>
                <p className="text-sm text-muted leading-7 mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-muted mt-auto">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="bg-teal">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-parchment mb-4">برای مشاوره حقوقی تخصصی، همین امروز با ما تماس بگیرید</h2>
          <p className="mb-8 text-parchment/85">کارشناسان ما آماده پاسخ‌گویی به سوالات اولیه شما هستند.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-ink font-semibold px-7 py-3.5 rounded-sm transition-colors">
              درخواست مشاوره <ArrowLeft size={18} aria-hidden="true" />
            </Link>
            <a href={FIRM.phoneHref} className="inline-flex items-center gap-2 border border-parchment/35 hover:bg-parchment hover:text-ink text-parchment px-7 py-3.5 rounded-sm transition-colors">
              <Phone size={18} aria-hidden="true" /> {FIRM.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
