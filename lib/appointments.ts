import { db } from '@/lib/db';
import { requireAccount } from '@/lib/session';
import type { Appointment, AppointmentStatus } from '@/types/content';

interface AppointmentRow {
  id: number | string; clientId: string; clientName: string; subject: string; requestedAt: Date;
  status: AppointmentStatus; notes: string | null; createdAt: Date;
}
function toAppointment(row: AppointmentRow): Appointment {
  return { id: Number(row.id), clientId: row.clientId, clientName: row.clientName || 'موکل', subject: row.subject,
    requestedAt: row.requestedAt.toISOString(), status: row.status, notes: row.notes, createdAt: row.createdAt.toISOString() };
}

export async function getAppointments(): Promise<Appointment[]> {
  const account = await requireAccount();
  const rows = account.role === 'admin'
    ? await db<AppointmentRow[]>`
        select a.*, p.full_name as client_name from appointments a join profiles p on p.id = a.client_id
        order by a.requested_at desc
      `
    : await db<AppointmentRow[]>`
        select a.*, p.full_name as client_name from appointments a join profiles p on p.id = a.client_id
        where a.client_id = ${account.id} order by a.requested_at desc
      `;
  return rows.map(toAppointment);
}

export async function createAppointment(clientId: string, subject: string, requestedAt: string): Promise<void> {
  await db`insert into appointments (client_id, subject, requested_at) values (${clientId}, ${subject}, ${requestedAt})`;
}
export async function updateAppointment(id: number, status: AppointmentStatus, notes: string | null): Promise<void> {
  await db`update appointments set status = ${status}, notes = ${notes} where id = ${id}`;
}
export async function deleteAppointment(id: number): Promise<void> { await db`delete from appointments where id = ${id}`; }
export async function cancelOwnAppointment(id: number): Promise<void> {
  const account = await requireAccount();
  const result = await db`
    update appointments set status = 'cancelled'
    where id = ${id} and client_id = ${account.id} and status in ('pending', 'confirmed')
    returning id
  `;
  if (result.length === 0) throw new Error('APPOINTMENT_NOT_CANCELLABLE');
}
