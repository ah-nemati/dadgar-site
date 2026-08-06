
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

export default async function LoginPage() {
  const account = await getCurrentAccount();
  if (account) redirect(dashboardPath(account.role));

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
        <AuthLoginForm />
      </div>
    </section>
  );
}
