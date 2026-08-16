import Link from '@/components/NoPrefetchLink';
import { ArrowLeft, Search } from 'lucide-react';
import Seal from '@/components/Seal';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <section className="relative flex min-h-[72vh] items-center overflow-hidden bg-[linear-gradient(135deg,#e9f8ff,#f8fdff)] px-6 py-20 text-sky-900">
      <div className="pointer-events-none absolute -left-24 top-1/2 size-[28rem] -translate-y-1/2 rounded-full border border-sky-200" aria-hidden="true" />
      <div className="relative mx-auto grid w-full max-w-5xl gap-10 md:grid-cols-[auto_1fr] md:items-center">
        <div className="mx-auto flex size-36 items-center justify-center rounded-full border border-white/10 bg-white/5 md:mx-0"><Seal size={82} tone="cream" /></div>
        <div className="text-center md:text-right">
          <div className="eyebrow eyebrow--dark justify-center md:justify-start"><Search size={15} /><span>خطای ۴۰۴</span></div>
          <h1 className="text-3xl font-extrabold md:text-5xl">صفحه مورد نظر پیدا نشد</h1>
          <p className="mt-4 max-w-xl text-sm leading-8 text-sky-800/70 md:text-base">ممکن است نشانی تغییر کرده باشد یا لینک موردنظر دیگر وجود نداشته باشد. از صفحه اصلی یا بخش خدمات مسیر درست را پیدا کنید.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3 md:justify-start"><Button asChild><Link href="/">بازگشت به صفحه اصلی <ArrowLeft size={16} /></Link></Button><Button asChild variant="ghostLight"><Link href="/practice-areas">حوزه‌های حقوقی</Link></Button></div>
        </div>
      </div>
    </section>
  );
}
