'use server';

import { revalidatePath } from 'next/cache';
import { updateConsultationRequestStatus } from '@/lib/messages';
import type { ConsultationStatus } from '@/types/content';

export async function setMessageStatus(id: number, status: ConsultationStatus) {
  await updateConsultationRequestStatus(id, status);
  revalidatePath('/admin/messages');
}
