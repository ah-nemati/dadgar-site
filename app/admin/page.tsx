
import Link from '@/components/NoPrefetchLink';
import {
  Briefcase,
  CalendarDays,
  FileText,
  Inbox,
  MessageSquare,
  Users,
} from 'lucide-react';
import AdminHeader from './AdminHeader';
import { getAdminDashboardStats } from '@/lib/admin-dashboard';
import { getConsultationRequests } from '@/lib/messages';
import { getCases } from '@/lib/cases';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatJalaliDate, toPersianDigits } from '@/lib/format';
import { CASE_STATUS_LABEL, CASE_STATUS_VARIANT } from '@/lib/status';
import { requireStaff } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [account, stats, messages, cases] = await Promise.all([
    requireStaff(),
    getAdminDashboardStats(),
    getConsultationRequests(),
    getCases(),
  ]);

  const cards = [
    { label: 'موکل ثبت‌شده', value: stats.clients, icon: Users, href: '/admin/clients' },
    { label: 'پرونده فعال', value: stats.activeCases, icon: Briefcase, href: '/admin/cases' },
    { label: 'درخواست جدید', value: stats.newConsultations, icon: Inbox, href: '/admin/messages' },
    { label: 'نوبت در انتظار', value: stats.pendingAppointments, icon: CalendarDays, href: '/admin/appointments' },
    { label: 'گفت‌وگوی باز', value: stats.openThreads, icon: MessageSquare, href: '/admin/support' },
    { label: 'مطلب منتشرشده', value: stats.publishedPosts, icon: FileText, href: '/admin/blog' },
  ].filter((card) =>
    account.role === 'ADMIN' || !['/admin/clients', '/admin/blog'].includes(card.href)
  );

  return (
    <div>
      <AdminHeader
        title={account.role === 'LAWYER' ? 'داشبورد وکیل' : 'داشبورد مدیریت'}
        description="نمای کلی فعالیت سایت، موکلین و مواردی که نیاز به پیگیری دارند."
        actions={<Button asChild><Link href="/admin/cases/new">ثبت پرونده جدید</Link></Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, href }) => (
          <Link href={href} key={label} className="dashboard-stat group">
            <div className="flex items-start justify-between gap-4 relative z-10">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-3xl font-extrabold mt-2">{toPersianDigits(value)}</p>
              </div>
              <span className="inline-flex size-11 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-ink group-hover:text-parchment transition-colors">
                <Icon size={22} aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="dashboard-card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold">آخرین درخواست‌های مشاوره</h2>
            <Link href="/admin/messages" className="text-sm text-accent hover:text-primary">مشاهده همه</Link>
          </div>
          <div className="space-y-3">
            {messages.slice(0, 5).map((message) => (
              <Link href="/admin/messages" key={message.id} className="block rounded-lg border border-border p-4 hover:border-primary transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-sm">{message.name}</p>
                  <Badge variant={message.status === 'new' ? 'default' : 'outline'}>
                    {message.status === 'new' ? 'جدید' : 'پیگیری‌شده'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-1">{message.message}</p>
              </Link>
            ))}
            {messages.length === 0 && <p className="text-sm text-muted-foreground py-8 text-center">درخواستی ثبت نشده است.</p>}
          </div>
        </section>

        <section className="dashboard-card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold">پرونده‌های اخیر</h2>
            <Link href="/admin/cases" className="text-sm text-accent hover:text-primary">مشاهده همه</Link>
          </div>
          <div className="space-y-3">
            {cases.slice(0, 5).map((item) => (
              <Link href={`/admin/cases/${item.id}`} key={item.id} className="block rounded-lg border border-border p-4 hover:border-primary transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-sm">{item.title}</p>
                  <Badge variant={CASE_STATUS_VARIANT[item.status]}>{CASE_STATUS_LABEL[item.status]}</Badge>
                </div>
                <div className="flex items-center justify-between gap-3 mt-2 text-xs text-muted-foreground">
                  <span>{item.clientName}</span>
                  <span>{formatJalaliDate(item.updatedAt)}</span>
                </div>
              </Link>
            ))}
            {cases.length === 0 && <p className="text-sm text-muted-foreground py-8 text-center">پرونده‌ای ثبت نشده است.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
