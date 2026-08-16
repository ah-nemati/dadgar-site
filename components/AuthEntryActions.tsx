'use client';

import { useActionState } from 'react';
import Link from '@/components/NoPrefetchLink';
import { useSearchParams } from 'next/navigation';
import { LogIn, Mail, Phone, UserPlus, UserRound } from 'lucide-react';
import { loginAction, signupAction } from '@/app/auth/actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function returnPath(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/account';
  return ['/account', '/admin', '/portal'].some(
    (prefix) => value === prefix || value.startsWith(`${prefix}/`),
  )
    ? value
    : '/account';
}

export function LoginEntryActions() {
  const searchParams = useSearchParams();
  const rawReturnTo = searchParams.get('returnTo');
  const returnTo = rawReturnTo ? returnPath(rawReturnTo) : '';
  const [state, formAction, pending] = useActionState(loginAction, undefined);
  const resetComplete = searchParams.get('reset') === 'success';
  const registered = searchParams.get('registered') === '1';

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="returnTo" value={returnTo} />

      {(resetComplete || registered) && (
        <Alert variant="accent">
          <AlertDescription className="col-start-1">
            {resetComplete
              ? 'رمز عبور تازه ثبت شد. اکنون وارد حساب شوید.'
              : 'حساب ساخته شد. برای ورود، ایمیل و رمز خود را وارد کنید.'}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="login-email">ایمیل</Label>
        <div className="relative">
          <Mail size={17} className="auth-field-icon" aria-hidden="true" />
          <Input
            id="login-email"
            name="email"
            type="email"
            dir="ltr"
            autoComplete="email"
            defaultValue={state?.email ?? ''}
            className="pr-11 text-right"
            required
            autoFocus
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password">رمز عبور</Label>
        <Input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      {state?.error && (
        <Alert variant="destructive">
          <AlertDescription className="col-start-1">{state.error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <span className="button-spinner" aria-hidden="true" /> : <LogIn size={17} aria-hidden="true" />}
        {pending ? 'در حال بررسی...' : 'ورود به پنل'}
      </Button>

      <Button type="button" variant="outline" className="w-full" asChild>
        <Link href={returnTo ? `/signup?returnTo=${encodeURIComponent(returnTo)}` : "/signup"}>
          <UserPlus size={17} aria-hidden="true" />
          ساخت حساب جدید
        </Link>
      </Button>
    </form>
  );
}

export function SignupEntryActions() {
  const searchParams = useSearchParams();
  const rawReturnTo = searchParams.get('returnTo');
  const returnTo = rawReturnTo ? returnPath(rawReturnTo) : '';
  const [state, formAction, pending] = useActionState(signupAction, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="returnTo" value={returnTo} />

      <div className="space-y-2">
        <Label htmlFor="signup-name">نام و نام خانوادگی</Label>
        <div className="relative">
          <UserRound size={17} className="auth-field-icon" aria-hidden="true" />
          <Input
            id="signup-name"
            name="fullName"
            autoComplete="name"
            defaultValue={state?.values?.fullName ?? ''}
            className="pr-11"
            required
            autoFocus
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-phone">شماره موبایل</Label>
        <div className="relative">
          <Phone size={17} className="auth-field-icon" aria-hidden="true" />
          <Input
            id="signup-phone"
            name="phone"
            type="tel"
            dir="ltr"
            inputMode="tel"
            autoComplete="tel"
            defaultValue={state?.values?.phone ?? ''}
            className="pr-11 text-right"
            placeholder="09123456789"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email">ایمیل</Label>
        <div className="relative">
          <Mail size={17} className="auth-field-icon" aria-hidden="true" />
          <Input
            id="signup-email"
            name="email"
            type="email"
            dir="ltr"
            autoComplete="email"
            defaultValue={state?.values?.email ?? ''}
            className="pr-11 text-right"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">رمز عبور</Label>
        <Input
          id="signup-password"
          name="password"
          type="password"
          minLength={12}
          maxLength={128}
          autoComplete="new-password"
          required
        />
        <p className="text-xs leading-6 text-muted-foreground">حداقل ۱۲ کاراکتر</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password-confirm">تکرار رمز عبور</Label>
        <Input
          id="signup-password-confirm"
          name="passwordConfirm"
          type="password"
          minLength={12}
          maxLength={128}
          autoComplete="new-password"
          required
        />
      </div>

      {state?.error && (
        <Alert variant="destructive">
          <AlertDescription className="col-start-1">{state.error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <span className="button-spinner" aria-hidden="true" /> : <UserPlus size={17} aria-hidden="true" />}
        {pending ? 'در حال ساخت حساب...' : 'ساخت حساب'}
      </Button>

      <Button type="button" variant="outline" className="w-full" asChild>
        <Link href={returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : "/login"}>
          <LogIn size={17} aria-hidden="true" />
          قبلاً حساب ساخته‌ام
        </Link>
      </Button>
    </form>
  );
}
