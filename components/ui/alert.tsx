import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const alertVariants = cva(
  'relative w-full rounded-sm border px-4 py-3.5 text-sm grid grid-cols-[0_1fr] has-[>svg]:grid-cols-[calc(var(--spacing)*5)_1fr] gap-x-3 gap-y-1 items-start [&>svg]:size-4.5 [&>svg]:translate-y-0.5',
  {
    variants: {
      variant: {
        default: 'bg-background border-border text-foreground [&>svg]:text-accent',
        accent: 'bg-accent/10 border-accent/30 text-foreground [&>svg]:text-accent',
        destructive: 'bg-destructive/10 border-destructive/30 text-foreground [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Alert({ className, variant, ...props }: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn('col-start-2 text-muted-foreground leading-6', className)}
      {...props}
    />
  );
}

export { Alert, AlertDescription };
