import ChangePasswordForm from '@/components/ChangePasswordForm';

export const dynamic = 'force-dynamic';

export default function AdminSecurityPage() {
  return (
    <div className="max-w-2xl">
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">امنیت حساب</h1>
          <p className="dashboard-page-description">
            رمز حساب مدیریتی خود را تغییر دهید و نشست‌های قدیمی را ببندید.
          </p>
        </div>
      </div>
      <ChangePasswordForm />
    </div>
  );
}
