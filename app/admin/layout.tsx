
import type { Metadata } from 'next';
import DashboardShell, { type DashboardNavItem } from '@/components/dashboard/DashboardShell';
import { getCurrentAccount } from '@/lib/session';

export const metadata: Metadata = {
  title: 'پنل مدیریت',
  robots: { index: false, follow: false },
};

const NAV_ITEMS: DashboardNavItem[] = [
  { href: '/admin', label: 'داشبورد', icon: 'dashboard' },
  { href: '/admin/messages', label: 'درخواست‌های مشاوره', icon: 'inbox' },
  { href: '/admin/blog', label: 'مدیریت وبلاگ', icon: 'blog' },
  { href: '/admin/clients', label: 'موکلین', icon: 'users' },
  { href: '/admin/cases', label: 'پرونده‌ها', icon: 'cases' },
  { href: '/admin/support', label: 'گفت‌وگوها', icon: 'messages' },
  { href: '/admin/appointments', label: 'نوبت‌ها', icon: 'calendar' },
];

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const account = await getCurrentAccount();

  if (!account || account.role !== 'admin') return <>{children}</>;

  return (
    <DashboardShell account={account} navItems={NAV_ITEMS} panelTitle="پنل مدیریت">
      {children}
    </DashboardShell>
  );
}
