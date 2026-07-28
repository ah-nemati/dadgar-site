'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { User, Phone, Mail, Lock, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Seal from '@/components/Seal';
import { clientSignUp } from '../actions';

export default function ClientSignupPage() {
  const [state, formAction, pending] = useActionState(clientSignUp, undefined);

  if (state?.info) {
    return (
      <section className="bg-parchment flex items-center" style={{ minHeight: '70vh' }}>
        <div className="max-w-md mx-auto px-6 py-20 w-full text-center">
          <div className="flex justify-center mb-5">
            <Seal size={52} />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-3">تقریباً تمام شد</h1>
          <p className="text-muted-foreground leading-7">{state.info}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-parchment" style={{ minHeight: '70vh' }}>
      <div className="max-w-md mx-auto px-6 py-16 w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <Seal size={52} />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">ساخت حساب کاربری</h1>
          <p className="text-sm text-muted-foreground">برای پیگیری درخواست‌های خود، یک حساب کاربری بسازید.</p>
        </div>

        <form action={formAction} className="bg-card border border-border rounded-sm p-7 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fullName">نام و نام خانوادگی</Label>
            <div className="relative">
              <User size={16} className="text-muted-foreground absolute" style={{ right: 14, top: '50%', transform: 'translateY(-50%)' }} aria-hidden="true" />
              <Input id="fullName" name="fullName" required style={{ paddingRight: 40, paddingLeft: 16 }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">شماره تماس</Label>
            <div className="relative">
              <Phone size={16} className="text-muted-foreground absolute" style={{ right: 14, top: '50%', transform: 'translateY(-50%)' }} aria-hidden="true" />
              <Input id="phone" name="phone" type="tel" required style={{ paddingRight: 40, paddingLeft: 16 }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">ایمیل</Label>
            <div className="relative">
              <Mail size={16} className="text-muted-foreground absolute" style={{ right: 14, top: '50%', transform: 'translateY(-50%)' }} aria-hidden="true" />
              <Input id="email" name="email" type="email" dir="ltr" required style={{ paddingRight: 40, paddingLeft: 16, textAlign: 'right' }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">رمز عبور (حداقل ۶ کاراکتر)</Label>
            <div className="relative">
              <Lock size={16} className="text-muted-foreground absolute" style={{ right: 14, top: '50%', transform: 'translateY(-50%)' }} aria-hidden="true" />
              <Input id="password" name="password" type="password" required minLength={6} style={{ paddingRight: 40, paddingLeft: 16 }} />
            </div>
            {state?.error && <p className="text-xs text-destructive">{state.error}</p>}
          </div>

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? 'در حال ثبت‌نام...' : (<>ثبت‌نام <UserPlus size={16} aria-hidden="true" /></>)}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          قبلاً ثبت‌نام کرده‌اید؟{' '}
          <Link href="/client-login" className="text-teal hover:text-gold transition-colors font-semibold">
            وارد شوید
          </Link>
        </p>
      </div>
    </section>
  );
}
