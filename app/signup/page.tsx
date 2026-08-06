
'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Lock, Mail, Phone, User, UserPlus } from 'lucide-react';
import { signUp } from '@/app/auth/actions';
import Seal from '@/components/Seal';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signUp, undefined);

  if (state?.info) {
    return (
      <section className="bg-parchment min-h-[72vh] flex items-center">
        <div className="max-w-md mx-auto px-6 py-16 w-full text-center">
          <div className="flex justify-center mb-5"><Seal size={58} /></div>
          <CheckCircle2 size={36} className="text-accent mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-2xl font-bold mb-3">ثبت‌نام انجام شد</h1>
          <p className="text-muted-foreground leading-8 mb-6">{state.info}</p>
          <Button asChild><Link href="/login">بازگشت به صفحه ورود</Link></Button>
        </div>
      </section>
    );
  }

  const fields = [
    { id: 'fullName', label: 'نام و نام خانوادگی', type: 'text', icon: User, autoComplete: 'name' },
    { id: 'phone', label: 'شماره تماس', type: 'tel', icon: Phone, autoComplete: 'tel' },
    { id: 'email', label: 'ایمیل', type: 'email', icon: Mail, autoComplete: 'email' },
    { id: 'password', label: 'رمز عبور (حداقل ۸ کاراکتر)', type: 'password', icon: Lock, autoComplete: 'new-password' },
    { id: 'passwordConfirm', label: 'تکرار رمز عبور', type: 'password', icon: Lock, autoComplete: 'new-password' },
  ] as const;

  return (
    <section className="bg-parchment min-h-[72vh]">
      <div className="max-w-md mx-auto px-6 py-14 w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5"><Seal size={58} /></div>
          <h1 className="text-2xl font-bold mb-2">ساخت حساب کاربری</h1>
          <p className="text-sm text-muted-foreground">برای استفاده از پنل موکلین ثبت‌نام کنید.</p>
        </div>

        <form action={formAction} className="bg-card border border-border rounded-lg p-7 space-y-5 shadow-sm">
          {fields.map(({ id, label, type, icon: Icon, autoComplete }) => (
            <div className="space-y-2" key={id}>
              <Label htmlFor={id}>{label}</Label>
              <div className="relative">
                <Icon size={17} className="auth-field-icon" aria-hidden="true" />
                <Input
                  id={id}
                  name={id}
                  type={type}
                  autoComplete={autoComplete}
                  dir={type === 'email' ? 'ltr' : undefined}
                  minLength={type === 'password' ? 8 : undefined}
                  required
                  className={`pr-11 ${type === 'email' ? 'text-right' : ''}`}
                />
              </div>
            </div>
          ))}

          {state?.error && (
            <Alert variant="destructive">
              <AlertDescription className="col-start-1">{state.error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
              <><span className="button-spinner" aria-hidden="true" />در حال ثبت‌نام...</>
            ) : (
              <>ثبت‌نام<UserPlus size={17} aria-hidden="true" /></>
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          قبلاً ثبت‌نام کرده‌اید؟{' '}
          <Link href="/login" className="text-accent hover:text-primary font-semibold transition-colors">
            وارد شوید
          </Link>
        </p>
      </div>
    </section>
  );
}
