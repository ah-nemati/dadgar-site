'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { submitConsultationRequest } from '@/lib/actions/consultation';
import type { PracticeArea } from '@/types/content';
import Link from '@/components/NoPrefetchLink';

interface ContactFormProps {
  practiceAreas: PracticeArea[];
}

type FormState = {
  name: string;
  phone: string;
  email: string;
  area: string;
  message: string;
  consent: boolean;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_FORM: FormState = { name: '', phone: '', email: '', area: '', message: '', consent: false };

export default function ContactForm({ practiceAreas }: ContactFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = 'لطفاً نام و نام خانوادگی را وارد کنید.';
    if (!form.phone.trim()) next.phone = 'لطفاً شماره تماس را وارد کنید.';
    if (!form.message.trim()) next.message = 'لطفاً شرح مختصری از موضوع بنویسید.';
    if (!form.consent) next.consent = 'برای ارسال درخواست، تایید این بخش لازم است.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    setServerError(null);
    submitConsultationRequest(form).then((result) => {
      if (result.ok) {
        setStatus('success');
      } else {
        setStatus('idle');
        setServerError(result.error ?? 'ارسال پیام با خطا مواجه شد. لطفاً دوباره تلاش کنید.');
      }
    });
  }

  function resetForm() {
    setForm(INITIAL_FORM);
    setErrors({});
    setStatus('idle');
    setServerError(null);
  }

  if (status === 'success') {
    return (
      <Card className="p-10 text-center items-center">
        <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mx-auto mb-1">
          <CheckCircle2 size={28} className="text-accent-foreground" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold text-foreground">پیام شما با موفقیت ارسال شد</h2>
        <p className="text-muted-foreground leading-7">کارشناسان ما ظرف ۲۴ ساعت کاری با شما تماس خواهند گرفت.</p>
        <Button variant="outline" onClick={resetForm}>
          ارسال درخواست دیگر
        </Button>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-card border border-border rounded-sm p-6 md:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div className="space-y-2">
          <Label htmlFor="cf-name">نام و نام خانوادگی *</Label>
          <Input id="cf-name" value={form.name} onChange={(event: ChangeEvent<HTMLInputElement>) => update('name', event.target.value)} aria-invalid={!!errors.name} />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cf-phone">شماره تماس *</Label>
          <Input id="cf-phone" type="tel" value={form.phone} onChange={(event: ChangeEvent<HTMLInputElement>) => update('phone', event.target.value)} aria-invalid={!!errors.phone} />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div className="space-y-2">
          <Label htmlFor="cf-email">ایمیل (اختیاری)</Label>
          <Input id="cf-email" type="email" dir="ltr" style={{ textAlign: 'right' }} value={form.email} onChange={(event: ChangeEvent<HTMLInputElement>) => update('email', event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cf-area">حوزه مورد نظر</Label>
          <select
            id="cf-area"
            value={form.area}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => update('area', event.target.value)}
            className="flex h-11 w-full rounded-sm border border-input bg-card px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
          >
            <option value="">انتخاب کنید</option>
            {practiceAreas.map((area) => (
              <option key={area.slug} value={area.slug}>
                {area.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2 mb-5">
        <Label htmlFor="cf-message">شرح خواسته *</Label>
        <Textarea id="cf-message" rows={5} value={form.message} onChange={(event: ChangeEvent<HTMLTextAreaElement>) => update('message', event.target.value)} aria-invalid={!!errors.message} />
        {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
      </div>

      <div className="mb-6">
        <div className="flex items-start gap-2.5">
          <Checkbox
            id="cf-consent"
            checked={form.consent}
            onCheckedChange={(checked) => update('consent', checked === true)}
            className="mt-0.5"
          />
          <Label htmlFor="cf-consent" className="text-sm text-muted-foreground font-normal leading-6 cursor-pointer">
            با ارسال این فرم، <Link href="/privacy" className="underline underline-offset-2">حریم خصوصی</Link> را می‌پذیرم و اجازه می‌دهم دفتر برای پیگیری این درخواست با من تماس بگیرد.
          </Label>
        </div>
        {errors.consent && <p className="text-xs text-destructive mt-1.5">{errors.consent}</p>}
      </div>

      <Button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden="true" /> در حال ارسال...
          </>
        ) : (
          <>
            ارسال درخواست <Send size={16} aria-hidden="true" />
          </>
        )}
      </Button>
      {serverError && <p className="text-sm text-destructive mt-3">{serverError}</p>}
    </form>
  );
}
