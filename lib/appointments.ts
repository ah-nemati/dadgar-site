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

function toTehranDateTimeLocal(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tehran',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

export async function getAppointmentReferenceTime(): Promise<string> {
  const [row] = await db<{ now: Date }[]>`select current_timestamp as now`;
  return row.now.toISOString();
}

export async function getUnavailableAppointmentSlots(maxAdvanceDays = 30): Promise<string[]> {
  const account = await requireAccount();
  if (!account) return [];
  const safeDays = Math.min(180, Math.max(1, Math.trunc(maxAdvanceDays || 30)));
  const rows = await db<{ requestedAt: Date }[]>`
    select requested_at
    from appointments
    where status in ('pending', 'confirmed')
      and requested_at >= now()
      and requested_at <= now() + (${safeDays} * interval '1 day')
    order by requested_at asc
  `;
  return rows.map((row) => toTehranDateTimeLocal(row.requestedAt));
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
  await db.begin(async (tx) => {
    await tx`select pg_advisory_xact_lock(hashtext(${requestedAt}))`;

    const [{ count }] = await tx<{ count: number | string }[]>`
      select count(*)::int as count from appointments
      where client_id = ${clientId} and status in ('pending', 'confirmed')
    `;
    if (Number(count) >= 5) throw new Error('TOO_MANY_OPEN_APPOINTMENTS');

    const [conflict] = await tx<{ id: number | string }[]>`
      select id from appointments
      where requested_at = ${requestedAt}
        and status in ('pending', 'confirmed')
      limit 1
    `;
    if (conflict) throw new Error('APPOINTMENT_TIME_CONFLICT');

    await tx`insert into appointments (client_id, subject, requested_at) values (${clientId}, ${subject}, ${requestedAt})`;
  });
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
        ${status} not in ('pending', 'confirmed')
        or not exists (
          select 1 from appointments as other
          where other.id <> current.id
            and other.status in ('pending', 'confirmed')
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
