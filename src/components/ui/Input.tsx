import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && <label className="text-[13px] font-medium text-text-secondary">{label}</label>}
        <input
          className={cn(
            'rounded-xl border border-border px-4 py-2.5 text-sm bg-white outline-none transition-all duration-150',
            'focus:border-accent-blue/40 focus:ring-2 focus:ring-accent-blue/10',
            'placeholder:text-text-muted',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
