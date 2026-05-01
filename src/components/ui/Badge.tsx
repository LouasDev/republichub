import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'error' | 'info' | 'purple' | 'warning';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-bg-soft text-text-secondary',
    success: 'bg-bg-success-soft text-accent-green',
    error: 'bg-bg-error-soft text-accent-red',
    info: 'bg-bg-info text-accent-blue',
    purple: 'bg-bg-purple-soft text-accent-purple',
    warning: 'bg-accent-red text-white',
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide', variants[variant], className)}>
      {children}
    </span>
  );
}
