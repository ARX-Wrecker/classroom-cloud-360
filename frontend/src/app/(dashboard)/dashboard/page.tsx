'use client';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardStats } from '@/hooks/useDashboard';
import { useCourses } from '@/hooks/useCourses';
import { useRouter } from 'next/navigation';
import {
  BookOpen, Users, Award, Clock, CheckCircle2, TrendingUp,
  GraduationCap, ArrowRight, Plus, ChevronRight, Star,
  BarChart3, BookMarked, Calendar, MessageSquare, ClipboardList, PlayCircle,
} from 'lucide-react';

function StatCard({ title, value, icon, color, bg, trend }: {
  title: string; value: string | number; icon: React.ReactNode;
  color: string; bg: string; trend?: number;
}) {
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg} shrink-0`}>
        <span className={color}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-bold text-slate-800 leading-none">{value}</p>
        <p className="text-xs text-slate-500 mt-1 leading-tight">{title}</p>
        {trend !== undefined && (
          <p className={`text-xs mt-1.5 font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% este mes
          </p>
        )}
      </div>
    </div>
  );
}

function QuickLink({ label, icon, href, color, bg }: {
  label: string; icon: React.ReactNode; href: string; color: string; bg: string;
}) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(href)}
      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border border-slate-200 hover:border-primary-300 hover:shadow-card transition-all group"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg} group-hover:scale-105 transition-transform`}>
        <span className={color}>{icon}</span>
      </div>
      <span className="text-[11px] font-medium text-slate-600 text-center leading-tight">{label}</span>
    </button>
  );
}

