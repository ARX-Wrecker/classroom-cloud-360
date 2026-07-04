'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, BookMarked, MessageSquare, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const MOBILE_ITEMS = [
  { label: 'Inicio', href: '/dashboard', icon: <Home size={20} /> },
  { label: 'Explorar', href: '/courses', icon: <BookOpen size={20} /> },
  { label: 'Mis cursos', href: '/my-courses', icon: <BookMarked size={20} /> },
  { label: 'Mensajes', href: '/messages', icon: <MessageSquare size={20} /> },
  { label: 'Ajustes', href: '/settings', icon: <Settings size={20} /> },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 flex md:hidden">
      {MOBILE_ITEMS.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors',
              isActive ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'
            )}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
