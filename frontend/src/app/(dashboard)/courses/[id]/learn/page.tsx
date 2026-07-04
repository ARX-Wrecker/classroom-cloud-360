'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCourse, useCompleteLesson } from '@/hooks/useCourses';
import {
  Play, CheckCircle2, Lock, ChevronLeft, ChevronRight, BookOpen,
  List, X, Clock, FileText, MessageCircle,
} from 'lucide-react';

export default function LearnPage() {
  const { id } = useParams<{ id: string }>();
  const { data: course, isLoading } = useCourse(id);
  const { mutate: complete } = useCompleteLesson();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeLesson, setActiveLesson] = useState<{ id: number; title: string; type: string; content?: string; video_url?: string } | null>(null);

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>;
  }
  if (!course) return null;

  const modules = course.modules ?? [];
  const allLessons = modules.flatMap((m: { id: number; title: string; lessons?: { id: number; title: string; type: string; content?: string; video_url?: string; duration_seconds?: number; is_preview?: boolean }[] }) => m.lessons ?? []);
  const currentLesson = activeLesson ?? allLessons[0];
  const currentIdx = allLessons.findIndex((l: { id: number }) => l.id === currentLesson?.id);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  return (
    <div className="-m-4 md:-m-6 min-h-screen bg-slate-900 flex flex-col">
      {/* Top bar */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center gap-4">
        <button onClick={() => router.push(`/courses/${id}`)} className="flex items-center gap-2 text-slate-300 hover:text-white text-sm transition-colors">
          <ChevronLeft size={16} /> Volver al curso
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{course.title}</p>
          {currentLesson && <p className="text-xs text-slate-400 truncate">{currentLesson.title}</p>}
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <div className="w-24 h-1 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 rounded-full" style={{ width: `${course.enrollment?.progress ?? 0}%` }} />
            </div>
            <span>{Math.round(course.enrollment?.progress ?? 0)}%</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="flex items-center gap-1.5 text-slate-300 hover:text-white text-xs border border-slate-600 px-3 py-1.5 rounded-lg transition-colors">
            <List size={14} /> Contenido
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Video / Content area */}
        <div className="flex-1 flex flex-col overflow-auto">
          {/* Video player */}
          <div className="bg-black aspect-video max-h-[60vh] flex items-center justify-center relative">
            {currentLesson?.video_url ? (
              <video src={currentLesson.video_url} controls className="w-full h-full" />
            ) : (
              <div className="flex flex-col items-center gap-3 text-white/30">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                  <Play size={28} className="text-white/60 ml-1" />
                </div>
                <p className="text-sm">
                  {currentLesson?.type === 'text' ? 'Contenido de texto' : 'Video no disponible'}
                </p>
              </div>
            )}
          </div>

          {/* Lesson content */}
          <div className="flex-1 p-6 max-w-4xl">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-xl font-bold text-white">{currentLesson?.title}</h1>
              <button
                onClick={() => currentLesson && complete(currentLesson.id)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shrink-0"
              >
                <CheckCircle2 size={15} /> Marcar completada
              </button>
            </div>

            {currentLesson?.content && (
              <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {currentLesson.content}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700">
              <button
                onClick={() => prevLesson && setActiveLesson(prevLesson)}
                disabled={!prevLesson}
                className="flex items-center gap-2 text-slate-400 hover:text-white text-sm disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={16} /> Anterior
              </button>
              <button
                onClick={() => nextLesson && setActiveLesson(nextLesson)}
                disabled={!nextLesson}
                className="flex items-center gap-2 text-slate-400 hover:text-white text-sm disabled:opacity-30 transition-colors"
              >
                Siguiente <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Course sidebar */}
        {sidebarOpen && (
          <div className="w-72 shrink-0 bg-slate-800 border-l border-slate-700 overflow-y-auto">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Contenido</p>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>
            {modules.map((mod: { id: number; title: string; lessons?: { id: number; title: string; type: string; duration_seconds?: number }[] }, mi: number) => (
              <div key={mod.id}>
                <div className="px-4 py-2.5 bg-slate-750 border-b border-slate-700/50">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Módulo {mi + 1}: {mod.title}
                  </p>
                </div>
                {(mod.lessons ?? []).map((lesson: { id: number; title: string; type: string; duration_seconds?: number }) => {
                  const isActive = currentLesson?.id === lesson.id;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-slate-700/50 transition-colors border-b border-slate-700/30 ${isActive ? 'bg-primary-900/30 border-l-2 border-l-primary-500' : ''}`}
                    >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${isActive ? 'border-primary-500 bg-primary-500' : 'border-slate-600'}`}>
                        {isActive ? <Play size={10} className="text-white ml-0.5" /> : <Play size={10} className="text-slate-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs leading-snug ${isActive ? 'text-white font-medium' : 'text-slate-400'}`}>
                          {lesson.title}
                        </p>
                        {lesson.duration_seconds && (
                          <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                            <Clock size={9} /> {Math.round(lesson.duration_seconds / 60)} min
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
