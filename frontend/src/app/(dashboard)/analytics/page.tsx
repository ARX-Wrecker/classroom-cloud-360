'use client';

import { useState } from 'react';
import {
  TrendingUp, Users, BookOpen, Award, Clock, BarChart2,
  ArrowUp, ArrowDown, Download, RefreshCw, Filter,
  Star, Activity, Target, Zap,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

const enrollmentData = [120,145,132,160,178,195,210,225,198,242,268,290];
const completionData = [45,52,48,61,70,78,88,92,80,95,110,125];
const revenueData = [1200,1450,1320,1600,1780,1950,2100,2250,1980,2420,2680,2900];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const h = 40;
  const w = 120;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Bar({ height, color, label }: { height: number; color: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-8 rounded-t" style={{ height: `${height}%`, backgroundColor: color, minHeight: 4 }} />
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

const topCourses = [
  { name: 'React Avanzado con TypeScript', students: 284, completion: 78, rating: 4.9 },
  { name: 'Python para Data Science', students: 231, completion: 65, rating: 4.8 },
  { name: 'Diseño UX/UI Profesional', students: 198, completion: 72, rating: 4.7 },
  { name: 'Node.js y APIs REST', students: 176, completion: 81, rating: 4.6 },
  { name: 'Cloud Computing AWS', students: 154, completion: 58, rating: 4.8 },
];

const riskStudents = [
  { name: 'Carlos Mendoza', course: 'React Avanzado', progress: 12, lastLogin: '18 días' },
  { name: 'Ana Rojas', course: 'Data Science', progress: 8, lastLogin: '25 días' },
  { name: 'Pedro Silva', course: 'Cloud AWS', progress: 22, lastLogin: '14 días' },
  { name: 'María Torres', course: 'UX/UI Profesional', progress: 15, lastLogin: '20 días' },
];

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  if (!['superadmin', 'admin'].includes(user?.role ?? '')) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500">
        <BarChart2 size={48} className="mb-4 opacity-30" />
        <p className="text-lg font-medium">Acceso restringido</p>
        <p className="text-sm">Esta sección es solo para administradores.</p>
      </div>
    );
  }

  const maxEnrollment = Math.max(...enrollmentData);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reportes</h1>
          <p className="text-gray-500 text-sm mt-1">Métricas de aprendizaje en tiempo real</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white border rounded-lg p-1">
            {(['week','month','year'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  period === p ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {p === 'week' ? 'Semana' : p === 'month' ? 'Mes' : 'Año'}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white hover:bg-gray-50">
            <Download size={14} /> Exportar
          </button>
          <button className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-600">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Usuarios Totales', value: '1,284', delta: '+12.4%', up: true, icon: Users, color: '#1a56db', bg: '#eff6ff', data: enrollmentData },
          { title: 'Cursos Activos', value: '47', delta: '+3 este mes', up: true, icon: BookOpen, color: '#059669', bg: '#ecfdf5', data: completionData },
          { title: 'Tasa de Completación', value: '68.3%', delta: '+5.2%', up: true, icon: Award, color: '#7c3aed', bg: '#f5f3ff', data: enrollmentData.map(v => v * 0.68) },
          { title: 'Horas de Aprendizaje', value: '9,842', delta: '-2.1%', up: false, icon: Clock, color: '#d97706', bg: '#fffbeb', data: revenueData },
        ].map(card => (
          <div key={card.title} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: card.bg }}>
                <card.icon size={18} style={{ color: card.color }} />
              </div>
              <span className={`text-xs font-medium flex items-center gap-0.5 ${card.up ? 'text-green-600' : 'text-red-500'}`}>
                {card.up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                {card.delta}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
            <div className="text-xs text-gray-500">{card.title}</div>
            <div className="mt-3">
              <Sparkline data={card.data} color={card.color} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enrollment Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Inscripciones Mensuales</h2>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">+18.4% vs año anterior</span>
          </div>
          <div className="flex items-end gap-1 h-40">
            {enrollmentData.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-sm bg-blue-600 transition-all hover:bg-blue-500"
                  style={{ height: `${(v / maxEnrollment) * 100}%` }}
                  title={`${v} inscripciones`}
                />
                <span className="text-[10px] text-gray-400">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Categorías Populares</h2>
          <div className="space-y-3">
            {[
              { name: 'Desarrollo Web', pct: 34, color: '#1a56db' },
              { name: 'Data Science', pct: 22, color: '#7c3aed' },
              { name: 'Diseño', pct: 18, color: '#059669' },
              { name: 'Cloud / DevOps', pct: 15, color: '#d97706' },
              { name: 'Mobile', pct: 11, color: '#db2777' },
            ].map(cat => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{cat.name}</span>
                  <span className="text-sm font-medium text-gray-900">{cat.pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full">
                  <div className="h-full rounded-full" style={{ width: `${cat.pct}%`, backgroundColor: cat.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Courses */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Cursos más Populares</h2>
            <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              <Filter size={12} /> Filtrar
            </button>
          </div>
          <div className="space-y-3">
            {topCourses.map((course, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{course.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-500">{course.students} estudiantes</span>
                    <div className="h-1 w-16 bg-gray-100 rounded-full">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${course.completion}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{course.completion}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 text-amber-500">
                  <Star size={12} fill="currentColor" />
                  <span className="text-xs font-medium text-gray-700">{course.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Students */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Estudiantes en Riesgo</h2>
            <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full font-medium">
              {riskStudents.length} detectados
            </span>
          </div>
          <div className="space-y-3">
            {riskStudents.map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
                <div className="w-9 h-9 rounded-full bg-red-200 flex items-center justify-center text-red-700 font-semibold text-sm">
                  {s.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{s.name}</p>
                  <p className="text-xs text-gray-500 truncate">{s.course} — {s.progress}% progreso</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-red-600 font-medium">Sin acceso</p>
                  <p className="text-xs text-gray-400">{s.lastLogin}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-3 w-full py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
            Enviar recordatorio a todos
          </button>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity size={16} className="text-blue-600" />
          Actividad de la Plataforma (últimas 12 semanas)
        </h2>
        <div className="grid grid-cols-12 gap-1">
          {Array.from({ length: 84 }).map((_, i) => {
            const intensity = Math.random();
            const bg = intensity > 0.8 ? 'bg-blue-600' : intensity > 0.6 ? 'bg-blue-400' : intensity > 0.3 ? 'bg-blue-200' : 'bg-gray-100';
            return <div key={i} className={`h-5 rounded-sm ${bg}`} title={`${Math.round(intensity * 100)} acciones`} />;
          })}
        </div>
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-xs text-gray-400">Menor</span>
          {['bg-gray-100','bg-blue-200','bg-blue-400','bg-blue-600'].map((bg, i) => (
            <div key={i} className={`w-4 h-4 rounded-sm ${bg}`} />
          ))}
          <span className="text-xs text-gray-400">Mayor</span>
        </div>
      </div>

      {/* Quick Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tiempo promedio/lección', value: '18 min', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'NPS Plataforma', value: '78 / 100', icon: Target, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Cursos nuevos este mes', value: '7', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Certificados emitidos', value: '342', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${m.bg}`}>
              <m.icon size={18} className={m.color} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{m.value}</p>
              <p className="text-xs text-gray-500">{m.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
