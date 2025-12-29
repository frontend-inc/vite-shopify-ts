import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps extends React.ComponentProps<'svg'> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'size-3',
  md: 'size-4',
  lg: 'size-6',
  xl: 'size-8',
};

function Spinner({ className, size = 'md', ...props }: SpinnerProps) {
  return (
    <svg
      role="status"
      aria-label="Loading"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('animate-spin', sizeClasses[size], className)}
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

export { Spinner };
export type { SpinnerProps };
