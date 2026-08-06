'use client';

import { useActionState } from 'react';
import { KeyRound, Lock } from 'lucide-react';
import { updatePassword } from '@/app/auth/actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(updatePassword, undefined);

  return (
    <form action={formAction} className="bg-card border border-border rounded-lg p-7 space-y-5 shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="password">رمز عبور جدید</Label>
        <div className="relative">
          <Lock size={17} className="auth-field-icon" aria-hidden="true" />
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            autoFocus
            className="pr-11"
          />
        </div>
        <p className="text-xs text-muted-foreground leading-6">
          حداقل ۸ کاراکتر و ترجیحاً شامل حرف بزرگ، حرف کوچک، عدد و نشانه باشد.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="passwordConfirm">تکرار رمز عبور جدید</Label>
        <div className="relative">
          <Lock size={17} className="auth-field-icon" aria-hidden="true" />
          <Input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            className="pr-11"
          />
        </div>
      </div>

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
        {pending ? 'در حال ذخیره...' : 'ذخیره رمز عبور جدید'}
      </Button>
    </form>
  );
}
