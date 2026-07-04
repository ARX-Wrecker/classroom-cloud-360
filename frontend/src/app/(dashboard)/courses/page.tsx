'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCourses, useCategories, useEnrollCourse } from '@/hooks/useCourses';
import { useAuth } from '@/hooks/useAuth';
import {
  BookOpen, Search, Filter, Star, Users, Clock, Award,
  Plus, ChevronRight, Play, Lock, CheckCircle2, Globe,
} from 'lucide-react';

const LEVELS: Record<string, { label: string; color: string }> = {
  beginner:     { label: 'Básico',       color: 'bg-emerald-50 text-emerald-700' },
  intermediate: { label: 'Intermedio',   color: 'bg-amber-50 text-amber-700' },
  advanced:     { label: 'Avanzado',     color: 'bg-red-50 text-red-700' },
};

interface Course {
  id: number;
  title: string;
  description?: string;
  short_description?: string;
  thumbnail?: string | null;
  price: number;
  is_free: boolean;
  is_published: boolean;
  level?: string;
  language?: string;
  duration_hours?: number;
  total_lessons?: number;
  rating?: string;
  enrolled_count?: number;
  instructor?: { name: string };
  category?: { name: string };
  enrollment?: { id: number; progress: number } | null;
}

function CourseCard({ course, onEnroll }: { course: Course; onEnroll: (id: number) => void }) {
  const router = useRouter();
  const { isAdmin, isInstructor } = useAuth();
  const enrolled = !!course.enrollment;
  const lvl = LEVELS[course.level ?? 'beginner'];

  return (
    <div className="card overflow-hidden group hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
      onClick={() => router.push(`/courses/${course.id}`)}>
      {/* Cover */}
      <div className="h-36 bg-gradient-to-br from-primary-500 to-primary-700 relative overflow-hidden">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen size={40} className="text-white/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {enrolled && (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 size={10} /> Inscrito
          </div>
        )}
        {course.is_free && !enrolled && (
          <div className="absolute top-2 right-2 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            GRATIS
          </div>
        )}
      </div>

      <div className="p-4 space-y-2.5">
        {/* Category & level */}
        <div className="flex items-center gap-2">
          {course.category && (
            <span className="text-[10px] font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
              {course.category.name}
            </span>
          )}
          {lvl && (
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${lvl.color}`}>
              {lvl.label}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-primary-700 transition-colors">
          {course.title}
        </h3>

        {/* Instructor */}
        {course.instructor && (
          <p className="text-xs text-slate-500">{course.instructor.name}</p>
        )}

        {/* Progress if enrolled */}
        {enrolled && course.enrollment && (
          <div>
            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
              <span>Progreso</span>
              <span className="font-semibold text-primary-600">{Math.round(course.enrollment.progress)}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 rounded-full" style={{ width: `${course.enrollment.progress}%` }} />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          {course.rating && (
            <span className="flex items-center gap-0.5 text-amber-500 font-medium">
              <Star size={11} fill="currentColor" /> {course.rating}
            </span>
          )}
          {course.enrolled_count !== undefined && (
            <span className="flex items-center gap-0.5"><Users size={11} /> {course.enrolled_count}</span>
          )}
          {course.total_lessons !== undefined && (
            <span className="flex items-center gap-0.5"><Play size={11} /> {course.total_lessons} lecciones</span>
          )}
          {course.duration_hours !== undefined && (
            <span className="flex items-center gap-0.5"><Clock size={11} /> {course.duration_hours}h</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <div className="text-sm font-bold text-slate-800">
            {course.is_free ? <span className="text-emerald-600">Gratis</span> : `$${course.price?.toLocaleString('es-CL')}`}
          </div>
          {enrolled ? (
            <button
              onClick={(e) => { e.stopPropagation(); router.push(`/courses/${course.id}/learn`); }}
              className="text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <Play size={11} /> Continuar
            </button>
          ) : (!isAdmin && !isInstructor) ? (
            <button
              onClick={(e) => { e.stopPropagation(); onEnroll(course.id); }}
              className="text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              Inscribirse
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const router = useRouter();
  const { isAdmin, isInstructor } = useAuth();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [page] = useState(1);

  const { data: coursesResp, isLoading } = useCourses({
    ...(search ? { search } : {}),
    ...(catFilter ? { category_id: catFilter } : {}),
    ...(levelFilter ? { level: levelFilter } : {}),
    page,
    per_page: 12,
  });
  const { data: categories } = useCategories();
  const { mutate: enroll, isPending } = useEnrollCourse();

  const courses: Course[] = coursesResp?.data ?? [];
  const meta = coursesResp?.meta;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Explorar Cursos</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {meta?.total ? `${meta.total} cursos disponibles` : 'Catálogo de cursos'}
          </p>
        </div>
        {(isAdmin || isInstructor) && (
          <button
            onClick={() => router.push('/create-course')}
            className="flex items-center gap-2 bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors self-start sm:self-auto"
          >
            <Plus size={16} /> Crear curso
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por título, instructor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-slate-50"
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-700 min-w-[140px]"
        >
          <option value="">Todas las categorías</option>
          {(categories ?? []).map((c: { id: number; name: string }) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-700 min-w-[120px]"
        >
          <option value="">Todos los niveles</option>
          <option value="beginner">Básico</option>
          <option value="intermediate">Intermedio</option>
          <option value="advanced">Avanzado</option>
        </select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card h-72 animate-pulse bg-slate-50" />
          ))}
        </div>
      ) : courses.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} onEnroll={enroll} />
          ))}
        </div>
      ) : (
        <div className="card p-16 text-center">
          <BookOpen size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium mb-1">No se encontraron cursos</p>
          <p className="text-sm text-slate-400 mb-4">
            {search ? `No hay resultados para "${search}"` : 'No hay cursos disponibles aún.'}
          </p>
          {(isAdmin || isInstructor) && (
            <button
              onClick={() => router.push('/create-course')}
              className="inline-flex items-center gap-2 bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-700 transition-colors"
            >
              <Plus size={15} /> Crear el primer curso
            </button>
          )}
        </div>
      )}
    </div>
  );
}
