'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, LogOut, User, Settings, ChevronDown, Menu, GraduationCap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { getRoleLabel } from '@/lib/utils';

interface HeaderProps {
  sidebarWidth: number;
  onMobileMenuOpen?: () => void;
}

export function Header({ sidebarWidth, onMobileMenuOpen }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/courses?q=${encodeURIComponent(search)}`);
  };

  return (
    <header
      className="fixed top-0 right-0 h-14 z-20 flex items-center gap-3 px-4 bg-white border-b border-slate-200 transition-all duration-300"
      style={{ left: sidebarWidth }}
    >
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuOpen}
        className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-all"
      >
        <Menu size={18} />
      </button>

      {/* Mobile logo */}
      <div className="md:hidden flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
          <GraduationCap size={15} className="text-white" />
        </div>
        <span className="font-bold text-slate-800 text-sm">CC360</span>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="relative flex-1 max-w-sm hidden sm:block">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar cursos, temas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-4 py-1.5 text-sm bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white focus:border-primary-300 text-slate-800 placeholder:text-slate-400 transition-all"
        />
      </form>

      <div className="flex items-center gap-1 ml-auto">
        {/* Notifications */}
        <button
          onClick={() => router.push('/notifications')}
          className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all"
        >
          <Bell size={17} />
        </button>

        {/* User menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 ml-1 pl-2 pr-2.5 py-1 rounded-lg hover:bg-slate-100 transition-all">
              <Avatar src={user?.avatar} name={user?.name} size="sm" />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 leading-none">{user?.name?.split(' ')[0]}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{getRoleLabel(user?.role ?? '')}</p>
              </div>
              <ChevronDown size={13} className="text-slate-400" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[200px] bg-white rounded-xl shadow-lg border border-slate-200 p-1.5 z-50 animate-fade-in"
              align="end"
              sideOffset={6}
            >
              <div className="px-3 py-2 mb-1 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
              <DropdownMenu.Item
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer outline-none"
                onSelect={() => router.push('/settings')}
              >
                <User size={14} className="text-slate-500" /> Mi perfil
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer outline-none"
                onSelect={() => router.push('/settings')}
              >
                <Settings size={14} className="text-slate-500" /> Configuración
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-slate-100" />
              <DropdownMenu.Item
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer outline-none"
                onSelect={handleLogout}
              >
                <LogOut size={14} /> Cerrar sesión
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
