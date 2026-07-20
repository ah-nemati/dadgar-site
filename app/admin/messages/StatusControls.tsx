'use client';

import { useTransition } from 'react';
import { Check, MailOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { setMessageStatus } from './actions';
import type { ConsultationStatus } from '@/types/content';

export default function StatusControls({ id, status }: { id: number; status: ConsultationStatus }) {
  const [isPending, startTransition] = useTransition();

  function update(next: ConsultationStatus) {
    startTransition(() => {
      setMessageStatus(id, next);
    });
  }

  return (
    <div className="flex items-center gap-2">
      {status === 'new' && (
        <Button size="sm" variant="outline" disabled={isPending} onClick={() => update('read')}>
          <MailOpen size={14} aria-hidden="true" /> خوانده شد
        </Button>
      )}
      {status !== 'replied' && (
        <Button size="sm" variant="outline" disabled={isPending} onClick={() => update('replied')}>
          <Check size={14} aria-hidden="true" /> پاسخ داده شد
        </Button>
      )}
    </div>
  );
}
