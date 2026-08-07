
import { CalendarDays } from 'lucide-react';
import { getAppointments } from '@/lib/appointments';
import { AppointmentRequestForm } from '@/components/AppointmentForms';
import { Badge } from '@/components/ui/badge';
import { APPOINTMENT_STATUS_LABEL, APPOINTMENT_STATUS_VARIANT } from '@/lib/status';
import { formatJalaliDateTime } from '@/lib/format';
import CancelAppointmentButton from '@/components/CancelAppointmentButton';
import { BUSINESS_HOURS_LABEL } from '@/lib/business-hours';

export const dynamic = 'force-dynamic';

export default async function PortalAppointmentsPage() {
  const appointments = await getAppointments();

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">نوبت مشاوره</h1>
          <p className="dashboard-page-description">زمان پیشنهادی خود را در ساعات کاری ({BUSINESS_HOURS_LABEL}) ثبت کنید؛ دفتر پس از بررسی وضعیت را تأیید می‌کند.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_.85fr] gap-6 items-start">
        <section className="dashboard-card p-5">
          <h2 className="font-bold mb-5">درخواست‌های قبلی</h2>
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="border border-border rounded-lg p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{appointment.subject}</p>
                    <p className="text-xs text-muted-foreground mt-2">زمان پیشنهادی: {formatJalaliDateTime(appointment.requestedAt)}</p>
                    {appointment.notes && <p className="text-sm text-muted-foreground mt-3 rounded-lg bg-muted/50 p-3">{appointment.notes}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={APPOINTMENT_STATUS_VARIANT[appointment.status]}>{APPOINTMENT_STATUS_LABEL[appointment.status]}</Badge>
                    {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                      <CancelAppointmentButton id={appointment.id} />
                    )}
                  </div>
                </div>
              </div>
            ))}
            {appointments.length === 0 && (
              <div className="text-center py-12">
                <CalendarDays size={34} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">درخواستی ثبت نشده است.</p>
              </div>
            )}
          </div>
        </section>

        <div className="xl:sticky xl:top-24">
          <AppointmentRequestForm />
        </div>
      </div>
    </div>
  );
}
