import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import Seal from '@/components/Seal';
import ResetPasswordForm from '@/app/reset-password/ResetPasswordForm';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export const metadata: Metadata = {
  title: 'تعیین رمز عبور جدید',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function ResetPasswordPage() {
  if (!isSupabaseConfigured()) redirect('/login');

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/forgot-password');

  return (
    <section className="bg-parchment min-h-[72vh] flex items-center">
      <div className="max-w-md mx-auto px-6 py-16 w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5"><Seal size={58} /></div>
          <h1 className="text-2xl font-bold mb-2">تعیین رمز عبور جدید</h1>
          <p className="text-sm text-muted-foreground leading-7">
            برای حساب <span dir="ltr" className="font-semibold">{user.email}</span> رمز جدید تعیین کنید.
          </p>
        </div>

        <ResetPasswordForm />

        <p className="text-center text-sm mt-6">
          <Link href="/login" className="inline-flex items-center gap-2 text-accent hover:text-primary font-semibold transition-colors">
            <ArrowRight size={16} aria-hidden="true" />
            بازگشت به ورود
          </Link>
        </p>
      </div>
    </section>
  );
}
