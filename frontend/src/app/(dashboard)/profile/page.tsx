'use client';

import { useState } from 'react';
import {
  User, Mail, Phone, Globe, MapPin, Camera,
  Award, BookOpen, Clock, Star, Edit3, Check,
  Linkedin, Github, Twitter, Shield, Target, Flame, TrendingUp, Library,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const roleColors: Record<string, string> = {
  superadmin: 'bg-red-100 text-red-700',
  admin: 'bg-purple-100 text-purple-700',
  instructor: 'bg-blue-100 text-blue-700',
  student: 'bg-green-100 text-green-700',
};

const roleLabels: Record<string, string> = {
  superadmin: 'Super Admin',
  admin: 'Administrador',
  instructor: 'Instructor',
  student: 'Estudiante',
};

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? '',
    bio: user?.bio ?? 'Apasionado por la tecnología y el aprendizaje continuo.',
    phone: user?.phone ?? '+56 9 1234 5678',
    country: user?.country ?? 'Chile',
    linkedin: 'linkedin.com/in/usuario',
    github: 'github.com/usuario',
    twitter: '@usuario',
  });

  const initials = (user?.name ?? 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const stats = user?.role === 'student'
    ? [
        { label: 'Cursos inscritos', value: '8', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Completados', value: '5', icon: Award, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Horas aprendidas', value: '124', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Certificados', value: '3', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
      ]
    : [
        { label: 'Cursos activos', value: '6', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Estudiantes', value: '284', icon: User, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Horas dictadas', value: '312', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Rating promedio', value: '4.8', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
      ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Cover */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl h-36 mb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)`
        }} />
        {/* Avatar */}
        <div className="absolute -bottom-10 left-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-2xl font-bold text-blue-700">
              {initials}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white hover:bg-blue-700">
              <Camera size={12} className="text-white" />
            </button>
          </div>
        </div>

        {/* Actions top right */}
        <div className="absolute top-3 right-3">
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur text-white rounded-lg text-sm hover:bg-white/30 transition-colors"
          >
            {editing ? <Check size={14} /> : <Edit3 size={14} />}
            {editing ? 'Guardar' : 'Editar perfil'}
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="px-6 mb-6">
        {editing ? (
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 bg-transparent focus:outline-none w-full mb-1"
          />
        ) : (
          <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
        )}
        <div className="flex items-center gap-3 mt-1">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleColors[user?.role ?? 'student']}`}>
            {roleLabels[user?.role ?? 'student']}
          </span>
          {user?.email_verified_at && (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <Shield size={11} /> Email verificado
            </span>
          )}
          <span className="text-xs text-gray-400">
            Miembro desde {user?.created_at ? new Date(user.created_at).toLocaleDateString('es-CL', { month: 'long', year: 'numeric' }) : '—'}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 px-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mx-auto mb-2`}>
              <s.icon size={18} className={s.color} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6">
        {/* Info Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Bio */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Acerca de mí</h3>
            {editing ? (
              <textarea
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-sm text-gray-600 leading-relaxed">{form.bio}</p>
            )}
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Información de contacto</h3>
            <div className="space-y-3">
              {[
                { icon: Mail, label: 'Email', value: user?.email ?? '', key: null, editable: false },
                { icon: Phone, label: 'Teléfono', value: form.phone, key: 'phone' as const, editable: true },
                { icon: Globe, label: 'País', value: form.country, key: 'country' as const, editable: true },
              ].map(f => (
                <div key={f.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <f.icon size={14} className="text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">{f.label}</p>
                    {editing && f.editable && f.key ? (
                      <input
                        value={form[f.key]}
                        onChange={e => setForm(prev => ({ ...prev, [f.key!]: e.target.value }))}
                        className="text-sm text-gray-900 border-b border-gray-200 bg-transparent focus:outline-none focus:border-blue-500 w-full"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">{f.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Redes Sociales</h3>
            <div className="space-y-3">
              {[
                { icon: Linkedin, label: 'LinkedIn', key: 'linkedin' as const, color: 'text-blue-600' },
                { icon: Github, label: 'GitHub', key: 'github' as const, color: 'text-gray-800' },
                { icon: Twitter, label: 'Twitter/X', key: 'twitter' as const, color: 'text-sky-500' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <s.icon size={18} className={s.color} />
                  {editing ? (
                    <input
                      value={form[s.key]}
                      onChange={e => setForm(prev => ({ ...prev, [s.key]: e.target.value }))}
                      className="flex-1 text-sm border-b border-gray-200 bg-transparent focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{form[s.key]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Achievements */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Logros</h3>
            <div className="space-y-2">
              {[
                { Icon: Target, name: 'Primer curso', desc: 'Completaste tu primer curso', color: 'text-blue-600', bg: 'bg-blue-50' },
                { Icon: Flame, name: 'Racha de 7 días', desc: '7 días seguidos de estudio', color: 'text-orange-500', bg: 'bg-orange-50' },
                { Icon: Star, name: 'Estudiante destacado', desc: 'Top 10% de tu cohorte', color: 'text-amber-500', bg: 'bg-amber-50' },
                { Icon: Library, name: 'Bibliófilo', desc: '10 cursos completados', color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className={`w-8 h-8 rounded-lg ${a.bg} flex items-center justify-center flex-shrink-0`}>
                    <a.Icon size={16} className={a.color} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{a.name}</p>
                    <p className="text-xs text-gray-500">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Actividad reciente</h3>
            <div className="space-y-2">
              {[
                { text: 'Completaste "React Hooks"', time: 'Hace 2 horas', color: 'bg-green-500' },
                { text: 'Obtuvo 88% en quiz TypeScript', time: 'Ayer', color: 'bg-blue-500' },
                { text: 'Se inscribió en Python DS', time: 'Hace 3 días', color: 'bg-purple-500' },
                { text: 'Descargó certificado React', time: 'Hace 1 semana', color: 'bg-amber-500' },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full ${a.color} mt-1.5 flex-shrink-0`} />
                  <div>
                    <p className="text-sm text-gray-700">{a.text}</p>
                    <p className="text-xs text-gray-400">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
