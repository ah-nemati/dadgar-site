
import type { Metadata } from 'next';
import DashboardShell, { type DashboardNavItem } from '@/components/dashboard/DashboardShell';
import { requireClient } from '@/lib/session';

export const metadata: Metadata = {
  title: 'پنل کاربری',
  robots: { index: false, follow: false },
};

const NAV_ITEMS: DashboardNavItem[] = [
  { href: '/portal', label: 'داشبورد', icon: 'dashboard' },
  { href: '/portal/cases', label: 'پرونده‌های من', icon: 'cases' },
  { href: '/portal/messages', label: 'پیام‌ها', icon: 'messages' },
  { href: '/portal/profile', label: 'اطلاعات حساب', icon: 'profile' },
];

export const dynamic = 'force-dynamic';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const account = await requireClient();

  return (
    <DashboardShell account={account} navItems={NAV_ITEMS} panelTitle="پنل موکلین">
      {children}
    </DashboardShell>
  );
}
