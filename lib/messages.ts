import { db } from '@/lib/db';
import type {
  ConsultationPriority,
  ConsultationRequest,
  ConsultationStatus,
} from '@/types/content';

interface Row {
  id: number | string;
  name: string;
  phone: string;
  email: string | null;
  practiceArea: string | null;
  message: string;
  status: ConsultationStatus;
  priority: ConsultationPriority;
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

function map(row: Row): ConsultationRequest {
  return {
    ...row,
    id: Number(row.id),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export interface NewConsultationRequest {
  name: string;
  phone: string;
  email?: string;
  practiceArea?: string;
  message: string;
}

export async function createConsultationRequest(
  input: NewConsultationRequest,
): Promise<ConsultationRequest> {
  const [row] = await db<Row[]>`
    insert into consultation_requests (name, phone, email, practice_area, message)
    values (${input.name}, ${input.phone}, ${input.email ?? null}, ${input.practiceArea ?? null}, ${input.message})
    returning id, name, phone, email, practice_area, message, status, priority,
              admin_notes, created_at, updated_at
  `;
  return map(row);
}

export async function getConsultationRequests(): Promise<ConsultationRequest[]> {
  return (
    await db<Row[]>`
      select id, name, phone, email, practice_area, message, status, priority,
             admin_notes, created_at, updated_at
      from consultation_requests
      order by
        case priority when 'urgent' then 0 when 'high' then 1 else 2 end,
        case status when 'new' then 0 when 'read' then 1 else 2 end,
        created_at desc
    `
  ).map(map);
}

export async function updateConsultationRequestStatus(
  id: number,
  status: ConsultationStatus,
): Promise<void> {
  await db`update consultation_requests set status = ${status} where id = ${id}`;
}

export async function updateConsultationRequestAdmin(
  id: number,
  input: {
    status: ConsultationStatus;
    priority: ConsultationPriority;
    adminNotes: string | null;
  },
): Promise<void> {
  await db`
    update consultation_requests
    set status = ${input.status}, priority = ${input.priority}, admin_notes = ${input.adminNotes}
    where id = ${id}
  `;
}

export async function deleteConsultationRequest(id: number): Promise<void> {
  await db`delete from consultation_requests where id = ${id}`;
}
