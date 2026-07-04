'use client';
import { useState } from 'react';
import { Bell, BookOpen, CheckCircle2, MessageSquare, Award, AlertCircle, Check, Trash2 } from 'lucide-react';

const MOCK_NOTIFS = [
  { id: 1, type: 'assignment', title: 'Nueva tarea publicada', body: 'El instructor publicó la tarea "Proyecto Final — API REST" en Desarrollo Web con Laravel 11.', time: '10 min', read: false },
  { id: 2, type: 'grade', title: 'Calificación publicada', body: 'Tu tarea "Análisis de Campaña" fue calificada con 85/100.', time: '2 horas', read: false },
  { id: 3, type: 'message', title: 'Nuevo mensaje de María González', body: 'Hola, ¿cómo van con el proyecto final? Si tienen dudas, pueden escribir en el foro.', time: '1 día', read: false },
  { id: 4, type: 'course', title: 'Nuevo contenido disponible', body: 'Se publicaron 3 nuevas lecciones en el módulo "Autenticación y Seguridad".', time: '2 días', read: true },
  { id: 5, type: 'award', title: '¡Lección completada!', body: 'Completaste la lección "Introducción a Laravel y MVC". ¡Sigue así!', time: '3 días', read: true },
  { id: 6, type: 'alert', title: 'Recordatorio de entrega', body: 'La tarea "Prototipo en Figma" vence mañana a las 23:59.', time: '3 días', read: true },
];

const TYPE_CONFIG = {
  assignment: { icon: <BookOpen size={16} />, color: 'text-violet-600', bg: 'bg-violet-50' },
  grade:      { icon: <CheckCircle2 size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  message:    { icon: <MessageSquare size={16} />, color: 'text-blue-600', bg: 'bg-blue-50' },
  course:     { icon: <BookOpen size={16} />, color: 'text-primary-600', bg: 'bg-primary-50' },
  award:      { icon: <Award size={16} />, color: 'text-amber-600', bg: 'bg-amber-50' },
  alert:      { icon: <AlertCircle size={16} />, color: 'text-red-600', bg: 'bg-red-50' },
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);
  const unread = notifs.filter(n => !n.read).length;

  const markRead = (id: number) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
  const remove = (id: number) => setNotifs(n => n.filter(x => x.id !== id));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Notificaciones</h1>
          <p className="text-sm text-slate-500 mt-0.5">{unread} sin leer</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1">
            <Check size={14} /> Marcar todas como leídas
          </button>
        )}
      </div>

      <div className="space-y-2">
        {notifs.map(n => {
          const tc = TYPE_CONFIG[n.type as keyof typeof TYPE_CONFIG] ?? TYPE_CONFIG.course;
          return (
            <div key={n.id} className={`card p-4 flex items-start gap-3 transition-all ${!n.read ? 'border-l-4 border-l-primary-500' : ''}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tc.bg}`}>
                <span className={tc.color}>{tc.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold ${n.read ? 'text-slate-700' : 'text-slate-900'}`}>{n.title}</p>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 shrink-0" />}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.body}</p>
                <p className="text-[11px] text-slate-400 mt-1.5">Hace {n.time}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {!n.read && (
                  <button onClick={() => markRead(n.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                    <Check size={14} />
                  </button>
                )}
                <button onClick={() => remove(n.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
        {notifs.length === 0 && (
          <div className="card p-16 text-center">
            <Bell size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Sin notificaciones</p>
          </div>
        )}
      </div>
    </div>
  );
}
