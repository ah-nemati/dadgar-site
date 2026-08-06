
import PortalProfileForm from '../PortalProfileForm';
import { getCurrentProfile } from '@/lib/profile';

export const dynamic = 'force-dynamic';

export default async function PortalProfilePage() {
  const profile = await getCurrentProfile();

  return (
    <div className="max-w-2xl">
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">اطلاعات حساب کاربری</h1>
          <p className="dashboard-page-description">نام و شماره تماس خود را به‌روز نگه دارید تا دفتر بتواند با شما ارتباط بگیرد.</p>
        </div>
      </div>
      <PortalProfileForm profile={profile} />
    </div>
  );
}
