
import Link from '@/components/NoPrefetchLink';
import { MessageSquare, Search } from 'lucide-react';
import AdminHeader from '../AdminHeader';
import { getSupportThreads } from '@/lib/support';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SUPPORT_STATUS_LABEL, SUPPORT_STATUS_VARIANT } from '@/lib/status';
import { formatJalaliDateTime } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function AdminSupportPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q = '', status = '' } = await searchParams;
  const threads = await getSupportThreads();
  const query = q.trim().toLowerCase();
  const filtered = threads.filter((thread) => {
    const matchesQuery = !query || [thread.subject, thread.clientName, thread.lastMessage ?? ''].join(' ').toLowerCase().includes(query);
    const matchesStatus = !status || thread.status === status;
    return matchesQuery && matchesStatus;
  });

  return (
    <div>
      <AdminHeader
        title="گفت‌وگوهای موکلین"
        description="پرسش‌های کاربران را مشاهده، پاسخ و در پایان گفت‌وگو را ببندید."
      />

      <form className="dashboard-card p-4 mb-5 grid grid-cols-1 md:grid-cols-[1fr_13rem_auto] gap-3">
        <div className="relative">
          <Search size={17} className="auth-field-icon" />
          <Input name="q" defaultValue={q} className="pr-11" placeholder="جستجو در موضوع، نام یا متن پیام" />
        </div>
        <select name="status" defaultValue={status} className="h-11 px-4 rounded-sm text-sm bg-card border border-input">
          <option value="">همه وضعیت‌ها</option>
          {Object.entries(SUPPORT_STATUS_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <Button type="submit" variant="secondary">اعمال فیلتر</Button>
      </form>

      {filtered.length === 0 ? (
        <div className="dashboard-card py-16 text-center">
          <MessageSquare size={34} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">گفت‌وگویی پیدا نشد.</p>
        </div>
      ) : (
        <div className="dashboard-card p-5 space-y-3">
          {filtered.map((thread) => (
            <Link key={thread.id} href={`/admin/support/${thread.id}`} className="block border border-border rounded-lg p-4 hover:border-primary transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold">{thread.subject}</p>
                  <p className="text-xs text-muted-foreground mt-1">موکل: {thread.clientName}</p>
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-1">{thread.lastMessage || 'بدون پیام'}</p>
                  <p className="text-[11px] text-muted-foreground mt-2">{formatJalaliDateTime(thread.updatedAt)}</p>
                </div>
                <Badge variant={SUPPORT_STATUS_VARIANT[thread.status]}>{SUPPORT_STATUS_LABEL[thread.status]}</Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
