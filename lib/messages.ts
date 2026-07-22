import { createClient } from '@/lib/supabase/server';
import type { ConsultationRequest, ConsultationStatus } from '@/types/content';

interface ConsultationRequestRow {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  practice_area: string | null;
  message: string;
  status: ConsultationStatus;
  created_at: string;
}

function toConsultationRequest(row: ConsultationRequestRow): ConsultationRequest {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    practiceArea: row.practice_area,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };
}

export interface NewConsultationRequest {
  name: string;
  phone: string;
  email?: string;
  practiceArea?: string;
  message: string;
}

/**
 * Inserts a new consultation request (a submitted Contact form). Uses the anon
 * key + the "Public can submit consultation requests" RLS policy — see
 * supabase/schema.sql.
 */
export async function createConsultationRequest(input: NewConsultationRequest): Promise<ConsultationRequest> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('consultation_requests')
    .insert({
      name: input.name,
      phone: input.phone,
      email: input.email ?? null,
      practice_area: input.practiceArea ?? null,
      message: input.message,
    })
    .select()
    .single();

  if (error) throw error;
  return toConsultationRequest(data as ConsultationRequestRow);
}

/** Returns every consultation request, newest first — for the admin messages panel. */
export async function getConsultationRequests(): Promise<ConsultationRequest[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('consultation_requests')
    .select()
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as ConsultationRequestRow[]).map(toConsultationRequest);
}

export async function updateConsultationRequestStatus(id: number, status: ConsultationStatus): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('consultation_requests').update({ status }).eq('id', id);
  if (error) throw error;
}
