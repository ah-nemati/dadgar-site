"use server";

import { requireAdmin, requireClient } from "@/lib/session";
import {
  createSupportThread,
  replySupportThread,
  setSupportThreadStatus,
} from "@/lib/support";
import type { SupportThreadStatus } from "@/types/content";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface SupportFormState {
  error?: string;
  success?: boolean;
}

export async function createThreadAction(
  _prevState: SupportFormState | undefined,
  formData: FormData,
): Promise<SupportFormState> {
  await requireClient();
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (subject.length < 3 || body.length < 2) {
    return { error: "موضوع و متن پیام را کامل کنید." };
  }

  let id: number;
  try {
    id = await createSupportThread(subject, body);
  } catch {
    return { error: "ایجاد گفت‌وگو انجام نشد." };
  }

  revalidatePath("/portal");
  revalidatePath("/portal/messages");
  revalidatePath("/admin");
  revalidatePath("/admin/support");
  redirect(`/portal/messages/${id}`);
}

export async function replyThreadAction(
  threadId: number,
  _prevState: SupportFormState | undefined,
  formData: FormData,
): Promise<SupportFormState> {
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "متن پیام را وارد کنید." };

  try {
    await replySupportThread(threadId, body);
  } catch {
    return { error: "ارسال پیام انجام نشد. ممکن است گفت‌وگو بسته شده باشد." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/support");
  revalidatePath(`/admin/support/${threadId}`);
  revalidatePath("/portal");
  revalidatePath("/portal/messages");
  revalidatePath(`/portal/messages/${threadId}`);

  return { success: true };
}

export async function setThreadStatusAction(
  id: number,
  status: SupportThreadStatus,
) {
  await requireAdmin();
  await setSupportThreadStatus(id, status);
  revalidatePath("/admin");
  revalidatePath("/admin/support");
  revalidatePath(`/admin/support/${id}`);
  revalidatePath("/portal/messages");
  revalidatePath(`/portal/messages/${id}`);
}
