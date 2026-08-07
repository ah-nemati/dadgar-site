import { Inbox, Search } from "lucide-react";
import AdminHeader from "../AdminHeader";
import StatusControls from "./StatusControls";
import { getConsultationRequests } from "@/lib/messages";
import { getPracticeAreas } from "@/lib/content/practice-areas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatJalaliDateTime, toPersianDigits } from "@/lib/format";
import { CONSULTATION_STATUS_LABEL } from "@/lib/status";
import type { ConsultationStatus } from "@/types/content";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STATUS_VARIANT: Record<
  ConsultationStatus,
  "default" | "outline" | "accent"
> = {
  new: "default",
  read: "outline",
  replied: "accent",
};

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const [{ q = "", status = "" }, messages, practiceAreas] = await Promise.all([
    searchParams,
    getConsultationRequests(),
    getPracticeAreas(),
  ]);

  const query = q.trim().toLowerCase();
  const filtered = messages.filter((message) => {
    const matchesQuery =
      !query ||
      [message.name, message.phone, message.email ?? "", message.message]
        .join(" ")
        .toLowerCase()
        .includes(query);
    const matchesStatus = !status || message.status === status;
    return matchesQuery && matchesStatus;
  });

  const areaTitle = (slug: string | null) =>
    practiceAreas.find((area) => area.slug === slug)?.title ?? slug ?? "—";

  return (
    <div>
      <AdminHeader
        title="درخواست‌های مشاوره"
        description={`${toPersianDigits(messages.length)} پیام از فرم تماس سایت دریافت شده است.`}
      />

      <form className="dashboard-card p-4 mb-5 grid grid-cols-1 md:grid-cols-[1fr_13rem_auto] gap-3">
        <div className="relative">
          <Search size={17} className="auth-field-icon" />
          <Input
            name="q"
            defaultValue={q}
            className="pr-11"
            placeholder="جستجو در نام، تلفن، ایمیل یا متن"
          />
        </div>
        <select
          name="status"
          defaultValue={status}
          className="h-11 px-4 rounded-sm text-sm bg-card border border-input"
        >
          <option value="">همه وضعیت‌ها</option>
          {Object.entries(CONSULTATION_STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <Button type="submit" variant="secondary">
          اعمال فیلتر
        </Button>
      </form>

      {filtered.length === 0 ? (
        <div className="dashboard-card py-16 text-center">
          <Inbox size={34} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">پیامی مطابق فیلتر پیدا نشد.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((message) => (
            <article key={message.id} className="dashboard-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-bold">{message.name}</h2>
                    <Badge variant={STATUS_VARIANT[message.status]}>
                      {CONSULTATION_STATUS_LABEL[message.status]}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground mt-2">
                    <Link href={`tel:${message.phone}`} dir="ltr">
                      {message.phone}
                    </Link>
                    {message.email && (
                      <Link href={`mailto:${message.email}`} dir="ltr">
                        {message.email}
                      </Link>
                    )}
                    <span>{areaTitle(message.practiceArea)}</span>
                    <span>{formatJalaliDateTime(message.createdAt)}</span>
                  </div>
                </div>
                <StatusControls id={message.id} status={message.status} />
              </div>
              <p className="text-sm text-muted-foreground leading-8 mt-5 whitespace-pre-wrap border-t border-border pt-4">
                {message.message}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
