'use server';

import { requireClient, requireStaff } from '@/lib/session';
import {
  createSupportThread,
  replySupportThread,
  setSupportThreadStatus,
} from '@/lib/support';
import { getPracticeAreas } from '@/lib/content/practice-areas';
import type { SupportThreadStatus } from '@/types/content';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface SupportFormState {
  error?: string;
  success?: boolean;
}

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MAX_TOTAL_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 3;
const ALLOWED_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const ALLOWED_EXTENSIONS = new Set(['pdf', 'jpg', 'jpeg', 'png', 'webp', 'doc', 'docx']);

function supportFiles(formData: FormData): { files?: File[]; error?: string } {
  const files = formData.getAll('attachments').filter((value): value is File => value instanceof File && value.size > 0);
  if (files.length > MAX_FILES) return { error: 'حداکثر سه فایل می‌توانید در هر پیام ارسال کنید.' };
  if (files.some((file) => file.size > MAX_FILE_SIZE)) return { error: 'حجم هر فایل باید کمتر از ۸ مگابایت باشد.' };
  if (files.reduce((sum, file) => sum + file.size, 0) > MAX_TOTAL_SIZE) return { error: 'حجم مجموع فایل‌های این پیام باید کمتر از ۱۰ مگابایت باشد.' };
  if (files.some((file) => {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    return !ALLOWED_TYPES.has(file.type) && !ALLOWED_EXTENSIONS.has(extension);
  })) return { error: 'فقط PDF، تصویر، DOC و DOCX قابل ارسال است.' };
  return { files };
}

function refreshThread(threadId?: number) {
  revalidatePath('/admin');
  revalidatePath('/admin/support');
  revalidatePath('/portal');
  revalidatePath('/portal/messages');
  if (threadId) {
    revalidatePath(`/admin/support/${threadId}`);
    revalidatePath(`/portal/messages/${threadId}`);
  }
}

export async function createThreadAction(
  _prevState: SupportFormState | undefined,
  formData: FormData,
): Promise<SupportFormState> {
  await requireClient();
  const subject = String(formData.get('subject') ?? '').trim().slice(0, 180);
  const body = String(formData.get('body') ?? '').trim().slice(0, 6000);
  const practiceArea = String(formData.get('practiceArea') ?? '').trim() || null;
  const fileResult = supportFiles(formData);

  if (fileResult.error) return { error: fileResult.error };
  if (subject.length < 3 || (!body && !fileResult.files?.length)) {
    return { error: 'موضوع را وارد کنید و متن یا حداقل یک فایل برای وکیل بفرستید.' };
  }

  if (practiceArea) {
    const areas = await getPracticeAreas();
    if (!areas.some((area) => area.slug === practiceArea)) return { error: 'حوزه حقوقی انتخاب‌شده معتبر نیست.' };
  }

  let id: number;
  try {
    id = await createSupportThread(subject, body || 'پیوست ارسال شد.', practiceArea, fileResult.files ?? []);
  } catch {
    return { error: 'ایجاد گفت‌وگو انجام نشد. تنظیمات ذخیره فایل یا دیتابیس را بررسی کنید.' };
  }

  refreshThread(id);
  redirect(`/portal/messages/${id}`);
}

export async function replyThreadAction(
  threadId: number,
  _prevState: SupportFormState | undefined,
  formData: FormData,
): Promise<SupportFormState> {
  const body = String(formData.get('body') ?? '').trim().slice(0, 6000);
  const fileResult = supportFiles(formData);
  if (fileResult.error) return { error: fileResult.error };
  if (!body && !fileResult.files?.length) return { error: 'متن یا فایل پیام را وارد کنید.' };

  try {
    await replySupportThread(threadId, body || 'پیوست ارسال شد.', fileResult.files ?? []);
  } catch {
    return { error: 'ارسال پیام انجام نشد. ممکن است گفت‌وگو بسته شده باشد یا ذخیره فایل در دسترس نباشد.' };
  }

  refreshThread(threadId);
  return { success: true };
}

export async function setThreadStatusAction(id: number, status: SupportThreadStatus) {
  await requireStaff();
  if (!['open', 'answered', 'closed'].includes(status)) return;
  await setSupportThreadStatus(id, status);
  refreshThread(id);
}
