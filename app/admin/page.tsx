import Link from '@/components/NoPrefetchLink';
import { Briefcase, CalendarDays, Clock3, FileText, Inbox, MessageSquare, Plus, Users } from 'lucide-react';
import AdminHeader from './AdminHeader';
import { getAdminDashboardStats } from '@/lib/admin-dashboard';
import { getConsultationRequests } from '@/lib/messages';
import { getCases } from '@/lib/cases';
import { getStaffAppointments } from '@/lib/appointments';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatJalaliDate, formatJalaliDateTime, toPersianDigits } from '@/lib/format';
import {
  APPOINTMENT_STATUS_LABEL,
  APPOINTMENT_STATUS_VARIANT,
  CASE_STATUS_LABEL,
  CASE_STATUS_VARIANT,
} from '@/lib/status';
import { requireStaff } from '@/lib/session';
import ServerDataAutoRefresh from '@/components/admin/ServerDataAutoRefresh';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [account, stats, messages, cases, appointments] = await Promise.all([
    requireStaff(),
    getAdminDashboardStats(),
    getConsultationRequests(),
    getCases(),
    getStaffAppointments(),
  ]);

  const cards = [
    { label: 'موکل ثبت‌شده', value: stats.clients, icon: Users, href: '/admin/clients', hint: 'حساب‌های فعال سامانه' },
    { label: 'پرونده فعال', value: stats.activeCases, icon: Briefcase, href: '/admin/cases', hint: 'نیازمند پیگیری' },
    { label: 'درخواست جدید', value: stats.newConsultations, icon: Inbox, href: '/admin/messages', hint: 'تماس اولیه' },
    { label: 'نوبت در انتظار', value: stats.pendingAppointments, icon: CalendarDays, href: '/admin/appointments', hint: 'نیازمند تأیید' },
    { label: 'گفت‌وگوی باز', value: stats.openThreads, icon: MessageSquare, href: '/admin/support', hint: 'در حال مکاتبه' },
    { label: 'مطلب منتشرشده', value: stats.publishedPosts, icon: FileText, href: '/admin/blog', hint: 'محتوای عمومی' },
  ].filter((card) => account.role === 'ADMIN' || !['/admin/clients', '/admin/blog'].includes(card.href));

  const urgentCount = stats.newConsultations + stats.pendingAppointments + stats.openThreads;

  return (
    <div>
      <ServerDataAutoRefresh intervalMs={15_000} />
      <AdminHeader
        title={account.role === 'LAWYER' ? 'داشبورد وکیل' : 'داشبورد مدیریت'}
        description="مواردی که نیاز به اقدام دارند در اولویت دیده می‌شوند؛ از این صفحه می‌توانید سریع وارد پرونده، درخواست یا گفت‌وگوی مربوط شوید."
        actions={<Button asChild><Link href="/admin/cases/new"><Plus size={16} /> ثبت پرونده جدید</Link></Button>}
      />

      <section className="mb-6 grid gap-4 rounded-2xl border border-sky-200 bg-[linear-gradient(135deg,#e8f7ff,#f8fdff)] p-5 text-sky-900 shadow-[0_16px_45px_rgba(2,132,199,.09)] md:grid-cols-[1fr_auto] md:items-center md:p-6">
        <div>
          <p className="text-xs font-bold text-sky-600">اولویت امروز</p>
          <h2 className="mt-2 text-xl font-extrabold">{toPersianDigits(urgentCount)} مورد برای بررسی یا پاسخ باقی مانده است</h2>
          <p className="mt-2 text-xs leading-6 text-sky-800/65">درخواست‌های جدید، نوبت‌های در انتظار و گفت‌وگوهای باز در این عدد جمع شده‌اند.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="ghostLight" asChild><Link href="/admin/messages">درخواست‌ها</Link></Button>
          <Button size="sm" variant="ghostLight" asChild><Link href="/admin/appointments">نوبت‌ها</Link></Button>
          <Button size="sm" variant="ghostLight" asChild><Link href="/admin/support">گفت‌وگوها</Link></Button>
        </div>
      </section>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, href, hint }) => (
          <Link href={href} key={label} className="dashboard-stat group">
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-muted-foreground">{label}</p>
                <p className="mt-2 text-3xl font-extrabold text-foreground">{toPersianDigits(value)}</p>
                <p className="mt-2 text-[11px] text-muted-foreground">{hint}</p>
              </div>
              <span className="inline-flex size-11 items-center justify-center rounded-xl border border-accent/15 bg-accent/10 text-accent transition-colors group-hover:bg-ink group-hover:text-sky-600">
                <Icon size={21} aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="dashboard-card p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div><p className="text-[11px] font-bold text-accent">ورودی‌های جدید</p><h2 className="mt-1 font-extrabold">آخرین پیام‌های مشاوره</h2></div>
            <Link href="/admin/messages" className="text-xs font-bold text-accent hover:text-primary">مشاهده همه</Link>
          </div>
          <div className="space-y-2.5">
            {messages.slice(0, 5).map((message) => (
              <Link href="/admin/messages" key={message.id} className="block rounded-xl border border-border p-4 transition-colors hover:border-gold/55 hover:bg-gold/5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-extrabold">{message.name}</p>
                  <Badge variant={message.status === 'new' ? 'default' : 'outline'}>{message.status === 'new' ? 'جدید' : 'پیگیری‌شده'}</Badge>
                </div>
                <p className="mt-2 line-clamp-1 text-xs leading-6 text-muted-foreground">{message.message}</p>
              </Link>
            ))}
            {messages.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">پیامی ثبت نشده است.</p>}
          </div>
        </section>

        <section className="dashboard-card p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div><p className="text-[11px] font-bold text-accent">رزرو نوبت</p><h2 className="mt-1 font-extrabold">آخرین نوبت‌های ثبت‌شده</h2></div>
            <Link href="/admin/appointments" className="text-xs font-bold text-accent hover:text-primary">مشاهده همه</Link>
          </div>
          <div className="space-y-2.5">
            {appointments.slice(0, 5).map((item) => (
              <Link href="/admin/appointments" key={item.id} className="block rounded-xl border border-border p-4 transition-colors hover:border-gold/55 hover:bg-gold/5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-extrabold truncate">{item.subject}</p>
                  <Badge variant={APPOINTMENT_STATUS_VARIANT[item.status]}>{APPOINTMENT_STATUS_LABEL[item.status]}</Badge>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground/80">{item.clientName}</span>
                  <span className="flex items-center gap-1"><Clock3 size={12} className="text-sky-600" /> {formatJalaliDateTime(item.requestedAt)}</span>
                </div>
              </Link>
            ))}
            {appointments.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">نوبتی ثبت نشده است.</p>}
          </div>
        </section>

        <section className="dashboard-card p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div><p className="text-[11px] font-bold text-accent">پرونده‌ها</p><h2 className="mt-1 font-extrabold">آخرین پرونده‌های به‌روزشده</h2></div>
            <Link href="/admin/cases" className="text-xs font-bold text-accent hover:text-primary">مشاهده همه</Link>
          </div>
          <div className="space-y-2.5">
            {cases.slice(0, 5).map((item) => (
              <Link href={`/admin/cases/${item.id}`} key={item.id} className="block rounded-xl border border-border p-4 transition-colors hover:border-gold/55 hover:bg-gold/5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-extrabold">{item.title}</p>
                  <Badge variant={CASE_STATUS_VARIANT[item.status]}>{CASE_STATUS_LABEL[item.status]}</Badge>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground"><span>{item.clientName}</span><span>{formatJalaliDate(item.updatedAt)}</span></div>
              </Link>
            ))}
            {cases.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">پرونده‌ای ثبت نشده است.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
