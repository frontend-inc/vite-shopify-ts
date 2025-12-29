import React from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(checked ?? false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;
      setIsChecked(newChecked);
      onCheckedChange?.(newChecked);
      props.onChange?.(e);
    };

    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(checked);
      }
    }, [checked]);

    return (
      <div className="relative inline-flex">
        <input
          ref={ref}
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div
          data-slot="switch"
          className={cn(
            'inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px]',
            isChecked
              ? 'bg-primary focus-visible:ring-ring/50 focus-visible:border-ring'
              : 'bg-input dark:bg-input/80 focus-visible:ring-ring/50 focus-visible:border-ring',
            disabled && 'cursor-not-allowed opacity-50',
            className
          )}
          onClick={() => {
            if (!disabled) {
              setIsChecked(!isChecked);
              onCheckedChange?.(!isChecked);
            }
          }}
        >
          <div
            data-slot="switch-thumb"
            className={cn(
              'bg-background dark:bg-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform',
              isChecked
                ? 'translate-x-[calc(100%-2px)] dark:bg-primary-foreground'
                : 'translate-x-0'
            )}
          />
        </div>
      </div>
    );
  }
);

Switch.displayName = 'Switch';

export { Switch };
