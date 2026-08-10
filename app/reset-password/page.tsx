import type { Metadata } from 'next';
import Link from '@/components/NoPrefetchLink';
import AuthShell from '@/components/AuthShell';
import ResetPasswordForm from '@/components/ResetPasswordForm';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const metadata: Metadata = {
  title: 'تعیین رمز عبور جدید',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = '' } = await searchParams;

  return (
    <AuthShell
      eyebrow="امنیت حساب"
      title="تعیین رمز عبور جدید"
      description="یک رمز تازه و اختصاصی برای حساب خود انتخاب کنید. لینک بازیابی فقط یک‌بار قابل استفاده است."
    >
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="space-y-5">
          <Alert variant="destructive">
            <AlertDescription className="col-start-1">
              لینک بازیابی ناقص یا نامعتبر است.
            </AlertDescription>
          </Alert>
          <Link className="text-sm font-semibold text-accent" href="/forgot-password">
            دریافت لینک تازه از مدیر
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
