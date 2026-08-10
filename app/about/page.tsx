import Link from '@/components/NoPrefetchLink';
import type { Metadata } from 'next';
import { Users, Lock, FileText, BookOpen, ArrowLeft } from 'lucide-react';
import PageHero from '@/components/PageHero';
import Eyebrow from '@/components/Eyebrow';
import Seal from '@/components/Seal';
import { Button } from '@/components/ui/button';
import { getFirm } from '@/lib/content/firm';

export const metadata: Metadata = {
  alternates: { canonical: '/about' },
  title: 'درباره ما',
  description: 'آشنایی با مجید سواری، وکیل پایه یک دادگستری، روش کاری دفتر و خدمات آنلاین سراسر ایران و حضوری در اهواز.',
  keywords: ['مجید سواری', 'وکیل پایه یک دادگستری اهواز', 'کانون وکلای خوزستان', 'درباره وکیل اهواز'],
};

const values = [
  { icon: Users, title: 'تعهد به موکل', text: 'منافع و آرامش خاطر موکل، معیار اصلی تصمیم‌گیری ماست، در هر مرحله از پرونده.' },
  { icon: Lock, title: 'محرمانگی', text: 'اطلاعات و اسناد هر پرونده، صرفاً در اختیار تیم مسئول همان پرونده قرار می‌گیرد.' },
  { icon: FileText, title: 'شفافیت', text: 'هزینه، زمان‌بندی و مراحل پیش‌رو، از همان ابتدا به‌روشنی برای موکل تشریح می‌شود.' },
  { icon: BookOpen, title: 'تخصص و به‌روز بودن', text: 'پیگیری مستمر تغییرات قانونی و رویه قضایی، بخشی جدایی‌ناپذیر از کار ماست.' },
];

const steps = [
  { n: '۰۱', title: 'مشاوره اولیه و بررسی پرونده', text: 'در نخستین جلسه، موضوع، مستندات و اهداف موکل به‌دقت بررسی می‌شود.' },
  { n: '۰۲', title: 'تحلیل حقوقی و تدوین راهکار', text: 'بر اساس بررسی‌های اولیه، مسیرهای حقوقی ممکن و پیامد هرکدام تحلیل می‌شود.' },
  { n: '۰۳', title: 'اقدام و پیگیری حقوقی', text: 'راهکار انتخاب‌شده، با پیگیری فعال در مراجع مربوطه به اجرا گذاشته می‌شود.' },
  { n: '۰۴', title: 'گزارش‌دهی مستمر تا نتیجه نهایی', text: 'موکل در هر مرحله از پیشرفت پرونده مطلع می‌شود، تا رسیدن به نتیجه نهایی.' },
];

export default async function AboutPage() {
  const firm = await getFirm();

  return (
    <>
      <PageHero eyebrow="درباره ما" title="وکیلی که در مسیر حقوقی، همراه شماست" description="آشنایی با روش کاری و حوزه‌های خدمات دفتر وکالت مجید سواری؛ آنلاین سراسر ایران و حضوری در اهواز." />

      <section className="bg-parchment">
        <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Eyebrow>معرفی موسسه</Eyebrow>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">داستان ما</h2>
            <p className="text-muted-foreground leading-8 mb-5">
              {firm.name} با هدف ارائه خدمات حقوقی شفاف و قابل‌اعتماد فعالیت می‌کند. خدمات دفتر، حوزه‌های اصلی
              حقوقی و کیفری را پوشش می‌دهد و برای متقاضیان سراسر ایران به‌صورت غیرحضوری و برای مراجعه‌کنندگان
              اهواز به‌صورت حضوری ارائه می‌شود.
            </p>
            <p className="text-muted-foreground leading-8">
              رویکرد ما ترکیبی از دقت حقوقی و همراهی انسانی است؛ معتقدیم هر پرونده، صرف‌نظر از حجم یا پیچیدگی آن،
              به همان اندازه شایسته توجه، شفافیت و پیگیری جدی است.
            </p>
          </div>
          <div className="bg-ink rounded-sm p-8 h-fit">
            <Seal size={40} tone="cream" />
            <ul className="mt-6 flex flex-col gap-5">
              <li>
                <div className="text-2xl font-bold text-gold font-display">پایه یک</div>
                <div className="text-xs mt-1 text-parchment/75">پروانه وکالت دادگستری</div>
              </li>
              <li>
                <div className="text-2xl font-bold text-gold font-display">۹ حوزه</div>
                <div className="text-xs mt-1 text-parchment/75">اصلی حقوقی و کیفری</div>
              </li>
              <li>
                <div className="text-2xl font-bold text-gold font-display">{firm.hours}</div>
                <div className="text-xs mt-1 text-parchment/75">ساعات پاسخ‌گویی دفتر</div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-card">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl mb-12">
            <Eyebrow>ارزش‌های ما</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">اصولی که کار ما را شکل می‌دهد</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div key={i}>
                <div className="w-12 h-12 rounded-sm bg-ink flex items-center justify-center mb-5">
                  <v.icon size={20} className="text-gold" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-7">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-parchment">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl mb-12">
            <Eyebrow>روش کار</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">از مشاوره اول تا نتیجه نهایی</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative pt-2">
                <div className="font-display text-3xl text-gold mb-4">{s.n}</div>
                <h3 className="font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-7">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-teal">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-parchment mb-6">مایلید بیشتر با وکیل پرونده خود آشنا شوید؟</h2>
          <Button size="lg" asChild>
            <Link href="/lawyers">
              مشاهده پروفایل وکیل <ArrowLeft size={18} aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
