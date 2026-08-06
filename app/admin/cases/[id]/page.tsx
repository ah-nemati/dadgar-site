
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Download, FileText } from 'lucide-react';
import AdminHeader from '../../AdminHeader';
import CaseForm from '../CaseForm';
import {
  CaseUpdateForm,
  DeleteCaseButton,
  DeleteDocumentButton,
  DeleteUpdateButton,
  DocumentUploadForm,
} from '../CaseExtras';
import { editCaseAction } from '../actions';
import { getClients } from '@/lib/clients';
import { getCaseById, getCaseDocuments, getCaseUpdates } from '@/lib/cases';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CASE_STATUS_LABEL, CASE_STATUS_VARIANT } from '@/lib/status';
import { formatFileSize, formatJalaliDateTime } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function AdminCaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id)) notFound();

  const [item, clients, updates, documents] = await Promise.all([
    getCaseById(id),
    getClients(),
    getCaseUpdates(id),
    getCaseDocuments(id),
  ]);
  if (!item) notFound();

  const editAction = editCaseAction.bind(null, item.id);

  return (
    <div>
      <Link href="/admin/cases" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5">
        <ArrowRight size={16} /> بازگشت به پرونده‌ها
      </Link>

      <AdminHeader
        title={item.title}
        description={`شماره پرونده: ${item.caseNumber} — موکل: ${item.clientName}`}
        actions={<div className="flex items-center gap-3"><Badge variant={CASE_STATUS_VARIANT[item.status]}>{CASE_STATUS_LABEL[item.status]}</Badge><DeleteCaseButton id={item.id} /></div>}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_.8fr] gap-6 items-start">
        <div className="space-y-6">
          <CaseForm action={editAction} clients={clients} item={item} submitLabel="ذخیره تغییرات پرونده" />

          <section className="dashboard-card p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold">روند و گزارش‌های پرونده</h2>
              <span className="text-xs text-muted-foreground">{updates.length} گزارش</span>
            </div>
            <div className="space-y-4">
              {updates.map((update) => (
                <article key={update.id} className="relative border-r-2 border-accent/30 pr-5 py-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-sm">{update.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{formatJalaliDateTime(update.createdAt)}</p>
                    </div>
                    <DeleteUpdateButton id={update.id} caseId={item.id} />
                  </div>
                  <p className="text-sm text-muted-foreground leading-8 mt-3 whitespace-pre-wrap">{update.body}</p>
                </article>
              ))}
              {updates.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">هنوز گزارشی ثبت نشده است.</p>}
            </div>
          </section>

          <section className="dashboard-card p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold">اسناد پرونده</h2>
              <span className="text-xs text-muted-foreground">{documents.length} فایل</span>
            </div>
            <div className="space-y-3">
              {documents.map((document) => (
                <div key={document.id} className="flex flex-wrap items-center justify-between gap-3 border border-border rounded-lg p-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="inline-flex size-10 items-center justify-center rounded-lg bg-muted"><FileText size={19} /></span>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{document.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{document.fileName} — {formatFileSize(document.fileSize)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {document.downloadUrl && <Button asChild size="sm" variant="outline"><a href={document.downloadUrl} target="_blank" rel="noreferrer"><Download size={14} /> دریافت</a></Button>}
                    <DeleteDocumentButton id={document.id} caseId={item.id} />
                  </div>
                </div>
              ))}
              {documents.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">سندی بارگذاری نشده است.</p>}
            </div>
          </section>
        </div>

        <div className="space-y-6 xl:sticky xl:top-24">
          <CaseUpdateForm caseId={item.id} />
          <DocumentUploadForm caseId={item.id} clientId={item.clientId} />
        </div>
      </div>
    </div>
  );
}
