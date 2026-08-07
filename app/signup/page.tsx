import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import AuthShell from '@/components/AuthShell';
import { SignupEntryActions } from '@/components/AuthEntryActions';

export const metadata: Metadata = {
  title: 'ساخت حساب کاربری',
  description: 'ساخت حساب امن موکل برای استفاده از پنل اختصاصی سایت.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-static';

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="ثبت‌نام موکلین"
      title="ساخت حساب کاربری"
      description="حساب شما برای دسترسی به پرونده‌ها، پیام‌ها و خدمات اختصاصی دفتر استفاده می‌شود."
    >
      <Suspense
        fallback={
          <div className="space-y-4" aria-hidden="true">
            <div className="h-24 animate-pulse rounded-sm bg-muted" />
            <div className="h-11 animate-pulse rounded-sm bg-muted" />
            <div className="h-11 animate-pulse rounded-sm bg-muted" />
          </div>
        }
      >
        <SignupEntryActions />
      </Suspense>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        <Link href="/" className="font-semibold text-accent transition-colors hover:text-primary">
          بازگشت به سایت
        </Link>
      </p>
    </AuthShell>
  );
}
