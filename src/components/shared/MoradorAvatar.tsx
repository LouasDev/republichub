import { cn } from '@/lib/utils';

interface MoradorAvatarProps {
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function MoradorAvatar({ name, color, size = 'md', className }: MoradorAvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-[11px]',
    md: 'w-10 h-10 text-sm',
    lg: 'w-11 h-11 text-sm',
    xl: 'w-14 h-14 text-base',
  };

  const colorMap: Record<string, string> = {
    red: 'bg-red-500',
    gray: 'bg-gray-400',
    lightgray: 'bg-gray-300',
    black: 'bg-gray-800',
    darkgray: 'bg-gray-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className={cn('rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0', colorMap[color] || 'bg-gray-400', sizes[size], className)}>
      {name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
    </div>
  );
}
