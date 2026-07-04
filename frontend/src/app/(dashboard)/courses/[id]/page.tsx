'use client';
import { useParams, useRouter } from 'next/navigation';
import { useCourse, useEnrollCourse } from '@/hooks/useCourses';
import { useAuth } from '@/hooks/useAuth';
import {
  BookOpen, Play, Clock, Users, Star, CheckCircle2, Lock,
  ChevronRight, ChevronDown, ChevronUp, Globe, Award, ArrowLeft,
} from 'lucide-react';
import { useState } from 'react';

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: course, isLoading } = useCourse(id);
  const { mutate: enroll, isPending } = useEnrollCourse();
  const { isAdmin, isInstructor } = useAuth();
  const router = useRouter();
  const [openModule, setOpenModule] = useState<number | null>(0);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="card h-32 animate-pulse bg-slate-50" />)}
      </div>
    );
  }

  if (!course) return (
    <div className="card p-12 text-center">
      <BookOpen size={48} className="text-slate-300 mx-auto mb-3" />
      <p className="text-slate-600">Curso no encontrado.</p>
    </div>
  );

  const enrolled = !!course.enrollment;
  const modules = course.modules ?? [];

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1">
        <ArrowLeft size={15} /> Volver
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Hero */}
          <div className="card overflow-hidden">
            <div className="h-52 bg-gradient-to-br from-primary-500 to-primary-700 relative flex items-center justify-center">
              <BookOpen size={64} className="text-white/30" />
              {course.thumbnail && <img src={course.thumbnail} alt={course.title} className="absolute inset-0 w-full h-full object-cover" />}
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {course.category && <span className="text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full font-medium">{course.category.name}</span>}
                {course.level && <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium capitalize">{course.level}</span>}
                {course.is_free && <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">Gratis</span>}
              </div>
              <h1 className="text-xl font-bold text-slate-800 mb-2">{course.title}</h1>
              <p className="text-sm text-slate-600 leading-relaxed">{course.description ?? course.short_description}</p>
              {course.instructor && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700">
                    {course.instructor.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Instructor</p>
                    <p className="text-sm font-semibold text-slate-800">{course.instructor.name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modules / Curriculum */}
          {modules.length > 0 && (
            <div className="card overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <h2 className="text-base font-semibold text-slate-800">Contenido del curso</h2>
                <p className="text-xs text-slate-500 mt-1">{modules.length} módulos · {modules.reduce((acc: number, m: { lessons?: { length: number }[] }) => acc + (m.lessons?.length ?? 0), 0)} lecciones</p>
              </div>
              <div className="divide-y divide-slate-100">
                {modules.map((mod: { id: number; title: string; description?: string; lessons?: { id: number; title: string; type: string; duration_seconds?: number; is_preview?: boolean }[] }, idx: number) => (
                  <div key={mod.id}>
                    <button
                      className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors"
                      onClick={() => setOpenModule(openModule === idx ? null : idx)}
                    >
                      <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center shrink-0 text-xs font-bold text-primary-600">
                        {idx + 1}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-semibold text-slate-800">{mod.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{mod.lessons?.length ?? 0} lecciones</p>
                      </div>
                      {openModule === idx ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </button>
                    {openModule === idx && (
                      <div className="bg-slate-50/50 divide-y divide-slate-100">
                        {(mod.lessons ?? []).map((lesson: { id: number; title: string; type: string; duration_seconds?: number; is_preview?: boolean }) => (
                          <div key={lesson.id} className="flex items-center gap-3 px-5 py-3">
                            <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                              {enrolled || lesson.is_preview
                                ? <Play size={11} className="text-primary-500" />
                                : <Lock size={11} className="text-slate-400" />
                              }
                            </div>
                            <p className="flex-1 text-xs text-slate-700">{lesson.title}</p>
                            <div className="flex items-center gap-2">
                              {lesson.is_preview && <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium">Preview</span>}
                              {lesson.duration_seconds && (
                                <span className="text-[11px] text-slate-400">{Math.round(lesson.duration_seconds / 60)} min</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar — enrollment card */}
        <div className="space-y-4">
          <div className="card p-5 sticky top-20">
            <div className="text-center mb-4 pb-4 border-b border-slate-100">
              {course.is_free ? (
                <p className="text-3xl font-bold text-emerald-600">Gratis</p>
              ) : (
                <p className="text-3xl font-bold text-slate-800">${course.price?.toLocaleString('es-CL')}</p>
              )}
            </div>

            {enrolled ? (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">Progreso</span>
                    <span className="font-semibold text-primary-600">{Math.round(course.enrollment?.progress ?? 0)}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: `${course.enrollment?.progress ?? 0}%` }} />
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/courses/${id}/learn`)}
                  className="w-full bg-primary-600 text-white font-semibold py-3 rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Play size={16} /> Continuar
                </button>
              </div>
            ) : (!isAdmin && !isInstructor) ? (
              <button
                onClick={() => enroll(Number(id))}
                disabled={isPending}
                className="w-full bg-primary-600 text-white font-semibold py-3 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-70"
              >
                {isPending ? 'Inscribiendo...' : 'Inscribirse'}
              </button>
            ) : (
              <button
                onClick={() => router.push(`/courses/${id}/learn`)}
                className="w-full bg-slate-100 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <Play size={16} /> Previsualizar
              </button>
            )}

            <div className="space-y-2.5 mt-4 text-sm">
              {[
                { icon: <Users size={14} />, label: `${course.enrolled_count ?? 0} estudiantes inscritos` },
                { icon: <Play size={14} />, label: `${modules.reduce((a: number, m: { lessons?: unknown[] }) => a + (m.lessons?.length ?? 0), 0)} lecciones en video` },
                { icon: <Globe size={14} />, label: 'Acceso de por vida' },
                { icon: <Award size={14} />, label: 'Certificado al completar' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-600">
                  <span className="text-slate-400">{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
