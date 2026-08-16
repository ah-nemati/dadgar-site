import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return <nav role="navigation" aria-label="صفحه‌بندی" className={cn('mx-auto flex w-full justify-center', className)} {...props} />;
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return <ul className={cn('flex items-center gap-1.5', className)} {...props} />;
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li {...props} />;
}

function PaginationButton({ active, className, ...props }: React.ComponentProps<'button'> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-xl border text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-40',
        active
          ? 'border-primary bg-primary text-primary-foreground shadow-[0_8px_22px_rgba(14,165,233,.22)]'
          : 'border-border bg-card text-foreground hover:border-primary/35 hover:bg-secondary',
        className,
      )}
      {...props}
    />
  );
}

function PaginationPrevious(props: React.ComponentProps<typeof PaginationButton>) {
  return <PaginationButton aria-label="صفحه قبلی" {...props}><ChevronRight size={17} /></PaginationButton>;
}
function PaginationNext(props: React.ComponentProps<typeof PaginationButton>) {
  return <PaginationButton aria-label="صفحه بعدی" {...props}><ChevronLeft size={17} /></PaginationButton>;
}
function PaginationEllipsis() {
  return <span className="inline-flex size-10 items-center justify-center text-muted-foreground"><MoreHorizontal size={18} /></span>;
}

export { Pagination, PaginationContent, PaginationItem, PaginationButton, PaginationPrevious, PaginationNext, PaginationEllipsis };
