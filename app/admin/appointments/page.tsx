
import { CalendarDays } from 'lucide-react';
import AdminHeader from '../AdminHeader';
import { getAppointments } from '@/lib/appointments';
import { AppointmentAdminForm } from '@/components/AppointmentForms';
import { Badge } from '@/components/ui/badge';
import { APPOINTMENT_STATUS_LABEL, APPOINTMENT_STATUS_VARIANT } from '@/lib/status';
import { formatJalaliDateTime } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function AdminAppointmentsPage() {
  const appointments = await getAppointments();

  return (
    <div>
      <AdminHeader
        title="مدیریت نوبت‌ها"
        description="درخواست‌های مشاوره را تأیید، تکمیل یا لغو کنید و توضیح زمان نهایی را برای کاربر بنویسید."
      />

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <article key={appointment.id} className="dashboard-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="font-bold">{appointment.subject}</h2>
                <p className="text-sm text-muted-foreground mt-1">موکل: {appointment.clientName}</p>
                <p className="text-xs text-muted-foreground mt-2">زمان پیشنهادی: {formatJalaliDateTime(appointment.requestedAt)}</p>
              </div>
              <Badge variant={APPOINTMENT_STATUS_VARIANT[appointment.status]}>{APPOINTMENT_STATUS_LABEL[appointment.status]}</Badge>
            </div>
            <AppointmentAdminForm appointment={appointment} />
          </article>
        ))}

        {appointments.length === 0 && (
          <div className="dashboard-card py-16 text-center">
            <CalendarDays size={36} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">هنوز نوبتی درخواست نشده است.</p>
          </div>
        )}
      </div>
    </div>
  );
}
