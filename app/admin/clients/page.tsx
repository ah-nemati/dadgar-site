
import Link from 'next/link';
import { Search, UserPlus } from 'lucide-react';
import AdminHeader from '../AdminHeader';
import { getClients } from '@/lib/clients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatJalaliDate, toPersianDigits } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const clients = await getClients();
  const query = q.trim().toLowerCase();
  const filtered = query
    ? clients.filter((client) =>
        [client.fullName, client.email ?? '', client.phone ?? '']
          .join(' ')
          .toLowerCase()
          .includes(query)
      )
    : clients;

  return (
    <div>
      <AdminHeader
        title="مدیریت موکلین"
        description={`${toPersianDigits(clients.length)} حساب کاربری در سامانه ثبت شده است.`}
      />

      <form className="dashboard-card p-4 mb-5 flex gap-3">
        <div className="relative flex-1">
          <Search size={17} className="auth-field-icon" aria-hidden="true" />
          <Input name="q" defaultValue={q} placeholder="جستجو براساس نام، ایمیل یا تلفن" className="pr-11" />
        </div>
        <Button type="submit" variant="secondary">جستجو</Button>
      </form>

      <div className="dashboard-table-wrap">
        <table className="w-full text-sm min-w-[760px]">
          <thead className="bg-muted/55 text-muted-foreground">
            <tr>
              <th className="text-right p-4">نام موکل</th>
              <th className="text-right p-4">ایمیل</th>
              <th className="text-right p-4">شماره تماس</th>
              <th className="text-right p-4">تاریخ عضویت</th>
              <th className="text-right p-4">اقدام</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((client) => (
              <tr key={client.id} className="border-t border-border hover:bg-muted/25">
                <td className="p-4 font-semibold">{client.fullName || 'بدون نام'}</td>
                <td className="p-4 text-muted-foreground" dir="ltr">{client.email || '—'}</td>
                <td className="p-4 text-muted-foreground" dir="ltr">{client.phone || '—'}</td>
                <td className="p-4 text-muted-foreground">{formatJalaliDate(client.createdAt)}</td>
                <td className="p-4">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/admin/cases/new?client=${client.id}`}>
                      <UserPlus size={14} aria-hidden="true" />
                      ثبت پرونده
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-12">موکلی پیدا نشد.</p>}
      </div>
    </div>
  );
}
