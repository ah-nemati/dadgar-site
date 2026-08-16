import { ShieldCheck } from 'lucide-react';
import AdminHeader from '../AdminHeader';
import { requireAdmin } from '@/lib/session';
import { getAuditLogs } from '@/lib/audit';
import { formatJalaliDateTime } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function AuditPage() {
  await requireAdmin();
  const logs = await getAuditLogs();
  return <div><AdminHeader title="گزارش فعالیت و امنیت" description="آخرین رخدادهای مهم مدیریتی و امنیتی برای پیگیری تغییرات." />
    <div className="dashboard-card overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border text-right"><th className="p-4">زمان</th><th className="p-4">کاربر</th><th className="p-4">عملیات</th><th className="p-4">نوع</th><th className="p-4">شناسه</th></tr></thead><tbody>{logs.map((log) => <tr key={log.id} className="border-b border-border/70"><td className="p-4 whitespace-nowrap">{formatJalaliDateTime(log.createdAt)}</td><td className="p-4"><div className="font-medium">{log.actorName ?? 'سیستم'}</div><div className="text-xs text-muted-foreground" dir="ltr">{log.actorEmail ?? ''}</div></td><td className="p-4" dir="ltr">{log.action}</td><td className="p-4" dir="ltr">{log.entityType}</td><td className="p-4" dir="ltr">{log.entityId ?? '—'}</td></tr>)}</tbody></table>{logs.length === 0 && <div className="p-10 text-center text-sm text-muted-foreground"><ShieldCheck className="mx-auto mb-3"/> رویدادی ثبت نشده است.</div>}</div>
  </div>;
}
