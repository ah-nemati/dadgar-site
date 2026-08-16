import { db } from '@/lib/db';
import { requireAccount } from '@/lib/session';
import type { Appointment, AppointmentStatus } from '@/types/content';

interface AppointmentRow {
  id: number | string;
  clientId: string;
  clientName: string;
  clientPhone: string | null;
  clientEmail: string | null;
  subject: string;
  requestedAt: Date;
  status: AppointmentStatus;
  notes: string | null;
  createdAt: Date;
}

function toAppointment(row: AppointmentRow): Appointment {
  return {
    id: Number(row.id),
    clientId: row.clientId,
    clientName: row.clientName || 'موکل',
    clientPhone: row.clientPhone,
    clientEmail: row.clientEmail,
    subject: row.subject,
    requestedAt: row.requestedAt.toISOString(),
    status: row.status,
    notes: row.notes,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function getAppointmentReferenceTime(): Promise<string> {
  const [row] = await db<{ now: Date }[]>`select current_timestamp as now`;
  return row.now.toISOString();
}

export async function getAppointments(): Promise<Appointment[]> {
  const account = await requireAccount();
  const rows = account.role !== 'CLIENT'
    ? await db<AppointmentRow[]>`
        select a.*, u.name as client_name, u.phone as client_phone, u.email as client_email
        from appointments a join users u on u.id = a.client_id
        order by
          case when a.status in ('pending', 'confirmed') and a.requested_at >= now() then 0 else 1 end,
          case when a.status in ('pending', 'confirmed') and a.requested_at >= now() then a.requested_at end asc,
          a.requested_at desc
      `
    : await db<AppointmentRow[]>`
        select a.*, u.name as client_name, u.phone as client_phone, u.email as client_email
        from appointments a join users u on u.id = a.client_id
        where a.client_id = ${account.id}
        order by
          case when a.status in ('pending', 'confirmed') and a.requested_at >= now() then 0 else 1 end,
          case when a.status in ('pending', 'confirmed') and a.requested_at >= now() then a.requested_at end asc,
          a.requested_at desc
      `;
  return rows.map(toAppointment);
}

export async function createAppointment(clientId: string, subject: string, requestedAt: string): Promise<void> {
  const [{ count }] = await db<{ count: number | string }[]>`
    select count(*)::int as count from appointments
    where client_id = ${clientId} and status in ('pending', 'confirmed')
  `;
  if (Number(count) >= 5) throw new Error('TOO_MANY_OPEN_APPOINTMENTS');
  await db`insert into appointments (client_id, subject, requested_at) values (${clientId}, ${subject}, ${requestedAt})`;
}

export async function updateAppointment(
  id: number,
  status: AppointmentStatus,
  notes: string | null,
  requestedAt: string,
): Promise<void> {
  const result = await db`
    update appointments as current
    set status = ${status}, notes = ${notes}, requested_at = ${requestedAt}
    where current.id = ${id}
      and (
        ${status} <> 'confirmed'
        or not exists (
          select 1 from appointments as other
          where other.id <> current.id
            and other.status = 'confirmed'
            and other.requested_at = ${requestedAt}
        )
      )
    returning current.id
  `;
  if (result.length === 0) throw new Error('APPOINTMENT_TIME_CONFLICT');
}

export async function deleteAppointment(id: number): Promise<void> {
  await db`delete from appointments where id = ${id}`;
}

export async function cancelOwnAppointment(id: number): Promise<void> {
  const account = await requireAccount();
  const result = await db`
    update appointments set status = 'cancelled'
    where id = ${id} and client_id = ${account.id} and status in ('pending', 'confirmed')
    returning id
  `;
  if (result.length === 0) throw new Error('APPOINTMENT_NOT_CANCELLABLE');
}
