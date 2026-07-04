import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: number;
  trendLabel?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const colorMap = {
  primary: {
    icon: 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
  },
  secondary: {
    icon: 'bg-secondary-50 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400',
  },
  success: {
    icon: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  },
  warning: {
    icon: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  },
  danger: {
    icon: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  },
};

export function StatCard({ title, value, icon, trend, trendLabel, color = 'primary', className }: StatCardProps) {
  return (
    <div className={cn(
      'rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 p-5 shadow-card',
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <div className={cn('p-2.5 rounded-xl', colorMap[color].icon)}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1.5">{value}</p>
      {trend !== undefined && (
        <div className="flex items-center gap-1">
          {trend >= 0 ? (
            <TrendingUp size={13} className="text-emerald-500" />
          ) : (
            <TrendingDown size={13} className="text-red-500" />
          )}
          <span className={cn('text-xs font-medium', trend >= 0 ? 'text-emerald-500' : 'text-red-500')}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
          {trendLabel && (
            <span className="text-xs text-slate-400">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
