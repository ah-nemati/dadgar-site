import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { LogIn, ShieldCheck, UserPlus } from 'lucide-react';
import Seal from '@/components/Seal';
import { Button } from '@/components/ui/button';
import { getCurrentAccount, dashboardPath } from '@/lib/session';

export const metadata: Metadata = {
  title: 'ورود امن به حساب کاربری',
  description: 'ورود امن مدیر و موکلان از طریق Auth0.',
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const account = await getCurrentAccount();
  if (account) redirect(dashboardPath(account.role));

  return (
    <section className="bg-parchment min-h-[72vh] flex items-center">
      <div className="max-w-md mx-auto px-6 py-16 w-full text-center">
        <div className="flex justify-center mb-5"><Seal size={58} /></div>
        <h1 className="text-2xl font-bold mb-3">ورود امن به حساب</h1>
        <p className="text-sm text-muted-foreground leading-7 mb-7">
          ورود، ثبت‌نام و بازیابی رمز توسط Auth0 انجام می‌شود. بعد از ورود، نوع پنل به‌صورت خودکار تشخیص داده خواهد شد.
        </p>
        <div className="bg-card border border-border rounded-lg p-7 shadow-sm space-y-4">
          <div className="flex items-start gap-3 text-right rounded-md bg-muted/50 p-4">
            <ShieldCheck className="text-accent shrink-0 mt-1" size={20} />
            <p className="text-sm leading-7">اطلاعات رمز عبور داخل دیتابیس سایت ذخیره نمی‌شود.</p>
          </div>
          <Button asChild className="w-full">
            <a href="/auth/login?returnTo=/account"><LogIn size={17} /> ورود به حساب</a>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <a href="/auth/login?screen_hint=signup&returnTo=/account"><UserPlus size={17} /> ساخت حساب جدید</a>
          </Button>
          <a href="/forgot-password" className="block text-sm font-semibold text-accent hover:text-primary">رمز عبور را فراموش کرده‌ام</a>
        </div>
      </div>
    </section>
  );
}
