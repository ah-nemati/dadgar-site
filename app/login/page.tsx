import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LogIn, ShieldCheck, UserPlus } from 'lucide-react';
import AuthShell from '@/components/AuthShell';
import { Button } from '@/components/ui/button';
import { dashboardPath, getCurrentAccount } from '@/lib/session';

export const metadata: Metadata = {
  title: 'ورود به حساب کاربری',
  description: 'ورود امن مدیر و موکلان به پنل اختصاصی سایت.',
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

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string | string[]; authError?: string | string[] }>;
}) {
  const account = await getCurrentAccount();
  if (account) redirect(dashboardPath(account.role));

  const params = await searchParams;
  const returnTo = safeReturnTo(params.returnTo);
  const hasAuthError = Boolean(Array.isArray(params.authError) ? params.authError[0] : params.authError);

  return (
    <AuthShell
      eyebrow="ورود کاربران"
      title="ورود به حساب کاربری"
      description="برای مشاهده پرونده‌ها، پیام‌ها، اسناد و نوبت‌های خود وارد فضای امن سایت شوید."
    >
      <div className="space-y-4">
        {hasAuthError && (
          <div className="rounded-sm border border-destructive/30 bg-destructive/10 p-4 text-sm leading-7 text-foreground">
            شروع احراز هویت انجام نشد. تنظیمات Auth0 و آدرس‌های Callback را بررسی کنید و دوباره تلاش کنید.
          </div>
        )}

        <div className="flex items-start gap-3 rounded-sm border border-accent/20 bg-accent/5 p-4 text-right">
          <ShieldCheck className="mt-1 shrink-0 text-accent" size={19} aria-hidden="true" />
          <p className="text-sm leading-7 text-muted-foreground">
            رمز عبور در دیتابیس سایت ذخیره نمی‌شود و ورود نهایی از مسیر امن احراز هویت انجام می‌شود.
          </p>
        </div>

        <form action="/auth/login" method="get">
          <input type="hidden" name="returnTo" value={returnTo} />
          <Button type="submit" className="w-full">
            <LogIn size={17} aria-hidden="true" />
            ورود امن به پنل
          </Button>
        </form>

        <form action="/auth/login" method="get">
          <input type="hidden" name="screen_hint" value="signup" />
          <input type="hidden" name="returnTo" value={returnTo} />
          <Button type="submit" variant="outline" className="w-full">
            <UserPlus size={17} aria-hidden="true" />
            ساخت حساب جدید
          </Button>
        </form>

        <div className="flex items-center justify-between gap-4 pt-1 text-sm">
          <Link
            href="/forgot-password"
            className="font-semibold text-accent transition-colors hover:text-primary"
          >
            رمز عبور را فراموش کرده‌ام
          </Link>
          <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
            بازگشت به سایت
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
