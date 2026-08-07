import { db } from '@/lib/db';
import type { ConsultationRequest, ConsultationStatus } from '@/types/content';

interface Row { id: number | string; name: string; phone: string; email: string | null; practiceArea: string | null; message: string; status: ConsultationStatus; createdAt: Date }
function map(row: Row): ConsultationRequest { return { ...row, id: Number(row.id), createdAt: row.createdAt.toISOString() }; }
export interface NewConsultationRequest { name: string; phone: string; email?: string; practiceArea?: string; message: string }

export async function createConsultationRequest(input: NewConsultationRequest): Promise<ConsultationRequest> {
  const [row] = await db<Row[]>`
    insert into consultation_requests (name, phone, email, practice_area, message)
    values (${input.name}, ${input.phone}, ${input.email ?? null}, ${input.practiceArea ?? null}, ${input.message})
    returning id, name, phone, email, practice_area, message, status, created_at
  `;
  return map(row);
}
export async function getConsultationRequests(): Promise<ConsultationRequest[]> {
  return (await db<Row[]>`select id, name, phone, email, practice_area, message, status, created_at from consultation_requests order by created_at desc`).map(map);
}
export async function updateConsultationRequestStatus(id: number, status: ConsultationStatus): Promise<void> {
  await db`update consultation_requests set status = ${status} where id = ${id}`;
}
export async function deleteConsultationRequest(id: number): Promise<void> { await db`delete from consultation_requests where id = ${id}`; }
