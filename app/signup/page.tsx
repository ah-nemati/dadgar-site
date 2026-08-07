import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LogIn, UserPlus } from 'lucide-react';
import AuthShell from '@/components/AuthShell';
import { Button } from '@/components/ui/button';
import { dashboardPath, getCurrentAccount } from '@/lib/session';

export const metadata: Metadata = {
  title: 'ساخت حساب کاربری',
  description: 'ساخت حساب امن موکل برای استفاده از پنل اختصاصی سایت.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

function safeReturnTo(value: string | string[] | undefined): string {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (!candidate || !candidate.startsWith('/') || candidate.startsWith('//')) {
    return '/account';
  }
  return candidate;
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}) {
  const account = await getCurrentAccount();
  if (account) redirect(dashboardPath(account.role));

  const params = await searchParams;
  const returnTo = safeReturnTo(params.returnTo);

  return (
    <AuthShell
      eyebrow="ثبت‌نام موکلین"
      title="ساخت حساب کاربری"
      description="حساب شما برای دسترسی به پرونده‌ها، پیام‌ها و خدمات اختصاصی دفتر استفاده می‌شود."
    >
      <div className="space-y-4">
        <div className="rounded-sm border border-border bg-muted/35 p-4 text-sm leading-7 text-muted-foreground">
          پس از ساخت حساب، پروفایل پنل شما به‌صورت خودکار ایجاد می‌شود و مدیر دفتر می‌تواند پرونده‌ها و خدمات مرتبط را به حساب شما متصل کند.
        </div>

        <form action="/auth/login" method="get">
          <input type="hidden" name="screen_hint" value="signup" />
          <input type="hidden" name="returnTo" value={returnTo} />
          <Button type="submit" className="w-full">
            <UserPlus size={17} aria-hidden="true" />
            ادامه و ساخت حساب
          </Button>
        </form>

        <form action="/auth/login" method="get">
          <input type="hidden" name="returnTo" value={returnTo} />
          <Button type="submit" variant="outline" className="w-full">
            <LogIn size={17} aria-hidden="true" />
            قبلاً حساب ساخته‌ام
          </Button>
        </form>

        <p className="pt-1 text-center text-sm text-muted-foreground">
          <Link href="/" className="font-semibold text-accent transition-colors hover:text-primary">
            بازگشت به سایت
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
