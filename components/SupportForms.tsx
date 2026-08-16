'use client';

import { useActionState } from 'react';
import { CheckCircle2, Paperclip, Send } from 'lucide-react';
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
import type { PracticeArea } from '@/types/content';

const FILE_ACCEPT = '.pdf,.jpg,.jpeg,.png,.webp,.doc,.docx';

function Feedback({ state }: { state: SupportFormState | undefined }) {
  if (state?.error) return <Alert variant="destructive"><AlertDescription className="col-start-1">{state.error}</AlertDescription></Alert>;
  if (state?.success) return <p className="text-sm text-accent flex items-center gap-2"><CheckCircle2 size={16} /> پیام ارسال شد.</p>;
  return null;
}

function AttachmentField({ id }: { id: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-2"><Paperclip size={15} /> پیوست مدارک (اختیاری)</Label>
      <Input id={id} name="attachments" type="file" accept={FILE_ACCEPT} multiple />
      <p className="text-[11px] leading-5 text-muted-foreground">حداکثر ۳ فایل؛ PDF، تصویر، DOC یا DOCX. حجم هر فایل حداکثر ۸ مگابایت و مجموع حداکثر ۱۰ مگابایت.</p>
    </div>
  );
}

export function NewThreadForm({ practiceAreas = [] }: { practiceAreas?: PracticeArea[] }) {
  const [state, formAction, pending] = useActionState(createThreadAction, undefined);
  return (
    <form action={formAction} className="dashboard-card p-5 space-y-4">
      <div>
        <h2 className="font-bold">شروع صحبت با وکیل</h2>
        <p className="text-xs text-muted-foreground leading-6 mt-1">موضوع را کوتاه بنویسید و در صورت نیاز مدارک مرتبط را به‌صورت خصوصی پیوست کنید.</p>
      </div>
      {practiceAreas.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="practiceArea">حوزه حقوقی</Label>
          <select id="practiceArea" name="practiceArea" className="h-11 w-full px-4 rounded-sm text-sm bg-card border border-input">
            <option value="">موضوع عمومی / مطمئن نیستم</option>
            {practiceAreas.map((area) => <option key={area.slug} value={area.slug}>{area.title}</option>)}
          </select>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="subject">موضوع</Label>
        <Input id="subject" name="subject" maxLength={180} required placeholder="مثلاً: بررسی قرارداد خرید ملک" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="body">شرح پیام</Label>
        <Textarea id="body" name="body" rows={6} maxLength={6000} className="resize-y" placeholder="شرح کوتاه مسئله، مرحله فعلی و سؤال اصلی خود را بنویسید." />
      </div>
      <AttachmentField id="new-thread-attachments" />
      <Feedback state={state} />
      <Button type="submit" disabled={pending} className="w-full">
        <Send size={16} /> {pending ? 'در حال ایجاد گفت‌وگو...' : 'ارسال برای وکیل'}
      </Button>
    </form>
  );
}

export function ReplyThreadForm({ threadId, disabled = false }: { threadId: number; disabled?: boolean }) {
  const action = replyThreadAction.bind(null, threadId);
  const [state, formAction, pending] = useActionState(action, undefined);

  if (disabled) {
    return <div className="dashboard-card p-5 text-sm text-muted-foreground text-center">این گفت‌وگو بسته شده است. برای ادامه، از دفتر درخواست بازگشایی کنید.</div>;
  }

  return (
    <form action={formAction} className="dashboard-card p-5 space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`reply-body-${threadId}`}>پاسخ جدید</Label>
        <Textarea id={`reply-body-${threadId}`} name="body" rows={4} maxLength={6000} className="resize-y" placeholder="پیام خود را بنویسید..." />
      </div>
      <AttachmentField id={`reply-attachments-${threadId}`} />
      <Feedback state={state} />
      <Button type="submit" disabled={pending}>
        <Send size={16} /> {pending ? 'در حال ارسال...' : 'ارسال پیام'}
      </Button>
    </form>
  );
}
