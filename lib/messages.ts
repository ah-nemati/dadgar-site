import db from '@/lib/db';
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

/** Inserts a new consultation request (a submitted Contact form). */
export async function createConsultationRequest(input: NewConsultationRequest): Promise<ConsultationRequest> {
  const stmt = db.prepare(
    `INSERT INTO consultation_requests (name, phone, email, practice_area, message)
     VALUES (@name, @phone, @email, @practiceArea, @message)`
  );
  const result = stmt.run({
    name: input.name,
    phone: input.phone,
    email: input.email ?? null,
    practiceArea: input.practiceArea ?? null,
    message: input.message,
  });
  const row = db
    .prepare('SELECT * FROM consultation_requests WHERE id = ?')
    .get(result.lastInsertRowid) as ConsultationRequestRow;
  return toConsultationRequest(row);
}

/** Returns every consultation request, newest first — for the admin messages panel. */
export async function getConsultationRequests(): Promise<ConsultationRequest[]> {
  const rows = db.prepare('SELECT * FROM consultation_requests ORDER BY created_at DESC').all() as ConsultationRequestRow[];
  return rows.map(toConsultationRequest);
}

export async function countNewConsultationRequests(): Promise<number> {
  const row = db.prepare("SELECT COUNT(*) as count FROM consultation_requests WHERE status = 'new'").get() as {
    count: number;
  };
  return row.count;
}

export async function updateConsultationRequestStatus(id: number, status: ConsultationStatus): Promise<void> {
  db.prepare('UPDATE consultation_requests SET status = ? WHERE id = ?').run(status, id);
}
