'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { clientLogIn } from '@/app/client-login/actions';

export default function ClientLoginForm() {
  const [state, formAction, pending] = useActionState(clientLogIn, undefined);

  return (
    <>
      <form action={formAction} className="bg-card border border-border rounded-sm p-7 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">ایمیل</Label>
          <div className="relative">
            <Mail size={16} className="text-muted-foreground absolute" style={{ right: 14, top: '50%', transform: 'translateY(-50%)' }} aria-hidden="true" />
            <Input id="email" name="email" type="email" dir="ltr" required autoFocus style={{ paddingRight: 40, paddingLeft: 16, textAlign: 'right' }} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">رمز عبور</Label>
          <div className="relative">
            <Lock size={16} className="text-muted-foreground absolute" style={{ right: 14, top: '50%', transform: 'translateY(-50%)' }} aria-hidden="true" />
            <Input id="password" name="password" type="password" required style={{ paddingRight: 40, paddingLeft: 16 }} />
          </div>
          {state?.error && <p className="text-xs text-destructive">{state.error}</p>}
        </div>

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? 'در حال ورود...' : (<>ورود <LogIn size={16} aria-hidden="true" /></>)}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        هنوز حساب کاربری نساخته‌اید؟{' '}
        <Link href="/client-login/signup" className="text-teal hover:text-gold transition-colors font-semibold">
          ثبت‌نام کنید
        </Link>
      </p>
    </>
  );
}
