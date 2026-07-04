'use client';

import { useState } from 'react';
import {
  Settings, Shield, Globe, Mail, Bell, Database, Palette,
  Users, Building2, CreditCard, Key, Save, ToggleLeft, ToggleRight,
  Server, Lock, Upload, ChevronRight, AlertTriangle,
  Video, Briefcase, Bot,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const sections = [
  { id: 'general', label: 'General', icon: Building2 },
  { id: 'security', label: 'Seguridad', icon: Shield },
  { id: 'appearance', label: 'Apariencia', icon: Palette },
  { id: 'email', label: 'Email / SMTP', icon: Mail },
  { id: 'integrations', label: 'Integraciones', icon: Globe },
  { id: 'billing', label: 'Plan & Facturación', icon: CreditCard },
  { id: 'backup', label: 'Respaldo', icon: Database },
  { id: 'api', label: 'API Keys', icon: Key },
];

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform mt-0.5 ${value ? 'translate-x-4.5 ml-4' : 'ml-0.5'}`} />
    </button>
  );
}

export default function AdminPage() {
  const { user } = useAuthStore();
  const [active, setActive] = useState('general');
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    platformName: 'Classroom Cloud 360',
    platformUrl: 'https://cc360.edu',
    contactEmail: 'admin@cc360.edu',
    maxStudents: '10000',
    maintenanceMode: false,
    registrationOpen: true,
    requireEmailVerification: true,
    twoFactorRequired: false,
    sessionTimeout: '60',
    maxLoginAttempts: '5',
    primaryColor: '#1a56db',
    logoUrl: '',
    smtpHost: 'smtp.mailgun.org',
    smtpPort: '587',
    smtpUser: 'no-reply@cc360.edu',
    googleMeetEnabled: true,
    teamsEnabled: false,
    openAiEnabled: true,
    openAiKey: 'sk-****************************',
  });

  if (!['superadmin', 'admin'].includes(user?.role ?? '')) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500">
        <Shield size={48} className="mb-4 opacity-30" />
        <p className="text-lg font-medium">Acceso restringido</p>
        <p className="text-sm">Solo administradores pueden acceder a este panel.</p>
      </div>
    );
  }

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const set = (key: keyof typeof settings, value: string | boolean) =>
    setSettings(prev => ({ ...prev, [key]: value }));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel Administrativo</h1>
          <p className="text-sm text-gray-500 mt-1">Configuración global de la plataforma</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            saved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <Save size={14} />
          {saved ? 'Guardado ✓' : 'Guardar cambios'}
        </button>
      </div>

      {settings.maintenanceMode && (
        <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
          <AlertTriangle size={16} className="text-amber-600" />
          <p className="text-sm text-amber-800">La plataforma está en modo mantenimiento. Los usuarios no pueden acceder.</p>
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-52 flex-shrink-0">
          <nav className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  active === s.id
                    ? 'bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <s.icon size={15} />
                {s.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {active === 'general' && (
              <div className="space-y-5">
                <h2 className="text-base font-semibold text-gray-900 pb-3 border-b border-gray-100">Configuración General</h2>
                {[
                  { label: 'Nombre de la plataforma', key: 'platformName' as const, type: 'text' },
                  { label: 'URL de la plataforma', key: 'platformUrl' as const, type: 'url' },
                  { label: 'Email de contacto', key: 'contactEmail' as const, type: 'email' },
                  { label: 'Máximo de estudiantes', key: 'maxStudents' as const, type: 'number' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                    <input
                      type={f.type}
                      value={settings[f.key] as string}
                      onChange={e => set(f.key, e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
                <div className="space-y-3 pt-2">
                  {[
                    { label: 'Modo mantenimiento', sublabel: 'Desactiva el acceso para todos los usuarios', key: 'maintenanceMode' as const },
                    { label: 'Registro abierto', sublabel: 'Permite que nuevos usuarios se registren', key: 'registrationOpen' as const },
                  ].map(t => (
                    <div key={t.key} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{t.label}</p>
                        <p className="text-xs text-gray-500">{t.sublabel}</p>
                      </div>
                      <Toggle value={settings[t.key] as boolean} onChange={v => set(t.key, v)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {active === 'security' && (
              <div className="space-y-5">
                <h2 className="text-base font-semibold text-gray-900 pb-3 border-b border-gray-100">Configuración de Seguridad</h2>
                <div className="space-y-3">
                  {[
                    { label: 'Verificación de email obligatoria', sublabel: 'Los usuarios deben verificar su email al registrarse', key: 'requireEmailVerification' as const },
                    { label: '2FA obligatorio para admins', sublabel: 'Requiere autenticación de dos factores para roles de administrador', key: 'twoFactorRequired' as const },
                  ].map(t => (
                    <div key={t.key} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{t.label}</p>
                        <p className="text-xs text-gray-500">{t.sublabel}</p>
                      </div>
                      <Toggle value={settings[t.key] as boolean} onChange={v => set(t.key, v)} />
                    </div>
                  ))}
                </div>
                {[
                  { label: 'Timeout de sesión (minutos)', key: 'sessionTimeout' as const },
                  { label: 'Intentos máximos de login', key: 'maxLoginAttempts' as const },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                    <input
                      type="number"
                      value={settings[f.key] as string}
                      onChange={e => set(f.key, e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            )}

            {active === 'appearance' && (
              <div className="space-y-5">
                <h2 className="text-base font-semibold text-gray-900 pb-3 border-b border-gray-100">Apariencia y Marca</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color primario</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={e => set('primaryColor', e.target.value)}
                      className="w-10 h-10 rounded border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.primaryColor}
                      onChange={e => set('primaryColor', e.target.value)}
                      className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo de la plataforma</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                    <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Arrastra o haz clic para subir</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG hasta 2MB. Recomendado: 200×60px</p>
                  </div>
                </div>
              </div>
            )}

            {active === 'email' && (
              <div className="space-y-5">
                <h2 className="text-base font-semibold text-gray-900 pb-3 border-b border-gray-100">Configuración SMTP</h2>
                {[
                  { label: 'Servidor SMTP', key: 'smtpHost' as const },
                  { label: 'Puerto', key: 'smtpPort' as const },
                  { label: 'Usuario', key: 'smtpUser' as const },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                    <input
                      type="text"
                      value={settings[f.key] as string}
                      onChange={e => set(f.key, e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña SMTP</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                  Enviar email de prueba
                </button>
              </div>
            )}

            {active === 'integrations' && (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-gray-900 pb-3 border-b border-gray-100">Integraciones</h2>
                {[
                  { name: 'Google Meet', desc: 'Videoclases integradas con Google Meet', key: 'googleMeetEnabled' as const, Icon: Video, color: 'text-green-600', bg: 'bg-green-50' },
                  { name: 'Microsoft Teams', desc: 'Videoclases y colaboración con Teams', key: 'teamsEnabled' as const, Icon: Briefcase, color: 'text-blue-700', bg: 'bg-blue-50' },
                  { name: 'OpenAI (ChatGPT)', desc: 'Asistente IA para estudiantes y profesores', key: 'openAiEnabled' as const, Icon: Bot, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map(intg => (
                  <div key={intg.key} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className={`w-10 h-10 rounded-lg ${intg.bg} flex items-center justify-center`}>
                      <intg.Icon size={20} className={intg.color} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{intg.name}</p>
                      <p className="text-xs text-gray-500">{intg.desc}</p>
                    </div>
                    <Toggle value={settings[intg.key] as boolean} onChange={v => set(intg.key, v)} />
                  </div>
                ))}
                {settings.openAiEnabled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">OpenAI API Key</label>
                    <input
                      type="text"
                      value={settings.openAiKey}
                      onChange={e => set('openAiKey', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            )}

            {active === 'billing' && (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-gray-900 pb-3 border-b border-gray-100">Plan & Facturación</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-blue-900 text-lg">Plan Enterprise</p>
                      <p className="text-blue-700 text-sm">Usuarios ilimitados · Soporte prioritario · SLA 99.9%</p>
                    </div>
                    <span className="text-2xl font-bold text-blue-900">$499/mes</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Gestionar plan</button>
                    <button className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg text-sm hover:bg-blue-100">Ver facturas</button>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Uso actual</h3>
                  {[
                    { label: 'Usuarios activos', used: 284, max: 'Ilimitado' },
                    { label: 'Almacenamiento', used: '45 GB', max: '500 GB' },
                    { label: 'Ancho de banda', used: '1.2 TB', max: '10 TB' },
                  ].map(u => (
                    <div key={u.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-700">{u.label}</span>
                      <span className="text-sm font-medium text-gray-900">{u.used} / {u.max}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {active === 'backup' && (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-gray-900 pb-3 border-b border-gray-100">Respaldo y Restauración</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Último respaldo', value: '2026-07-04 03:00', status: 'ok' },
                    { label: 'Tamaño del respaldo', value: '2.4 GB', status: 'ok' },
                    { label: 'Próximo respaldo', value: '2026-07-05 03:00', status: 'pending' },
                    { label: 'Retención', value: '30 días', status: 'ok' },
                  ].map(b => (
                    <div key={b.label} className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">{b.label}</p>
                      <p className="text-sm font-semibold text-gray-900">{b.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2">
                    <Database size={14} /> Crear respaldo ahora
                  </button>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                    Restaurar desde respaldo
                  </button>
                </div>
              </div>
            )}

            {active === 'api' && (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-gray-900 pb-3 border-b border-gray-100">API Keys</h2>
                <p className="text-sm text-gray-500">Gestiona las claves de API para integraciones externas.</p>
                <div className="space-y-3">
                  {[
                    { name: 'Integración ERP', key: 'cc360_live_abc123def456...', created: '2026-06-01', lastUsed: 'hace 2 horas' },
                    { name: 'App Móvil iOS', key: 'cc360_live_xyz789uvw012...', created: '2026-05-15', lastUsed: 'hace 1 día' },
                  ].map((k, i) => (
                    <div key={i} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900">{k.name}</p>
                        <button className="text-xs text-red-600 hover:underline">Revocar</button>
                      </div>
                      <p className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">{k.key}</p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-400">
                        <span>Creada: {k.created}</span>
                        <span>Último uso: {k.lastUsed}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                  <Key size={14} /> Crear nueva clave API
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
