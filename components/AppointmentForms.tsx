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
import { appointmentSettingsLabel, normalizeJalaliDateKey, type AppointmentSettings } from "@/lib/appointment-settings-shared";
import type { Appointment } from "@/types/content";
import { CalendarDays, CalendarPlus, CheckCircle2, Clock3, Info, Trash2 } from "lucide-react";
import { useActionState, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

function Feedback({ state }: { state: AppointmentFormState | undefined }) {
  if (state?.error)
    return (
      <Alert variant="destructive">
        <AlertDescription className="col-start-1">{state.error}</AlertDescription>
      </Alert>
    );
  if (state?.success)
    return (
      <p className="flex items-center gap-2 text-sm font-bold text-sky-700">
        <CheckCircle2 size={16} /> درخواست نوبت با موفقیت ثبت شد.
      </p>
    );
  return null;
}

const tehranDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Tehran",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const jalaliKeyFormatter = new Intl.DateTimeFormat("en-US-u-ca-persian", {
  timeZone: "Asia/Tehran",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const jalaliLabelFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  timeZone: "Asia/Tehran",
  weekday: "short",
  month: "long",
  day: "numeric",
});

const persianNumber = new Intl.NumberFormat("fa-IR");

function dateKeyFromParts(parts: Intl.DateTimeFormatPart[]): string {
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function tehranDateKey(value: string): string {
  return dateKeyFromParts(tehranDateFormatter.formatToParts(new Date(value)));
}

function dateFromKey(key: string): Date {
  return new Date(`${key}T12:00:00+03:30`);
}

function addDays(key: string, amount: number): string {
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + amount, 12));
  return `${date.getUTCFullYear().toString().padStart(4, "0")}-${(date.getUTCMonth() + 1).toString().padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}`;
}

function jalaliKey(key: string): string {
  const values = Object.fromEntries(jalaliKeyFormatter.formatToParts(dateFromKey(key)).map((part) => [part.type, part.value]));
  return normalizeJalaliDateKey(`${values.year}/${values.month}/${values.day}`) ?? "";
}

function jalaliLabel(key: string): string {
  return jalaliLabelFormatter.format(dateFromKey(key));
}

function weekDay(key: string): number {
  return dateFromKey(key).getUTCDay();
}

function localSlotEpoch(value: string): number {
  return new Date(`${value}:00+03:30`).getTime();
}

function timeLabel(totalMinutes: number): string {
  const hour = Math.floor(totalMinutes / 60).toString().padStart(2, "0");
  const minute = (totalMinutes % 60).toString().padStart(2, "0");
  return new Intl.NumberFormat("fa-IR", { minimumIntegerDigits: 2, useGrouping: false }).format(Number(hour)) + ":" + new Intl.NumberFormat("fa-IR", { minimumIntegerDigits: 2, useGrouping: false }).format(Number(minute));
}

interface DateOption {
  key: string;
  jalaliKey: string;
  label: string;
  reason: "holiday" | "closed" | "full" | null;
  selectable: boolean;
}

function slotsForDate(
  dateKey: string,
  settings: AppointmentSettings,
  referenceTime: string,
  unavailableSlots: Set<string>,
) {
  const result: Array<{ value: string; label: string; blocked: boolean; tooSoon: boolean; tooLate: boolean }> = [];
  const referenceMs = new Date(referenceTime).getTime();
  const minMs = referenceMs + settings.minLeadHours * 60 * 60 * 1000;
  const maxMs = referenceMs + settings.maxAdvanceDays * 24 * 60 * 60 * 1000;

  for (let minutes = settings.openHour * 60; minutes < settings.closeHour * 60; minutes += settings.slotMinutes) {
    const hour = Math.floor(minutes / 60).toString().padStart(2, "0");
    const minute = (minutes % 60).toString().padStart(2, "0");
    const value = `${dateKey}T${hour}:${minute}`;
    const epoch = localSlotEpoch(value);
    result.push({
      value,
      label: timeLabel(minutes),
      blocked: unavailableSlots.has(value),
      tooSoon: epoch < minMs,
      tooLate: epoch > maxMs,
    });
  }
  return result;
}

