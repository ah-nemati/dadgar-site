import type { ReactNode } from 'react';
import { LockKeyhole, ShieldCheck, Scale } from 'lucide-react';
import Eyebrow from '@/components/Eyebrow';
import Seal from '@/components/Seal';

interface AuthShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

export default function AuthShell({ eyebrow, title, description, children }: AuthShellProps) {
  return (
    <section className="relative overflow-hidden py-10 md:py-16">
      <div className="pointer-events-none absolute -right-24 top-16 size-72 rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid overflow-hidden rounded-[1.35rem] border border-border bg-card shadow-[0_28px_90px_rgba(2,132,199,.12)] lg:grid-cols-[.88fr_1.12fr]">
          <aside className="relative hidden min-h-[38rem] overflow-hidden border-l border-sky-100 bg-[linear-gradient(160deg,#e6f6ff,#f7fcff)] p-10 text-sky-900 lg:flex lg:flex-col lg:justify-between">
            <div className="absolute -left-24 -top-24 opacity-[0.07]" aria-hidden="true">
              <Seal size={380} tone="cream" />
            </div>
            <div className="relative z-10">
              <Seal size={58} />
              <Eyebrow dark>سامانه امن موکلین</Eyebrow>
              <h2 className="max-w-md text-3xl font-extrabold leading-[1.75] text-sky-900">
                پرونده، مدارک و گفت‌وگوهای خصوصی در یک فضای منظم و امن
              </h2>
              <p className="mt-5 max-w-md text-sm leading-8 text-sky-800/70">
                ورود به حساب فقط برای دسترسی به اطلاعات اختصاصی شماست؛ صفحات عمومی سایت بدون ورود قابل استفاده‌اند.
              </p>
            </div>

            <div className="relative z-10 grid gap-3">
              <div className="flex items-start gap-3 rounded-xl border border-sky-200 bg-white/70 p-4">
                <ShieldCheck className="mt-1 shrink-0 text-sky-500" size={19} aria-hidden="true" />
                <div><p className="text-sm font-bold text-sky-900">محرمانگی دسترسی</p><p className="mt-1 text-xs leading-6 text-sky-800/65">اطلاعات پنل برای حساب شما و افراد مجاز دفتر نمایش داده می‌شود.</p></div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-sky-200 bg-white/70 p-4">
                <LockKeyhole className="mt-1 shrink-0 text-sky-500" size={19} aria-hidden="true" />
                <div><p className="text-sm font-bold text-sky-900">ورود محافظت‌شده</p><p className="mt-1 text-xs leading-6 text-sky-800/65">رمز عبور هش می‌شود و نشست کاربری محدود و قابل لغو است.</p></div>
              </div>
            </div>
          </aside>

          <div className="relative flex min-h-[34rem] items-center p-6 sm:p-10 lg:p-14">
            <div className="absolute left-8 top-8 hidden text-border sm:block" aria-hidden="true"><Scale size={32} strokeWidth={1.2} /></div>
            <div className="mx-auto w-full max-w-md">
              <Eyebrow>{eyebrow}</Eyebrow>
              <h1 className="text-3xl font-extrabold leading-[1.55] text-foreground sm:text-4xl">{title}</h1>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
              <div className="mt-8">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
