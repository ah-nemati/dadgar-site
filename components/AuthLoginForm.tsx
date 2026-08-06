
'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { LogIn, Mail, Lock, ShieldCheck } from 'lucide-react';
import { signIn } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AuthLoginForm() {
  const [state, formAction, pending] = useActionState(signIn, undefined);

  return (
    <>
      <form action={formAction} className="bg-card border border-border rounded-lg p-7 space-y-5 shadow-sm">
        <Alert variant="accent">
          <ShieldCheck />
          <AlertDescription>
            مدیر و کاربران عادی از همین صفحه وارد می‌شوند و بعد از ورود، به‌صورت خودکار به پنل مناسب هدایت خواهند شد.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="email">ایمیل</Label>
          <div className="relative">
            <Mail size={17} className="auth-field-icon" aria-hidden="true" />
            <Input
              id="email"
              name="email"
              type="email"
              dir="ltr"
              autoComplete="email"
              required
              autoFocus
              className="pr-11 text-right"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">رمز عبور</Label>
          <div className="relative">
            <Lock size={17} className="auth-field-icon" aria-hidden="true" />
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="pr-11"
            />
          </div>
        </div>

        {state?.error && (
          <Alert variant="destructive">
            <AlertDescription className="col-start-1">{state.error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? (
            <>
              <span className="button-spinner" aria-hidden="true" />
              در حال ورود...
            </>
          ) : (
            <>
              ورود به حساب
              <LogIn size={17} aria-hidden="true" />
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        حساب کاربری ندارید؟{' '}
        <Link href="/signup" className="text-accent hover:text-primary font-semibold transition-colors">
          ثبت‌نام کنید
        </Link>
      </p>
    </>
  );
}
