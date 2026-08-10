'use client';

import { useActionState } from 'react';
import { KeyRound } from 'lucide-react';
import { resetPasswordAction } from '@/app/auth/actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(
    resetPasswordAction,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="token" value={token} />

      <div className="space-y-2">
        <Label htmlFor="reset-password">رمز عبور جدید</Label>
        <Input
          id="reset-password"
          name="password"
          type="password"
          minLength={12}
          maxLength={128}
          autoComplete="new-password"
          required
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reset-password-confirm">تکرار رمز عبور جدید</Label>
        <Input
          id="reset-password-confirm"
          name="passwordConfirm"
          type="password"
          minLength={12}
          maxLength={128}
          autoComplete="new-password"
          required
        />
      </div>

      {state?.error && (
        <Alert variant="destructive">
          <AlertDescription className="col-start-1">{state.error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <span className="button-spinner" aria-hidden="true" /> : <KeyRound size={17} aria-hidden="true" />}
        {pending ? 'در حال ثبت...' : 'ثبت رمز عبور جدید'}
      </Button>
    </form>
  );
}
