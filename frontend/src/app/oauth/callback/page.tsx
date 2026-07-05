'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/lib/api';
import { GraduationCap, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

function OAuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error || !token) {
      toast.error('Error al autenticar con el proveedor. Inténtalo de nuevo.');
      router.replace('/login');
      return;
    }

    const finalize = async () => {
      try {
        // Store token
        localStorage.setItem('cc360_token', token);
        document.cookie = `cc360_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

        // Fetch user profile
        const res = await authApi.me();
        const user = res.data?.data ?? res.data;
        setAuth(user, token);

        toast.success(`¡Bienvenido, ${user.name}!`);
        router.replace('/dashboard');
      } catch {
        toast.error('No se pudo completar la autenticación');
        router.replace('/login');
      }
    };

    finalize();
  }, [searchParams, router, setAuth]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: '#F2F2EE' }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#4A6FA5' }}>
        <GraduationCap size={24} className="text-white" />
      </div>
      <div className="flex items-center gap-3" style={{ color: '#4A6FA5' }}>
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm font-medium">Completando autenticación...</span>
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F2F2EE' }}>
        <Loader2 size={24} className="animate-spin" style={{ color: '#4A6FA5' }} />
      </div>
    }>
      <OAuthCallbackInner />
    </Suspense>
  );
}
