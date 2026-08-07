import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import AuthShell from '@/components/AuthShell';
import { LoginEntryActions } from '@/components/AuthEntryActions';

export const metadata: Metadata = {
  title: 'ورود به حساب کاربری',
  description: 'ورود امن مدیر و موکلان به پنل اختصاصی سایت.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-static';

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="ورود کاربران"
      title="ورود به حساب کاربری"
      description="برای مشاهده پرونده‌ها، پیام‌ها، اسناد و نوبت‌های خود وارد فضای امن سایت شوید."
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
