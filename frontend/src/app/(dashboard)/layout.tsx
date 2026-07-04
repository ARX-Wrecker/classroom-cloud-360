'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [sidebarPx, setSidebarPx] = useState(240);
  const { user, fetchMe } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setHydrated(true);
    const token = localStorage.getItem('cc360_token');
    if (!token) { router.push('/login'); return; }
    if (!user) fetchMe();
  }, []);

  useEffect(() => {
    const updateSidebar = () => {
      if (window.innerWidth < 768) setSidebarPx(0);
      else setSidebarPx(collapsed ? 64 : 240);
    };
    updateSidebar();
    window.addEventListener('resize', updateSidebar);
    return () => window.removeEventListener('resize', updateSidebar);
  }, [collapsed]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <p className="text-slate-500 text-sm">Cargando plataforma...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="transition-all duration-300 pb-16 md:pb-0" style={{ marginLeft: sidebarPx }}>
        <Header sidebarWidth={sidebarPx} />
        <main className="pt-14 min-h-screen">
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
