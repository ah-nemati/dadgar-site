'use client';

import { useActionState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateProfileAction } from './actions';
import type { Profile } from '@/types/content';

export default function PortalProfileForm({ profile }: { profile: Profile | null }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, undefined);

  return (
    <form action={formAction} className="bg-card border border-border rounded-sm p-6 space-y-5 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="fullName">نام و نام خانوادگی</Label>
        <Input id="fullName" name="fullName" defaultValue={profile?.fullName ?? ''} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">شماره تماس</Label>
        <Input id="phone" name="phone" type="tel" defaultValue={profile?.phone ?? ''} required />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-accent flex items-center gap-1.5">
          <CheckCircle2 size={16} aria-hidden="true" /> اطلاعات با موفقیت ذخیره شد.
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
      </Button>
    </form>
  );
}
