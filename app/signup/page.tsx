import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from '@/components/NoPrefetchLink';
import { redirect } from 'next/navigation';
import AuthShell from '@/components/AuthShell';
import { SignupEntryActions } from '@/components/AuthEntryActions';
import { dashboardPath, getCurrentAccountForAuthEntry } from '@/lib/session';

export const metadata: Metadata = {
  title: 'ساخت حساب کاربری',
  description: 'ساخت حساب امن موکل برای استفاده از پنل اختصاصی سایت.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function SignupPage() {
  const account = await getCurrentAccountForAuthEntry();
  if (account) redirect(dashboardPath(account.role));

  return (
    <AuthShell
      eyebrow="ثبت‌نام موکلین"
      title="ساخت حساب کاربری"
      description="حساب موکل برای دسترسی به پرونده‌ها، پیام‌ها و خدمات اختصاصی دفتر ساخته می‌شود."
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
