
import Link from '@/components/NoPrefetchLink';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import AdminHeader from '../../AdminHeader';
import ThreadControls from '../ThreadControls';
import { getSupportMessages, getSupportThread } from '@/lib/support';
import { ReplyThreadForm } from '@/components/SupportForms';
import { Badge } from '@/components/ui/badge';
import { SUPPORT_STATUS_LABEL, SUPPORT_STATUS_VARIANT } from '@/lib/status';
import { formatJalaliDateTime } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function AdminThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id)) notFound();

  const [thread, messages] = await Promise.all([
    getSupportThread(id),
    getSupportMessages(id),
  ]);
  if (!thread) notFound();

  return (
    <div className="max-w-5xl mx-auto">
      <Link href="/admin/support" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5">
        <ArrowRight size={16} /> بازگشت به گفت‌وگوها
      </Link>

      <AdminHeader
        title={thread.subject}
        description={`موکل: ${thread.clientName} — شروع: ${formatJalaliDateTime(thread.createdAt)}`}
        actions={<Badge variant={SUPPORT_STATUS_VARIANT[thread.status]}>{SUPPORT_STATUS_LABEL[thread.status]}</Badge>}
      />

      <ThreadControls id={thread.id} status={thread.status} />

      <section className="dashboard-card p-5 md:p-6 my-6 space-y-4">
        {messages.map((message) => {
          const fromAdmin = message.senderRole !== 'CLIENT';
          return (
            <div key={message.id} className={`flex ${fromAdmin ? 'justify-end' : 'justify-start'}`}>
              <article className={`max-w-[86%] rounded-xl p-4 ${fromAdmin ? 'bg-ink text-parchment' : 'bg-muted'}`}>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className={`text-xs font-semibold ${fromAdmin ? 'text-gold-light' : 'text-accent'}`}>{fromAdmin ? 'شما (مدیر)' : message.senderName}</span>
                  <span className={`text-[10px] ${fromAdmin ? 'text-parchment/60' : 'text-muted-foreground'}`}>{formatJalaliDateTime(message.createdAt)}</span>
                </div>
                <p className="text-sm leading-8 whitespace-pre-wrap">{message.body}</p>
              </article>
            </div>
          );
        })}
      </section>

      <ReplyThreadForm threadId={thread.id} />
    </div>
  );
}
