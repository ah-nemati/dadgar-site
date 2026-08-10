'use client';

import { useActionState } from 'react';
import { CheckCircle2, UserPlus } from 'lucide-react';
import { createUserAccountAction } from './actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ClientCreateForm() {
  const [state, formAction, pending] = useActionState(createUserAccountAction, undefined);

  return (
    <details className="dashboard-card mb-5 group">
      <summary className="cursor-pointer list-none p-4 md:p-5 flex items-center justify-between gap-3 font-bold">
        <span className="flex items-center gap-2"><UserPlus size={18} /> ساخت حساب کاربر</span>
        <span className="text-xs font-normal text-muted-foreground group-open:hidden">نمایش فرم</span>
      </summary>
      <form action={formAction} className="border-t border-border p-4 md:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="client-full-name">نام و نام خانوادگی</Label>
          <Input id="client-full-name" name="fullName" autoComplete="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client-phone">شماره تماس</Label>
          <Input id="client-phone" name="phone" type="tel" autoComplete="tel" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client-email">ایمیل</Label>
          <Input id="client-email" name="email" type="email" dir="ltr" className="text-right" autoComplete="off" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client-password">رمز عبور موقت</Label>
          <Input id="client-password" name="password" type="password" minLength={12} maxLength={128} autoComplete="new-password" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client-password-confirm">تکرار رمز عبور موقت</Label>
          <Input id="client-password-confirm" name="passwordConfirm" type="password" minLength={12} maxLength={128} autoComplete="new-password" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client-role">نقش</Label>
          <select id="client-role" name="role" defaultValue="CLIENT" className="h-10 w-full rounded-sm border border-input bg-background px-3 text-sm" required>
            <option value="CLIENT">موکل</option>
            <option value="LAWYER">وکیل</option>
            <option value="ADMIN">مدیر</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="client-license-number">شماره پروانه وکیل</Label>
          <Input id="client-license-number" name="licenseNumber" inputMode="numeric" placeholder="فقط برای نقش وکیل" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="client-education">تحصیلات وکیل</Label>
          <textarea id="client-education" name="education" rows={3} className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm leading-7" placeholder="هر مدرک در یک خط؛ فقط برای نقش وکیل" />
        </div>

        <div className="md:col-span-2 space-y-3">
          {state?.error && <Alert variant="destructive"><AlertDescription className="col-start-1">{state.error}</AlertDescription></Alert>}
          {state?.success && <p className="text-sm text-accent flex items-center gap-2"><CheckCircle2 size={16} /> حساب کاربر ساخته شد.</p>}
          <Button type="submit" disabled={pending}>
            {pending ? <><span className="button-spinner" />در حال ساخت...</> : <><UserPlus size={16} />ساخت حساب</>}
          </Button>
        </div>
      </form>
    </details>
  );
}
