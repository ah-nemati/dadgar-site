
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  addCaseUpdate,
  createCase,
  deleteCase,
  deleteCaseDocument,
  deleteCaseUpdate,
  updateCase,
  uploadCaseDocument,
} from '@/lib/cases';
import { requireAdmin } from '@/lib/session';
import type { CaseStatus } from '@/types/content';

export interface CaseFormState {
  error?: string;
  success?: boolean;
}

function nullable(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim();
  return text || null;
}

function parseDateTime(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim();
  if (!text) return null;
  const date = new Date(`${text}:00+03:30`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function readCase(formData: FormData) {
  return {
    clientId: String(formData.get('clientId') ?? ''),
    caseNumber: String(formData.get('caseNumber') ?? '').trim(),
    title: String(formData.get('title') ?? '').trim(),
    court: nullable(formData.get('court')),
    status: String(formData.get('status') ?? 'new') as CaseStatus,
    description: nullable(formData.get('description')),
    nextAction: nullable(formData.get('nextAction')),
    nextActionAt: parseDateTime(formData.get('nextActionAt')),
  };
}

function caseError(error: unknown) {
  const message = error instanceof Error ? error.message : '';
  if (message.includes('duplicate') || message.includes('unique')) {
    return 'شماره پرونده قبلاً ثبت شده است.';
  }
  return 'ذخیره پرونده با خطا مواجه شد.';
}

export async function createCaseAction(
  _prevState: CaseFormState | undefined,
  formData: FormData
): Promise<CaseFormState> {
  await requireAdmin();
  const input = readCase(formData);

  if (!input.clientId || !input.caseNumber || !input.title) {
    return { error: 'موکل، شماره پرونده و عنوان الزامی هستند.' };
  }

  let id: number;
  try {
    id = await createCase(input);
  } catch (error) {
    return { error: caseError(error) };
  }

  revalidatePath('/admin');
  revalidatePath('/admin/cases');
  revalidatePath('/portal');
  redirect(`/admin/cases/${id}`);
}

export async function editCaseAction(
  id: number,
  _prevState: CaseFormState | undefined,
  formData: FormData
): Promise<CaseFormState> {
  await requireAdmin();
  const input = readCase(formData);

  if (!input.clientId || !input.caseNumber || !input.title) {
    return { error: 'موکل، شماره پرونده و عنوان الزامی هستند.' };
  }

  try {
    await updateCase(id, input);
  } catch (error) {
    return { error: caseError(error) };
  }

  revalidatePath('/admin');
  revalidatePath('/admin/cases');
  revalidatePath(`/admin/cases/${id}`);
  revalidatePath('/portal');
  revalidatePath('/portal/cases');
  revalidatePath(`/portal/cases/${id}`);
  return { success: true };
}

export async function addCaseUpdateAction(
  caseId: number,
  _prevState: CaseFormState | undefined,
  formData: FormData
): Promise<CaseFormState> {
  await requireAdmin();
  const title = String(formData.get('title') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();

  if (!title || !body) return { error: 'عنوان و شرح بروزرسانی را وارد کنید.' };

  try {
    await addCaseUpdate(caseId, title, body);
  } catch {
    return { error: 'ثبت گزارش پرونده انجام نشد.' };
  }

  revalidatePath(`/admin/cases/${caseId}`);
  revalidatePath(`/portal/cases/${caseId}`);
  revalidatePath('/portal');
  return { success: true };
}

export async function uploadCaseDocumentAction(
  caseId: number,
  clientId: string,
  _prevState: CaseFormState | undefined,
  formData: FormData
): Promise<CaseFormState> {
  await requireAdmin();
  const title = String(formData.get('title') ?? '').trim();
  const file = formData.get('file');

  if (!title || !(file instanceof File) || file.size === 0) {
    return { error: 'عنوان و فایل سند الزامی هستند.' };
  }

  try {
    await uploadCaseDocument(caseId, clientId, title, file);
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message === 'FILE_TOO_LARGE') return { error: 'حجم فایل باید کمتر از ۱۰ مگابایت باشد.' };
    return { error: 'بارگذاری سند انجام نشد. تنظیمات Storage را بررسی کنید.' };
  }

  revalidatePath(`/admin/cases/${caseId}`);
  revalidatePath(`/portal/cases/${caseId}`);
  return { success: true };
}

export async function removeCaseAction(id: number) {
  await requireAdmin();
  await deleteCase(id);
  revalidatePath('/admin');
  revalidatePath('/admin/cases');
  revalidatePath('/portal/cases');
  redirect('/admin/cases');
}

export async function removeCaseUpdateAction(id: number, caseId: number) {
  await requireAdmin();
  await deleteCaseUpdate(id);
  revalidatePath(`/admin/cases/${caseId}`);
  revalidatePath(`/portal/cases/${caseId}`);
}

export async function removeCaseDocumentAction(id: number, caseId: number) {
  await requireAdmin();
  await deleteCaseDocument(id);
  revalidatePath(`/admin/cases/${caseId}`);
  revalidatePath(`/portal/cases/${caseId}`);
}
