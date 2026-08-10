'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, KeyRound, Mail } from 'lucide-react';
import { requestPasswordReset } from '@/app/auth/actions';
import AuthShell from '@/components/AuthShell';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, undefined);

  return (
    <AuthShell
      eyebrow="بازیابی دسترسی"
      title="بازیابی رمز عبور"
      description="ایمیل حساب خود را وارد کنید تا لینک امن تعیین رمز جدید برای شما ارسال شود."
    >
      <form action={formAction} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">ایمیل حساب</Label>
          <div className="relative">
            <Mail size={17} className="auth-field-icon" aria-hidden="true" />
            <Input
              id="email"
              name="email"
              type="email"
              dir="ltr"
              autoComplete="email"
              defaultValue={state?.email ?? ''}
              required
              autoFocus
              className="pr-11 text-right"
              placeholder="name@example.com"
            />
          </div>
        </div>

        {state?.info && (
          <Alert variant="accent">
            <CheckCircle2 />
            <AlertDescription>{state.info}</AlertDescription>
          </Alert>
        )}

        {state?.developmentResetUrl && (
          <Alert>
            <AlertDescription className="col-start-1 leading-7">
              فقط در محیط توسعه: {' '}
              <Link className="font-semibold text-accent" href={state.developmentResetUrl}>
                باز کردن لینک تعیین رمز
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {state?.error && (
          <Alert variant="destructive">
            <AlertDescription className="col-start-1">
              {state.error}
            </AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? (
            <span className="button-spinner" aria-hidden="true" />
          ) : (
            <KeyRound size={17} aria-hidden="true" />
          )}
          {pending ? 'در حال ارسال...' : 'ارسال لینک بازیابی'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 font-semibold text-accent transition-colors hover:text-primary"
        >
          <ArrowRight size={16} aria-hidden="true" />
          بازگشت به ورود
        </Link>
      </p>
    </AuthShell>
  );
}
