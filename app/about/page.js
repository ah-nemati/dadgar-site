import Link from 'next/link';
import { Users, Lock, FileText, BookOpen, ArrowLeft } from 'lucide-react';
import PageHero from '@/components/PageHero';
import Eyebrow from '@/components/Eyebrow';
import Seal from '@/components/Seal';
import { FIRM } from '@/data/firm';

export const metadata = {
  title: 'درباره ما',
  description: `آشنایی با تاریخچه، ارزش‌ها و روش کاری ${FIRM.name}.`,
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

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="درباره ما" title="موسسه‌ای که در مسیر حقوقی، همراه شماست" description="آشنایی با تاریخچه، ارزش‌ها و روش کاری موسسه حقوقی دادگر." />

      <section className="bg-parchment">
        <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Eyebrow>معرفی موسسه</Eyebrow>
            <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-6">داستان ما</h2>
            <p className="text-muted leading-8 mb-5">
              {FIRM.name} از سال {FIRM.established} فعالیت خود را با هدف ارائه خدمات حقوقی تخصصی، شفاف و قابل‌اعتماد آغاز کرد.
              در طول این سال‌ها، تیم ما با تمرکز بر حوزه‌های حقوق خانواده، تجاری، کیفری، ملکی، کار و قراردادها، در کنار موکلان
              متعددی در حل مسائل حقوقی، از مشاوره‌های ساده تا پرونده‌های پیچیده، حضور داشته است.
            </p>
            <p className="text-muted leading-8">
              رویکرد ما ترکیبی از دقت حقوقی و همراهی انسانی است؛ معتقدیم هر پرونده، صرف‌نظر از حجم یا پیچیدگی آن،
              به همان اندازه شایسته توجه، شفافیت و پیگیری جدی است.
            </p>
          </div>
          <div className="bg-ink rounded-sm p-8 h-fit">
            <Seal size={40} tone="cream" />
            <ul className="mt-6 flex flex-col gap-5">
              <li>
                <div className="text-2xl font-bold text-gold font-display">{FIRM.established}</div>
                <div className="text-xs mt-1 text-parchment/75">سال تاسیس موسسه</div>
              </li>
              <li>
                <div className="text-2xl font-bold text-gold font-display">۶ حوزه</div>
                <div className="text-xs mt-1 text-parchment/75">تخصص حقوقی فعال</div>
              </li>
              <li>
                <div className="text-2xl font-bold text-gold font-display">{FIRM.hours}</div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal">اصولی که کار ما را شکل می‌دهد</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div key={i}>
                <div className="w-12 h-12 rounded-sm bg-ink flex items-center justify-center mb-5">
                  <v.icon size={20} className="text-gold" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-charcoal mb-2">{v.title}</h3>
                <p className="text-sm text-muted leading-7">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-parchment">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl mb-12">
            <Eyebrow>روش کار</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal">از مشاوره اول تا نتیجه نهایی</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative pt-2">
                <div className="font-display text-3xl text-gold mb-4">{s.n}</div>
                <h3 className="font-bold text-charcoal mb-2">{s.title}</h3>
                <p className="text-sm text-muted leading-7">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-teal">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-parchment mb-6">مایلید بیشتر با تیم حقوقی ما آشنا شوید؟</h2>
          <Link href="/lawyers" className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-ink font-semibold px-7 py-3.5 rounded-sm transition-colors">
            مشاهده تیم حقوقی <ArrowLeft size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
