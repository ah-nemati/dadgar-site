'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, KeyRound, Mail } from 'lucide-react';
import { requestPasswordReset } from '@/app/auth/actions';
import Seal from '@/components/Seal';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, undefined);

  return (
    <section className="bg-parchment min-h-[72vh] flex items-center">
      <div className="max-w-md mx-auto px-6 py-16 w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5"><Seal size={58} /></div>
          <h1 className="text-2xl font-bold mb-2">بازیابی رمز عبور</h1>
          <p className="text-sm text-muted-foreground leading-7">
            ایمیل حساب را وارد کنید تا لینک تعیین رمز جدید ارسال شود.
          </p>
        </div>

        <form action={formAction} className="bg-card border border-border rounded-lg p-7 space-y-5 shadow-sm">
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
                defaultValue={state?.email ?? ''}
                required
                autoFocus
                className="pr-11 text-right"
              />
            </div>
          </div>

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

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? <span className="button-spinner" aria-hidden="true" /> : <KeyRound size={17} aria-hidden="true" />}
            {pending ? 'در حال ارسال...' : 'ارسال لینک بازیابی'}
          </Button>
        </form>

        <p className="text-center text-sm mt-6">
          <Link href="/login" className="inline-flex items-center gap-2 text-accent hover:text-primary font-semibold transition-colors">
            <ArrowRight size={16} aria-hidden="true" />
            بازگشت به ورود
          </Link>
        </p>
      </div>
    </section>
  );
}
