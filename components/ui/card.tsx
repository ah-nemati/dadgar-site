import * as React from 'react';
import { cn } from '@/lib/utils';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card" className={cn('flex flex-col gap-4 rounded-2xl border border-sky-100 bg-white p-6 text-card-foreground shadow-[0_12px_34px_rgba(2,132,199,.07)]', className)} {...props} />;
}
function CardHeader({ className, ...props }: React.ComponentProps<'div'>) { return <div data-slot="card-header" className={cn('flex flex-col gap-1.5', className)} {...props} />; }
function CardTitle({ className, ...props }: React.ComponentProps<'div'>) { return <div data-slot="card-title" className={cn('font-extrabold leading-7 text-foreground', className)} {...props} />; }
function CardDescription({ className, ...props }: React.ComponentProps<'div'>) { return <div data-slot="card-description" className={cn('text-sm leading-7 text-muted-foreground', className)} {...props} />; }
function CardContent({ className, ...props }: React.ComponentProps<'div'>) { return <div data-slot="card-content" className={cn(className)} {...props} />; }
function CardFooter({ className, ...props }: React.ComponentProps<'div'>) { return <div data-slot="card-footer" className={cn('flex items-center', className)} {...props} />; }
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
