import * as React from 'react';
import { cn } from '@/lib/utils';

type SkeletonTone = 'default' | 'dark' | 'accent';

export function Skeleton({
  className,
  tone = 'default',
  ...props
}: React.ComponentProps<'div'> & { tone?: SkeletonTone }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'skeleton rounded-sm',
        tone === 'dark' && 'skeleton--dark',
        tone === 'accent' && 'skeleton--accent',
        className,
      )}
      {...props}
    />
  );
}
