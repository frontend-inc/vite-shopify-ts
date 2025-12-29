import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs component');
  }
  return context;
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

function Tabs({
  className,
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  ...props
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const isControlled = controlledValue !== undefined;
  const activeTab = isControlled ? controlledValue : internalValue;

  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider
      value={{ activeTab, setActiveTab: handleValueChange }}
    >
      <div
        data-slot="tabs"
        className={cn('flex flex-col gap-2', className)}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function TabsList({ className, children, ...props }: TabsListProps) {
  return (
    <div
      data-slot="tabs-list"
      className={cn(
        'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]',
        className
      )}
      role="tablist"
      {...props}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: React.ReactNode;
}

function TabsTrigger({
  className,
  value,
  children,
  ...props
}: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <button
      data-slot="tabs-trigger"
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabs-content-${value}`}
      className={cn(
        'text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
        isActive &&
          'bg-background dark:bg-input/30 dark:border-input shadow-sm',
        className
      )}
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  );
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

function TabsContent({
  className,
  value,
  children,
  ...props
}: TabsContentProps) {
  const { activeTab } = useTabs();

  if (activeTab !== value) {
    return null;
  }

  return (
    <div
      data-slot="tabs-content"
      role="tabpanel"
      id={`tabs-content-${value}`}
      className={cn('flex-1 outline-none', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