export default function DashboardPage() {
  const { user, isAdmin, isInstructor } = useAuth();
  const { data: dash, isLoading } = useDashboardStats();
  const { data: coursesResp } = useCourses({ per_page: 6 });
  const router = useRouter();

  const stats = dash?.stats ?? {};
  const recentUsers = dash?.recent_users ?? [];
  const popularCourses = dash?.popular_courses ?? [];
  const courses = coursesResp?.data ?? [];
  const firstName = user?.name?.split(' ')[0] ?? 'usuario';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
        <div className="relative z-10">
          <p className="text-primary-200 text-sm font-medium">{greeting},</p>
          <h1 className="text-2xl font-bold mt-0.5 mb-2">{firstName} 👋</h1>
          <p className="text-primary-100 text-sm max-w-md">
            {isAdmin
              ? 'Gestiona tu plataforma y monitorea el progreso de todos los estudiantes.'
              : isInstructor
              ? 'Revisa el avance de tus estudiantes y mantén tu contenido actualizado.'
              : 'Continúa aprendiendo donde lo dejaste. Tienes cursos esperándote.'}
          </p>
          <button
            onClick={() => router.push(isAdmin ? '/users' : '/my-courses')}
            className="mt-4 inline-flex items-center gap-2 bg-white text-primary-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors"
          >
            {isAdmin ? 'Ver usuarios' : 'Mis cursos'} <ArrowRight size={14} />
          </button>
        </div>
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -right-4 -bottom-12 w-56 h-56 rounded-full bg-white/5" />
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="card p-5 h-24 animate-pulse bg-slate-50" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {isAdmin ? (<>
            <StatCard title="Usuarios totales" value={stats.total_users ?? 0} icon={<Users size={18} />} color="text-blue-600" bg="bg-blue-50" trend={12} />
            <StatCard title="Cursos activos" value={stats.total_courses ?? 0} icon={<BookOpen size={18} />} color="text-emerald-600" bg="bg-emerald-50" trend={5} />
            <StatCard title="Inscripciones" value={stats.total_enrollments ?? 0} icon={<GraduationCap size={18} />} color="text-violet-600" bg="bg-violet-50" />
            <StatCard title="Tasa de éxito" value={`${stats.completion_rate ?? 0}%`} icon={<TrendingUp size={18} />} color="text-amber-600" bg="bg-amber-50" />
          </>) : isInstructor ? (<>
            <StatCard title="Mis cursos" value={stats.total_courses ?? 0} icon={<BookOpen size={18} />} color="text-blue-600" bg="bg-blue-50" />
            <StatCard title="Estudiantes" value={stats.total_enrollments ?? 0} icon={<Users size={18} />} color="text-emerald-600" bg="bg-emerald-50" trend={8} />
            <StatCard title="Completaron" value={stats.completed_enrollments ?? 0} icon={<CheckCircle2 size={18} />} color="text-violet-600" bg="bg-violet-50" />
            <StatCard title="Tasa éxito" value={`${stats.completion_rate ?? 0}%`} icon={<TrendingUp size={18} />} color="text-amber-600" bg="bg-amber-50" />
          </>) : (<>
            <StatCard title="En progreso" value={stats.total_enrollments ?? 0} icon={<BookMarked size={18} />} color="text-blue-600" bg="bg-blue-50" />
            <StatCard title="Completados" value={stats.completed_enrollments ?? 0} icon={<CheckCircle2 size={18} />} color="text-emerald-600" bg="bg-emerald-50" />
            <StatCard title="Certificados" value={0} icon={<Award size={18} />} color="text-violet-600" bg="bg-violet-50" />
            <StatCard title="Horas" value={0} icon={<Clock size={18} />} color="text-amber-600" bg="bg-amber-50" />
          </>)}
        </div>
      )}

      {/* Quick links */}
      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Acceso rápido</h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
          <QuickLink label="Mis Cursos" icon={<BookMarked size={18} />} href="/my-courses" color="text-blue-600" bg="bg-blue-50" />
          <QuickLink label="Explorar" icon={<BookOpen size={18} />} href="/courses" color="text-emerald-600" bg="bg-emerald-50" />
          <QuickLink label="Tareas" icon={<ClipboardList size={18} />} href="/assignments" color="text-violet-600" bg="bg-violet-50" />
          <QuickLink label="Notas" icon={<BarChart3 size={18} />} href="/grades" color="text-amber-600" bg="bg-amber-50" />
          <QuickLink label="Calendario" icon={<Calendar size={18} />} href="/calendar" color="text-rose-600" bg="bg-rose-50" />
          <QuickLink label="Mensajes" icon={<MessageSquare size={18} />} href="/messages" color="text-cyan-600" bg="bg-cyan-50" />
          <QuickLink label="Certificados" icon={<Award size={18} />} href="/certificates" color="text-orange-600" bg="bg-orange-50" />
          {(isAdmin || isInstructor) && (
            <QuickLink label="Crear Curso" icon={<Plus size={18} />} href="/create-course" color="text-pink-600" bg="bg-pink-50" />
          )}
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Courses list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-800">
              {isAdmin ? 'Cursos populares' : isInstructor ? 'Mis cursos' : 'Cursos disponibles'}
            </h2>
            <button onClick={() => router.push('/courses')} className="text-xs text-primary-600 font-medium hover:underline flex items-center gap-1">
              Ver todos <ChevronRight size={13} />
            </button>
          </div>
          {(popularCourses.length ? popularCourses : courses).slice(0, 4).map((course: { id: number; title: string; enrolled_count?: number; rating?: string; instructor?: { name: string } }) => (
            <div
              key={course.id}
              onClick={() => router.push(`/courses/${course.id}`)}
              className="card p-4 flex items-center gap-4 cursor-pointer hover:shadow-card-hover hover:border-slate-300 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shrink-0">
                <BookOpen size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-primary-700 transition-colors">
                  {course.title}
                </p>
                {course.instructor && <p className="text-xs text-slate-500 mt-0.5">{course.instructor.name}</p>}
                <div className="flex items-center gap-3 mt-1">
                  {course.enrolled_count !== undefined && (
                    <span className="text-xs text-slate-400 flex items-center gap-1"><Users size={11} /> {course.enrolled_count}</span>
                  )}
                  {course.rating && (
                    <span className="text-xs text-amber-500 flex items-center gap-1"><Star size={11} fill="currentColor" /> {course.rating}</span>
                  )}
                </div>
              </div>
              <PlayCircle size={18} className="text-slate-300 group-hover:text-primary-500 transition-colors shrink-0" />
            </div>
          ))}
          {!popularCourses.length && !courses.length && (
            <div className="card p-10 text-center">
              <BookOpen size={36} className="text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500 mb-3">No hay cursos disponibles aún.</p>
              {(isAdmin || isInstructor) && (
                <button onClick={() => router.push('/create-course')} className="inline-flex items-center gap-2 bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                  <Plus size={15} /> Crear primer curso
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sidebar widgets */}
        <div className="space-y-4">
          {/* Users by role (admin) */}
          {isAdmin ? (
            <>
              <div className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-800">Nuevos usuarios</h3>
                  <button onClick={() => router.push('/users')} className="text-xs text-primary-600 hover:underline">Ver todos</button>
                </div>
                <div className="space-y-2.5">
                  {recentUsers.slice(0, 5).map((u: { id: number; name: string; email: string; role: string }) => (
                    <div key={u.id} className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0 text-xs font-bold text-primary-700">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-800 truncate">{u.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{u.email}</p>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        u.role === 'superadmin' ? 'bg-red-50 text-red-600' :
                        u.role === 'instructor' ? 'bg-blue-50 text-blue-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>{u.role === 'superadmin' ? 'Admin' : u.role === 'instructor' ? 'Instructor' : 'Estudiante'}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-4">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Distribución de roles</h3>
                <div className="space-y-2.5">
                  {Object.entries(stats.users_by_role ?? {}).map(([role, count]) => (
                    <div key={role}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600 capitalize">{role}</span>
                        <span className="font-semibold text-slate-800">{count as number}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-400 rounded-full" style={{ width: `${Math.min(100, ((count as number) / (stats.total_users || 1)) * 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="card p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Mi progreso</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Inscritos</span>
                  <span className="font-semibold">{stats.total_enrollments ?? 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Completados</span>
                  <span className="font-semibold">{stats.completed_enrollments ?? 0}</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${stats.completion_rate ?? 0}%` }} />
                </div>
                <p className="text-[11px] text-slate-500 text-center">{stats.completion_rate ?? 0}% completado</p>
              </div>
            </div>
          )}

          {/* Notice */}
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Avisos</h3>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs font-medium text-blue-800 mb-1">¡Bienvenido a Classroom Cloud 360!</p>
              <p className="text-xs text-blue-600">Tu plataforma LMS enterprise está lista para usar.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
