'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { PRACTICE_AREAS } from '@/data/practiceAreas';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', area: '', message: '', consent: false });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'لطفاً نام و نام خانوادگی را وارد کنید.';
    if (!form.phone.trim()) next.phone = 'لطفاً شماره تماس را وارد کنید.';
    if (!form.message.trim()) next.message = 'لطفاً شرح مختصری از موضوع بنویسید.';
    if (!form.consent) next.consent = 'برای ارسال درخواست، تایید این بخش لازم است.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    setTimeout(() => setStatus('success'), 900);
  };

  const resetForm = () => {
    setForm({ name: '', phone: '', email: '', area: '', message: '', consent: false });
    setErrors({});
    setStatus('idle');
  };

  if (status === 'success') {
    return (
      <div className="bg-card border border-sand rounded-sm p-10 text-center">
        <div className="w-14 h-14 rounded-full bg-teal flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={28} className="text-parchment" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold text-charcoal mb-3">پیام شما با موفقیت ارسال شد</h2>
        <p className="text-muted leading-7 mb-6">کارشناسان ما ظرف ۲۴ ساعت کاری با شما تماس خواهند گرفت.</p>
        <button onClick={resetForm} className="border border-ink text-ink hover:bg-ink hover:text-parchment transition-colors px-6 py-2.5 rounded-sm text-sm">
          ارسال درخواست دیگر
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-card border border-sand rounded-sm p-6 md:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label htmlFor="cf-name" className="block text-sm font-medium text-charcoal mb-2">نام و نام خانوادگی *</label>
          <input
            id="cf-name"
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="w-full px-4 py-2.5 rounded-sm text-sm bg-card border border-sand focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          />
          {errors.name && <p className="text-xs text-danger mt-1.5">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="cf-phone" className="block text-sm font-medium text-charcoal mb-2">شماره تماس *</label>
          <input
            id="cf-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            className="w-full px-4 py-2.5 rounded-sm text-sm bg-card border border-sand focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          />
          {errors.phone && <p className="text-xs text-danger mt-1.5">{errors.phone}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label htmlFor="cf-email" className="block text-sm font-medium text-charcoal mb-2">ایمیل (اختیاری)</label>
          <input
            id="cf-email"
            type="email"
            dir="ltr"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            style={{ textAlign: 'right' }}
            className="w-full px-4 py-2.5 rounded-sm text-sm bg-card border border-sand focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          />
        </div>
        <div>
          <label htmlFor="cf-area" className="block text-sm font-medium text-charcoal mb-2">حوزه مورد نظر</label>
          <select
            id="cf-area"
            value={form.area}
            onChange={(e) => update('area', e.target.value)}
            className="w-full px-4 py-2.5 rounded-sm text-sm bg-card border border-sand focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          >
            <option value="">انتخاب کنید</option>
            {PRACTICE_AREAS.map((a) => (
              <option key={a.slug} value={a.slug}>{a.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-5">
        <label htmlFor="cf-message" className="block text-sm font-medium text-charcoal mb-2">شرح خواسته *</label>
        <textarea
          id="cf-message"
          rows={5}
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          className="w-full px-4 py-2.5 rounded-sm text-sm resize-none bg-card border border-sand focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
        />
        {errors.message && <p className="text-xs text-danger mt-1.5">{errors.message}</p>}
      </div>

      <div className="mb-6">
        <label className="flex items-start gap-2.5 text-sm text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => update('consent', e.target.checked)}
            className="mt-1"
            style={{ width: 16, height: 16 }}
          />
          <span>با ارسال این فرم، با حفظ کامل محرمانگی اطلاعات ارسالی موافقم و اجازه می‌دهم کارشناسان موسسه با من تماس بگیرند.</span>
        </label>
        {errors.consent && <p className="text-xs text-danger mt-1.5">{errors.consent}</p>}
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-ink font-semibold px-7 py-3 rounded-sm text-sm transition-colors disabled:opacity-70"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden="true" /> در حال ارسال...
          </>
        ) : (
          <>
            ارسال درخواست <Send size={16} aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
