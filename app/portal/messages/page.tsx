
import Link from '@/components/NoPrefetchLink';
import { MessageSquare } from 'lucide-react';
import { getSupportThreads } from '@/lib/support';
import { NewThreadForm } from '@/components/SupportForms';
import { Badge } from '@/components/ui/badge';
import { SUPPORT_STATUS_LABEL, SUPPORT_STATUS_VARIANT } from '@/lib/status';
import { formatJalaliDateTime } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function PortalMessagesPage() {
  const threads = await getSupportThreads();

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">پیام‌ها و گفت‌وگوها</h1>
          <p className="dashboard-page-description">سؤال‌های مرتبط با پرونده و خدمات دفتر را به‌صورت امن ارسال کنید.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_.85fr] gap-6 items-start">
        <section className="dashboard-card p-5">
          <h2 className="font-bold mb-5">گفت‌وگوهای من</h2>
          <div className="space-y-3">
            {threads.map((thread) => (
              <Link href={`/portal/messages/${thread.id}`} key={thread.id} className="block border border-border rounded-lg p-4 hover:border-primary transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{thread.subject}</p>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-1">{thread.lastMessage || 'بدون پیام'}</p>
                    <p className="text-[11px] text-muted-foreground mt-2">{formatJalaliDateTime(thread.updatedAt)}</p>
                  </div>
                  <Badge variant={SUPPORT_STATUS_VARIANT[thread.status]}>{SUPPORT_STATUS_LABEL[thread.status]}</Badge>
                </div>
              </Link>
            ))}
            {threads.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare size={34} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">هنوز گفت‌وگویی ایجاد نکرده‌اید.</p>
              </div>
            )}
          </div>
        </section>

        <div className="xl:sticky xl:top-24">
          <NewThreadForm />
        </div>
      </div>
    </div>
  );
}
