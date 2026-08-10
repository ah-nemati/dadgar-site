
import Link from '@/components/NoPrefetchLink';
import { ArrowRight } from 'lucide-react';
import AdminHeader from '../../AdminHeader';
import CaseForm from '../CaseForm';
import { createCaseAction } from '../actions';
import { getClients } from '@/lib/clients';

export const dynamic = 'force-dynamic';

export default async function NewCasePage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const [{ client }, clients] = await Promise.all([searchParams, getClients()]);

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/admin/cases" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5">
        <ArrowRight size={16} /> بازگشت به پرونده‌ها
      </Link>
      <AdminHeader title="ثبت پرونده جدید" description="پرونده را به یکی از حساب‌های موکلین متصل کنید." />
      {clients.length === 0 ? (
        <div className="dashboard-card p-8 text-center">
          <p className="text-muted-foreground">ابتدا باید حداقل یک کاربر عادی در سایت ثبت‌نام کند.</p>
        </div>
      ) : (
        <CaseForm
          action={createCaseAction}
          clients={clients}
          defaultClientId={client}
          submitLabel="ثبت پرونده"
        />
      )}
    </div>
  );
}
