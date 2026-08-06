
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Download, FileText } from 'lucide-react';
import { getCaseById, getCaseDocuments, getCaseUpdates } from '@/lib/cases';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CASE_STATUS_LABEL, CASE_STATUS_VARIANT } from '@/lib/status';
import { formatFileSize, formatJalaliDateTime } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function PortalCaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id)) notFound();

  const [item, updates, documents] = await Promise.all([
    getCaseById(id),
    getCaseUpdates(id),
    getCaseDocuments(id),
  ]);
  if (!item) notFound();

  return (
    <div>
      <Link href="/portal/cases" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5">
        <ArrowRight size={16} /> بازگشت به پرونده‌ها
      </Link>

      <div className="dashboard-page-header">
        <div>
          <Badge variant={CASE_STATUS_VARIANT[item.status]}>{CASE_STATUS_LABEL[item.status]}</Badge>
          <h1 className="dashboard-page-title mt-3">{item.title}</h1>
          <p className="dashboard-page-description">شماره پرونده: <span dir="ltr">{item.caseNumber}</span>{item.court ? ` — ${item.court}` : ''}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_.8fr] gap-6 items-start">
        <section className="dashboard-card p-5">
          <h2 className="font-bold mb-5">روند پرونده</h2>
          <div className="space-y-5">
            {updates.map((update) => (
              <article key={update.id} className="border-r-2 border-accent/35 pr-5">
                <h3 className="font-semibold">{update.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{formatJalaliDateTime(update.createdAt)}</p>
                <p className="text-sm text-muted-foreground leading-8 mt-3 whitespace-pre-wrap">{update.body}</p>
              </article>
            ))}
            {updates.length === 0 && <p className="text-sm text-muted-foreground text-center py-10">هنوز گزارشی برای این پرونده ثبت نشده است.</p>}
          </div>
        </section>

        <div className="space-y-6">
          <section className="dashboard-card p-5">
            <h2 className="font-bold mb-4">اطلاعات پرونده</h2>
            <dl className="space-y-4 text-sm">
              <div><dt className="text-muted-foreground">شرح پرونده</dt><dd className="mt-1 leading-7">{item.description || '—'}</dd></div>
              <div><dt className="text-muted-foreground">اقدام بعدی</dt><dd className="mt-1">{item.nextAction || '—'}</dd></div>
              <div><dt className="text-muted-foreground">زمان اقدام بعدی</dt><dd className="mt-1">{item.nextActionAt ? formatJalaliDateTime(item.nextActionAt) : '—'}</dd></div>
            </dl>
          </section>

          <section className="dashboard-card p-5">
            <h2 className="font-bold mb-4">اسناد قابل دریافت</h2>
            <div className="space-y-3">
              {documents.map((document) => (
                <div key={document.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-accent shrink-0" />
                    <div className="min-w-0"><p className="font-semibold text-sm truncate">{document.title}</p><p className="text-xs text-muted-foreground mt-1">{document.fileName} — {formatFileSize(document.fileSize)}</p></div>
                  </div>
                  {document.downloadUrl && <Button asChild size="sm" variant="outline" className="mt-3 w-full"><a href={document.downloadUrl} target="_blank" rel="noreferrer"><Download size={14} /> دریافت فایل</a></Button>}
                </div>
              ))}
              {documents.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">سندی برای دانلود وجود ندارد.</p>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
