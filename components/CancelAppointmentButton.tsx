'use client';

import { useTransition } from 'react';
import { XCircle } from 'lucide-react';
import { cancelAppointmentAction } from '@/app/appointments/actions';
import { Button } from '@/components/ui/button';

export default function CancelAppointmentButton({ id }: { id: number }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      disabled={pending}
      onClick={() => {
        if (!window.confirm('این درخواست نوبت لغو شود؟')) return;
        startTransition(() => cancelAppointmentAction(id));
      }}
    >
      <XCircle size={14} /> {pending ? 'در حال لغو...' : 'لغو درخواست'}
    </Button>
  );
}
