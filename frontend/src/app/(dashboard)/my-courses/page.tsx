'use client';
import { useRouter } from 'next/navigation';
import { useMyEnrollments } from '@/hooks/useCourses';
import { useCourses } from '@/hooks/useCourses';
import { useAuth } from '@/hooks/useAuth';
import {
  BookMarked, Play, CheckCircle2, Clock, BookOpen,
  Plus, ChevronRight, TrendingUp, Award,
} from 'lucide-react';

export default function MyCoursesPage() {
  const router = useRouter();
  const { isAdmin, isInstructor } = useAuth();
  const { data: enrollments, isLoading } = useMyEnrollments();
  const { data: myCoursesResp } = useCourses({ per_page: 20 });

  const myCourses = isInstructor || isAdmin
    ? (myCoursesResp?.data ?? [])
    : (Array.isArray(enrollments) ? enrollments : []);

  const inProgress = myCourses.filter((e: { progress?: number; enrollment?: { progress: number } }) =>
    (e.progress ?? e.enrollment?.progress ?? 0) < 100
  );
  const completed = myCourses.filter((e: { progress?: number; enrollment?: { progress: number } }) =>
    (e.progress ?? e.enrollment?.progress ?? 0) >= 100
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            {isInstructor || isAdmin ? 'Mis Cursos Creados' : 'Mis Cursos'}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{myCourses.length} cursos</p>
        </div>
        {(isAdmin || isInstructor) && (
          <button onClick={() => router.push('/create-course')} className="flex items-center gap-2 bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors">
            <Plus size={15} /> Nuevo curso
          </button>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-slate-800">{myCourses.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{inProgress.length}</p>
          <p className="text-xs text-slate-500 mt-1">En progreso</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{completed.length}</p>
          <p className="text-xs text-slate-500 mt-1">Completados</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="card h-24 animate-pulse bg-slate-50" />)}
        </div>
      ) : myCourses.length === 0 ? (
        <div className="card p-16 text-center">
          <BookMarked size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium mb-1">
            {isInstructor || isAdmin ? 'No tienes cursos creados aún' : 'No estás inscrito en ningún curso'}
          </p>
          <p className="text-sm text-slate-400 mb-4">
            {isInstructor || isAdmin ? 'Crea tu primer curso y comparte tu conocimiento.' : 'Explora el catálogo y comienza a aprender hoy.'}
          </p>
          <button
            onClick={() => router.push(isInstructor || isAdmin ? '/create-course' : '/courses')}
            className="inline-flex items-center gap-2 bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-700 transition-colors"
          >
            {isInstructor || isAdmin ? <><Plus size={15} /> Crear curso</> : <><BookOpen size={15} /> Explorar cursos</>}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {myCourses.map((item: {
            id: number; title?: string; course?: { id: number; title: string; thumbnail?: string };
            progress?: number; enrollment?: { progress: number };
            total_lessons?: number; duration_hours?: number;
          }) => {
            const course = item.course ?? item;
            const progress = item.progress ?? item.enrollment?.progress ?? 0;
            const courseId = item.course?.id ?? item.id;

            return (
              <div key={item.id} className="card p-4 flex items-center gap-4 hover:shadow-card-hover transition-all group cursor-pointer"
                onClick={() => router.push(`/courses/${courseId}/learn`)}>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shrink-0">
                  <BookOpen size={22} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-primary-700 transition-colors">
                    {(course as { title?: string }).title ?? 'Curso sin título'}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-primary-600 w-10 text-right">{Math.round(progress)}%</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {progress >= 100 ? '✓ Completado' : progress > 0 ? 'En progreso' : 'No iniciado'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {progress >= 100 ? (
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <CheckCircle2 size={18} className="text-emerald-600" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                      <Play size={16} className="text-primary-600" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
