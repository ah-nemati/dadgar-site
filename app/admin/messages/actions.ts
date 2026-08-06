
'use server';

import { revalidatePath } from 'next/cache';
import {
  deleteConsultationRequest,
  updateConsultationRequestStatus,
} from '@/lib/messages';
import { requireAdmin } from '@/lib/session';
import type { ConsultationStatus } from '@/types/content';

export async function setMessageStatus(id: number, status: ConsultationStatus) {
  await requireAdmin();
  await updateConsultationRequestStatus(id, status);
  revalidatePath('/admin');
  revalidatePath('/admin/messages');
}

export async function removeMessage(id: number) {
  await requireAdmin();
  await deleteConsultationRequest(id);
  revalidatePath('/admin');
  revalidatePath('/admin/messages');
}
