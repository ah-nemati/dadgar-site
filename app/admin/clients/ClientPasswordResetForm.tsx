'use client';

import { useActionState } from 'react';
import { CheckCircle2, KeyRound } from 'lucide-react';
import { resetClientPasswordAction } from './actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ClientPasswordResetForm({ clientId }: { clientId: string }) {
  const action = resetClientPasswordAction.bind(null, clientId);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <details className="dashboard-card mt-6 group">
      <summary className="cursor-pointer list-none p-4 md:p-5 flex items-center justify-between gap-3 font-bold">
        <span className="flex items-center gap-2"><KeyRound size={18} /> تعیین رمز موقت موکل</span>
        <span className="text-xs font-normal text-muted-foreground group-open:hidden">بدون ارسال ایمیل</span>
      </summary>
      <form action={formAction} className="border-t border-border p-4 md:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="temporary-password">رمز موقت جدید</Label>
          <Input id="temporary-password" name="password" type="password" minLength={8} autoComplete="new-password" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="temporary-password-confirm">تکرار رمز موقت</Label>
          <Input id="temporary-password-confirm" name="passwordConfirm" type="password" minLength={8} autoComplete="new-password" required />
        </div>
        <div className="md:col-span-2 space-y-3">
          {state?.error && <Alert variant="destructive"><AlertDescription className="col-start-1">{state.error}</AlertDescription></Alert>}
          {state?.success && <p className="text-sm text-accent flex items-center gap-2"><CheckCircle2 size={16} /> رمز موقت با موفقیت تنظیم شد.</p>}
          <Button type="submit" variant="secondary" disabled={pending}>
            {pending ? <><span className="button-spinner" />در حال تغییر...</> : <><KeyRound size={16} />تنظیم رمز موقت</>}
          </Button>
        </div>
      </form>
    </details>
  );
}
