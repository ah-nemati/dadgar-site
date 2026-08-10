import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Briefcase, Mail, MessageSquare, Phone, Plus } from 'lucide-react';
import AdminHeader from '../../AdminHeader';
import { getUserById } from '@/lib/clients';
import { getCases } from '@/lib/cases';
import { getSupportThreads } from '@/lib/support';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CASE_STATUS_LABEL, CASE_STATUS_VARIANT } from '@/lib/status';
import { formatJalaliDate, formatJalaliDateTime, toPersianDigits } from '@/lib/format';
import ClientPasswordResetForm from '../ClientPasswordResetForm';
import UserEditForm from '../UserEditForm';
import DeleteUserButton from '../DeleteUserButton';
import type { UserRole, UserStatus } from '@/types/content';

export const dynamic = 'force-dynamic';

const ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: 'مدیر',
  LAWYER: 'وکیل',
  CLIENT: 'موکل',
};

const STATUS_LABEL: Record<UserStatus, string> = {
  ACTIVE: 'فعال',
  DISABLED: 'غیرفعال',
  PASSWORD_RESET_REQUIRED: 'نیازمند تعیین رمز',
};

function decodeRouteId(value: string): string {
  let decoded = value;

  // Decode defensively because route parameters can arrive encoded by a proxy.
  for (let index = 0; index < 2; index += 1) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }

  return decoded;
}

export default async function AdminClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = decodeRouteId(rawId);
  const [client, allCases, allThreads] = await Promise.all([
    getUserById(id),
    getCases(),
    getSupportThreads(),
  ]);
  if (!client) notFound();

  const cases = allCases.filter((item) => item.clientId === id);
  const threads = allThreads.filter((item) => item.clientId === id);

  return (
    <div>
      <Link href="/admin/clients" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5">
        <ArrowRight size={16} /> بازگشت به کاربران
      </Link>

      <AdminHeader
        title={client.fullName || 'کاربر بدون نام'}
        description={`${ROLE_LABEL[client.role]} · ${STATUS_LABEL[client.status]} · عضویت از ${formatJalaliDate(client.createdAt)}`}
        actions={client.role === 'CLIENT' ? <Button asChild><Link href={`/admin/cases/new?client=${encodeURIComponent(client.id)}`}><Plus size={16} /> ثبت پرونده</Link></Button> : undefined}
      />

      <section className="dashboard-card p-5 mb-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-lg bg-muted/45 p-4"><Mail size={18} className="text-accent mb-3" /><p className="text-xs text-muted-foreground">ایمیل</p><p className="text-sm mt-1 break-all" dir="ltr">{client.email || '—'}</p></div>
        <div className="rounded-lg bg-muted/45 p-4"><Phone size={18} className="text-accent mb-3" /><p className="text-xs text-muted-foreground">شماره تماس</p><p className="text-sm mt-1" dir="ltr">{client.phone || '—'}</p></div>
        <div className="rounded-lg bg-muted/45 p-4"><Briefcase size={18} className="text-accent mb-3" /><p className="text-xs text-muted-foreground">پرونده‌ها</p><p className="text-2xl font-bold mt-1">{toPersianDigits(cases.length)}</p></div>
        <div className="rounded-lg bg-muted/45 p-4"><MessageSquare size={18} className="text-accent mb-3" /><p className="text-xs text-muted-foreground">گفت‌وگوها</p><p className="text-2xl font-bold mt-1">{toPersianDigits(threads.length)}</p></div>
      </section>

      <div className="grid grid-cols-1 gap-6">
        <section className="dashboard-card p-5">
          <div className="flex items-center justify-between mb-5"><h2 className="font-bold">پرونده‌های موکل</h2><Briefcase size={19} className="text-accent" /></div>
          <div className="space-y-3">
            {cases.map((item) => (
              <Link key={item.id} href={`/admin/cases/${item.id}`} className="block rounded-lg border border-border p-4 hover:border-primary transition-colors">
                <div className="flex items-center justify-between gap-3"><p className="font-semibold text-sm">{item.title}</p><Badge variant={CASE_STATUS_VARIANT[item.status]}>{CASE_STATUS_LABEL[item.status]}</Badge></div>
                <p className="text-xs text-muted-foreground mt-2" dir="ltr">{item.caseNumber}</p>
              </Link>
            ))}
            {cases.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">هنوز پرونده‌ای ثبت نشده است.</p>}
          </div>
        </section>
      </div>

      <UserEditForm user={client} />
      <ClientPasswordResetForm clientId={client.id} />

      <section className="dashboard-card p-5 mt-6">
        <h2 className="font-bold mb-5">گفت‌وگوهای پشتیبانی</h2>
        <div className="space-y-3">
          {threads.map((thread) => (
            <Link key={thread.id} href={`/admin/support/${thread.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4 hover:border-primary transition-colors">
              <div><p className="font-semibold text-sm">{thread.subject}</p><p className="text-xs text-muted-foreground mt-2">{formatJalaliDateTime(thread.updatedAt)}</p></div>
              <span className="text-sm text-accent">مشاهده گفت‌وگو</span>
            </Link>
          ))}
          {threads.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">گفت‌وگویی ثبت نشده است.</p>}
        </div>
      </section>

      <DeleteUserButton userId={client.id} />
    </div>
  );
}
