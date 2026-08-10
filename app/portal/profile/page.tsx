import PortalProfileForm from '../PortalProfileForm';
import ChangePasswordForm from '@/components/ChangePasswordForm';
import { getCurrentProfile } from '@/lib/profile';

export const dynamic = 'force-dynamic';

export default async function PortalProfilePage() {
  const profile = await getCurrentProfile();

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
        <ChangePasswordForm />
      </div>
    </div>
  );
}
