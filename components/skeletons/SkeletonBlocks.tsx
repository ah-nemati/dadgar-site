import { Skeleton } from '@/components/ui/skeleton';

export function PublicHeroSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <section className="bg-sky-100">
      <div className={`mx-auto max-w-6xl px-6 ${compact ? 'py-12' : 'py-16 md:py-20'}`}>
        <Skeleton tone="dark" className="mb-5 h-4 w-28" />
        <Skeleton tone="dark" className="mb-5 h-10 w-[34rem] max-w-full md:h-12" />
        <Skeleton tone="dark" className="h-4 w-[42rem] max-w-full" />
        {!compact && <Skeleton tone="dark" className="mt-3 h-4 w-[30rem] max-w-[85%]" />}
      </div>
    </section>
  );
}

export function SectionHeadingSkeleton({ dark = false }: { dark?: boolean }) {
  return (
    <div className="mb-10 max-w-2xl space-y-3">
      <Skeleton tone={dark ? 'dark' : 'accent'} className="h-4 w-24" />
      <Skeleton tone={dark ? 'dark' : 'default'} className="h-8 w-80 max-w-full" />
      <Skeleton tone={dark ? 'dark' : 'default'} className="h-4 w-[34rem] max-w-full" />
    </div>
  );
}

export function DashboardHeaderSkeleton({ action = false }: { action?: boolean }) {
  return (
    <div className="dashboard-page-header">
      <div className="flex-1 space-y-3">
        <Skeleton tone="accent" className="h-8 w-56 max-w-full" />
        <Skeleton className="h-4 w-[34rem] max-w-full" />
      </div>
      {action && <Skeleton tone="accent" className="h-10 w-32 rounded-sm" />}
    </div>
  );
}

export function BackLinkSkeleton() {
  return <Skeleton className="mb-5 h-4 w-40" />;
}

export function FormFieldSkeleton({ wide = false }: { wide?: boolean }) {
  return (
    <div className={wide ? 'col-span-full space-y-2' : 'space-y-2'}>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-11 w-full rounded-sm" />
    </div>
  );
}

export function TextareaFieldSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="col-span-full space-y-2">
      <Skeleton className="h-3 w-28" />
      <Skeleton className={`${rows >= 6 ? 'h-44' : 'h-28'} w-full rounded-sm`} />
    </div>
  );
}

export function FilterBarSkeleton({ selects = 1 }: { selects?: number }) {
  return (
    <div className="dashboard-card mb-5 grid grid-cols-1 gap-3 p-4 md:grid-cols-[1fr_auto]">
      <Skeleton className="h-11 w-full" />
      <div className="flex gap-3">
        {Array.from({ length: selects }).map((_, index) => (
          <Skeleton key={index} className="h-11 w-40" />
        ))}
        <Skeleton tone="accent" className="h-11 w-24" />
      </div>
    </div>
  );
}

export function ListRowSkeleton({ meta = true }: { meta?: boolean }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-3">
          <Skeleton className="h-4 w-48 max-w-full" />
          {meta && <Skeleton className="h-3 w-36" />}
          <Skeleton className="h-3 w-full" />
        </div>
        <Skeleton tone="accent" className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}
