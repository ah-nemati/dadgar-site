
'use client';

import { useActionState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import {
  createThreadAction,
  replyThreadAction,
  type SupportFormState,
} from '@/app/support/actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

function Feedback({ state }: { state: SupportFormState | undefined }) {
  if (state?.error) return <Alert variant="destructive"><AlertDescription className="col-start-1">{state.error}</AlertDescription></Alert>;
  if (state?.success) return <p className="text-sm text-accent flex items-center gap-2"><CheckCircle2 size={16} /> پیام ارسال شد.</p>;
  return null;
}

export function NewThreadForm() {
  const [state, formAction, pending] = useActionState(createThreadAction, undefined);
  return (
    <form action={formAction} className="dashboard-card p-5 space-y-4">
      <h2 className="font-bold">گفت‌وگوی جدید</h2>
      <div className="space-y-2">
        <Label htmlFor="subject">موضوع</Label>
        <Input id="subject" name="subject" required placeholder="مثلاً: سؤال درباره مدارک پرونده" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="body">متن پیام</Label>
        <Textarea id="body" name="body" rows={5} required className="resize-y" />
      </div>
      <Feedback state={state} />
      <Button type="submit" disabled={pending}>
        <Send size={16} /> {pending ? 'در حال ارسال...' : 'ایجاد گفت‌وگو'}
      </Button>
    </form>
  );
}

export function ReplyThreadForm({ threadId, disabled = false }: { threadId: number; disabled?: boolean }) {
  const action = replyThreadAction.bind(null, threadId);
  const [state, formAction, pending] = useActionState(action, undefined);

  if (disabled) {
    return <div className="dashboard-card p-5 text-sm text-muted-foreground text-center">این گفت‌وگو بسته شده است.</div>;
  }

  return (
    <form action={formAction} className="dashboard-card p-5 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reply-body">پاسخ جدید</Label>
        <Textarea id="reply-body" name="body" rows={4} required className="resize-y" />
      </div>
      <Feedback state={state} />
      <Button type="submit" disabled={pending}>
        <Send size={16} /> {pending ? 'در حال ارسال...' : 'ارسال پیام'}
      </Button>
    </form>
  );
}
