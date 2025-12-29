import React, { useState, useCallback, useContext, createContext } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SheetContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  side: 'top' | 'right' | 'bottom' | 'left';
}

const SheetContext = createContext<SheetContextType | undefined>(undefined);

function useSheet() {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error('Sheet components must be used within a Sheet');
  }
  return context;
}

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

function Sheet({
  open: controlledOpen,
  onOpenChange,
  children,
  side = 'right',
}: SheetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  return (
    <SheetContext.Provider value={{ open, setOpen, side }}>
      {children}
    </SheetContext.Provider>
  );
}

function SheetTrigger(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
) {
  const { setOpen } = useSheet();
  const { children, asChild, ...rest } = props;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      ...rest,
      onClick: (e: React.MouseEvent) => {
        setOpen(true);
        children.props.onClick?.(e);
      },
    });
  }

  return (
    <button
      data-slot="sheet-trigger"
      {...rest}
      onClick={(e) => {
        setOpen(true);
        props.onClick?.(e);
      }}
    >
      {children}
    </button>
  );
}

function SheetPortal({ children }: { children: React.ReactNode }) {
  return createPortal(children, document.body);
}

function SheetOverlay({
  className,
  onClick,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { setOpen } = useSheet();

  return (
    <motion.div
      data-slot="sheet-overlay"
      className={cn('fixed inset-0 z-50 bg-black/50', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => {
        setOpen(false);
        onClick?.(e);
      }}
      {...props}
    />
  );
}

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  showCloseButton?: boolean;
}

function SheetContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: SheetContentProps) {
  const { setOpen, side } = useSheet();

  const sideClasses = {
    right: 'inset-y-0 right-0 h-full w-3/4 sm:max-w-sm border-l',
    left: 'inset-y-0 left-0 h-full w-3/4 sm:max-w-sm border-r',
    top: 'inset-x-0 top-0 h-auto border-b',
    bottom: 'inset-x-0 bottom-0 h-auto border-t',
  };

  const slideVariants = {
    right: {
      initial: { x: 400, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 400, opacity: 0 },
    },
    left: {
      initial: { x: -400, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -400, opacity: 0 },
    },
    top: {
      initial: { y: -400, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -400, opacity: 0 },
    },
    bottom: {
      initial: { y: 400, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 400, opacity: 0 },
    },
  };

  return (
    <SheetPortal>
      <SheetOverlay />
      <motion.div
        data-slot="sheet-content"
        className={cn(
          'bg-background fixed z-50 flex flex-col gap-0 shadow-lg',
          sideClasses[side]
        )}
        variants={slideVariants[side]}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        {...props}
      >
        {children}
        {showCloseButton && (
          <button
            data-slot="sheet-close"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            aria-label="Close"
          >
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
              <path d="M18 6l-12 12M6 6l12 12" />
            </svg>
          </button>
        )}
      </motion.div>
    </SheetPortal>
  );
}

function SheetClose(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
) {
  const { setOpen } = useSheet();
  const { children, asChild, ...rest } = props;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      ...rest,
      onClick: (e: React.MouseEvent) => {
        setOpen(false);
        children.props.onClick?.(e);
      },
    });
  }

  return (
    <button
      data-slot="sheet-close"
      {...rest}
      onClick={(e) => {
        setOpen(false);
        props.onClick?.(e);
      }}
    >
      {children}
    </button>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn(
        'flex flex-col gap-1.5 p-6 border-b border-border',
        className
      )}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        'flex flex-col-reverse gap-2 p-6 border-t border-border sm:flex-row sm:justify-end',
        className
      )}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return (
    <h2
      data-slot="sheet-title"
      className={cn('text-lg leading-none font-semibold', className)}
      {...props}
    />
  );
}

function SheetDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="sheet-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

interface SheetBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function SheetBody({ className, children, ...props }: SheetBodyProps) {
  return (
    <div
      data-slot="sheet-body"
      className={cn('flex-1 overflow-y-auto px-6 py-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetPortal,
  SheetOverlay,
  AnimatePresence,
};
