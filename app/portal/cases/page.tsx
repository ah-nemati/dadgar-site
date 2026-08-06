
import Link from 'next/link';
import { Briefcase, ChevronLeft } from 'lucide-react';
import { getCases } from '@/lib/cases';
import { Badge } from '@/components/ui/badge';
import { CASE_STATUS_LABEL, CASE_STATUS_VARIANT } from '@/lib/status';
import { formatJalaliDateTime } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function PortalCasesPage() {
  const cases = await getCases();

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">پرونده‌های من</h1>
          <p className="dashboard-page-description">وضعیت، آخرین اقدامات و اسناد هر پرونده را مشاهده کنید.</p>
        </div>
      </div>

      {cases.length === 0 ? (
        <div className="dashboard-card py-16 text-center">
          <Briefcase size={36} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">در حال حاضر پرونده‌ای به حساب شما متصل نشده است.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {cases.map((item) => (
            <Link href={`/portal/cases/${item.id}`} key={item.id} className="dashboard-card p-5 hover:border-primary transition-colors group">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant={CASE_STATUS_VARIANT[item.status]}>{CASE_STATUS_LABEL[item.status]}</Badge>
                  <h2 className="font-bold mt-4 leading-7">{item.title}</h2>
                  <p className="text-xs text-muted-foreground mt-2">شماره پرونده: <span dir="ltr">{item.caseNumber}</span></p>
                </div>
                <ChevronLeft className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              {item.nextAction && (
                <div className="mt-5 rounded-lg bg-muted/50 p-3 text-sm">
                  <span className="text-muted-foreground">اقدام بعدی: </span>{item.nextAction}
                  {item.nextActionAt && <p className="text-xs text-muted-foreground mt-1">{formatJalaliDateTime(item.nextActionAt)}</p>}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
