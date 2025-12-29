import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps extends React.ComponentProps<'div'> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'size-6',
  md: 'size-8',
  lg: 'size-10',
  xl: 'size-12',
};

function Avatar({ className, size = 'md', ...props }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div
      data-slot="avatar"
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full',
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  onError,
  ...props
}: React.ComponentProps<'img'>) {
  const [hasError, setHasError] = React.useState(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    onError?.(e as any);
  };

  if (hasError) {
    return null;
  }

  return (
    <img
      data-slot="avatar-image"
      className={cn('aspect-square h-full w-full object-cover', className)}
      onError={handleError}
      {...props}
    />
  );
}

interface AvatarFallbackProps extends React.ComponentProps<'div'> {
  children: React.ReactNode;
}

function AvatarFallback({
  className,
  children,
  ...props
}: AvatarFallbackProps) {
  return (
    <div
      data-slot="avatar-fallback"
      className={cn(
        'bg-muted text-muted-foreground flex size-full items-center justify-center rounded-full font-medium text-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Avatar, AvatarImage, AvatarFallback };
export type { AvatarProps };
