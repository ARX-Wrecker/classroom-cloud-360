'use client';

import { useState } from 'react';
import {
  CheckSquare, XSquare, Clock, Users, BookOpen,
  ChevronDown, Search, Download, AlertTriangle,
  CheckCircle2, MinusCircle, Calendar,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const classes = [
  { id: 1, course: 'React Avanzado con TypeScript', date: '2026-07-03', time: '10:00', duration: 90, instructor: 'Dr. García', students: 28 },
  { id: 2, course: 'Python para Data Science', date: '2026-07-03', time: '14:00', duration: 60, instructor: 'Ing. López', students: 22 },
  { id: 3, course: 'Diseño UX/UI Profesional', date: '2026-07-02', time: '09:00', duration: 90, instructor: 'Arq. Torres', students: 18 },
  { id: 4, course: 'React Avanzado con TypeScript', date: '2026-07-01', time: '10:00', duration: 90, instructor: 'Dr. García', students: 28 },
];

const studentAttendance = [
  { name: 'Ana García', avatar: 'AG', present: 18, absent: 2, late: 1, total: 21, status: 'present' },
  { name: 'Carlos López', avatar: 'CL', present: 15, absent: 5, late: 1, total: 21, status: 'absent' },
  { name: 'María Torres', avatar: 'MT', present: 20, absent: 0, late: 1, total: 21, status: 'present' },
  { name: 'Pedro Silva', avatar: 'PS', present: 12, absent: 7, late: 2, total: 21, status: 'late' },
  { name: 'Laura Jiménez', avatar: 'LJ', present: 19, absent: 1, late: 1, total: 21, status: 'present' },
  { name: 'Diego Herrera', avatar: 'DH', present: 14, absent: 6, late: 1, total: 21, status: 'absent' },
  { name: 'Sofía Castro', avatar: 'SC', present: 21, absent: 0, late: 0, total: 21, status: 'present' },
  { name: 'Miguel Reyes', avatar: 'MR', present: 16, absent: 4, late: 1, total: 21, status: 'present' },
];

type AttendanceStatus = 'present' | 'absent' | 'late' | null;

export default function AttendancePage() {
  const { user } = useAuthStore();
  const [selectedClass, setSelectedClass] = useState(classes[0]);
  const [search, setSearch] = useState('');
  const [taking, setTaking] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<Record<string, AttendanceStatus>>(
    Object.fromEntries(studentAttendance.map(s => [s.name, null]))
  );

  const isAdmin = ['superadmin', 'admin', 'instructor'].includes(user?.role ?? '');
  const filtered = studentAttendance.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  const presentCount = Object.values(currentStatus).filter(s => s === 'present').length;
  const absentCount = Object.values(currentStatus).filter(s => s === 'absent').length;
  const lateCount = Object.values(currentStatus).filter(s => s === 'late').length;

  const markAll = (status: AttendanceStatus) => {
    setCurrentStatus(Object.fromEntries(studentAttendance.map(s => [s.name, status])));
  };

  const statusIcon = (s: AttendanceStatus) => {
    if (s === 'present') return <CheckCircle2 size={20} className="text-green-600" />;
    if (s === 'absent') return <XSquare size={20} className="text-red-500" />;
    if (s === 'late') return <Clock size={20} className="text-amber-500" />;
    return <MinusCircle size={20} className="text-gray-300" />;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Control de Asistencia</h1>
          <p className="text-sm text-gray-500 mt-1">Registro y seguimiento de asistencia por clase</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white hover:bg-gray-50">
            <Download size={14} /> Exportar
          </button>
          {isAdmin && (
            <button
              onClick={() => setTaking(!taking)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                taking ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <CheckSquare size={14} />
              {taking ? 'Guardar asistencia' : 'Tomar asistencia'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Class Selector */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Clases recientes</h3>
            <div className="space-y-2">
              {classes.map(cls => (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClass(cls)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedClass.id === cls.id
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-transparent hover:bg-gray-50'
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900 truncate">{cls.course}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{cls.date} · {cls.time}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Users size={10} className="text-gray-400" />
                    <span className="text-xs text-gray-400">{cls.students} estudiantes</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Resumen sesión actual</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-600">Presentes</span>
                </div>
                <span className="font-semibold text-gray-900">{taking ? presentCount : 22}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="text-sm text-gray-600">Ausentes</span>
                </div>
                <span className="font-semibold text-gray-900">{taking ? absentCount : 4}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-sm text-gray-600">Tardanza</span>
                </div>
                <span className="font-semibold text-gray-900">{taking ? lateCount : 2}</span>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Asistencia</span>
                  <span className="font-bold text-green-600">{taking ? Math.round((presentCount / studentAttendance.length) * 100) : 79}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Panel */}
        <div className="lg:col-span-3">
          {/* Selected class header */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">{selectedClass.course}</h2>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Calendar size={12} />{selectedClass.date}</span>
                  <span className="flex items-center gap-1"><Clock size={12} />{selectedClass.time} ({selectedClass.duration} min)</span>
                  <span className="flex items-center gap-1"><Users size={12} />{selectedClass.instructor}</span>
                </div>
              </div>
              {taking && (
                <div className="flex gap-2">
                  <button onClick={() => markAll('present')} className="px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-medium">
                    Todos presentes
                  </button>
                  <button onClick={() => markAll('absent')} className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium">
                    Todos ausentes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar estudiante..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Student List */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <div className="col-span-4">Estudiante</div>
              <div className="col-span-2 text-center">Presentes</div>
              <div className="col-span-2 text-center">Ausentes</div>
              <div className="col-span-2 text-center">% Asistencia</div>
              <div className="col-span-2 text-center">Estado hoy</div>
            </div>
            <div className="divide-y divide-gray-100">
              {filtered.map(student => {
                const pct = Math.round((student.present / student.total) * 100);
                const atRisk = pct < 70;
                return (
                  <div key={student.name} className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-gray-50">
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-semibold">
                        {student.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{student.name}</p>
                        {atRisk && (
                          <p className="text-xs text-amber-600 flex items-center gap-0.5">
                            <AlertTriangle size={10} /> En riesgo
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2 text-center text-sm text-green-600 font-medium">{student.present}</div>
                    <div className="col-span-2 text-center text-sm text-red-500 font-medium">{student.absent}</div>
                    <div className="col-span-2 text-center">
                      <span className={`text-sm font-medium ${pct >= 80 ? 'text-green-600' : pct >= 70 ? 'text-amber-500' : 'text-red-500'}`}>
                        {pct}%
                      </span>
                    </div>
                    <div className="col-span-2 flex justify-center">
                      {taking ? (
                        <div className="flex gap-1">
                          {(['present','late','absent'] as const).map(s => (
                            <button
                              key={s}
                              onClick={() => setCurrentStatus(prev => ({ ...prev, [student.name]: s }))}
                              className={`p-1 rounded transition-colors ${
                                currentStatus[student.name] === s ? 'opacity-100' : 'opacity-30 hover:opacity-60'
                              }`}
                            >
                              {s === 'present' ? <CheckCircle2 size={18} className="text-green-600" /> :
                               s === 'late' ? <Clock size={18} className="text-amber-500" /> :
                               <XSquare size={18} className="text-red-500" />}
                            </button>
                          ))}
                        </div>
                      ) : (
                        statusIcon(student.status as AttendanceStatus)
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
