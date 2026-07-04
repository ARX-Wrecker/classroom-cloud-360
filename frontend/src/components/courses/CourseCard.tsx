'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Course } from '@/types';
import { cn, getLevelColor, getLevelLabel, formatHours, formatPrice } from '@/lib/utils';
import { Users, Clock, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface CourseCardProps {
  course: Course;
  progress?: number;
  href?: string;
}

export function CourseCard({ course, progress, href }: CourseCardProps) {
  const linkHref = href ?? `/courses/${course.id}`;
  return (
    <Link href={linkHref} className="group block">
      <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-card overflow-hidden transition-all duration-200 group-hover:shadow-card-hover group-hover:-translate-y-0.5 h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative h-44 bg-gradient-to-br from-primary-400 to-secondary-500 overflow-hidden">
          {course.thumbnail ? (
            <Image src={course.thumbnail} alt={course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen size={48} className="text-white/40" />
            </div>
          )}
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          {/* Price badge */}
          <div className="absolute top-3 right-3">
            {course.is_free ? (
              <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                Gratis
              </span>
            ) : (
              <span className="bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {formatPrice(course.price ?? 0)}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1 gap-2">
          {/* Level + Category */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', getLevelColor(course.level))}>
              {getLevelLabel(course.level)}
            </span>
            <span className="text-xs text-slate-400">{course.category?.name}</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {course.title}
          </h3>

          {/* Instructor */}
          <div className="flex items-center gap-2 mt-auto pt-2 border-t border-slate-100 dark:border-slate-700/50">
            <Avatar src={course.instructor?.avatar} name={course.instructor?.name} size="xs" />
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{course.instructor?.name}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Users size={12} />
              {course.enrollments_count ?? 0}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {formatHours(course.duration_hours)}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen size={12} />
              {course.lessons_count ?? 0} lecciones
            </span>
          </div>

          {/* Progress bar if enrolled */}
          {progress !== undefined && (
            <div className="mt-1">
              <ProgressBar value={progress} showLabel size="sm" />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
