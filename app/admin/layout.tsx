
import type { Metadata } from 'next';
import DashboardShell, { type DashboardNavItem } from '@/components/dashboard/DashboardShell';
import { requireStaff } from '@/lib/session';

export const metadata: Metadata = {
  title: 'پنل مدیریت',
  robots: { index: false, follow: false },
};

const STAFF_NAV_ITEMS: DashboardNavItem[] = [
  { href: '/admin', label: 'داشبورد', icon: 'dashboard' },
  { href: '/admin/messages', label: 'درخواست‌های اولیه', icon: 'inbox' },
  { href: '/admin/appointments', label: 'نوبت‌ها', icon: 'calendar' },
  { href: '/admin/cases', label: 'پرونده‌ها', icon: 'cases' },
  { href: '/admin/support', label: 'گفت‌وگو با موکلان', icon: 'messages' },
  { href: '/admin/security', label: 'امنیت حساب', icon: 'profile' },
];

const ADMIN_NAV_ITEMS: DashboardNavItem[] = [
  STAFF_NAV_ITEMS[0],
  STAFF_NAV_ITEMS[1],
  { href: '/admin/appointments', label: 'مدیریت نوبت‌ها', icon: 'calendar' },
  { href: '/admin/blog', label: 'مدیریت وبلاگ', icon: 'blog' },
  { href: '/admin/content', label: 'محتوای سایت', icon: 'content' },
  { href: '/admin/site', label: 'تنظیمات دفتر', icon: 'settings' },
  { href: '/admin/seo', label: 'SEO و گوگل', icon: 'seo' },
  { href: '/admin/clients', label: 'مدیریت کاربران', icon: 'users' },
  { href: '/admin/cases', label: 'پرونده‌ها', icon: 'cases' },
  { href: '/admin/support', label: 'گفت‌وگو با موکلان', icon: 'messages' },
  { href: '/admin/audit', label: 'گزارش فعالیت', icon: 'audit' },
  { href: '/admin/security', label: 'امنیت حساب', icon: 'profile' },
];

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const account = await requireStaff();
  const navItems = account.role === 'ADMIN' ? ADMIN_NAV_ITEMS : STAFF_NAV_ITEMS;

  return (
    <DashboardShell
      account={account}
      navItems={navItems}
      panelTitle={account.role === 'LAWYER' ? 'پنل وکیل' : 'پنل مدیریت'}
    >
      {children}
    </DashboardShell>
  );
}
