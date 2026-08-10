import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import AuthShell from '@/components/AuthShell';
import { LoginEntryActions } from '@/components/AuthEntryActions';
import { dashboardPath, getCurrentAccount } from '@/lib/session';

export const metadata: Metadata = {
  title: 'ورود به حساب کاربری',
  description: 'ورود امن مدیر، وکیل و موکلان به پنل اختصاصی سایت.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const account = await getCurrentAccount();
  if (account) redirect(dashboardPath(account.role));

  return (
    <AuthShell
      eyebrow="ورود کاربران"
      title="ورود به حساب کاربری"
      description="ایمیل و رمز عبور خود را وارد کنید تا به پنل متناسب با نقش حساب دسترسی داشته باشید."
    >
      <Suspense
        fallback={
          <div className="space-y-4" aria-hidden="true">
            <div className="h-20 animate-pulse rounded-sm bg-muted" />
            <div className="h-11 animate-pulse rounded-sm bg-muted" />
            <div className="h-11 animate-pulse rounded-sm bg-muted" />
          </div>
        }
      >
        <LoginEntryActions />
      </Suspense>

      <div className="mt-5 flex items-center justify-between gap-4 text-sm">
        <Link href="/forgot-password" className="font-semibold text-accent transition-colors hover:text-primary">
          رمز عبور را فراموش کرده‌ام
        </Link>
        <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
          بازگشت به سایت
        </Link>
      </div>
    </AuthShell>
  );
}
