'use client';

import { useActionState } from 'react';
import { CheckCircle2, KeyRound } from 'lucide-react';
import { changePasswordAction } from '@/app/account/actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(
    changePasswordAction,
    undefined,
  );

  return (
    <form action={formAction} className="dashboard-card p-6 space-y-5">
      <div>
        <h2 className="font-bold flex items-center gap-2">
          <KeyRound size={18} /> تغییر رمز عبور
        </h2>
        <p className="text-xs text-muted-foreground mt-2 leading-6">
          پس از تغییر رمز، نشست‌های قبلی بسته می‌شوند و همین دستگاه یک نشست تازه می‌گیرد.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="currentPassword">رمز عبور فعلی</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">رمز عبور جدید</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          minLength={12}
          maxLength={128}
          autoComplete="new-password"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPasswordConfirm">تکرار رمز عبور جدید</Label>
        <Input
          id="newPasswordConfirm"
          name="newPasswordConfirm"
          type="password"
          minLength={12}
          maxLength={128}
          autoComplete="new-password"
          required
        />
      </div>
      {state?.error && (
        <Alert variant="destructive">
          <AlertDescription className="col-start-1">
            {state.error}
          </AlertDescription>
        </Alert>
      )}
      {state?.success && (
        <p className="text-sm text-accent flex items-center gap-2">
          <CheckCircle2 size={16} /> رمز عبور تغییر کرد.
        </p>
      )}
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? (
          <>
            <span className="button-spinner" />در حال تغییر...
          </>
        ) : (
          'تغییر رمز عبور'
        )}
      </Button>
    </form>
  );
}
