
'use client';

import { useActionState, useState, useTransition } from 'react';
import { CheckCircle2, Trash2, Upload } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  addCaseUpdateAction,
  removeCaseAction,
  removeCaseDocumentAction,
  removeCaseUpdateAction,
  uploadCaseDocumentAction,
  type CaseFormState,
} from './actions';

export function CaseUpdateForm({ caseId }: { caseId: number }) {
  const action = addCaseUpdateAction.bind(null, caseId);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="dashboard-card p-5 space-y-4">
      <h2 className="font-bold">ثبت گزارش جدید</h2>
      <div className="space-y-2">
        <Label htmlFor="update-title">عنوان گزارش</Label>
        <Input id="update-title" name="title" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="update-body">شرح اقدامات یا نتیجه</Label>
        <Textarea id="update-body" name="body" rows={4} required className="resize-y" />
      </div>
      <StateMessage state={state} />
      <Button type="submit" disabled={pending}>{pending ? 'در حال ثبت...' : 'افزودن به روند پرونده'}</Button>
    </form>
  );
}

export function DocumentUploadForm({ caseId, clientId }: { caseId: number; clientId: string }) {
  const action = uploadCaseDocumentAction.bind(null, caseId, clientId);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="dashboard-card p-5 space-y-4">
      <h2 className="font-bold">بارگذاری سند</h2>
      <div className="space-y-2">
        <Label htmlFor="document-title">عنوان سند</Label>
        <Input id="document-title" name="title" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="document-file">فایل (حداکثر ۱۰ مگابایت)</Label>
        <Input id="document-file" name="file" type="file" required />
      </div>
      <StateMessage state={state} />
      <Button type="submit" disabled={pending}>
        <Upload size={16} aria-hidden="true" />
        {pending ? 'در حال بارگذاری...' : 'بارگذاری فایل'}
      </Button>
    </form>
  );
}

function StateMessage({ state }: { state: CaseFormState | undefined }) {
  if (state?.error) {
    return <Alert variant="destructive"><AlertDescription className="col-start-1">{state.error}</AlertDescription></Alert>;
  }
  if (state?.success) {
    return <p className="text-sm text-accent flex items-center gap-2"><CheckCircle2 size={16} /> با موفقیت انجام شد.</p>;
  }
  return null;
}

export function DeleteCaseButton({ id }: { id: number }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <form action={removeCaseAction.bind(null, id)} className="inline-flex items-center gap-2">
      {confirming ? (
        <>
          <span className="text-xs text-muted-foreground">از حذف کامل پرونده مطمئن هستید؟</span>
          <Button type="submit" variant="destructive" size="sm">بله، حذف شود</Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setConfirming(false)}>انصراف</Button>
        </>
      ) : (
        <Button type="button" variant="destructive" size="sm" onClick={() => setConfirming(true)}>
          <Trash2 size={14} /> حذف پرونده
        </Button>
      )}
    </form>
  );
}

export function DeleteUpdateButton({ id, caseId }: { id: number; caseId: number }) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      size="sm"
      variant="ghost"
      disabled={pending}
      onClick={() => startTransition(() => removeCaseUpdateAction(id, caseId))}
      aria-label="حذف گزارش"
    >
      <Trash2 size={14} />
    </Button>
  );
}

export function DeleteDocumentButton({ id, caseId }: { id: number; caseId: number }) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      size="sm"
      variant="ghost"
      disabled={pending}
      onClick={() => startTransition(() => removeCaseDocumentAction(id, caseId))}
      aria-label="حذف سند"
    >
      <Trash2 size={14} />
    </Button>
  );
}
