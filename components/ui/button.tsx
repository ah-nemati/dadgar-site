import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-gold-light',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-ink-2',
        outline: 'border border-input bg-transparent hover:bg-secondary hover:text-secondary-foreground',
        ghostLight: 'border border-white/35 text-secondary-foreground hover:bg-background hover:text-secondary',
        ghost: 'hover:bg-muted',
        link: 'text-accent underline-offset-4 hover:underline hover:text-primary',
        destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',
      },
      size: {
        default: 'h-11 px-6 py-2.5',
        sm: 'h-9 px-4 text-sm',
        lg: 'h-12 px-7 text-base',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const mergedClassName = cn(buttonVariants({ variant, size, className }));

  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<{
      className?: string;
    }>;

    return React.cloneElement(
      child,
      {
        ...props,
        'data-slot': 'button',
        className: cn(mergedClassName, child.props.className),
      } as unknown as Partial<{ className?: string }>
    );
  }

  return (
    <button
      data-slot="button"
      className={mergedClassName}
      {...props}
    >
      {children}
    </button>
  );
}

export { Button, buttonVariants };
