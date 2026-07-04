import { ActivityItem } from '@/types';
import { formatRelativeDate } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { BookOpen, Award, MessageSquare, UserPlus } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  enrollment: <BookOpen size={14} className="text-primary-500" />,
  completion: <Award size={14} className="text-emerald-500" />,
  message: <MessageSquare size={14} className="text-secondary-500" />,
  register: <UserPlus size={14} className="text-amber-500" />,
};

interface Props {
  activities: ActivityItem[];
}

export function RecentActivity({ activities }: Props) {
  if (!activities?.length) {
    return (
      <p className="text-sm text-slate-400 text-center py-8">Sin actividad reciente</p>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((item) => (
        <div key={item.id} className="flex items-start gap-3">
          {item.user ? (
            <Avatar src={item.user.avatar} name={item.user.name} size="sm" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
              {iconMap[item.type] ?? <BookOpen size={14} className="text-slate-400" />}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{item.description}</p>
            <p className="text-xs text-slate-400 mt-0.5">{formatRelativeDate(item.created_at)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
