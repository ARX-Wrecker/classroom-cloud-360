'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard, BookOpen, BookMarked, MessageSquare, Award,
  Settings, Users, BarChart3, PlusCircle, GraduationCap,
  ChevronLeft, ChevronRight, ClipboardList, Calendar,
  MessageCircle, FileText, Bell, Home, ClipboardCheck,
  TrendingUp, ShieldCheck, User, CheckSquare, Video,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
  section?: string;
}

const navItems: NavItem[] = [
  { label: 'Inicio', href: '/dashboard', icon: <Home size={18} />, section: 'principal' },
  { label: 'Mis Cursos', href: '/my-courses', icon: <BookMarked size={18} />, section: 'principal' },
  { label: 'Explorar', href: '/courses', icon: <BookOpen size={18} />, section: 'principal' },
  { label: 'Calendario', href: '/calendar', icon: <Calendar size={18} />, section: 'principal' },
  { label: 'Tareas', href: '/assignments', icon: <ClipboardList size={18} />, section: 'academico' },
  { label: 'Quizzes', href: '/quizzes', icon: <ClipboardCheck size={18} />, section: 'academico' },
  { label: 'Calificaciones', href: '/grades', icon: <BarChart3 size={18} />, section: 'academico' },
  { label: 'Asistencia', href: '/attendance', icon: <CheckSquare size={18} />, section: 'academico' },
  { label: 'Videoclases', href: '/videoclases', icon: <Video size={18} />, section: 'academico' },
  { label: 'Foro', href: '/forum', icon: <MessageCircle size={18} />, section: 'academico' },
  { label: 'Mensajes', href: '/messages', icon: <MessageSquare size={18} />, section: 'academico' },
  { label: 'Certificados', href: '/certificates', icon: <Award size={18} />, section: 'academico' },
  { label: 'Crear Curso', href: '/create-course', icon: <PlusCircle size={18} />, section: 'gestion', roles: ['instructor', 'admin', 'superadmin'] },
  { label: 'Usuarios', href: '/users', icon: <Users size={18} />, section: 'gestion', roles: ['admin', 'superadmin'] },
  { label: 'Analytics', href: '/analytics', icon: <TrendingUp size={18} />, section: 'gestion', roles: ['admin', 'superadmin'] },
  { label: 'Admin', href: '/admin', icon: <ShieldCheck size={18} />, section: 'gestion', roles: ['admin', 'superadmin'] },
  { label: 'Notificaciones', href: '/notifications', icon: <Bell size={18} />, section: 'gestion' },
  { label: 'Documentos', href: '/documents', icon: <FileText size={18} />, section: 'gestion' },
  { label: 'Mi Perfil', href: '/profile', icon: <User size={18} />, section: 'cuenta' },
  { label: 'Configuración', href: '/settings', icon: <Settings size={18} />, section: 'cuenta' },
];

const sections: { key: string; label: string }[] = [
  { key: 'principal', label: 'Principal' },
  { key: 'academico', label: 'Académico' },
  { key: 'gestion', label: 'Gestión' },
  { key: 'cuenta', label: 'Cuenta' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const visibleItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role ?? '');
  });

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full z-30 flex flex-col',
        'bg-white border-r border-slate-200',
        'transition-all duration-300 ease-in-out hidden md:flex',
        collapsed ? 'w-[64px]' : 'w-[240px]'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-14 border-b border-slate-200 shrink-0 px-4',
        collapsed ? 'justify-center' : 'gap-3'
      )}>
        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shrink-0">
          <GraduationCap size={17} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-bold text-slate-800 text-sm leading-tight">Classroom</p>
            <p className="font-bold text-primary-600 text-sm leading-tight">Cloud 360</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {sections.map((sec) => {
          const items = visibleItems.filter((i) => i.section === sec.key);
          if (items.length === 0) return null;
          return (
            <div key={sec.key} className="mb-1">
              {!collapsed && (
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400 select-none">
                  {sec.label}
                </p>
              )}
              {collapsed && <div className="my-1 mx-2 h-px bg-slate-100" />}
              {items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-100 group relative my-0.5',
                      isActive
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800',
                      collapsed && 'justify-center px-0'
                    )}
                  >
                    <span className={cn('shrink-0', isActive ? 'text-primary-600' : 'text-slate-500 group-hover:text-slate-700')}>
                      {item.icon}
                    </span>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {isActive && !collapsed && (
                      <span className="absolute right-2.5 w-1.5 h-1.5 rounded-full bg-primary-500" />
                    )}
                    {collapsed && (
                      <span className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-slate-200">
        <button
          onClick={onToggle}
          className={cn(
            'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all text-xs',
            collapsed && 'justify-center px-0'
          )}
        >
          {collapsed ? <ChevronRight size={15} /> : (
            <>
              <ChevronLeft size={15} />
              <span>Contraer</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
