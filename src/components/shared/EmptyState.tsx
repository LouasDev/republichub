import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  className?: string;
  iconColor?: string;
}

export function EmptyState({ icon: Icon, title, subtitle, ctaLabel, onCtaClick, className, iconColor = 'text-text-muted/40' }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <div className="w-16 h-16 rounded-2xl bg-bg-soft flex items-center justify-center mb-4">
        <Icon className={cn('w-8 h-8', iconColor)} />
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-text-muted mb-5 max-w-[280px]">{subtitle}</p>}
      {ctaLabel && onCtaClick && (
        <button
          onClick={onCtaClick}
          className="px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent/90 transition-colors active:scale-[0.98]"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
