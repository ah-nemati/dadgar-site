'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

type AccordionMode = 'single' | 'multiple';

type AccordionContextValue = {
  type: AccordionMode;
  openValues: string[];
  collapsible: boolean;
  disabled: boolean;
  toggle: (value: string) => void;
};

type AccordionItemContextValue = {
  value: string;
  isOpen: boolean;
  disabled: boolean;
  triggerId: string;
  contentId: string;
};

const AccordionContext = React.createContext<AccordionContextValue | null>(null);
const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

function useAccordionContext() {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used inside <Accordion>.');
  }
  return context;
}

function useAccordionItemContext() {
  const context = React.useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionTrigger and AccordionContent must be used inside <AccordionItem>.');
  }
  return context;
}

interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  type?: AccordionMode;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  collapsible?: boolean;
  disabled?: boolean;
}

function normalizeValue(value: string | string[] | undefined, type: AccordionMode): string[] {
  if (Array.isArray(value)) return type === 'single' ? value.slice(0, 1) : value;
  if (typeof value === 'string' && value.length > 0) return [value];
  return [];
}

function Accordion({
  type = 'single',
  value,
  defaultValue,
  onValueChange,
  collapsible = false,
  disabled = false,
  className,
  children,
  ...props
}: AccordionProps) {
  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<string[]>(() =>
    normalizeValue(defaultValue, type)
  );

  const openValues = controlled ? normalizeValue(value, type) : internalValue;

  const toggle = React.useCallback(
    (itemValue: string) => {
      if (disabled) return;

      const isOpen = openValues.includes(itemValue);
      let nextValue: string[];

      if (type === 'multiple') {
        nextValue = isOpen
          ? openValues.filter((currentValue) => currentValue !== itemValue)
          : [...openValues, itemValue];
      } else if (isOpen) {
        nextValue = collapsible ? [] : openValues;
      } else {
        nextValue = [itemValue];
      }

      if (!controlled) setInternalValue(nextValue);
      onValueChange?.(type === 'single' ? (nextValue[0] ?? '') : nextValue);
    },
    [collapsible, controlled, disabled, onValueChange, openValues, type]
  );

  const contextValue = React.useMemo<AccordionContextValue>(
    () => ({ type, openValues, collapsible, disabled, toggle }),
    [type, openValues, collapsible, disabled, toggle]
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

function AccordionItem({ value, disabled = false, className, children, ...props }: AccordionItemProps) {
  const accordion = useAccordionContext();
  const reactId = React.useId().replace(/:/g, '');
  const isOpen = accordion.openValues.includes(value);
  const itemDisabled = accordion.disabled || disabled;

  const contextValue = React.useMemo<AccordionItemContextValue>(
    () => ({
      value,
      isOpen,
      disabled: itemDisabled,
      triggerId: `accordion-trigger-${reactId}`,
      contentId: `accordion-content-${reactId}`,
    }),
    [value, isOpen, itemDisabled, reactId]
  );

  return (
    <AccordionItemContext.Provider value={contextValue}>
      <div
        data-state={isOpen ? 'open' : 'closed'}
        data-disabled={itemDisabled ? '' : undefined}
        className={cn('border-b', className)}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

function AccordionTrigger({ className, children, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const accordion = useAccordionContext();
  const item = useAccordionItemContext();

  return (
    <h3 className="flex">
      <button
        id={item.triggerId}
        type="button"
        aria-expanded={item.isOpen}
        aria-controls={item.contentId}
        disabled={item.disabled}
        data-state={item.isOpen ? 'open' : 'closed'}
        className={cn(
          'flex flex-1 items-center justify-between py-4 text-start text-sm font-medium transition-all hover:underline disabled:cursor-not-allowed disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
          className
        )}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) accordion.toggle(item.value);
        }}
        {...props}
      >
        {children}
        <ChevronDown className="size-4 shrink-0 transition-transform duration-200" aria-hidden="true" />
      </button>
    </h3>
  );
}

function AccordionContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const item = useAccordionItemContext();

  return (
    <div
      id={item.contentId}
      role="region"
      aria-labelledby={item.triggerId}
      hidden={!item.isOpen}
      data-state={item.isOpen ? 'open' : 'closed'}
      className={cn('overflow-hidden text-sm', className)}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </div>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
