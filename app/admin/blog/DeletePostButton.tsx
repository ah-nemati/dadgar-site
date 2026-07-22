'use client';

import { useState, useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { removePost } from './actions';

export default function DeletePostButton({ id, slug, title }: { id: number; slug: string; title: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground whitespace-nowrap">حذف «{title}»؟</span>
        <Button
          size="sm"
          variant="destructive"
          disabled={isPending}
          onClick={() => startTransition(() => removePost(id, slug))}
        >
          بله، حذف شود
        </Button>
        <Button size="sm" variant="outline" onClick={() => setConfirming(false)}>
          انصراف
        </Button>
      </div>
    );
  }

  return (
    <Button size="sm" variant="outline" onClick={() => setConfirming(true)}>
      <Trash2 size={14} aria-hidden="true" /> حذف
    </Button>
  );
}
