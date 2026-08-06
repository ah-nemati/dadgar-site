
'use client';

import { useState, useTransition } from 'react';
import { Check, MailOpen, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { removeMessage, setMessageStatus } from './actions';
import type { ConsultationStatus } from '@/types/content';

export default function StatusControls({ id, status }: { id: number; status: ConsultationStatus }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function update(next: ConsultationStatus) {
    startTransition(() => setMessageStatus(id, next));
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <Button size="sm" variant="destructive" disabled={isPending} onClick={() => startTransition(() => removeMessage(id))}>
          حذف قطعی
        </Button>
        <Button size="sm" variant="outline" onClick={() => setConfirming(false)}>انصراف</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status === 'new' && (
        <Button size="sm" variant="outline" disabled={isPending} onClick={() => update('read')}>
          <MailOpen size={14} /> خوانده شد
        </Button>
      )}
      {status !== 'replied' && (
        <Button size="sm" variant="outline" disabled={isPending} onClick={() => update('replied')}>
          <Check size={14} /> پاسخ داده شد
        </Button>
      )}
      <Button size="sm" variant="ghost" disabled={isPending} onClick={() => setConfirming(true)} aria-label="حذف پیام">
        <Trash2 size={14} />
      </Button>
    </div>
  );
}
