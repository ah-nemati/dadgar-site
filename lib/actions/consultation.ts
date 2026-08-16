'use server';

import { createConsultationRequest } from '@/lib/messages';
import { consumeRateLimit, requestRateLimitKey } from '@/lib/auth/rate-limit';
import {
  isValidEmail,
  isValidIranianPhone,
  normalizeEmail,
  normalizeIranianPhone,
  validateName,
} from '@/lib/auth/validation';

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
  const phone = normalizeIranianPhone(formData.phone);
  const email = normalizeEmail(formData.email);
  const practiceArea = formData.area.trim().slice(0, 120);
  const message = formData.message.trim();

  if (!name || !phone || !message || !formData.consent) {
    return { ok: false, error: 'لطفاً فیلدهای الزامی را تکمیل کنید.' };
  }
  if (validateName(name) || !isValidIranianPhone(phone)) {
    return { ok: false, error: 'نام یا شماره موبایل معتبر نیست.' };
  }
  if (email && !isValidEmail(email)) {
    return { ok: false, error: 'ایمیل واردشده معتبر نیست.' };
  }
  if (message.length < 10 || message.length > 4000) {
    return { ok: false, error: 'شرح موضوع باید بین ۱۰ تا ۴۰۰۰ کاراکتر باشد.' };
  }

  try {
    const key = await requestRateLimitKey(phone);
    const blocked = await consumeRateLimit({
      key,
      action: 'consultation',
      limit: 5,
      windowSeconds: 3600,
      blockSeconds: 3600,
    });
    if (blocked) {
      return {
        ok: false,
        error: 'تعداد درخواست‌ها زیاد است. لطفاً بعداً دوباره تلاش کنید یا با دفتر تماس بگیرید.',
      };
    }
  } catch {
    return {
      ok: false,
      error: 'ارسال درخواست موقتاً در دسترس نیست. لطفاً با دفتر تماس بگیرید.',
    };
  }

  try {
    await createConsultationRequest({
      name,
      phone,
      email: email || undefined,
      practiceArea: practiceArea || undefined,
      message,
    });
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: 'ارسال پیام با خطا مواجه شد. لطفاً دوباره تلاش کنید یا با دفتر تماس بگیرید.',
    };
  }
}
