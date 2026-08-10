
'use server';

import { revalidatePath } from 'next/cache';
import {
  deleteConsultationRequest,
  updateConsultationRequestStatus,
} from '@/lib/messages';
import { requireStaff } from '@/lib/session';
import type { ConsultationStatus } from '@/types/content';

export async function setMessageStatus(id: number, status: ConsultationStatus) {
  await requireStaff();
  await updateConsultationRequestStatus(id, status);
  revalidatePath('/admin');
  revalidatePath('/admin/messages');
}

export async function removeMessage(id: number) {
  await requireStaff();
  await deleteConsultationRequest(id);
  revalidatePath('/admin');
  revalidatePath('/admin/messages');
}
