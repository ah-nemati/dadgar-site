'use server';

import { revalidatePath } from 'next/cache';
import {
  deleteConsultationRequest,
  updateConsultationRequestAdmin,
  updateConsultationRequestStatus,
} from '@/lib/messages';
import { requireStaff } from '@/lib/session';
import { recordAudit } from '@/lib/audit';
import type { ConsultationPriority, ConsultationStatus } from '@/types/content';

const STATUSES: ConsultationStatus[] = ['new', 'read', 'replied'];
const PRIORITIES: ConsultationPriority[] = ['normal', 'high', 'urgent'];

function refresh() {
  revalidatePath('/admin');
  revalidatePath('/admin/messages');
}

export async function setMessageStatus(id: number, status: ConsultationStatus) {
  const account = await requireStaff();
  if (!STATUSES.includes(status)) return;
  await updateConsultationRequestStatus(id, status);
  await recordAudit(account.id, 'consultation.status', 'consultation_request', id, { status });
  refresh();
}

export async function saveMessageAdminDetails(id: number, formData: FormData) {
  const account = await requireStaff();
  const status = String(formData.get('status') ?? 'new') as ConsultationStatus;
  const priority = String(formData.get('priority') ?? 'normal') as ConsultationPriority;
  const adminNotes = String(formData.get('adminNotes') ?? '').trim().slice(0, 2000) || null;

  if (!STATUSES.includes(status) || !PRIORITIES.includes(priority)) return;

  await updateConsultationRequestAdmin(id, { status, priority, adminNotes });
  await recordAudit(account.id, 'consultation.update', 'consultation_request', id, { status, priority });
  refresh();
}

export async function removeMessage(id: number) {
  const account = await requireStaff();
  await deleteConsultationRequest(id);
  await recordAudit(account.id, 'consultation.delete', 'consultation_request', id);
  refresh();
}
