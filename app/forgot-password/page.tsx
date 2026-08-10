import Link from 'next/link';
import { ArrowRight, KeyRound, Phone } from 'lucide-react';
import AuthShell from '@/components/AuthShell';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FIRM } from '@/data/firm';

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="بازیابی دسترسی"
      title="بازیابی رمز عبور"
      description="برای بازنشانی رمز، ابتدا هویت شما توسط مدیر سامانه بررسی می‌شود."
    >
      <div className="space-y-5">
        <Alert variant="accent">
          <KeyRound size={17} />
          <AlertDescription className="leading-7">
            با دفتر تماس بگیرید و ایمیل یا شماره موبایل ثبت‌شده در حساب را اعلام کنید. مدیر پس از تأیید هویت، یک لینک یک‌بارمصرف ۳۰ دقیقه‌ای برای شما می‌سازد.
          </AlertDescription>
        </Alert>

        <p className="text-sm leading-7 text-muted-foreground">
          لینک بازیابی از طریق تماس یا پیام خصوصی در اختیار شما قرار می‌گیرد؛ برای این کار نیازی به سرویس ایمیل یا پرداخت هزینه نیست.
        </p>

        <Button className="w-full" asChild>
          <a href={FIRM.phoneHref}>
            <Phone size={17} aria-hidden="true" />
            تماس با دفتر: {FIRM.phone}
          </a>
        </Button>

        <Button className="w-full" variant="outline" asChild>
          <Link href="/contact">ارسال درخواست از صفحه تماس</Link>
        </Button>
      </div>

      <p className="mt-6 text-center text-sm">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 font-semibold text-accent transition-colors hover:text-primary"
        >
          <ArrowRight size={16} aria-hidden="true" />
          بازگشت به ورود
        </Link>
      </p>
    </AuthShell>
  );
}
