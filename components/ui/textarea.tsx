import * as React from 'react';
import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex min-h-28 w-full resize-y rounded-lg border border-input bg-card px-4 py-3 text-sm leading-7 text-foreground outline-none transition-all duration-200',
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

export { Textarea };
