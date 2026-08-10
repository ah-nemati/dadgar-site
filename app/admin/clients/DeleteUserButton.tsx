'use client';

import { useActionState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteUserAction } from './actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function DeleteUserButton({ userId }: { userId: string }) {
  const action = deleteUserAction.bind(null, userId);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="dashboard-card mt-6 border-destructive/30 p-5 space-y-4">
      <div>
        <h2 className="font-bold text-destructive">حذف حساب کاربر</h2>
        <p className="mt-2 text-xs leading-6 text-muted-foreground">
          پرونده‌ها، پیام‌ها، نوبت‌ها و نشست‌های وابسته به این حساب نیز حذف می‌شوند. این کار قابل بازگشت نیست.
        </p>
      </div>
      {state?.error && <Alert variant="destructive"><AlertDescription className="col-start-1">{state.error}</AlertDescription></Alert>}
      <Button type="submit" variant="destructive" disabled={pending}>
        {pending ? <span className="button-spinner" aria-hidden="true" /> : <Trash2 size={16} aria-hidden="true" />}
        {pending ? 'در حال حذف...' : 'حذف قطعی حساب'}
      </Button>
    </form>
  );
}
