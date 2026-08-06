import * as React from 'react';
import type { ChangeEvent } from 'react';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

type CheckboxProps = Omit<React.ComponentProps<'input'>, 'type' | 'onChange'> & {
  onCheckedChange?: (checked: boolean) => void;
};

function Checkbox({ className, onCheckedChange, checked, defaultChecked, ...props }: CheckboxProps) {
  return (
    <span className={cn('relative inline-flex size-4 shrink-0', className)}>
      <input
        type="checkbox"
        className="peer absolute inset-0 z-10 size-4 cursor-pointer opacity-0 disabled:cursor-not-allowed"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onCheckedChange?.(event.target.checked)}
        {...props}
      />
      <span
        aria-hidden="true"
        className={cn(
          'flex size-4 items-center justify-center rounded-[4px] border border-input bg-card text-transparent transition-colors',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-ring/30',
          'peer-disabled:opacity-50 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground'
        )}
      >
        <Check className="size-3" strokeWidth={3} />
      </span>
    </span>
  );
}

export { Checkbox };
