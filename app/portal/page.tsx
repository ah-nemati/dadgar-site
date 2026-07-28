import type { Metadata } from 'next';
import { ShieldCheck, Clock, FileText, MessageSquare } from 'lucide-react';
import { getCurrentProfile } from '@/lib/profile';
import PortalProfileForm from './PortalProfileForm';
import { clientLogOut } from '../client-login/actions';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const metadata: Metadata = {
  title: 'پنل موکلین',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function PortalPage() {
  // proxy.ts already guarantees a signed-in user reaches this far.
  const profile = await getCurrentProfile();

  return (
    <section className="bg-parchment">
      <div className="max-w-3xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              خوش آمدید{profile?.fullName ? `، ${profile.fullName}` : ''}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">این پنل اختصاصی حساب کاربری شماست.</p>
          </div>
          <form action={clientLogOut}>
            <Button type="submit" variant="outline" size="sm">
              خروج
            </Button>
          </form>
        </div>

        <Alert variant="accent" className="mb-8">
          <ShieldCheck />
          <AlertDescription>
            ورود شما با موفقیت و به‌صورت امن انجام شد. بخش پیگیری پرونده، اسناد و پیام‌رسانی امن با وکیل، در مراحل
            بعدی این پروژه فعال می‌شود؛ در حال حاضر این پنل امکان مدیریت اطلاعات حساب کاربری شما را فراهم می‌کند.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-card border border-border rounded-sm p-5 text-center opacity-60">
            <Clock size={22} className="text-muted-foreground mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm font-medium text-foreground">پیگیری وضعیت پرونده</p>
            <p className="text-xs text-muted-foreground mt-1">به‌زودی</p>
          </div>
          <div className="bg-card border border-border rounded-sm p-5 text-center opacity-60">
            <FileText size={22} className="text-muted-foreground mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm font-medium text-foreground">اسناد پرونده</p>
            <p className="text-xs text-muted-foreground mt-1">به‌زودی</p>
          </div>
          <div className="bg-card border border-border rounded-sm p-5 text-center opacity-60">
            <MessageSquare size={22} className="text-muted-foreground mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm font-medium text-foreground">پیام‌رسانی با وکیل</p>
            <p className="text-xs text-muted-foreground mt-1">به‌زودی</p>
          </div>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-4">اطلاعات حساب کاربری</h2>
        <PortalProfileForm profile={profile} />
      </div>
    </section>
  );
}
