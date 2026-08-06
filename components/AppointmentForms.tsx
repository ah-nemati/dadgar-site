
'use client';

import { useActionState, useTransition } from 'react';
import { CalendarPlus, CheckCircle2, Trash2 } from 'lucide-react';
import {
  createAppointmentAction,
  removeAppointmentAction,
  updateAppointmentAction,
  type AppointmentFormState,
} from '@/app/appointments/actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Appointment } from '@/types/content';

function Feedback({ state }: { state: AppointmentFormState | undefined }) {
  if (state?.error) return <Alert variant="destructive"><AlertDescription className="col-start-1">{state.error}</AlertDescription></Alert>;
  if (state?.success) return <p className="text-sm text-accent flex items-center gap-2"><CheckCircle2 size={16} /> با موفقیت ثبت شد.</p>;
  return null;
}

export function AppointmentRequestForm() {
  const [state, formAction, pending] = useActionState(createAppointmentAction, undefined);

  return (
    <form action={formAction} className="dashboard-card p-5 space-y-4">
      <h2 className="font-bold">درخواست نوبت جدید</h2>
      <div className="space-y-2">
        <Label htmlFor="appointment-subject">موضوع مشاوره</Label>
        <Input id="appointment-subject" name="subject" required placeholder="موضوع کوتاه و مشخص" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="requestedAt">تاریخ و ساعت پیشنهادی</Label>
        <Input id="requestedAt" name="requestedAt" type="datetime-local" required />
        <p className="text-xs text-muted-foreground">زمان نهایی پس از بررسی مدیر دفتر تأیید می‌شود.</p>
      </div>
      <Feedback state={state} />
      <Button type="submit" disabled={pending}>
        <CalendarPlus size={16} /> {pending ? 'در حال ثبت...' : 'ثبت درخواست نوبت'}
      </Button>
    </form>
  );
}

export function AppointmentAdminForm({ appointment }: { appointment: Appointment }) {
  const action = updateAppointmentAction.bind(null, appointment.id);
  const [state, formAction, pending] = useActionState(action, undefined);
  const [deleting, startTransition] = useTransition();

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label className="sr-only" htmlFor={`status-${appointment.id}`}>وضعیت</Label>
          <select
            id={`status-${appointment.id}`}
            name="status"
            defaultValue={appointment.status}
            className="w-full h-10 px-3 rounded-sm text-sm bg-card border border-input"
          >
            <option value="pending">در انتظار تأیید</option>
            <option value="confirmed">تأیید شده</option>
            <option value="completed">انجام شده</option>
            <option value="cancelled">لغو شده</option>
          </select>
        </div>
        <Input name="notes" defaultValue={appointment.notes ?? ''} placeholder="یادداشت مدیر / زمان نهایی" />
      </div>
      <Feedback state={state} />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={pending}>{pending ? 'در حال ذخیره...' : 'ذخیره وضعیت'}</Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={deleting}
          onClick={() => startTransition(() => removeAppointmentAction(appointment.id))}
        >
          <Trash2 size={14} /> حذف
        </Button>
      </div>
    </form>
  );
}
