
'use client';

import { useActionState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { CaseFormState } from './actions';
import type { ClientCase, Profile } from '@/types/content';
import { toTehranDateTimeLocal } from '@/lib/format';

export default function CaseForm({
  action,
  clients,
  item,
  defaultClientId,
  submitLabel,
}: {
  action: (state: CaseFormState | undefined, formData: FormData) => Promise<CaseFormState>;
  clients: Profile[];
  item?: ClientCase;
  defaultClientId?: string;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="dashboard-card p-5 md:p-7 space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="clientId">موکل *</Label>
          <select
            id="clientId"
            name="clientId"
            required
            defaultValue={item?.clientId ?? defaultClientId ?? ''}
            className="w-full h-11 px-4 rounded-sm text-sm bg-card border border-input outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
          >
            <option value="" disabled>انتخاب موکل</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.fullName || client.email || client.phone || client.id}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="caseNumber">شماره پرونده *</Label>
          <Input id="caseNumber" name="caseNumber" defaultValue={item?.caseNumber} required />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">عنوان پرونده *</Label>
          <Input id="title" name="title" defaultValue={item?.title} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="court">مرجع رسیدگی / شعبه</Label>
          <Input id="court" name="court" defaultValue={item?.court ?? ''} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">وضعیت</Label>
          <select
            id="status"
            name="status"
            defaultValue={item?.status ?? 'new'}
            className="w-full h-11 px-4 rounded-sm text-sm bg-card border border-input outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
          >
            <option value="new">جدید</option>
            <option value="in_progress">در حال رسیدگی</option>
            <option value="waiting">در انتظار اقدام</option>
            <option value="closed">مختومه</option>
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">شرح پرونده</Label>
          <Textarea id="description" name="description" rows={5} defaultValue={item?.description ?? ''} className="resize-y" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nextAction">اقدام بعدی</Label>
          <Input id="nextAction" name="nextAction" defaultValue={item?.nextAction ?? ''} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nextActionAt">زمان اقدام بعدی</Label>
          <Input
            id="nextActionAt"
            name="nextActionAt"
            type="datetime-local"
            defaultValue={toTehranDateTimeLocal(item?.nextActionAt ?? null)}
          />
        </div>
      </div>

      {state?.error && (
        <Alert variant="destructive"><AlertDescription className="col-start-1">{state.error}</AlertDescription></Alert>
      )}
      {state?.success && (
        <p className="text-sm text-accent flex items-center gap-2">
          <CheckCircle2 size={16} aria-hidden="true" /> تغییرات ذخیره شد.
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? <><span className="button-spinner" />در حال ذخیره...</> : submitLabel}
      </Button>
    </form>
  );
}
