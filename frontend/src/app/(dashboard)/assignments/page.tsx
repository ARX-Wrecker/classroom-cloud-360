'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClipboardList, Clock, CheckCircle2, AlertCircle, Plus, Filter, BookOpen, Calendar } from 'lucide-react';

interface Assignment {
  id: number;
  title: string;
  course: string;
  due_date: string;
  status: 'pending' | 'submitted' | 'graded' | 'late';
  grade?: number;
  max_grade: number;
  type: 'assignment' | 'quiz' | 'exam';
}

const MOCK_ASSIGNMENTS: Assignment[] = [
  { id: 1, title: 'Proyecto Final — API REST con Laravel', course: 'Desarrollo Web Completo con Laravel 11', due_date: '2026-07-15', status: 'pending', max_grade: 100, type: 'assignment' },
  { id: 2, title: 'Quiz — Módulo de Rutas y Controladores', course: 'Desarrollo Web Completo con Laravel 11', due_date: '2026-07-08', status: 'submitted', max_grade: 50, type: 'quiz' },
  { id: 3, title: 'Análisis de Campaña de Marketing Digital', course: 'Marketing Digital para Emprendedores', due_date: '2026-07-12', status: 'graded', grade: 85, max_grade: 100, type: 'assignment' },
  { id: 4, title: 'Prototipo en Figma — App Móvil', course: 'Diseño UX/UI con Figma', due_date: '2026-07-05', status: 'late', max_grade: 100, type: 'assignment' },
  { id: 5, title: 'Examen Parcial — Fundamentos de UX', course: 'Diseño UX/UI con Figma', due_date: '2026-07-20', status: 'pending', max_grade: 100, type: 'exam' },
];

const STATUS_CONFIG = {
  pending:   { label: 'Pendiente',   color: 'bg-amber-50 text-amber-700',   icon: <Clock size={13} /> },
  submitted: { label: 'Entregado',   color: 'bg-blue-50 text-blue-700',     icon: <CheckCircle2 size={13} /> },
  graded:    { label: 'Calificado',  color: 'bg-emerald-50 text-emerald-700', icon: <CheckCircle2 size={13} /> },
  late:      { label: 'Atrasado',    color: 'bg-red-50 text-red-700',        icon: <AlertCircle size={13} /> },
};

const TYPE_CONFIG = {
  assignment: { label: 'Tarea',  color: 'bg-violet-50 text-violet-700' },
  quiz:       { label: 'Quiz',   color: 'bg-cyan-50 text-cyan-700' },
  exam:       { label: 'Examen', color: 'bg-rose-50 text-rose-700' },
};

export default function AssignmentsPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded' | 'late'>('all');
  const router = useRouter();

  const filtered = filter === 'all' ? MOCK_ASSIGNMENTS : MOCK_ASSIGNMENTS.filter(a => a.status === filter);

  const counts = {
    all: MOCK_ASSIGNMENTS.length,
    pending: MOCK_ASSIGNMENTS.filter(a => a.status === 'pending').length,
    submitted: MOCK_ASSIGNMENTS.filter(a => a.status === 'submitted').length,
    graded: MOCK_ASSIGNMENTS.filter(a => a.status === 'graded').length,
    late: MOCK_ASSIGNMENTS.filter(a => a.status === 'late').length,
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
  const isOverdue = (d: string) => new Date(d) < new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Tareas y Evaluaciones</h1>
          <p className="text-sm text-slate-500 mt-0.5">{counts.pending} pendientes · {counts.late} atrasadas</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Pendientes', count: counts.pending, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Entregadas', count: counts.submitted, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Calificadas', count: counts.graded, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Atrasadas', count: counts.late, color: 'text-red-600', bg: 'bg-red-50' },
        ].map(s => (
          <div key={s.label} className="card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
              <ClipboardList size={18} className={s.color} />
            </div>
            <div>
              <p className={`text-xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all', 'pending', 'submitted', 'graded', 'late'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              filter === f ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f === 'all' ? `Todas (${counts.all})` : STATUS_CONFIG[f as keyof typeof STATUS_CONFIG]?.label} {f !== 'all' && `(${counts[f]})`}
          </button>
        ))}
      </div>

      {/* Assignments list */}
      <div className="space-y-3">
        {filtered.map(a => {
          const sc = STATUS_CONFIG[a.status];
          const tc = TYPE_CONFIG[a.type];
          const overdue = isOverdue(a.due_date) && a.status === 'pending';

          return (
            <div key={a.id} className={`card p-5 hover:shadow-card-hover transition-all ${overdue ? 'border-red-200' : ''}`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  a.type === 'quiz' ? 'bg-cyan-50' : a.type === 'exam' ? 'bg-rose-50' : 'bg-violet-50'
                }`}>
                  <ClipboardList size={18} className={
                    a.type === 'quiz' ? 'text-cyan-600' : a.type === 'exam' ? 'text-rose-600' : 'text-violet-600'
                  } />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">{a.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <BookOpen size={11} /> {a.course}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${tc.color}`}>{tc.label}</span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${sc.color}`}>
                        {sc.icon} {sc.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-600 font-medium' : 'text-slate-500'}`}>
                      <Calendar size={12} />
                      {overdue ? '¡Atrasada! ' : 'Entrega: '}{formatDate(a.due_date)}
                    </div>
                    <div className="flex items-center gap-3">
                      {a.status === 'graded' && a.grade !== undefined && (
                        <span className={`text-sm font-bold ${a.grade >= 60 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {a.grade}/{a.max_grade}
                        </span>
                      )}
                      {a.status === 'pending' && (
                        <button className="text-xs font-semibold bg-primary-600 text-white px-3 py-1.5 rounded-lg hover:bg-primary-700 transition-colors">
                          Entregar
                        </button>
                      )}
                      {a.status === 'submitted' && (
                        <span className="text-xs text-blue-600 font-medium">Esperando calificación</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
