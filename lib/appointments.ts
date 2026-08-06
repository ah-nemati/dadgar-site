
import { createClient } from '@/lib/supabase/server';
import type { Appointment, AppointmentStatus } from '@/types/content';

interface AppointmentRow {
  id: number;
  client_id: string;
  subject: string;
  requested_at: string;
  status: AppointmentStatus;
  notes: string | null;
  created_at: string;
}

async function namesMap(ids: string[]) {
  const map = new Map<string, string>();
  if (ids.length === 0) return map;
  const supabase = await createClient();
  const { data } = await supabase.from('profiles').select('id, full_name').in('id', ids);
  for (const row of data ?? []) map.set(row.id, row.full_name || 'موکل');
  return map;
}

export async function getAppointments(): Promise<Appointment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('appointments')
    .select()
    .order('requested_at', { ascending: false });

  if (error) throw error;
  const rows = data as AppointmentRow[];
  const names = await namesMap(Array.from(new Set(rows.map((row) => row.client_id))));

  return rows.map((row) => ({
    id: row.id,
    clientId: row.client_id,
    clientName: names.get(row.client_id) ?? 'موکل',
    subject: row.subject,
    requestedAt: row.requested_at,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
  }));
}

export async function createAppointment(
  clientId: string,
  subject: string,
  requestedAt: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('appointments').insert({
    client_id: clientId,
    subject,
    requested_at: requestedAt,
  });
  if (error) throw error;
}

export async function updateAppointment(
  id: number,
  status: AppointmentStatus,
  notes: string | null
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('appointments')
    .update({ status, notes })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteAppointment(id: number): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('appointments').delete().eq('id', id);
  if (error) throw error;
}
