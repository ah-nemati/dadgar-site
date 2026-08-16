import Link from '@/components/NoPrefetchLink';
import { Briefcase, CalendarDays, MessageSquare, ShieldCheck } from 'lucide-react';
import { getCurrentProfile } from '@/lib/profile';
import { getCases } from '@/lib/cases';
import { getSupportThreads } from '@/lib/support';
import { getAppointments } from '@/lib/appointments';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CASE_STATUS_LABEL, CASE_STATUS_VARIANT } from '@/lib/status';
import { toPersianDigits } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function PortalDashboardPage() {
  const [profile, cases, threads, appointments] = await Promise.all([
    getCurrentProfile(),
    getCases(),
    getSupportThreads(),
    getAppointments(),
  ]);

  const cards = [
    { label: 'پرونده‌های من', value: cases.length, icon: Briefcase, href: '/portal/cases', hint: 'مشاهده وضعیت و اسناد' },
    { label: 'گفت‌وگوها', value: threads.length, icon: MessageSquare, href: '/portal/messages', hint: 'پیام خصوصی با دفتر' },
    { label: 'نوبت‌ها', value: appointments.length, icon: CalendarDays, href: '/portal/appointments', hint: 'درخواست و پیگیری زمان' },
  ];

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <p className="mb-2 text-[11px] font-extrabold text-accent">حساب موکل</p>
          <h1 className="dashboard-page-title">سلام{profile?.fullName ? `، ${profile.fullName}` : ''}</h1>
          <p className="dashboard-page-description">پرونده‌ها، مدارک، پیام‌های خصوصی و نوبت‌های خود را از این صفحه دنبال کنید.</p>
        </div>
        <div className="flex flex-wrap gap-2"><Button asChild><Link href="/portal/messages"><MessageSquare size={16} /> صحبت با وکیل</Link></Button><Button asChild variant="outline"><Link href="/portal/profile">ویرایش پروفایل</Link></Button></div>
      </div>

      <div className="dashboard-card mb-6 flex items-start gap-3 border-accent/20 bg-accent/5 p-4 md:p-5">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent"><ShieldCheck size={18} /></span>
        <div><p className="text-sm font-extrabold text-foreground">فضای خصوصی موکل</p><p className="mt-1 text-xs leading-6 text-muted-foreground">اطلاعات این پنل فقط برای شما و افراد مجاز دفتر قابل مشاهده است. فایل‌های خصوصی نیز با دسترسی کنترل‌شده ارائه می‌شوند.</p></div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, href, hint }) => (
          <Link href={href} key={label} className="dashboard-stat group">
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div><p className="text-xs font-bold text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-extrabold">{toPersianDigits(value)}</p><p className="mt-2 text-[11px] text-muted-foreground">{hint}</p></div>
              <span className="inline-flex size-11 items-center justify-center rounded-xl border border-accent/15 bg-accent/10 text-accent transition-colors group-hover:bg-sky-200 group-hover:text-sky-700"><Icon size={21} /></span>
            </div>
          </Link>
        ))}
      </div>

      <section className="dashboard-card p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between"><div><p className="text-[11px] font-bold text-accent">پرونده‌ها</p><h2 className="mt-1 font-extrabold">آخرین پرونده‌های من</h2></div><Link href="/portal/cases" className="text-xs font-bold text-accent">مشاهده همه</Link></div>
        <div className="grid gap-3 md:grid-cols-2">
          {cases.slice(0, 4).map((item) => (
            <Link key={item.id} href={`/portal/cases/${item.id}`} className="rounded-xl border border-border p-4 transition-colors hover:border-sky-300 hover:bg-sky-50">
              <div className="flex items-center justify-between gap-3"><p className="text-sm font-extrabold">{item.title}</p><Badge variant={CASE_STATUS_VARIANT[item.status]}>{CASE_STATUS_LABEL[item.status]}</Badge></div>
              <p className="mt-3 text-xs text-muted-foreground">شماره پرونده: <span dir="ltr">{item.caseNumber}</span></p>
            </Link>
          ))}
          {cases.length === 0 && <p className="col-span-full py-10 text-center text-sm text-muted-foreground">هنوز پرونده‌ای برای حساب شما ثبت نشده است.</p>}
        </div>
      </section>
    </div>
  );
}
