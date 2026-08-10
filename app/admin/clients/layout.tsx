import { requireAdmin } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function UserManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return children;
}
