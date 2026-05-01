import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface MoneyTextProps {
  value: number;
  variant?: 'default' | 'green' | 'red' | 'blue';
  className?: string;
}

export function MoneyText({ value, variant = 'default', className }: MoneyTextProps) {
  const variants = {
    default: 'text-text-primary',
    green: 'text-accent-green',
    red: 'text-accent-red',
    blue: 'text-accent-blue',
  };

  return (
    <span className={cn('font-semibold', variants[variant], className)}>
      {formatCurrency(value)}
    </span>
  );
}
