import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-extrabold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 active:scale-[.985]",
  {
    variants: {
      variant: {
        default: 'border border-primary bg-primary text-white shadow-[0_10px_24px_rgba(14,165,233,.20)] hover:-translate-y-0.5 hover:border-sky-400 hover:bg-sky-400 hover:shadow-[0_14px_30px_rgba(14,165,233,.24)]',
        secondary: 'border border-sky-200 bg-sky-100 text-sky-800 shadow-[0_8px_20px_rgba(14,165,233,.08)] hover:-translate-y-0.5 hover:bg-sky-200',
        outline: 'border border-sky-200 bg-white text-sky-800 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50',
        ghostLight: 'border border-sky-200 bg-white/70 text-sky-800 backdrop-blur-sm hover:-translate-y-0.5 hover:border-sky-300 hover:bg-white',
        ghost: 'border border-transparent text-sky-800 hover:bg-sky-50',
        link: 'h-auto rounded-none p-0 text-primary underline-offset-4 hover:text-sky-600 hover:underline',
        destructive: 'border border-destructive bg-destructive text-destructive-foreground hover:opacity-90',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 px-3.5 text-xs',
        lg: 'h-12 px-6 text-[0.95rem]',
        icon: 'size-10 p-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

type ButtonProps = React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

function Button({ className, variant, size, asChild = false, children, ...props }: ButtonProps) {
  const mergedClassName = cn(buttonVariants({ variant, size, className }));
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<{ className?: string }>;
    return React.cloneElement(child, { ...props, 'data-slot': 'button', className: cn(mergedClassName, child.props.className) } as unknown as Partial<{ className?: string }>);
  }
  return <button data-slot="button" className={mergedClassName} {...props}>{children}</button>;
}

export { Button, buttonVariants };
