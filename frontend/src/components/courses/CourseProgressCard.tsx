'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Enrollment } from '@/types';
import { cn, formatDate, getLevelColor, getLevelLabel } from '@/lib/utils';
import { BookOpen, Award, Play } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';

export function CourseProgressCard({ enrollment }: { enrollment: Enrollment }) {
  const { course, progress, completed_at } = enrollment;
  const isCompleted = !!completed_at || progress >= 100;

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-card overflow-hidden flex flex-col sm:flex-row gap-0">
      {/* Thumbnail */}
      <div className="relative w-full sm:w-40 h-40 sm:h-auto bg-gradient-to-br from-primary-400 to-secondary-500 shrink-0">
        {course.thumbnail ? (
          <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen size={36} className="text-white/40" />
          </div>
        )}
        {isCompleted && (
          <div className="absolute inset-0 bg-emerald-900/60 flex items-center justify-center">
            <Award size={32} className="text-emerald-300" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', getLevelColor(course.level))}>
            {getLevelLabel(course.level)}
          </span>
          {isCompleted && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              Completado
            </span>
          )}
        </div>

        <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2">{course.title}</h3>
        <p className="text-xs text-slate-400">{course.instructor?.name}</p>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500">Progreso</span>
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">{Math.round(progress)}%</span>
          </div>
          <ProgressBar value={progress} color={isCompleted ? 'success' : 'primary'} />
        </div>

        <div className="flex items-center justify-between mt-2">
          {completed_at && (
            <span className="text-xs text-slate-400">Completado el {formatDate(completed_at)}</span>
          )}
          <Link href={`/courses/${course.id}/learn`} className="ml-auto">
            <Button size="sm" variant={isCompleted ? 'outline' : 'primary'} iconLeft={<Play size={13} />}>
              {isCompleted ? 'Repasar' : 'Continuar'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
