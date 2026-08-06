
'use client';

import { useActionState } from 'react';
import { CheckCircle2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { updateProfileAction } from './actions';
import type { Profile } from '@/types/content';

export default function PortalProfileForm({ profile }: { profile: Profile | null }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, undefined);

  return (
    <form action={formAction} className="dashboard-card p-6 space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">ایمیل حساب</Label>
        <div className="relative">
          <Mail size={17} className="auth-field-icon" />
          <Input id="email" value={profile?.email ?? ''} disabled dir="ltr" className="pr-11 text-right" />
        </div>
        <p className="text-xs text-muted-foreground">برای تغییر ایمیل با دفتر تماس بگیرید.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">نام و نام خانوادگی</Label>
        <Input id="fullName" name="fullName" defaultValue={profile?.fullName ?? ''} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">شماره تماس</Label>
        <Input id="phone" name="phone" type="tel" defaultValue={profile?.phone ?? ''} required />
      </div>

      {state?.error && <Alert variant="destructive"><AlertDescription className="col-start-1">{state.error}</AlertDescription></Alert>}
      {state?.success && <p className="text-sm text-accent flex items-center gap-2"><CheckCircle2 size={16} /> اطلاعات با موفقیت ذخیره شد.</p>}

      <Button type="submit" disabled={pending}>
        {pending ? <><span className="button-spinner" />در حال ذخیره...</> : 'ذخیره تغییرات'}
      </Button>
    </form>
  );
}
