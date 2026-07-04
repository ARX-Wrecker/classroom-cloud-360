'use client';
import { useState } from 'react';
import { BarChart3, TrendingUp, Award, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

const MOCK_GRADES = [
  {
    id: 1,
    course: 'Desarrollo Web Completo con Laravel 11',
    instructor: 'María González',
    progress: 68,
    assignments: [
      { name: 'Quiz Módulo 1', grade: 42, max: 50, type: 'quiz' },
      { name: 'Proyecto API REST', grade: 85, max: 100, type: 'assignment' },
    ],
    average: 77.5,
  },
  {
    id: 2,
    course: 'Marketing Digital para Emprendedores',
    instructor: 'Carlos Mendoza',
    progress: 90,
    assignments: [
      { name: 'Análisis de Campaña', grade: 85, max: 100, type: 'assignment' },
      { name: 'Examen Final', grade: 92, max: 100, type: 'exam' },
    ],
    average: 88.5,
  },
  {
    id: 3,
    course: 'Diseño UX/UI con Figma',
    instructor: 'María González',
    progress: 45,
    assignments: [
      { name: 'Prototipo Figma', grade: 0, max: 100, type: 'assignment', pending: true },
    ],
    average: 0,
  },
];

function GradeBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const color = pct >= 70 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-slate-700 w-12 text-right">{value}/{max}</span>
    </div>
  );
}

export default function GradesPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const overall = MOCK_GRADES.filter(g => g.average > 0);
  const overallAvg = overall.length > 0
    ? (overall.reduce((s, g) => s + g.average, 0) / overall.length).toFixed(1)
    : '—';

  const getLetterGrade = (avg: number) => {
    if (avg >= 90) return { letter: 'A', color: 'text-emerald-600' };
    if (avg >= 75) return { letter: 'B', color: 'text-blue-600' };
    if (avg >= 60) return { letter: 'C', color: 'text-amber-600' };
    return { letter: 'F', color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Mis Calificaciones</h1>
        <p className="text-sm text-slate-500 mt-0.5">Historial académico y notas por curso</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-primary-600">{overallAvg}</p>
          <p className="text-xs text-slate-500 mt-1">Promedio general</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-emerald-600">{MOCK_GRADES.filter(g => g.average >= 60).length}</p>
          <p className="text-xs text-slate-500 mt-1">Aprobados</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-slate-600">{MOCK_GRADES.length}</p>
          <p className="text-xs text-slate-500 mt-1">Cursos totales</p>
        </div>
      </div>

      {/* Courses */}
      <div className="space-y-3">
        {MOCK_GRADES.map(g => {
          const lg = g.average > 0 ? getLetterGrade(g.average) : null;
          const isOpen = expanded === g.id;
          return (
            <div key={g.id} className="card overflow-hidden">
              <button
                className="w-full p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors"
                onClick={() => setExpanded(isOpen ? null : g.id)}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shrink-0">
                  <BookOpen size={20} className="text-white" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-semibold text-slate-800 line-clamp-1">{g.course}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{g.instructor}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-400 rounded-full" style={{ width: `${g.progress}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-500">{g.progress}% avance</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {lg && (
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${lg.color}`}>{lg.letter}</p>
                      <p className="text-xs text-slate-500">{g.average.toFixed(0)}%</p>
                    </div>
                  )}
                  {!lg && <span className="text-sm text-slate-400">Sin notas</span>}
                  {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-slate-100 p-5 bg-slate-50/50">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Actividades evaluadas</p>
                  <div className="space-y-3">
                    {g.assignments.map((a, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-medium text-slate-700">{a.name}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              a.type === 'quiz' ? 'bg-cyan-50 text-cyan-700' :
                              a.type === 'exam' ? 'bg-rose-50 text-rose-700' :
                              'bg-violet-50 text-violet-700'
                            }`}>{a.type === 'quiz' ? 'Quiz' : a.type === 'exam' ? 'Examen' : 'Tarea'}</span>
                          </div>
                          {(a as { pending?: boolean }).pending
                            ? <p className="text-xs text-amber-600">Pendiente de entrega</p>
                            : <GradeBar value={a.grade} max={a.max} />
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
