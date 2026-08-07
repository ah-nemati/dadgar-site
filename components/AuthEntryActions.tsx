'use client';

import { useSearchParams } from 'next/navigation';
import { LogIn, ShieldCheck, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

function safeReturnTo(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/account';
  return value;
}

export function LoginEntryActions() {
  const searchParams = useSearchParams();
  const returnTo = safeReturnTo(searchParams.get('returnTo'));
  const hasAuthError = searchParams.has('authError');

  return (
    <div className="space-y-4">
      {hasAuthError && (
        <div className="rounded-sm border border-destructive/30 bg-destructive/10 p-4 text-sm leading-7 text-foreground">
          شروع احراز هویت انجام نشد. تنظیمات سرویس ورود بررسی و اصلاح شده است؛ دوباره تلاش کنید.
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
    </div>
  );
}

export function SignupEntryActions() {
  const searchParams = useSearchParams();
  const returnTo = safeReturnTo(searchParams.get('returnTo'));

  return (
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
    </div>
  );
}
