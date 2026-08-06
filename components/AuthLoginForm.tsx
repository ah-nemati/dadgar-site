'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { CheckCircle2, LogIn, Mail, Lock, RefreshCw, ShieldCheck } from 'lucide-react';
import { resendConfirmation, signIn } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AuthLoginFormProps {
  initialNotice?: string;
  initialError?: string;
  initialErrorCode?: string;
  initialEmail?: string;
}

function ResendConfirmationForm({ email }: { email: string }) {
  const [state, formAction, pending] = useActionState(resendConfirmation, undefined);

  return (
    <div className="mt-4 space-y-3">
      {state?.info && (
        <Alert variant="accent">
          <CheckCircle2 />
          <AlertDescription>{state.info}</AlertDescription>
        </Alert>
      )}
      {state?.error && (
        <Alert variant="destructive">
          <AlertDescription className="col-start-1">
            {state.error}
            {state.errorCode && (
              <span className="block mt-1 text-xs" dir="ltr">code: {state.errorCode}</span>
            )}
          </AlertDescription>
        </Alert>
      )}
      {!state?.info && (
        <form action={formAction}>
          <input type="hidden" name="email" value={email} />
          <Button type="submit" variant="outline" size="sm" disabled={pending} className="w-full">
            {pending ? <span className="button-spinner" aria-hidden="true" /> : <RefreshCw size={16} aria-hidden="true" />}
            ارسال مجدد ایمیل تأیید
          </Button>
        </form>
      )}
    </div>
  );
}

export default function AuthLoginForm({
  initialNotice,
  initialError,
  initialErrorCode,
  initialEmail = '',
}: AuthLoginFormProps) {
  const [state, formAction, pending] = useActionState(signIn, undefined);
  const emailForActions = state?.email || initialEmail;

  return (
    <>
      {initialNotice && (
        <Alert variant="accent" className="mb-5">
          <CheckCircle2 />
          <AlertDescription>{initialNotice}</AlertDescription>
        </Alert>
      )}

      {initialError && (
        <Alert variant="destructive" className="mb-5">
          <AlertDescription className="col-start-1">
            {initialError}
            {initialErrorCode && (
              <span className="block mt-1 text-xs" dir="ltr">code: {initialErrorCode}</span>
            )}
          </AlertDescription>
        </Alert>
      )}

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
              defaultValue={emailForActions}
              required
              autoFocus
              className="pr-11 text-right"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="password">رمز عبور</Label>
            <Link href="/forgot-password" className="text-xs text-accent hover:text-primary font-semibold transition-colors">
              فراموشی رمز عبور
            </Link>
          </div>
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
            <AlertDescription className="col-start-1">
              {state.error}
              {state.errorCode && (
                <span className="block mt-1 text-xs" dir="ltr">code: {state.errorCode}</span>
              )}
            </AlertDescription>
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

      {state?.canResendConfirmation && emailForActions && (
        <ResendConfirmationForm email={emailForActions} />
      )}

      {state?.canResetPassword && (
        <p className="text-center text-sm mt-4">
          <Link href="/forgot-password" className="text-accent hover:text-primary font-semibold transition-colors">
            بازیابی رمز عبور
          </Link>
        </p>
      )}

      <p className="text-center text-sm text-muted-foreground mt-6">
        حساب کاربری ندارید؟{' '}
        <Link href="/signup" className="text-accent hover:text-primary font-semibold transition-colors">
          ثبت‌نام کنید
        </Link>
      </p>
    </>
  );
}
