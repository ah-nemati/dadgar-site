'use server';

import { createConsultationRequest } from '@/lib/messages';

export interface ConsultationFormResult {
  ok: boolean;
  error?: string;
}

export async function submitConsultationRequest(formData: {
  name: string;
  phone: string;
  email: string;
  area: string;
  message: string;
  consent: boolean;
}): Promise<ConsultationFormResult> {
  const name = formData.name.trim();
  const phone = formData.phone.trim();
  const message = formData.message.trim();

  if (!name || !phone || !message || !formData.consent) {
    return { ok: false, error: 'لطفاً فیلدهای الزامی را تکمیل کنید.' };
  }

  try {
    await createConsultationRequest({
      name,
      phone,
      email: formData.email.trim() || undefined,
      practiceArea: formData.area || undefined,
      message,
    });
    return { ok: true };
  } catch {
    return { ok: false, error: 'ارسال پیام با خطا مواجه شد. لطفاً دوباره تلاش کنید یا با دفتر تماس بگیرید.' };
  }
}
