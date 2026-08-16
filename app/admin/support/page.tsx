import Link from '@/components/NoPrefetchLink';
import { MessageSquare, Search } from 'lucide-react';
import AdminHeader from '../AdminHeader';
import ServerDataAutoRefresh from '@/components/admin/ServerDataAutoRefresh';
import { getSupportThreads } from '@/lib/support';
import { getPracticeAreas } from '@/lib/content/practice-areas';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SUPPORT_STATUS_LABEL, SUPPORT_STATUS_VARIANT } from '@/lib/status';
import { formatJalaliDateTime, toPersianDigits } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function AdminSupportPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; area?: string }>;
}) {
  const [{ q = '', status = '', area = '' }, threads, practiceAreas] = await Promise.all([
    searchParams,
    getSupportThreads(),
    getPracticeAreas(),
  ]);
  const query = q.trim().toLowerCase();
  const filtered = threads.filter((thread) => {
    const matchesQuery = !query || [thread.subject, thread.clientName, thread.lastMessage ?? ''].join(' ').toLowerCase().includes(query);
    const matchesStatus = !status || thread.status === status;
    const matchesArea = !area || thread.practiceArea === area;
    return matchesQuery && matchesStatus && matchesArea;
  });
  const areaTitle = (slug?: string | null) => practiceAreas.find((item) => item.slug === slug)?.title;
  const open = threads.filter((thread) => thread.status === 'open').length;
  const answered = threads.filter((thread) => thread.status === 'answered').length;

  return (
    <div>
      <ServerDataAutoRefresh intervalMs={10_000} />
      <AdminHeader
        title="گفت‌وگو با موکلان"
        description={`در حال حاضر ${toPersianDigits(open)} گفت‌وگو نیازمند پاسخ و ${toPersianDigits(answered)} گفت‌وگو پاسخ‌داده‌شده است.`}
      />

      <form className="dashboard-card p-4 mb-5 grid grid-cols-1 md:grid-cols-[1fr_13rem_14rem_auto] gap-3">
        <div className="relative">
          <Search size={17} className="auth-field-icon" />
          <Input name="q" defaultValue={q} className="pr-11" placeholder="جستجو در موضوع، نام موکل یا متن پیام" />
        </div>
        <select name="status" defaultValue={status} className="h-11 px-4 rounded-sm text-sm bg-card border border-input">
          <option value="">همه وضعیت‌ها</option>
          {Object.entries(SUPPORT_STATUS_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select name="area" defaultValue={area} className="h-11 px-4 rounded-sm text-sm bg-card border border-input">
          <option value="">همه حوزه‌های حقوقی</option>
          {practiceAreas.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}
        </select>
        <Button type="submit" variant="secondary">اعمال فیلتر</Button>
      </form>

      {filtered.length === 0 ? (
        <div className="dashboard-card py-16 text-center">
          <MessageSquare size={34} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">گفت‌وگویی مطابق فیلتر پیدا نشد.</p>
        </div>
      ) : (
        <div className="dashboard-card p-5 space-y-3">
          {filtered.map((thread) => (
            <Link key={thread.id} href={`/admin/support/${thread.id}`} className="block border border-border rounded-lg p-4 hover:border-primary transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{thread.subject}</p>
                    {areaTitle(thread.practiceArea) && <Badge variant="outline">{areaTitle(thread.practiceArea)}</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">موکل: {thread.clientName}</p>
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-1">{thread.lastMessage || 'فقط فایل ارسال شده است'}</p>
                  <p className="text-[11px] text-muted-foreground mt-2">آخرین فعالیت: {formatJalaliDateTime(thread.updatedAt)}</p>
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
