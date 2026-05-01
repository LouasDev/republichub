import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  size?: 'sm' | 'md';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 active:scale-[0.98] select-none cursor-pointer';
    const variants = {
      primary: 'bg-accent text-white hover:bg-accent/90 shadow-sm',
      secondary: 'bg-white border border-border text-text-primary hover:bg-bg-soft',
      destructive: 'bg-white text-accent-red border border-border hover:bg-bg-error-soft',
      ghost: 'bg-transparent hover:bg-bg-soft text-text-secondary',
    };
    const sizes = {
      sm: 'px-3.5 py-2 text-sm',
      md: 'px-4 py-2.5 text-sm',
    };

    return (
      <button
        className={cn(base, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
