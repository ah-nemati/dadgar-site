'use client';

import { useActionState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Seal from '@/components/Seal';
import { login } from '../actions';

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-sm w-full">
        <div className="flex justify-center mb-6">
          <Seal size={56} />
        </div>
        <h1 className="text-xl font-bold text-foreground text-center mb-1">ورود به پنل مدیریت</h1>
        <p className="text-sm text-muted-foreground text-center mb-8">این بخش صرفاً برای مدیر سایت است.</p>

        <form action={formAction} className="bg-card border border-border rounded-sm p-6 space-y-5">
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
            {pending ? 'در حال بررسی...' : 'ورود'}
          </Button>
        </form>
      </div>
    </div>
  );
}
