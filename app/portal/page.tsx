
import Link from 'next/link';
import { Briefcase, MessageSquare, ShieldCheck } from 'lucide-react';
import { getCurrentProfile } from '@/lib/profile';
import { getCases } from '@/lib/cases';
import { getSupportThreads } from '@/lib/support';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CASE_STATUS_LABEL, CASE_STATUS_VARIANT } from '@/lib/status';
import { toPersianDigits } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function PortalDashboardPage() {
  const [profile, cases, threads] = await Promise.all([
    getCurrentProfile(),
    getCases(),
    getSupportThreads(),
  ]);

  const cards = [
    { label: 'پرونده‌های من', value: cases.length, icon: Briefcase, href: '/portal/cases' },
    { label: 'گفت‌وگوها', value: threads.length, icon: MessageSquare, href: '/portal/messages' },
  ];

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">سلام{profile?.fullName ? `، ${profile.fullName}` : ''}</h1>
          <p className="dashboard-page-description">از این بخش می‌توانید پرونده‌ها، اسناد و پیام‌های خصوصی خود را پیگیری کنید.</p>
        </div>
        <Button asChild variant="outline"><Link href="/portal/profile">ویرایش پروفایل</Link></Button>
      </div>

      <div className="dashboard-card p-4 mb-6 flex items-start gap-3 border-accent/30 bg-accent/5">
        <ShieldCheck className="text-accent shrink-0 mt-1" size={20} />
        <p className="text-sm text-muted-foreground leading-7">اطلاعات این پنل فقط برای شما و مدیر دفتر قابل مشاهده است. لینک دانلود اسناد نیز زمان‌دار و محافظت‌شده است.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, href }) => (
          <Link href={href} key={label} className="dashboard-stat group">
            <div className="flex items-center justify-between relative z-10">
              <div><p className="text-sm text-muted-foreground">{label}</p><p className="text-3xl font-extrabold mt-2">{toPersianDigits(value)}</p></div>
              <span className="inline-flex size-11 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-ink group-hover:text-parchment transition-colors"><Icon size={22} /></span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <section className="dashboard-card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold">آخرین پرونده‌ها</h2>
            <Link href="/portal/cases" className="text-sm text-accent">مشاهده همه</Link>
          </div>
          <div className="space-y-3">
            {cases.slice(0, 4).map((item) => (
              <Link key={item.id} href={`/portal/cases/${item.id}`} className="block border border-border rounded-lg p-4 hover:border-primary transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-sm">{item.title}</p>
                  <Badge variant={CASE_STATUS_VARIANT[item.status]}>{CASE_STATUS_LABEL[item.status]}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">شماره پرونده: <span dir="ltr">{item.caseNumber}</span></p>
              </Link>
            ))}
            {cases.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">هنوز پرونده‌ای برای حساب شما ثبت نشده است.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
