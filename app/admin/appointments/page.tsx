import { CalendarCheck2, CalendarDays, Clock3, Search, Settings2 } from 'lucide-react';
import AdminHeader from '../AdminHeader';
import { getAppointmentReferenceTime, getAppointments } from '@/lib/appointments';
import { AppointmentAdminForm } from '@/components/AppointmentForms';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { APPOINTMENT_STATUS_LABEL, APPOINTMENT_STATUS_VARIANT } from '@/lib/status';
import { formatJalaliDateTime, toPersianDigits } from '@/lib/format';
import { requireStaff } from '@/lib/session';
import { getAppointmentSettings } from '@/lib/content/appointment-settings';
import { saveAppointmentSettingsAction } from './actions';

export const dynamic = 'force-dynamic';
type SearchParams = Promise<{
  settingsSaved?: string;
  settingsError?: string;
  q?: string;
  status?: string;
  range?: string;
}>;

const DAYS = [
  [6, 'شنبه'], [0, 'یکشنبه'], [1, 'دوشنبه'], [2, 'سه‌شنبه'],
  [3, 'چهارشنبه'], [4, 'پنجشنبه'], [5, 'جمعه'],
] as const;

function tehranDateKey(value: string | number | Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tehran', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date(value));
}

export default async function AdminAppointmentsPage({ searchParams }: { searchParams: SearchParams }) {
  const account = await requireStaff();
  const [appointments, settings, query, referenceTime] = await Promise.all([
    getAppointments(), getAppointmentSettings(), searchParams, getAppointmentReferenceTime(),
  ]);

  const q = query.q?.trim().toLowerCase() ?? '';
  const status = query.status ?? '';
  const range = query.range ?? 'all';
  const now = new Date(referenceTime).getTime();
  const today = tehranDateKey(now);

  const filtered = appointments.filter((item) => {
    const time = new Date(item.requestedAt).getTime();
    const matchesQuery = !q || [
      item.subject, item.clientName, item.clientPhone ?? '', item.clientEmail ?? '', item.notes ?? '',
    ].join(' ').toLowerCase().includes(q);
    const matchesStatus = !status || item.status === status;
    const matchesRange =
      range === 'all' ||
      (range === 'upcoming' && time >= now && !['cancelled', 'completed'].includes(item.status)) ||
      (range === 'today' && tehranDateKey(item.requestedAt) === today) ||
      (range === 'past' && (time < now || ['cancelled', 'completed'].includes(item.status)));
    return matchesQuery && matchesStatus && matchesRange;
  });

  const pending = appointments.filter((x) => x.status === 'pending').length;
  const confirmedUpcoming = appointments.filter((x) => x.status === 'confirmed' && new Date(x.requestedAt).getTime() >= now).length;
  const todayCount = appointments.filter((x) => tehranDateKey(x.requestedAt) === today && !['cancelled'].includes(x.status)).length;
  const completed = appointments.filter((x) => x.status === 'completed').length;

  return (
    <div>
      <AdminHeader
        title="مدیریت نوبت‌ها"
        description="درخواست‌های زمانی را جستجو، تأیید، جابه‌جا، تکمیل یا لغو کنید."
      />

      {account.role === 'ADMIN' && (
        <details className="dashboard-card p-5 mb-6 group" open={Boolean(query.settingsSaved || query.settingsError)}>
          <summary className="font-bold flex items-center gap-2 cursor-pointer list-none select-none">
            <Settings2 size={18} /> تنظیمات رزرو آنلاین
            <span className="mr-auto text-xs font-normal text-muted-foreground group-open:hidden">برای تغییر روزها و ساعات کلیک کنید</span>
          </summary>
          <div className="pt-5">
            {query.settingsSaved && <Alert className="mb-4">تنظیمات نوبت‌دهی ذخیره شد.</Alert>}
            {query.settingsError && <Alert variant="destructive" className="mb-4">روزها یا ساعت‌های واردشده معتبر نیست.</Alert>}
            <form action={saveAppointmentSettingsAction} className="space-y-5">
              <label className="flex items-center gap-2.5 text-sm"><Checkbox name="enabled" defaultChecked={settings.enabled} /> رزرو آنلاین فعال باشد</label>
              <div>
                <Label>روزهای کاری قابل رزرو</Label>
                <div className="flex flex-wrap gap-4 mt-3">
                  {DAYS.map(([value, label]) => (
                    <label key={value} className="flex items-center gap-2 text-sm">
                      <Checkbox name="workingDays" value={String(value)} defaultChecked={settings.workingDays.includes(value)} /> {label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div><Label htmlFor="openHour">شروع ساعت کاری</Label><Input id="openHour" name="openHour" type="number" min="0" max="23" defaultValue={settings.openHour} className="mt-2" /></div>
                <div><Label htmlFor="closeHour">پایان ساعت کاری</Label><Input id="closeHour" name="closeHour" type="number" min="1" max="24" defaultValue={settings.closeHour} className="mt-2" /></div>
                <div><Label htmlFor="slotMinutes">فاصله نوبت‌ها</Label><select id="slotMinutes" name="slotMinutes" defaultValue={settings.slotMinutes} className="mt-2 flex h-11 w-full rounded-sm border border-input bg-card px-4 text-sm"><option value="15">۱۵ دقیقه</option><option value="30">۳۰ دقیقه</option><option value="60">۶۰ دقیقه</option></select></div>
                <div><Label htmlFor="minLeadHours">حداقل فاصله رزرو (ساعت)</Label><Input id="minLeadHours" name="minLeadHours" type="number" min="0" max="168" defaultValue={settings.minLeadHours} className="mt-2" /></div>
              </div>
              <Button type="submit">ذخیره تنظیمات رزرو</Button>
            </form>
          </div>
        </details>
      )}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
        <Stat label="در انتظار تأیید" value={pending} icon={Clock3} />
        <Stat label="تأییدشده آینده" value={confirmedUpcoming} icon={CalendarCheck2} />
        <Stat label="نوبت‌های امروز" value={todayCount} icon={CalendarDays} />
        <Stat label="انجام‌شده" value={completed} icon={CalendarCheck2} />
      </div>

      <form className="dashboard-card p-4 mb-5 grid grid-cols-1 md:grid-cols-[1fr_12rem_12rem_auto] gap-3">
        <div className="relative">
          <Search size={17} className="auth-field-icon" />
          <Input name="q" defaultValue={query.q ?? ''} className="pr-11" placeholder="نام موکل، تلفن، ایمیل، موضوع یا یادداشت" />
        </div>
        <select name="status" defaultValue={status} className="h-11 px-4 rounded-sm text-sm bg-card border border-input">
          <option value="">همه وضعیت‌ها</option>
          <option value="pending">در انتظار تأیید</option>
          <option value="confirmed">تأیید شده</option>
          <option value="completed">انجام شده</option>
          <option value="cancelled">لغو شده</option>
        </select>
        <select name="range" defaultValue={range} className="h-11 px-4 rounded-sm text-sm bg-card border border-input">
          <option value="upcoming">نوبت‌های آینده</option>
          <option value="today">امروز</option>
          <option value="past">سوابق</option>
          <option value="all">همه</option>
        </select>
        <Button type="submit" variant="secondary">اعمال فیلتر</Button>
      </form>

      <div className="space-y-4">
        {filtered.map((item) => (
          <article key={item.id} className="dashboard-card p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
              <div className="min-w-0">
                <h2 className="font-bold">{item.subject}</h2>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
                  <span>{item.clientName}</span>
                  {item.clientPhone && <a href={`tel:${item.clientPhone}`} dir="ltr" className="hover:text-foreground">{item.clientPhone}</a>}
                  {item.clientEmail && <a href={`mailto:${item.clientEmail}`} dir="ltr" className="hover:text-foreground">{item.clientEmail}</a>}
                </div>
              </div>
              <div className="text-left">
                <Badge variant={APPOINTMENT_STATUS_VARIANT[item.status]}>{APPOINTMENT_STATUS_LABEL[item.status]}</Badge>
                <p className="text-xs text-muted-foreground mt-2" dir="ltr">{formatJalaliDateTime(item.requestedAt)}</p>
              </div>
            </div>
            <AppointmentAdminForm appointment={item} settings={settings} />
          </article>
        ))}
        {filtered.length === 0 && <div className="dashboard-card p-12 text-center text-sm text-muted-foreground">نوبتی مطابق فیلتر پیدا نشد.</div>}
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: number; icon: typeof CalendarDays }) {
  return <div className="dashboard-stat"><div className="flex justify-between gap-3"><div><p className="text-xs sm:text-sm text-muted-foreground">{label}</p><p className="text-2xl sm:text-3xl font-extrabold mt-2">{toPersianDigits(value)}</p></div><Icon className="text-accent" size={20} /></div></div>;
}
