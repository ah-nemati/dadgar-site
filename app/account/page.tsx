import { redirect } from 'next/navigation';
import { dashboardPath, requireAccount } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function AccountRouterPage() {
  const account = await requireAccount();
  redirect(dashboardPath(account.role));
}
