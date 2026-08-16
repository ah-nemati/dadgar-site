import Link from '@/components/NoPrefetchLink';
import { MessageSquare, ShieldCheck } from 'lucide-react';
import { getSupportThreads } from '@/lib/support';
import { getPracticeAreas } from '@/lib/content/practice-areas';
import { NewThreadForm } from '@/components/SupportForms';
import { Badge } from '@/components/ui/badge';
import { SUPPORT_STATUS_LABEL, SUPPORT_STATUS_VARIANT } from '@/lib/status';
import { formatJalaliDateTime } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function PortalMessagesPage() {
  const [threads, practiceAreas] = await Promise.all([getSupportThreads(), getPracticeAreas()]);
  const areaTitle = (slug?: string | null) => practiceAreas.find((area) => area.slug === slug)?.title;

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">صحبت با وکیل</h1>
          <p className="dashboard-page-description">گفت‌وگوی خصوصی با دفتر، ارسال سؤال و مدارک و پیگیری پاسخ در یک مسیر واحد.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck size={16} className="text-accent" /> فایل‌ها به‌صورت خصوصی نگهداری می‌شوند</div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_.85fr] gap-6 items-start">
        <section className="dashboard-card p-5">
          <h2 className="font-bold mb-5">گفت‌وگوهای من</h2>
          <div className="space-y-3">
            {threads.map((thread) => (
              <Link href={`/portal/messages/${thread.id}`} key={thread.id} className="block border border-border rounded-lg p-4 hover:border-primary transition-colors">
                <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-sm truncate">{thread.subject}</p>
                      {areaTitle(thread.practiceArea) && <span className="text-[10px] rounded-full border border-border px-2 py-0.5 text-muted-foreground">{areaTitle(thread.practiceArea)}</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-1">{thread.lastMessage || 'بدون پیام متنی'}</p>
                    <p className="text-[11px] text-muted-foreground mt-2">آخرین فعالیت: {formatJalaliDateTime(thread.updatedAt)}</p>
                  </div>
                  <Badge variant={SUPPORT_STATUS_VARIANT[thread.status]}>{SUPPORT_STATUS_LABEL[thread.status]}</Badge>
                </div>
              </Link>
            ))}
            {threads.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare size={34} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">هنوز گفت‌وگویی با وکیل ایجاد نکرده‌اید.</p>
              </div>
            )}
          </div>
        </section>

        <div className="xl:sticky xl:top-24">
          <NewThreadForm practiceAreas={practiceAreas} />
        </div>
      </div>
    </div>
  );
}
