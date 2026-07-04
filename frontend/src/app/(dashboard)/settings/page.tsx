'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User, Lock, Bell, Globe, Shield, Camera, Save } from 'lucide-react';

const TABS = [
  { id: 'profile', label: 'Perfil', icon: <User size={16} /> },
  { id: 'password', label: 'Contraseña', icon: <Lock size={16} /> },
  { id: 'notifications', label: 'Notificaciones', icon: <Bell size={16} /> },
  { id: 'privacy', label: 'Privacidad', icon: <Shield size={16} /> },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Configuración</h1>
        <p className="text-sm text-slate-500 mt-0.5">Gestiona tu cuenta y preferencias</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar tabs */}
        <div className="card p-3 h-fit">
          <nav className="space-y-0.5">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  tab === t.id ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className={tab === t.id ? 'text-primary-600' : 'text-slate-400'}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="md:col-span-3 card p-6">
          {tab === 'profile' && (
            <div className="space-y-5">
              <div className="flex items-center gap-5 pb-5 border-b border-slate-100">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-primary-100 flex items-center justify-center text-2xl font-bold text-primary-700">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors">
                    <Camera size={13} />
                  </button>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{user?.name}</p>
                  <p className="text-sm text-slate-500">{user?.email}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${
                    user?.role === 'superadmin' ? 'bg-red-50 text-red-700' :
                    user?.role === 'instructor' ? 'bg-blue-50 text-blue-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>{user?.role}</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Nombre completo</label>
                  <input type="text" defaultValue={user?.name} className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Correo electrónico</label>
                  <input type="email" defaultValue={user?.email} className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Teléfono</label>
                  <input type="tel" defaultValue={user?.phone ?? ''} placeholder="+56 9 xxxx xxxx" className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">País</label>
                  <select defaultValue={user?.country ?? 'CL'} className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                    <option value="CL">Chile</option>
                    <option value="AR">Argentina</option>
                    <option value="MX">México</option>
                    <option value="CO">Colombia</option>
                    <option value="PE">Perú</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Biografía</label>
                  <textarea rows={3} defaultValue={user?.bio ?? ''} placeholder="Cuéntanos sobre ti..." className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
                </div>
              </div>
            </div>
          )}

          {tab === 'password' && (
            <div className="space-y-4 max-w-md">
              <h3 className="text-sm font-semibold text-slate-800">Cambiar contraseña</h3>
              {['Contraseña actual', 'Nueva contraseña', 'Confirmar nueva contraseña'].map((label, i) => (
                <div key={i}>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">{label}</label>
                  <input type="password" className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              ))}
              <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-700">
                La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-800">Preferencias de notificaciones</h3>
              {[
                { label: 'Nuevas tareas publicadas', desc: 'Cuando un instructor publica una tarea en tus cursos' },
                { label: 'Calificaciones disponibles', desc: 'Cuando recibas una nota o retroalimentación' },
                { label: 'Mensajes directos', desc: 'Cuando alguien te envíe un mensaje' },
                { label: 'Recordatorios de entrega', desc: '24 horas antes de cada fecha límite' },
                { label: 'Nuevos contenidos en cursos', desc: 'Cuando se publiquen lecciones en tus cursos' },
                { label: 'Anuncios del sistema', desc: 'Actualizaciones y novedades de la plataforma' },
              ].map((n, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{n.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{n.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={i < 4} className="sr-only peer" />
                    <div className="w-10 h-5 bg-slate-200 peer-checked:bg-primary-600 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                </div>
              ))}
            </div>
          )}

          {tab === 'privacy' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-800">Privacidad y seguridad</h3>
              {[
                { label: 'Perfil público', desc: 'Otros estudiantes pueden ver tu perfil' },
                { label: 'Mostrar progreso', desc: 'Otros pueden ver tu progreso en los cursos' },
                { label: 'Autenticación 2FA', desc: 'Requerir código adicional al iniciar sesión' },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{p.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{p.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={i === 0} className="sr-only peer" />
                    <div className="w-10 h-5 bg-slate-200 peer-checked:bg-primary-600 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all ${
                saved ? 'bg-emerald-600 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              <Save size={15} /> {saved ? '¡Guardado!' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
