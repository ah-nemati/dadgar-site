
'use client';

import { useTransition } from 'react';
import { CheckCircle2, LockKeyhole, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { setThreadStatusAction } from '@/app/support/actions';
import type { SupportThreadStatus } from '@/types/content';

export default function ThreadControls({ id, status }: { id: number; status: SupportThreadStatus }) {
  const [pending, startTransition] = useTransition();

  function update(next: SupportThreadStatus) {
    startTransition(() => setThreadStatusAction(id, next));
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status === 'closed' ? (
        <Button size="sm" variant="outline" disabled={pending} onClick={() => update('open')}>
          <RotateCcw size={14} /> بازگشایی
        </Button>
      ) : (
        <>
          <Button size="sm" variant="outline" disabled={pending} onClick={() => update('answered')}>
            <CheckCircle2 size={14} /> علامت پاسخ‌داده‌شده
          </Button>
          <Button size="sm" variant="destructive" disabled={pending} onClick={() => update('closed')}>
            <LockKeyhole size={14} /> بستن گفت‌وگو
          </Button>
        </>
      )}
    </div>
  );
}
