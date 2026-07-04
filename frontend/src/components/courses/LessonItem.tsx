'use client';
import { Lesson } from '@/types';
import { cn, formatDuration } from '@/lib/utils';
import { Play, FileText, HelpCircle, CheckCircle2, Lock } from 'lucide-react';

interface LessonItemProps {
  lesson: Lesson;
  isActive?: boolean;
  isLocked?: boolean;
  onClick?: () => void;
}

const typeIcons = {
  video: Play,
  text: FileText,
  quiz: HelpCircle,
};

export function LessonItem({ lesson, isActive, isLocked, onClick }: LessonItemProps) {
  const Icon = typeIcons[lesson.type] ?? Play;
  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150',
        isActive
          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
          : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300',
        isLocked && 'opacity-50 cursor-not-allowed'
      )}
    >
      <div className={cn(
        'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
        lesson.is_completed
          ? 'bg-emerald-100 dark:bg-emerald-900/30'
          : isActive
          ? 'bg-primary-100 dark:bg-primary-900/30'
          : 'bg-slate-100 dark:bg-slate-700'
      )}>
        {isLocked ? (
          <Lock size={13} className="text-slate-400" />
        ) : lesson.is_completed ? (
          <CheckCircle2 size={14} className="text-emerald-500" />
        ) : (
          <Icon size={13} className={isActive ? 'text-primary-500' : 'text-slate-400'} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-xs font-medium truncate', isActive ? 'text-primary-700 dark:text-primary-300' : '')}>
          {lesson.title}
        </p>
        {lesson.duration_seconds && (
          <p className="text-xs text-slate-400 mt-0.5">{formatDuration(lesson.duration_seconds)}</p>
        )}
      </div>
    </button>
  );
}
