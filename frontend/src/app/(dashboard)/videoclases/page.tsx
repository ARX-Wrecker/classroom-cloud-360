'use client';

import { useState } from 'react';
import {
  Video, Calendar, Clock, Users, Play, ExternalLink,
  Plus, Mic, MicOff, Camera, CameraOff, MonitorPlay,
  Radio, CheckCircle2, ChevronRight,
} from 'lucide-react';

const liveClasses = [
  {
    id: 1,
    title: 'React Hooks en profundidad — Sesión 3',
    course: 'React Avanzado con TypeScript',
    instructor: 'Dr. Carlos García',
    date: '2026-07-04',
    time: '10:00',
    duration: 90,
    platform: 'Google Meet',
    status: 'live',
    participants: 24,
    meetLink: '#',
  },
  {
    id: 2,
    title: 'Introducción a NumPy y Pandas',
    course: 'Python para Data Science',
    instructor: 'Ing. Ana López',
    date: '2026-07-04',
    time: '14:00',
    duration: 60,
    platform: 'Google Meet',
    status: 'upcoming',
    participants: 0,
    meetLink: '#',
  },
  {
    id: 3,
    title: 'Principios de Diseño Visual',
    course: 'Diseño UX/UI Profesional',
    instructor: 'Arq. Sofía Torres',
    date: '2026-07-05',
    time: '09:00',
    duration: 90,
    platform: 'Microsoft Teams',
    status: 'upcoming',
    participants: 0,
    meetLink: '#',
  },
  {
    id: 4,
    title: 'REST API con Express.js',
    course: 'Node.js y APIs REST',
    instructor: 'Dev. Miguel Reyes',
    date: '2026-07-02',
    time: '11:00',
    duration: 120,
    platform: 'Google Meet',
    status: 'recorded',
    participants: 31,
    meetLink: '#',
  },
  {
    id: 5,
    title: 'Fundamentos de AWS S3 y EC2',
    course: 'Cloud Computing AWS',
    instructor: 'Cloud. Patricia Vega',
    date: '2026-07-01',
    time: '15:00',
    duration: 90,
    platform: 'Microsoft Teams',
    status: 'recorded',
    participants: 19,
    meetLink: '#',
  },
];

const platformColor: Record<string, string> = {
  'Google Meet': 'text-green-600 bg-green-50',
  'Microsoft Teams': 'text-blue-700 bg-blue-50',
};

const statusBadge: Record<string, { label: string; class: string }> = {
  live: { label: '🔴 En vivo', class: 'bg-red-100 text-red-700' },
  upcoming: { label: '⏰ Próxima', class: 'bg-amber-100 text-amber-700' },
  recorded: { label: '📹 Grabada', class: 'bg-gray-100 text-gray-600' },
};

export default function VideoclasesPage() {
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming' | 'recorded'>('all');

  const filtered = liveClasses.filter(c => filter === 'all' || c.status === filter);
  const liveNow = liveClasses.filter(c => c.status === 'live');

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Videoclases</h1>
          <p className="text-sm text-gray-500 mt-1">Clases en vivo y grabaciones</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
          <Plus size={16} /> Programar clase
        </button>
      </div>

      {/* Live Now Banner */}
      {liveNow.length > 0 && (
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
              <div>
                <p className="font-semibold">{liveNow[0].title}</p>
                <p className="text-sm text-red-100">{liveNow[0].course} · {liveNow[0].participants} participantes</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 rounded-lg text-sm font-medium hover:bg-red-50">
              <Play size={14} /> Unirse ahora
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {[
          { v: 'all', label: 'Todas' },
          { v: 'live', label: '🔴 En vivo' },
          { v: 'upcoming', label: '⏰ Próximas' },
          { v: 'recorded', label: '📹 Grabadas' },
        ].map(f => (
          <button
            key={f.v}
            onClick={() => setFilter(f.v as typeof filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.v
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(cls => (
          <div key={cls.id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${cls.status === 'live' ? 'bg-red-100' : cls.status === 'upcoming' ? 'bg-amber-100' : 'bg-gray-100'}`}>
              {cls.status === 'live' ? (
                <Radio size={22} className="text-red-600" />
              ) : cls.status === 'upcoming' ? (
                <Video size={22} className="text-amber-600" />
              ) : (
                <MonitorPlay size={22} className="text-gray-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <h3 className="font-semibold text-gray-900">{cls.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[cls.status].class}`}>
                  {statusBadge[cls.status].label}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{cls.course} · {cls.instructor}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                <span className="flex items-center gap-1"><Calendar size={11} />{cls.date} {cls.time}</span>
                <span className="flex items-center gap-1"><Clock size={11} />{cls.duration} min</span>
                {cls.status !== 'upcoming' && (
                  <span className="flex items-center gap-1"><Users size={11} />{cls.participants} participantes</span>
                )}
                <span className={`px-2 py-0.5 rounded-full text-xs ${platformColor[cls.platform]}`}>
                  {cls.platform}
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              {cls.status === 'live' && (
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 font-medium">
                  <Play size={14} /> Unirse
                </button>
              )}
              {cls.status === 'upcoming' && (
                <button className="flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-600 rounded-lg text-sm hover:bg-blue-50">
                  <ExternalLink size={14} /> Ver enlace
                </button>
              )}
              {cls.status === 'recorded' && (
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                  <Play size={14} /> Ver grabación
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {[
          { label: 'Clases este mes', value: '12', icon: Video, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Horas en vivo', value: '18h', icon: Clock, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Grabaciones', value: '8', icon: MonitorPlay, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${s.bg}`}>
              <s.icon size={18} className={s.color} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
