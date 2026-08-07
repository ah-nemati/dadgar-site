import { ShieldCheck } from 'lucide-react';
import PortalProfileForm from '../PortalProfileForm';
import PortalPasswordForm from '../PortalPasswordForm';
import { getCurrentProfile } from '@/lib/profile';

export const dynamic = 'force-dynamic';

export default async function PortalProfilePage() {
  const profile = await getCurrentProfile();
  const passwordAccount = profile?.id.startsWith('auth0|') ?? false;

  return (
    <div className="max-w-5xl">
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">اطلاعات حساب کاربری</h1>
          <p className="dashboard-page-description">نام و شماره تماس خود را به‌روز نگه دارید تا دفتر بتواند با شما ارتباط بگیرد.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <PortalProfileForm profile={profile} />
        {passwordAccount ? (
          <PortalPasswordForm />
        ) : (
          <div className="dashboard-card p-6">
            <h2 className="font-bold flex items-center gap-2"><ShieldCheck size={18} /> امنیت حساب</h2>
            <p className="text-sm text-muted-foreground mt-3 leading-7">
              این حساب با یک ارائه‌دهنده اجتماعی مانند Google وارد شده است؛ مدیریت رمز عبور از همان ارائه‌دهنده انجام می‌شود.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
