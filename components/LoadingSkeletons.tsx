import { Skeleton } from '@/components/ui/skeleton';

function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="dashboard-card p-5 space-y-4">
      <Skeleton className="h-6 w-40" />
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="rounded-lg border border-border p-4 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function DashboardLoadingSkeleton() {
  return (
    <div role="status" aria-label="در حال بارگذاری اطلاعات پنل" aria-live="polite">
      <div className="dashboard-page-header">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-8 w-52 max-w-full" />
          <Skeleton className="h-4 w-[34rem] max-w-full" />
        </div>
        <Skeleton className="hidden sm:block h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="dashboard-stat space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="size-11 rounded-lg" />
            </div>
            <Skeleton className="h-9 w-16" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

export function PublicPageLoadingSkeleton() {
  return (
    <div role="status" aria-label="در حال بارگذاری محتوای صفحه" aria-live="polite">
      <section className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-20">
          <Skeleton className="h-5 w-32 mb-5" />
          <Skeleton className="h-10 md:h-12 w-[42rem] max-w-full mb-5" />
          <Skeleton className="h-4 w-[34rem] max-w-full" />
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-border bg-card p-6 space-y-4">
              <Skeleton className="size-12 rounded-lg" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
