import * as React from 'react';
import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-12 w-full min-w-0 rounded-lg border border-input bg-card px-4 py-2.5 text-sm text-foreground shadow-[inset_0_1px_0_rgba(14,165,233,.02)] outline-none transition-all duration-200',
        'placeholder:text-muted-foreground/80',
        'hover:border-sky-300',
        'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/10',
        'disabled:pointer-events-none disabled:bg-muted/60 disabled:opacity-60',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/10',
        className
      )}
      {...props}
    />
  );
}

export { Input };