function PersianAppointmentPicker({
  settings,
  referenceTime,
  unavailableSlots,
  value,
  onChange,
}: {
  settings: AppointmentSettings;
  referenceTime: string;
  unavailableSlots: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const blocked = useMemo(() => new Set(unavailableSlots), [unavailableSlots]);
  const baseDate = useMemo(() => tehranDateKey(referenceTime), [referenceTime]);
  const holidaySet = useMemo(() => new Set(settings.holidayDates), [settings.holidayDates]);
  const [selectedDate, setSelectedDate] = useState(value ? value.slice(0, 10) : "");

  const dates = useMemo<DateOption[]>(() => {
    const result: DateOption[] = [];
    for (let offset = 0; offset <= settings.maxAdvanceDays; offset += 1) {
      const key = addDays(baseDate, offset);
      const jKey = jalaliKey(key);
      const isHoliday = holidaySet.has(jKey);
      const isWorkingDay = settings.workingDays.includes(weekDay(key));
      const daySlots = slotsForDate(key, settings, referenceTime, blocked);
      const hasFreeSlot = daySlots.some((slot) => !slot.blocked && !slot.tooSoon && !slot.tooLate);
      const reason = isHoliday ? "holiday" : !isWorkingDay ? "closed" : !hasFreeSlot ? "full" : null;
      result.push({ key, jalaliKey: jKey, label: jalaliLabel(key), reason, selectable: reason === null });
    }
    return result;
  }, [baseDate, blocked, holidaySet, referenceTime, settings]);

  const timeOptions = useMemo(
    () => (selectedDate ? slotsForDate(selectedDate, settings, referenceTime, blocked) : []),
    [blocked, referenceTime, selectedDate, settings],
  );

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
        <div className="grid gap-3 text-xs text-slate-600 sm:grid-cols-3">
          <div className="flex items-center gap-2"><CalendarDays size={16} className="text-sky-600" /><span>حداکثر رزرو: <strong>{persianNumber.format(settings.maxAdvanceDays)} روز آینده</strong></span></div>
          <div className="flex items-center gap-2"><Clock3 size={16} className="text-sky-600" /><span>حداقل فاصله: <strong>{persianNumber.format(settings.minLeadHours)} ساعت</strong></span></div>
          <div className="flex items-center gap-2"><Info size={16} className="text-sky-600" /><span>فاصله نوبت‌ها: <strong>{persianNumber.format(settings.slotMinutes)} دقیقه</strong></span></div>
        </div>
      </div>

      <div>
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Label>۱. روز موردنظر را انتخاب کنید</Label>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-sky-500" /> قابل رزرو</span>
            <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-rose-400" /> تعطیل</span>
            <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-slate-300" /> غیرفعال/پر</span>
          </div>
        </div>
        <div className="appointment-date-grid" role="list" aria-label="روزهای قابل رزرو">
          {dates.map((date) => {
            const active = date.key === selectedDate;
            const reasonLabel = date.reason === "holiday" ? "تعطیل" : date.reason === "closed" ? "غیرکاری" : date.reason === "full" ? "پر" : "آزاد";
            return (
              <button
                key={date.key}
                type="button"
                disabled={!date.selectable}
                data-active={active || undefined}
                data-reason={date.reason ?? "available"}
                className="appointment-date-card"
                onClick={() => {
                  setSelectedDate(date.key);
                  onChange("");
                }}
                aria-pressed={active}
              >
                <span className="appointment-date-card__label">{date.label}</span>
                <span className="appointment-date-card__key">{date.jalaliKey.replaceAll("/", " / ")}</span>
                <span className="appointment-date-card__status">{reasonLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label>۲. ساعت آزاد را انتخاب کنید</Label>
        {!selectedDate ? (
          <div className="mt-3 rounded-xl border border-dashed border-sky-200 bg-white p-5 text-center text-sm text-muted-foreground">ابتدا یک روز قابل رزرو را انتخاب کنید.</div>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-2 min-[420px]:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6">
            {timeOptions.map((slot) => {
              const disabled = slot.blocked || slot.tooSoon || slot.tooLate;
              const active = value === slot.value;
              return (
                <button
                  key={slot.value}
                  type="button"
                  disabled={disabled}
                  data-active={active || undefined}
                  className="appointment-time-slot"
                  onClick={() => onChange(slot.value)}
                  aria-pressed={active}
                  title={slot.blocked ? "این ساعت رزرو شده است" : slot.tooSoon ? "کمتر از حداقل فاصله مجاز" : slot.tooLate ? "بیرون از بازه رزرو" : "انتخاب ساعت"}
                >
                  <span>{slot.label}</span>
                  {slot.blocked && <small>رزرو شده</small>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function AppointmentRequestForm({
  settings,
  referenceTime,
  unavailableSlots,
}: {
  settings: AppointmentSettings;
  referenceTime: string;
  unavailableSlots: string[];
}) {
  const [state, formAction, pending] = useActionState(createAppointmentAction, undefined);
  const [requestedAt, setRequestedAt] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!state?.success) return;
    formRef.current?.reset();
    setRequestedAt("");
    router.refresh();
  }, [router, state?.success]);

  return (
    <form ref={formRef} action={formAction} className="dashboard-card space-y-5 p-5 md:p-6">
      <div>
        <h2 className="font-extrabold text-foreground">درخواست نوبت جدید</h2>
        <p className="mt-1 text-xs leading-6 text-muted-foreground">فقط زمان‌های واقعاً آزاد قابل انتخاب‌اند و روزهای تعطیل در تقویم مشخص شده‌اند.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="appointment-subject">موضوع مشاوره</Label>
        <Input id="appointment-subject" name="subject" required placeholder="مثلاً بررسی قرارداد، پرونده ملکی یا مشاوره خانواده" />
      </div>

      <input type="hidden" name="requestedAt" value={requestedAt} />
      <PersianAppointmentPicker
        settings={settings}
        referenceTime={referenceTime}
        unavailableSlots={unavailableSlots}
        value={requestedAt}
        onChange={setRequestedAt}
      />

      <p id="appointment-hours" className="text-xs leading-6 text-muted-foreground">
        ساعات کاری رزرو: {appointmentSettingsLabel(settings)}. ثبت این درخواست به معنی تأیید نهایی نیست؛ وضعیت نوبت در همین پنل اعلام می‌شود.
      </p>
      <Feedback state={state} />
      <Button type="submit" disabled={pending || !requestedAt} className="w-full sm:w-auto">
        <CalendarPlus size={16} /> {pending ? "در حال ثبت..." : "ثبت درخواست نوبت"}
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

export function AppointmentAdminForm({ appointment, settings }: { appointment: Appointment; settings: AppointmentSettings }) {
  const action = updateAppointmentAction.bind(null, appointment.id);
  const [state, formAction, pending] = useActionState(action, undefined);
  const [deleting, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div>
          <Label className="sr-only" htmlFor={`status-${appointment.id}`}>وضعیت</Label>
          <select id={`status-${appointment.id}`} name="status" defaultValue={appointment.status} className="h-11 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus:border-ring">
            <option value="pending">در انتظار تأیید</option>
            <option value="confirmed">تأیید شده</option>
            <option value="completed">انجام شده</option>
            <option value="cancelled">لغو شده</option>
          </select>
        </div>
        <div>
          <Label className="sr-only" htmlFor={`requestedAt-${appointment.id}`}>زمان نهایی</Label>
          <Input id={`requestedAt-${appointment.id}`} name="requestedAt" type="datetime-local" step={settings.slotMinutes * 60} defaultValue={toTehranDateTimeLocal(appointment.requestedAt)} required />
        </div>
        <Textarea name="notes" rows={2} defaultValue={appointment.notes ?? ""} placeholder="یادداشت دفتر برای موکل یا نتیجه جلسه" className="min-h-10 lg:col-span-1" />
      </div>
      <Feedback state={state} />
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button type="submit" size="sm" disabled={pending} className="w-full sm:w-auto">{pending ? "در حال ذخیره..." : "ذخیره وضعیت"}</Button>
        {confirmDelete ? (
          <>
            <Button type="button" size="sm" variant="destructive" disabled={deleting} className="w-full sm:w-auto" onClick={() => startTransition(() => removeAppointmentAction(appointment.id))}><Trash2 size={14} /> حذف قطعی</Button>
            <Button type="button" size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => setConfirmDelete(false)}>انصراف</Button>
          </>
        ) : (
          <Button type="button" size="sm" variant="ghost" disabled={deleting} className="w-full sm:w-auto" onClick={() => setConfirmDelete(true)}><Trash2 size={14} /> حذف</Button>
        )}
      </div>
    </form>
  );
}
