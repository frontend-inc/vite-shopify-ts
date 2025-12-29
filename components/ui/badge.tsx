import React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface BadgeProps extends React.ComponentProps<'span'> {
  variant?: BadgeVariant;
  asChild?: boolean;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default:
    'border-transparent bg-primary text-primary-foreground hover:bg-primary/90',
  secondary:
    'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90',
  destructive:
    'border-transparent bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
  outline:
    'text-foreground border-border hover:bg-accent hover:text-accent-foreground',
};

function Badge({
  className,
  variant = 'default',
  asChild = false,
  children,
  ...props
}: BadgeProps) {
  const baseClasses = cn(
    'inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-colors overflow-hidden',
    '[&>svg]:size-3 [&>svg]:pointer-events-none [&>svg]:shrink-0'
  );

  const variantClasses = badgeVariants[variant];

  const finalClassName = cn(baseClasses, variantClasses, className);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      className: cn(children.props.className, finalClassName),
      ...props,
    });
  }

  return (
    <span data-slot="badge" className={finalClassName} {...props}>
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };
