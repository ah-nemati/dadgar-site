import { AlertTriangle, Inbox, MailOpen, Search, Send, UserRoundCheck } from 'lucide-react';
import AdminHeader from '../AdminHeader';
import ServerDataAutoRefresh from '@/components/admin/ServerDataAutoRefresh';
import StatusControls from './StatusControls';
import { saveMessageAdminDetails } from './actions';
import { getConsultationRequests } from '@/lib/messages';
import { getPracticeAreas } from '@/lib/content/practice-areas';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { formatJalaliDateTime, toPersianDigits } from '@/lib/format';
import { CONSULTATION_STATUS_LABEL } from '@/lib/status';
import type { ConsultationPriority, ConsultationStatus } from '@/types/content';
import Link from '@/components/NoPrefetchLink';

export const dynamic = 'force-dynamic';

const STATUS_VARIANT: Record<ConsultationStatus, 'default' | 'outline' | 'accent'> = {
  new: 'default',
  read: 'outline',
  replied: 'accent',
};

const PRIORITY_LABEL: Record<ConsultationPriority, string> = {
  normal: 'عادی',
  high: 'مهم',
  urgent: 'فوری',
};

const PRIORITY_VARIANT: Record<ConsultationPriority, 'outline' | 'default' | 'destructive'> = {
  normal: 'outline',
  high: 'default',
  urgent: 'destructive',
};

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; area?: string; priority?: string }>;
}) {
  const [{ q = '', status = '', area = '', priority = '' }, messages, practiceAreas] = await Promise.all([
    searchParams,
    getConsultationRequests(),
    getPracticeAreas(),
  ]);

  const query = q.trim().toLowerCase();
  const filtered = messages.filter((message) => {
    const matchesQuery =
      !query ||
      [message.name, message.phone, message.email ?? '', message.message, message.adminNotes ?? '']
        .join(' ')
        .toLowerCase()
        .includes(query);
    const matchesStatus = !status || message.status === status;
    const matchesArea = !area || message.practiceArea === area;
    const matchesPriority = !priority || message.priority === priority;
    return matchesQuery && matchesStatus && matchesArea && matchesPriority;
  });

  const areaTitle = (slug: string | null) =>
    practiceAreas.find((item) => item.slug === slug)?.title ?? slug ?? 'موضوع عمومی';

  const stats = {
    new: messages.filter((item) => item.status === 'new').length,
    read: messages.filter((item) => item.status === 'read').length,
    replied: messages.filter((item) => item.status === 'replied').length,
    urgent: messages.filter((item) => item.priority === 'urgent' && item.status !== 'replied').length,
  };

  return (
    <div>
      <ServerDataAutoRefresh intervalMs={10_000} />
      <AdminHeader
        title="درخواست‌های مشاوره"
        description="سرنخ‌های ورودی سایت را بررسی، اولویت‌بندی و نتیجه پیگیری را ثبت کنید."
      />

      <div className="grid grid-cols-1 gap-3 mb-5 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="جدید" value={stats.new} icon={Inbox} />
        <Stat label="در حال پیگیری" value={stats.read} icon={MailOpen} />
        <Stat label="پاسخ داده‌شده" value={stats.replied} icon={UserRoundCheck} />
        <Stat label="فوریِ باز" value={stats.urgent} icon={AlertTriangle} />
      </div>

      <form className="dashboard-card p-4 mb-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1fr_11rem_13rem_10rem_auto] gap-3">
        <div className="relative">
          <Search size={17} className="auth-field-icon" />
          <Input name="q" defaultValue={q} className="pr-11" placeholder="نام، تلفن، ایمیل، متن یا یادداشت" />
        </div>
        <select name="status" defaultValue={status} className="h-11 px-4 rounded-sm text-sm bg-card border border-input">
          <option value="">همه وضعیت‌ها</option>
          {Object.entries(CONSULTATION_STATUS_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select name="area" defaultValue={area} className="h-11 px-4 rounded-sm text-sm bg-card border border-input">
          <option value="">همه حوزه‌ها</option>
          {practiceAreas.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}
        </select>
        <select name="priority" defaultValue={priority} className="h-11 px-4 rounded-sm text-sm bg-card border border-input">
          <option value="">همه اولویت‌ها</option>
          <option value="normal">عادی</option>
          <option value="high">مهم</option>
          <option value="urgent">فوری</option>
        </select>
        <Button type="submit" variant="secondary" className="w-full md:w-auto">اعمال فیلتر</Button>
      </form>

      {filtered.length === 0 ? (
        <div className="dashboard-card py-16 text-center">
          <Inbox size={34} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">درخواستی مطابق فیلتر پیدا نشد.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((message) => (
            <article key={message.id} className="dashboard-card p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="font-bold">{message.name}</h2>
                    <Badge variant={STATUS_VARIANT[message.status]}>{CONSULTATION_STATUS_LABEL[message.status]}</Badge>
                    <Badge variant={PRIORITY_VARIANT[message.priority]}>{PRIORITY_LABEL[message.priority]}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground mt-3">
                    <Link href={`tel:${message.phone}`} dir="ltr" className="hover:text-foreground">{message.phone}</Link>
                    {message.email && <Link href={`mailto:${message.email}`} dir="ltr" className="hover:text-foreground">{message.email}</Link>}
                    <span>{areaTitle(message.practiceArea)}</span>
                    <span>{formatJalaliDateTime(message.createdAt)}</span>
                  </div>
                </div>
                <StatusControls id={message.id} status={message.status} />
              </div>

              <div className="mt-5 grid grid-cols-1 xl:grid-cols-[1fr_22rem] gap-5 border-t border-border pt-5">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">شرح درخواست</p>
                  <p className="text-sm leading-8 whitespace-pre-wrap">{message.message}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild size="sm"><a href={`tel:${message.phone}`}><Send size={14} /> تماس با متقاضی</a></Button>
                    {message.email && <Button asChild size="sm" variant="outline"><a href={`mailto:${message.email}`}>ارسال ایمیل</a></Button>}
                  </div>
                </div>

                <form action={saveMessageAdminDetails.bind(null, message.id)} className="rounded-lg border border-border bg-muted/25 p-4 space-y-3">
                  <p className="text-sm font-semibold">پیگیری داخلی</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <select name="status" defaultValue={message.status} className="h-10 px-3 rounded-sm text-sm bg-card border border-input">
                      <option value="new">جدید</option>
                      <option value="read">در حال پیگیری</option>
                      <option value="replied">پاسخ داده‌شده</option>
                    </select>
                    <select name="priority" defaultValue={message.priority} className="h-10 px-3 rounded-sm text-sm bg-card border border-input">
                      <option value="normal">عادی</option>
                      <option value="high">مهم</option>
                      <option value="urgent">فوری</option>
                    </select>
                  </div>
                  <Textarea name="adminNotes" defaultValue={message.adminNotes ?? ''} rows={4} maxLength={2000} placeholder="یادداشت داخلی، نتیجه تماس یا اقدام بعدی..." />
                  <Button type="submit" size="sm" variant="secondary" className="w-full">ذخیره پیگیری</Button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Inbox }) {
  return (
    <div className="dashboard-stat">
      <div className="flex justify-between gap-3">
        <div><p className="text-xs sm:text-sm text-muted-foreground">{label}</p><p className="text-2xl sm:text-3xl font-extrabold mt-2">{toPersianDigits(value)}</p></div>
        <Icon className="text-accent" size={20} />
      </div>
    </div>
  );
}
