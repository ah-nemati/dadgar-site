import Link from '@/components/NoPrefetchLink';
import { notFound } from 'next/navigation';
import { ArrowRight, Download, Paperclip } from 'lucide-react';
import AdminHeader from '../../AdminHeader';
import ThreadControls from '../ThreadControls';
import { getSupportMessages, getSupportThread } from '@/lib/support';
import { ReplyThreadForm } from '@/components/SupportForms';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SUPPORT_STATUS_LABEL, SUPPORT_STATUS_VARIANT } from '@/lib/status';
import { formatJalaliDateTime, toPersianDigits } from '@/lib/format';
import { getPracticeAreas } from '@/lib/content/practice-areas';

export const dynamic = 'force-dynamic';

function sizeLabel(size: number | null): string {
  if (!size) return '';
  if (size < 1024 * 1024) return `${toPersianDigits(Math.max(1, Math.round(size / 1024)))} کیلوبایت`;
  return `${toPersianDigits((size / (1024 * 1024)).toFixed(1))} مگابایت`;
}

export default async function AdminThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id)) notFound();

  const [thread, messages, practiceAreas] = await Promise.all([
    getSupportThread(id),
    getSupportMessages(id),
    getPracticeAreas(),
  ]);
  if (!thread) notFound();
  const areaTitle = practiceAreas.find((area) => area.slug === thread.practiceArea)?.title;

  return (
    <div className="max-w-5xl mx-auto">
      <Link href="/admin/support" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5">
        <ArrowRight size={16} /> بازگشت به گفت‌وگوها
      </Link>

      <AdminHeader
        title={thread.subject}
        description={`موکل: ${thread.clientName} — شروع: ${formatJalaliDateTime(thread.createdAt)}`}
        actions={<div className="flex items-center gap-2">{areaTitle && <Badge variant="outline">{areaTitle}</Badge>}<Badge variant={SUPPORT_STATUS_VARIANT[thread.status]}>{SUPPORT_STATUS_LABEL[thread.status]}</Badge></div>}
      />

      <ThreadControls id={thread.id} status={thread.status} />

      <section className="dashboard-card p-5 md:p-6 my-6 space-y-4">
        {messages.map((message) => {
          const fromAdmin = message.senderRole !== 'CLIENT';
          return (
            <div key={message.id} className={`flex ${fromAdmin ? 'justify-end' : 'justify-start'}`}>
              <article className={`max-w-[92%] md:max-w-[82%] rounded-xl p-4 ${fromAdmin ? 'bg-sky-100 text-sky-900' : 'bg-sky-50'}`}>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className={`text-xs font-semibold ${fromAdmin ? 'text-sky-600' : 'text-accent'}`}>{fromAdmin ? 'دفتر وکالت' : message.senderName}</span>
                  <span className={`text-[10px] ${fromAdmin ? 'text-sky-700/60' : 'text-muted-foreground'}`}>{formatJalaliDateTime(message.createdAt)}</span>
                </div>
                <p className="text-sm leading-8 whitespace-pre-wrap">{message.body}</p>
                {Boolean(message.attachments?.length) && (
                  <div className={`mt-3 pt-3 border-t space-y-2 ${fromAdmin ? 'border-white/15' : 'border-border'}`}>
                    {message.attachments?.map((file) => (
                      <Button key={file.id} asChild size="sm" variant={fromAdmin ? 'ghostLight' : 'outline'} className="w-full justify-between">
                        <a href={file.downloadUrl} target="_blank" rel="noreferrer">
                          <span className="flex items-center gap-2 min-w-0"><Paperclip size={14} /><span className="truncate">{file.fileName}</span></span>
                          <span className="flex items-center gap-2 text-[10px] opacity-70">{sizeLabel(file.fileSize)} <Download size={13} /></span>
                        </a>
                      </Button>
                    ))}
                  </div>
                )}
              </article>
            </div>
          );
        })}
      </section>

      <ReplyThreadForm threadId={thread.id} />
    </div>
  );
}
