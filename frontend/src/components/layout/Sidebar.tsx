'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard, BookOpen, BookMarked, MessageSquare, Award,
  Settings, Users, BarChart2, PlusCircle, GraduationCap,
  ChevronLeft, ChevronRight, ClipboardList, CalendarDays,
  MessagesSquare, FileText, Bell, ClipboardCheck,
  LineChart, ShieldCheck, UserCircle, CheckSquare2, Video,
  MessageCircle,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
  section?: string;
}

const navItems: NavItem[] = [
  { label: 'Inicio',          href: '/dashboard',    icon: <LayoutDashboard size={17} />, section: 'principal' },
  { label: 'Mis Cursos',      href: '/my-courses',   icon: <BookMarked size={17} />,      section: 'principal' },
  { label: 'Explorar',        href: '/courses',       icon: <BookOpen size={17} />,        section: 'principal' },
  { label: 'Calendario',      href: '/calendar',      icon: <CalendarDays size={17} />,    section: 'principal' },
  { label: 'Tareas',          href: '/assignments',   icon: <ClipboardList size={17} />,   section: 'academico' },
  { label: 'Quizzes',         href: '/quizzes',       icon: <ClipboardCheck size={17} />,  section: 'academico' },
  { label: 'Calificaciones',  href: '/grades',        icon: <BarChart2 size={17} />,       section: 'academico' },
  { label: 'Asistencia',      href: '/attendance',    icon: <CheckSquare2 size={17} />,    section: 'academico' },
  { label: 'Videoclases',     href: '/videoclases',   icon: <Video size={17} />,           section: 'academico' },
  { label: 'Foro',            href: '/forum',         icon: <MessagesSquare size={17} />,  section: 'academico' },
  { label: 'Mensajes',        href: '/messages',      icon: <MessageSquare size={17} />,   section: 'academico' },
  { label: 'Certificados',    href: '/certificates',  icon: <Award size={17} />,           section: 'academico' },
  { label: 'Crear Curso',     href: '/create-course', icon: <PlusCircle size={17} />,      section: 'gestion', roles: ['instructor', 'admin', 'superadmin'] },
  { label: 'Usuarios',        href: '/users',         icon: <Users size={17} />,           section: 'gestion', roles: ['admin', 'superadmin'] },
  { label: 'Analytics',       href: '/analytics',     icon: <LineChart size={17} />,       section: 'gestion', roles: ['admin', 'superadmin'] },
  { label: 'Admin',           href: '/admin',         icon: <ShieldCheck size={17} />,     section: 'gestion', roles: ['admin', 'superadmin'] },
  { label: 'Notificaciones',  href: '/notifications', icon: <Bell size={17} />,            section: 'gestion' },
  { label: 'Documentos',      href: '/documents',     icon: <FileText size={17} />,        section: 'gestion' },
  { label: 'Mi Perfil',       href: '/profile',       icon: <UserCircle size={17} />,      section: 'cuenta' },
  { label: 'Configuración',   href: '/settings',      icon: <Settings size={17} />,        section: 'cuenta' },
];

const sections: { key: string; label: string }[] = [
  { key: 'principal', label: 'Principal' },
  { key: 'academico',  label: 'Académico' },
  { key: 'gestion',    label: 'Gestión' },
  { key: 'cuenta',     label: 'Cuenta' },
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
        'transition-all duration-300 ease-in-out hidden md:flex',
        collapsed ? 'w-[64px]' : 'w-[240px]'
      )}
      style={{ backgroundColor: '#FAFAF8', borderRight: '1px solid #E8E8E2' }}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex items-center h-14 shrink-0 px-4',
          collapsed ? 'justify-center' : 'gap-3'
        )}
        style={{ borderBottom: '1px solid #E8E8E2' }}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#4A6FA5' }}>
          <GraduationCap size={17} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-bold text-sm leading-tight" style={{ color: '#1C2A3A' }}>Classroom</p>
            <p className="font-bold text-sm leading-tight" style={{ color: '#4A6FA5' }}>Cloud 360</p>
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
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest select-none" style={{ color: '#B0B8C4' }}>
                  {sec.label}
                </p>
              )}
              {collapsed && <div className="my-1 mx-2 h-px" style={{ backgroundColor: '#E8E8E2' }} />}
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
                      collapsed && 'justify-center px-0'
                    )}
                    style={isActive
                      ? { backgroundColor: '#EAF0F8', color: '#3A5580' }
                      : { color: '#5C7080' }
                    }
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = '#F4F4F0'; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                  >
                    <span className="shrink-0" style={{ color: isActive ? '#4A6FA5' : '#8A9BB0' }}>
                      {item.icon}
                    </span>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {isActive && !collapsed && (
                      <span className="absolute right-2.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#4A6FA5' }} />
                    )}
                    {collapsed && (
                      <span className="absolute left-full ml-2 px-2 py-1 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg" style={{ backgroundColor: '#2A3E5E' }}>
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
      <div className="p-2" style={{ borderTop: '1px solid #E8E8E2' }}>
        <button
          onClick={onToggle}
          className={cn(
            'w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-xs',
            collapsed && 'justify-center px-0'
          )}
          style={{ color: '#9AABB8' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F4F4F0')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
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
