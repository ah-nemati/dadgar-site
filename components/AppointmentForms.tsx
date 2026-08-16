"use client";

import {
  createAppointmentAction,
  removeAppointmentAction,
  updateAppointmentAction,
  type AppointmentFormState,
} from "@/app/appointments/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { appointmentSettingsLabel, type AppointmentSettings } from "@/lib/appointment-settings-shared";
import type { Appointment } from "@/types/content";
import { CalendarPlus, CheckCircle2, Trash2 } from "lucide-react";
import { useActionState, useState, useTransition } from "react";

function Feedback({ state }: { state: AppointmentFormState | undefined }) {
  if (state?.error)
    return (
      <Alert variant="destructive">
        <AlertDescription className="col-start-1">
          {state.error}
        </AlertDescription>
      </Alert>
    );
  if (state?.success)
    return (
      <p className="text-sm text-accent flex items-center gap-2">
        <CheckCircle2 size={16} /> با موفقیت ثبت شد.
      </p>
    );
  return null;
}

export function AppointmentRequestForm({ settings }: { settings: AppointmentSettings }) {
  const [state, formAction, pending] = useActionState(
    createAppointmentAction,
    undefined,
  );

  return (
    <form action={formAction} className="dashboard-card p-5 space-y-4">
      <h2 className="font-bold">درخواست نوبت جدید</h2>
      <div className="space-y-2">
        <Label htmlFor="appointment-subject">موضوع مشاوره</Label>
        <Input
          id="appointment-subject"
          name="subject"
          required
          placeholder="موضوع کوتاه و مشخص"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="requestedAt">تاریخ و ساعت پیشنهادی</Label>
        <Input
          id="requestedAt"
          name="requestedAt"
          type="datetime-local"
          step={settings.slotMinutes * 60}
          required
          aria-describedby="appointment-hours"
        />
        <p
          id="appointment-hours"
          className="text-xs text-muted-foreground leading-6"
        >
          ساعات قابل رزرو: {appointmentSettingsLabel(settings)}. زمان نهایی پس از بررسی مدیر
          دفتر تأیید می‌شود.
        </p>
      </div>
      <Feedback state={state} />
      <Button type="submit" disabled={pending}>
        <CalendarPlus size={16} />{" "}
        {pending ? "در حال ثبت..." : "ثبت درخواست نوبت"}
      </Button>
    </form>
  );
}

function toTehranDateTimeLocal(value: string): string {
  const date = new Date(value);
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tehran",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

export function AppointmentAdminForm({
  appointment,
  settings,
}: {
  appointment: Appointment;
  settings: AppointmentSettings;
}) {
  const action = updateAppointmentAction.bind(null, appointment.id);
  const [state, formAction, pending] = useActionState(action, undefined);
  const [deleting, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div>
          <Label className="sr-only" htmlFor={`status-${appointment.id}`}>
            وضعیت
          </Label>
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
        <div>
          <Label className="sr-only" htmlFor={`requestedAt-${appointment.id}`}>زمان نهایی</Label>
          <Input
            id={`requestedAt-${appointment.id}`}
            name="requestedAt"
            type="datetime-local"
            step={settings.slotMinutes * 60}
            defaultValue={toTehranDateTimeLocal(appointment.requestedAt)}
            required
          />
        </div>
        <Textarea
          name="notes"
          rows={2}
          defaultValue={appointment.notes ?? ""}
          placeholder="یادداشت دفتر برای موکل یا نتیجه جلسه"
          className="lg:col-span-1 min-h-10"
        />
      </div>
      <Feedback state={state} />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "در حال ذخیره..." : "ذخیره وضعیت"}
        </Button>
        {confirmDelete ? (
          <>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={deleting}
              onClick={() => startTransition(() => removeAppointmentAction(appointment.id))}
            >
              <Trash2 size={14} /> حذف قطعی
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setConfirmDelete(false)}>
              انصراف
            </Button>
          </>
        ) : (
          <Button type="button" size="sm" variant="ghost" disabled={deleting} onClick={() => setConfirmDelete(true)}>
            <Trash2 size={14} /> حذف
          </Button>
        )}
      </div>
    </form>
  );
}
