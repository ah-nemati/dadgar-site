import { Clock3, ShieldCheck } from 'lucide-react';
import AdminHeader from '../AdminHeader';
import { requireAdmin } from '@/lib/session';
import { getAuditLogs } from '@/lib/audit';
import { formatJalaliDateTime } from '@/lib/format';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export default async function AuditPage() {
  await requireAdmin();
  const logs = await getAuditLogs();

  return (
    <div>
      <AdminHeader
        title="گزارش فعالیت و امنیت"
        description="آخرین رخدادهای مهم مدیریتی و امنیتی برای پیگیری تغییرات."
      />

      <div className="dashboard-table-wrap">
        <table className="min-w-[720px] w-full text-sm">
          <thead className="bg-muted/55 text-muted-foreground">
            <tr className="border-b border-border text-right">
              <th className="p-4">زمان رخداد</th>
              <th className="p-4">کاربر مجری</th>
              <th className="p-4">عملیات</th>
              <th className="p-4">نوع موجودیت</th>
              <th className="p-4">شناسه</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-border/70 hover:bg-muted/20 transition-colors">
                <td className="p-4 whitespace-nowrap">
                  <span className="flex items-center gap-1.5 text-xs text-foreground/80 font-medium">
                    <Clock3 size={13} className="text-sky-600 shrink-0" aria-hidden="true" />
                    <span>{formatJalaliDateTime(log.createdAt)}</span>
                  </span>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-foreground">{log.actorName ?? 'سیستم'}</div>
                  <div className="text-xs text-muted-foreground mt-0.5" dir="ltr">{log.actorEmail ?? '—'}</div>
                </td>
                <td className="p-4">
                  <Badge variant="outline" className="font-mono text-xs" dir="ltr">
                    {log.action}
                  </Badge>
                </td>
                <td className="p-4 text-xs font-mono text-muted-foreground" dir="ltr">
                  {log.entityType}
                </td>
                <td className="p-4 text-xs font-mono text-muted-foreground" dir="ltr">
                  {log.entityId ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && (
          <div className="p-12 text-center text-sm text-muted-foreground">
            <ShieldCheck className="mx-auto mb-3 text-accent" size={32} />
            رویدادی ثبت نشده است.
          </div>
        )}
      </div>
    </div>
  );
}
