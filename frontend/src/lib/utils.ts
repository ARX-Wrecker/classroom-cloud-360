import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string, pattern = 'dd MMM yyyy'): string {
  try {
    return format(parseISO(dateStr), pattern, { locale: es });
  } catch {
    return dateStr;
  }
}

export function formatRelativeDate(dateStr: string): string {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true, locale: es });
  } catch {
    return dateStr;
  }
}

export function formatDuration(seconds: number): string {
  if (!seconds) return '0 min';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}min`;
  if (m > 0) return `${m}min ${s > 0 ? `${s}s` : ''}`;
  return `${s}s`;
}

export function formatHours(hours: number): string {
  if (!hours) return '0h';
  if (hours < 1) return `${Math.round(hours * 60)}min`;
  return `${hours}h`;
}

export function formatPrice(price: number, currency = 'CLP'): string {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency }).format(price);
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getLevelColor(level: string) {
  const map: Record<string, string> = {
    beginner: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  return map[level] ?? 'bg-slate-100 text-slate-700';
}

export function getLevelLabel(level: string) {
  const map: Record<string, string> = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
  };
  return map[level] ?? level;
}

export function getRoleLabel(role: string) {
  const map: Record<string, string> = {
    superadmin: 'Super Admin',
    admin: 'Admin',
    instructor: 'Instructor',
    student: 'Estudiante',
  };
  return map[role] ?? role;
}

export function getRoleColor(role: string) {
  const map: Record<string, string> = {
    superadmin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    instructor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    student: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  };
  return map[role] ?? 'bg-slate-100 text-slate-700';
}
