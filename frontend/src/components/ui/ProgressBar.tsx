'use client';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  className?: string;
  animated?: boolean;
}

const colorMap = {
  primary: 'bg-primary-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

const sizeMap = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' };

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  color = 'primary',
  showLabel,
  className,
  animated = true,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('flex-1 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden', sizeMap[size])}>
        <div
          className={cn('h-full rounded-full', colorMap[color], animated && 'transition-all duration-500 ease-out')}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-8 text-right">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
