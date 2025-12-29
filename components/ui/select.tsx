import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { cn } from '@/lib/utils';

interface SelectContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  setValue: (value: string) => void;
}

const SelectContext = createContext<SelectContextType | undefined>(undefined);

function useSelect() {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('Select components must be used within a Select');
  }
  return context;
}

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

function Select({
  value: controlledValue,
  onValueChange,
  children,
}: SelectProps) {
  const [internalValue, setInternalValue] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
      setOpen(false);
    },
    [isControlled, onValueChange]
  );

  // Handle clicking outside to close the menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [open]);

  return (
    <SelectContext.Provider
      value={{ open, setOpen, value, setValue: handleValueChange }}
    >
      <div ref={containerRef} data-slot="select" className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  placeholder?: string;
}

function SelectTrigger({
  className,
  children,
  placeholder = 'Select...',
  ...props
}: SelectTriggerProps) {
  const { open, setOpen, value } = useSelect();
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={triggerRef}
      data-slot="select-trigger"
      onClick={() => setOpen(!open)}
      className={cn(
        'border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*="text-"])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
        className
      )}
      {...props}
    >
      {children || <span className="text-muted-foreground">{placeholder}</span>}
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
        className={cn(
          'size-4 opacity-50 transition-transform',
          open && 'rotate-180'
        )}
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
  );
}

interface SelectValueProps {
  children?: React.ReactNode;
  placeholder?: string;
}

function SelectValue({
  children,
  placeholder = 'Select...',
}: SelectValueProps) {
  const { value } = useSelect();

  return (
    <span data-slot="select-value">{children || value || placeholder}</span>
  );
}

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function SelectContent({ className, children, ...props }: SelectContentProps) {
  const { open } = useSelect();
  const contentRef = useRef<HTMLDivElement>(null);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      data-slot="select-content"
      className={cn(
        'bg-popover text-popover-foreground absolute z-50 min-w-[8rem] rounded-md border border-border shadow-md overflow-hidden top-full mt-2 left-0',
        className
      )}
      {...props}
    >
      <div className="p-1 overflow-y-auto max-h-60">{children}</div>
    </div>
  );
}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}

function SelectItem({
  value,
  children,
  disabled = false,
  className,
  ...props
}: SelectItemProps) {
  const { value: selectedValue, setValue } = useSelect();
  const isSelected = selectedValue === value;

  return (
    <div
      data-slot="select-item"
      onClick={() => !disabled && setValue(value)}
      className={cn(
        'focus:bg-accent focus:text-accent-foreground [&_svg:not([class*="text-"])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none transition-colors',
        !disabled &&
          'hover:bg-accent hover:text-accent-foreground cursor-pointer',
        disabled && 'pointer-events-none opacity-50',
        isSelected && 'bg-accent text-accent-foreground',
        className
      )}
      {...props}
    >
      {isSelected && (
        <span className="absolute right-2 flex size-3.5 items-center justify-center">
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
            className="size-4"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
      )}
      {children}
    </div>
  );
}

interface SelectGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function SelectGroup({ className, children, ...props }: SelectGroupProps) {
  return (
    <div
      data-slot="select-group"
      className={cn('overflow-hidden', className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface SelectLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function SelectLabel({ className, children, ...props }: SelectLabelProps) {
  return (
    <div
      data-slot="select-label"
      className={cn(
        'text-muted-foreground px-2 py-1.5 text-xs font-semibold',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface SelectSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
  return (
    <div
      data-slot="select-separator"
      className={cn(
        'bg-border pointer-events-none -mx-1 my-1 h-px',
        className
      )}
      {...props}
    />
  );
}

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
};
