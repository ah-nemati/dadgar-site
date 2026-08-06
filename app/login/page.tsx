import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Seal from '@/components/Seal';
import AuthLoginForm from '@/components/AuthLoginForm';
import { getCurrentAccount, dashboardPath } from '@/lib/session';

export const metadata: Metadata = {
  title: 'ورود به حساب کاربری',
  description: 'ورود مدیر و کاربران به پنل اختصاصی دفتر وکالت.',
};

export const dynamic = 'force-dynamic';

type LoginSearchParams = Promise<{
  status?: string | string[];
  code?: string | string[];
  email?: string | string[];
}>;

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

function callbackErrorMessage(code: string): string {
  switch (code) {
    case 'otp_expired':
    case 'flow_state_expired':
    case 'flow_state_not_found':
    case 'bad_code_verifier':
      return 'لینک تأیید یا بازیابی منقضی شده است. یک لینک جدید درخواست کنید.';
    case 'profile_missing':
      return 'احراز هویت انجام شد، اما پروفایل کاربر در دیتابیس وجود ندارد. نسخه جدید فایل supabase/schema.sql را اجرا کنید.';
    case 'session_not_found':
      return 'جلسه ورود ساخته نشد. دوباره وارد شوید.';
    case 'missing_code':
    case 'invalid_confirmation_link':
      return 'لینک احراز هویت ناقص یا نامعتبر است.';
    default:
      return 'تأیید حساب انجام نشد. ممکن است لینک منقضی یا قبلاً استفاده شده باشد.';
  }
}

export default async function LoginPage({ searchParams }: { searchParams: LoginSearchParams }) {
  const account = await getCurrentAccount();
  if (account) redirect(dashboardPath(account.role));

  const query = await searchParams;
  const status = first(query.status);
  const code = first(query.code);
  const email = first(query.email);

  const initialNotice =
    status === 'password-updated'
      ? 'رمز عبور با موفقیت تغییر کرد. اکنون با رمز جدید وارد شوید.'
      : undefined;
  const initialError = status === 'auth-link-error' ? callbackErrorMessage(code) : undefined;

  return (
    <section className="bg-parchment min-h-[72vh] flex items-center">
      <div className="max-w-md mx-auto px-6 py-16 w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <Seal size={58} />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">ورود به حساب کاربری</h1>
          <p className="text-sm text-muted-foreground leading-7">
            اطلاعات حساب خود را وارد کنید؛ نوع پنل براساس نقش شما تشخیص داده می‌شود.
          </p>
        </div>
        <AuthLoginForm
          initialNotice={initialNotice}
          initialError={initialError}
          initialErrorCode={initialError ? code : undefined}
          initialEmail={email}
        />
      </div>
    </section>
  );
}
