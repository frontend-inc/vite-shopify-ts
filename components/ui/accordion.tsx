import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface AccordionContextType {
  value: string | string[];
  onValueChange: (value: string) => void;
  type: 'single' | 'multiple';
}

const AccordionContext = createContext<AccordionContextType | undefined>(
  undefined
);

interface AccordionItemContextType {
  value: string;
}

const AccordionItemContext = createContext<
  AccordionItemContextType | undefined
>(undefined);

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion');
  }
  return context;
}

function useAccordionItem() {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error(
      'AccordionTrigger and AccordionContent must be used within an AccordionItem'
    );
  }
  return context;
}

interface AccordionProps {
  type?: 'single' | 'multiple';
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  children: React.ReactNode;
}

function Accordion({
  type = 'single',
  value: controlledValue,
  onValueChange,
  children,
}: AccordionProps) {
  const [internalValue, setInternalValue] = useState<string | string[]>(
    type === 'single' ? '' : []
  );

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleValueChange = useCallback(
    (itemValue: string) => {
      if (type === 'single') {
        const newValue = value === itemValue ? '' : itemValue;
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
      } else {
        const valueArray = Array.isArray(value) ? value : [];
        const newValue = valueArray.includes(itemValue)
          ? valueArray.filter((v) => v !== itemValue)
          : [...valueArray, itemValue];
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
      }
    },
    [value, type, isControlled, onValueChange]
  );

  return (
    <AccordionContext.Provider
      value={{ value, onValueChange: handleValueChange, type }}
    >
      <div data-slot="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

function AccordionItem({ value, children, className }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div
        data-slot="accordion-item"
        className={cn('border-b border-border last:border-b-0', className)}
        data-value={value}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionTriggerProps) {
  const accordion = useAccordion();
  const item = useAccordionItem();

  const handleClick = () => {
    accordion.onValueChange(item.value);
  };

  const isOpen =
    accordion.type === 'single'
      ? accordion.value === item.value
      : Array.isArray(accordion.value) && accordion.value.includes(item.value);

  return (
    <div className="flex">
      <button
        data-slot="accordion-trigger"
        className={cn(
          'flex flex-1 items-start justify-between gap-4 rounded-md py-4 px-0 text-left text-sm font-medium transition-all outline-none hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-md disabled:pointer-events-none disabled:opacity-50',
          isOpen && '[&>svg]:rotate-180',
          className
        )}
        onClick={handleClick}
        data-state={isOpen ? 'open' : 'closed'}
        {...props}
      >
        {children}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </div>
  );
}

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionContentProps) {
  const accordion = useAccordion();
  const item = useAccordionItem();

  const isOpen =
    accordion.type === 'single'
      ? accordion.value === item.value
      : Array.isArray(accordion.value) && accordion.value.includes(item.value);

  return (
    <div
      data-slot="accordion-content"
      data-state={isOpen ? 'open' : 'closed'}
      className={cn(
        'overflow-hidden text-sm transition-all duration-200',
        isOpen ? 'max-h-96' : 'max-h-0'
      )}
      {...props}
    >
      <div className={cn('pt-0 pb-4', className)}>{children}</div>
    </div>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
