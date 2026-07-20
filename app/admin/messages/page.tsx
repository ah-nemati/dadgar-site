import { Inbox } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import AdminHeader from '../AdminHeader';
import StatusControls from './StatusControls';
import { getConsultationRequests } from '@/lib/messages';
import { getPracticeAreas } from '@/lib/content/practice-areas';
import type { ConsultationStatus } from '@/types/content';

// This page reads live data from the SQLite file on every request; it must never
// be statically cached (build-time output would freeze the DB's state at build
// time and hide every message submitted afterwards).
export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<ConsultationStatus, string> = {
  new: 'جدید',
  read: 'خوانده‌شده',
  replied: 'پاسخ‌داده‌شده',
};

const STATUS_VARIANT: Record<ConsultationStatus, 'default' | 'outline' | 'accent'> = {
  new: 'default',
  read: 'outline',
  replied: 'accent',
};

export default async function AdminMessagesPage() {
  const [messages, practiceAreas] = await Promise.all([getConsultationRequests(), getPracticeAreas()]);
  const areaTitle = (slug: string | null) => practiceAreas.find((a) => a.slug === slug)?.title ?? slug ?? '—';

  return (
    <>
      <AdminHeader title="پیام‌ها و درخواست‌های مشاوره" />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-foreground">پیام‌های دریافتی</h1>
          <span className="text-sm text-muted-foreground">{messages.length} پیام</span>
        </div>

        {messages.length === 0 ? (
          <div className="bg-card border border-border rounded-sm p-16 text-center">
            <Inbox size={32} className="text-muted-foreground mx-auto mb-4" aria-hidden="true" />
            <p className="text-muted-foreground">هنوز پیامی از طریق فرم تماس ارسال نشده است.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>نام</TableHead>
                  <TableHead>تماس</TableHead>
                  <TableHead>حوزه</TableHead>
                  <TableHead>پیام</TableHead>
                  <TableHead>تاریخ</TableHead>
                  <TableHead>اقدام</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[m.status]}>{STATUS_LABEL[m.status]}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-foreground whitespace-nowrap">{m.name}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span dir="ltr" className="block text-sm">{m.phone}</span>
                      {m.email && <span dir="ltr" className="block text-xs text-muted-foreground">{m.email}</span>}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">{areaTitle(m.practiceArea)}</TableCell>
                    <TableCell className="max-w-xs text-sm text-muted-foreground">{m.message}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground" dir="ltr">
                      {m.createdAt}
                    </TableCell>
                    <TableCell>
                      <StatusControls id={m.id} status={m.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </>
  );
}
