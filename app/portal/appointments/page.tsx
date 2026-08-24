import { Clock3 } from 'lucide-react';
import { AppointmentRequestForm } from '@/components/AppointmentForms';
import CancelAppointmentButton from '@/components/CancelAppointmentButton';
import { getAppointmentReferenceTime, getClientAppointments, getUnavailableAppointmentSlots } from '@/lib/appointments';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { APPOINTMENT_STATUS_LABEL, APPOINTMENT_STATUS_VARIANT } from '@/lib/status';
import { formatJalaliDateTime } from '@/lib/format';
import { requireClient } from '@/lib/session';
import { getAppointmentSettings } from '@/lib/content/appointment-settings';

export const dynamic = 'force-dynamic';

export default async function PortalAppointmentsPage() {
  await requireClient();
  const settings = await getAppointmentSettings();
  const [appointments, referenceTime, unavailableSlots] = await Promise.all([
    getClientAppointments(),
    getAppointmentReferenceTime(),
    getUnavailableAppointmentSlots(settings.maxAdvanceDays),
  ]);

  return (
    <div className="max-w-4xl">
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">نوبت مشاوره</h1>
          <p className="dashboard-page-description">زمان پیشنهادی خود را ثبت کنید؛ تأیید نهایی توسط دفتر انجام می‌شود.</p>
        </div>
      </div>

      <section className="mb-6">
        {settings.enabled ? (
          <AppointmentRequestForm settings={settings} referenceTime={referenceTime} unavailableSlots={unavailableSlots} />
        ) : (
          <Alert>رزرو آنلاین نوبت موقتاً غیرفعال است. برای هماهنگی از بخش تماس استفاده کنید.</Alert>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-bold text-foreground">نوبت‌های من</h2>
        {appointments.map((item) => (
          <article key={item.id} className="dashboard-card p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-between">
              <div className="min-w-0">
                <p className="font-extrabold text-base text-foreground">{item.subject}</p>
                <p className="flex items-center gap-1.5 text-xs font-bold text-sky-700 mt-2">
                  <Clock3 size={14} className="text-sky-600 shrink-0" aria-hidden="true" />
                  <span>زمان نوبت: {formatJalaliDateTime(item.requestedAt)}</span>
                </p>
                {item.notes && <p className="text-xs text-muted-foreground mt-3 leading-6">یادداشت دفتر: {item.notes}</p>}
              </div>
              <div className="flex flex-row flex-wrap items-center gap-3 sm:flex-col sm:items-end">
                <Badge variant={APPOINTMENT_STATUS_VARIANT[item.status]}>{APPOINTMENT_STATUS_LABEL[item.status]}</Badge>
                {['pending', 'confirmed'].includes(item.status) && <CancelAppointmentButton id={item.id} />}
              </div>
            </div>
          </article>
        ))}
        {appointments.length === 0 && (
          <div className="dashboard-card p-5 text-center text-sm text-muted-foreground sm:p-8">
            نوبتی ثبت نشده است.
          </div>
        )}
      </section>
    </div>
  );
}
