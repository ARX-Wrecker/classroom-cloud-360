'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, BookOpen, ClipboardList, Video, Bell } from 'lucide-react';

const EVENTS = [
  { id: 1, date: '2026-07-08', title: 'Quiz — Rutas y Controllers', course: 'Laravel 11', type: 'quiz', color: 'bg-cyan-500' },
  { id: 2, date: '2026-07-10', title: 'Clase en Vivo — React Hooks', course: 'React Avanzado', type: 'live', color: 'bg-rose-500' },
  { id: 3, date: '2026-07-12', title: 'Entrega — Análisis de Campaña', course: 'Marketing Digital', type: 'assignment', color: 'bg-violet-500' },
  { id: 4, date: '2026-07-15', title: 'Proyecto Final — API REST', course: 'Laravel 11', type: 'assignment', color: 'bg-violet-500' },
  { id: 5, date: '2026-07-17', title: 'Webinar — UX Research', course: 'Diseño UX/UI', type: 'live', color: 'bg-rose-500' },
  { id: 6, date: '2026-07-20', title: 'Examen Parcial — Fundamentos UX', course: 'Diseño UX/UI', type: 'exam', color: 'bg-red-500' },
  { id: 7, date: '2026-07-22', title: 'Entrega — Prototipo Figma', course: 'Diseño UX/UI', type: 'assignment', color: 'bg-violet-500' },
];

const TYPE_ICONS = {
  quiz:       <ClipboardList size={13} />,
  assignment: <BookOpen size={13} />,
  live:       <Video size={13} />,
  exam:       <Bell size={13} />,
};

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return EVENTS.filter(e => e.date === dateStr);
  };

  const upcomingEvents = EVENTS
    .filter(e => new Date(e.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-800">Calendario Académico</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 card p-5">
          {/* Nav */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
              <ChevronLeft size={17} />
            </button>
            <h2 className="text-base font-semibold text-slate-800">{MONTHS[month]} {year}</h2>
            <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
              <ChevronRight size={17} />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-2">
            {WEEKDAYS.map(d => (
              <div key={d} className="text-center text-[11px] font-semibold text-slate-400 py-1">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDay(day);
              const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

              return (
                <div key={day} className={`min-h-[56px] p-1 rounded-lg transition-colors ${isToday ? 'bg-primary-50 ring-1 ring-primary-300' : 'hover:bg-slate-50'}`}>
                  <p className={`text-xs font-medium mb-1 w-5 h-5 flex items-center justify-center rounded-full ${
                    isToday ? 'bg-primary-600 text-white' : 'text-slate-700'
                  }`}>{day}</p>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 2).map(ev => (
                      <div key={ev.id} className={`text-[9px] font-medium text-white px-1 py-0.5 rounded truncate ${ev.color}`}>
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[9px] text-slate-500 font-medium">+{dayEvents.length - 2} más</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100">
            {[
              { label: 'Tarea', color: 'bg-violet-500' },
              { label: 'Quiz', color: 'bg-cyan-500' },
              { label: 'Examen', color: 'bg-red-500' },
              { label: 'Clase en vivo', color: 'bg-rose-500' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                <span className="text-[11px] text-slate-600">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming events */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Próximos eventos</h3>
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-8">
              <Calendar size={32} className="text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Sin eventos próximos</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map(ev => {
                const d = new Date(ev.date + 'T00:00:00');
                const daysLeft = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={ev.id} className="flex gap-3">
                    <div className={`w-1 self-stretch rounded-full ${ev.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 line-clamp-1">{ev.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{ev.course}</p>
                      <p className={`text-[11px] font-medium mt-1 ${daysLeft <= 2 ? 'text-red-600' : daysLeft <= 5 ? 'text-amber-600' : 'text-slate-500'}`}>
                        {daysLeft === 0 ? '¡Hoy!' : daysLeft === 1 ? 'Mañana' : `En ${daysLeft} días`}
                      </p>
                    </div>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${ev.color} shrink-0`}>
                      {TYPE_ICONS[ev.type as keyof typeof TYPE_ICONS]}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
