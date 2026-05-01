import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoreBadgeProps {
  score: number;
  className?: string;
}

export function ScoreBadge({ score, className }: ScoreBadgeProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
      <span className="font-bold text-text-primary text-sm">{score.toFixed(1)}</span>
    </div>
  );
}
