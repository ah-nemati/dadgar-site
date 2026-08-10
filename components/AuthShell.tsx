import type { ReactNode } from 'react';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import Eyebrow from '@/components/Eyebrow';
import PatternStrip from '@/components/PatternStrip';
import Seal from '@/components/Seal';

interface AuthShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

export default function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: AuthShellProps) {
  return (
    <section className="relative flex min-h-[72vh] items-center overflow-hidden bg-parchment py-10 md:py-16">
      <div
        className="pointer-events-none absolute -left-28 top-10 size-80 rounded-full bg-accent/5 blur-3xl"
        aria-hidden="true"
      />
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="grid overflow-hidden rounded-sm border border-border bg-card shadow-[0_24px_80px_rgba(12,63,110,0.12)] md:grid-cols-[0.9fr_1.1fr]">
          <aside className="relative flex min-h-72 flex-col justify-between overflow-hidden bg-ink p-7 text-parchment sm:p-9 md:min-h-[34rem] md:p-10">
            <div
              className="absolute -left-24 -top-24 opacity-[0.06]"
              aria-hidden="true"
            >
              <Seal size={360} tone="cream" />
            </div>

            <div className="relative z-10">
              <Seal size={62} tone="cream" />
              <div className="mt-8">
                <Eyebrow dark>فضای امن موکلین</Eyebrow>
                <h2 className="max-w-sm text-2xl font-bold leading-[1.8] text-parchment md:text-3xl">
                  دسترسی امن به پرونده‌ها، اسناد و پیام‌های خصوصی شما
                </h2>
              </div>
            </div>

            <div className="relative z-10 mt-10 space-y-4 text-sm leading-7 text-parchment/75">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 shrink-0 text-gold-light" size={19} aria-hidden="true" />
                <p>رمز عبور به‌صورت هش‌شده نگهداری می‌شود و نشست کاربری قابل لغو و زمان‌دار است.</p>
              </div>
              <div className="flex items-start gap-3">
                <LockKeyhole className="mt-1 shrink-0 text-gold-light" size={19} aria-hidden="true" />
                <p>دسترسی به پنل فقط پس از تأیید هویت و تعیین سطح دسترسی انجام می‌شود.</p>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0" aria-hidden="true">
              <PatternStrip id="auth-shell-pattern" color="#D8BC7E" />
            </div>
          </aside>

          <div className="flex items-center p-6 sm:p-9 md:p-10 lg:p-12">
            <div className="mx-auto w-full max-w-md">
              <Eyebrow>{eyebrow}</Eyebrow>
              <h1 className="text-2xl font-extrabold leading-10 text-foreground sm:text-3xl">
                {title}
              </h1>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {description}
              </p>
              <div className="mt-7">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
