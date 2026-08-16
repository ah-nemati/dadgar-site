
import Link from '@/components/NoPrefetchLink';
import { Briefcase, Plus, Search } from 'lucide-react';
import AdminHeader from '../AdminHeader';
import { getCases } from '@/lib/cases';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CASE_STATUS_LABEL, CASE_STATUS_VARIANT } from '@/lib/status';
import { formatJalaliDate, toPersianDigits } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function AdminCasesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q = '', status = '' } = await searchParams;
  const cases = await getCases();
  const query = q.trim().toLowerCase();
  const filtered = cases.filter((item) => {
    const matchesQuery = !query || [
      item.title,
      item.caseNumber,
      item.clientName,
      item.court ?? '',
    ].join(' ').toLowerCase().includes(query);
    const matchesStatus = !status || item.status === status;
    return matchesQuery && matchesStatus;
  });

  return (
    <div>
      <AdminHeader
        title="مدیریت پرونده‌ها"
        description={`${toPersianDigits(cases.length)} پرونده در سامانه ثبت شده است.`}
        actions={
          <Button asChild>
            <Link href="/admin/cases/new"><Plus size={16} /> پرونده جدید</Link>
          </Button>
        }
      />

      <form className="dashboard-card p-4 mb-5 grid grid-cols-1 md:grid-cols-[1fr_13rem_auto] gap-3">
        <div className="relative">
          <Search size={17} className="auth-field-icon" aria-hidden="true" />
          <Input name="q" defaultValue={q} placeholder="جستجو در عنوان، شماره یا نام موکل" className="pr-11" />
        </div>
        <select
          name="status"
          defaultValue={status}
          className="h-11 px-4 rounded-sm text-sm bg-card border border-input outline-none"
        >
          <option value="">همه وضعیت‌ها</option>
          {Object.entries(CASE_STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <Button type="submit" variant="secondary">اعمال فیلتر</Button>
      </form>

      {filtered.length === 0 ? (
        <div className="dashboard-card py-16 text-center">
          <Briefcase size={34} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">پرونده‌ای مطابق فیلتر پیدا نشد.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filtered.map((item) => (
              <article key={item.id} className="dashboard-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-bold truncate">{item.title}</h2>
                    <p className="text-xs text-muted-foreground mt-2">موکل: {item.clientName}</p>
                    <p className="text-xs text-muted-foreground mt-1" dir="ltr">{item.caseNumber}</p>
                  </div>
                  <Badge variant={CASE_STATUS_VARIANT[item.status]}>{CASE_STATUS_LABEL[item.status]}</Badge>
                </div>
                <div className="flex items-center justify-between gap-3 mt-4">
                  <span className="text-[11px] text-muted-foreground">آخرین تغییر: {formatJalaliDate(item.updatedAt)}</span>
                  <Button asChild size="sm" variant="outline"><Link href={`/admin/cases/${item.id}`}>مدیریت</Link></Button>
                </div>
              </article>
            ))}
          </div>

          <div className="dashboard-table-wrap hidden md:block">
            <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-muted/55 text-muted-foreground">
              <tr>
                <th className="text-right p-4">وضعیت</th>
                <th className="text-right p-4">شماره پرونده</th>
                <th className="text-right p-4">عنوان</th>
                <th className="text-right p-4">موکل</th>
                <th className="text-right p-4">آخرین تغییر</th>
                <th className="text-right p-4">اقدام</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-t border-border hover:bg-muted/25">
                  <td className="p-4"><Badge variant={CASE_STATUS_VARIANT[item.status]}>{CASE_STATUS_LABEL[item.status]}</Badge></td>
                  <td className="p-4 text-xs" dir="ltr">{item.caseNumber}</td>
                  <td className="p-4 font-semibold">{item.title}</td>
                  <td className="p-4 text-muted-foreground">{item.clientName}</td>
                  <td className="p-4 text-muted-foreground">{formatJalaliDate(item.updatedAt)}</td>
                  <td className="p-4"><Button asChild size="sm" variant="outline"><Link href={`/admin/cases/${item.id}`}>مشاهده و مدیریت</Link></Button></td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
