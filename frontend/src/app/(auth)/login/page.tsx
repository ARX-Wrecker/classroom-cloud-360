'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  GraduationCap, Mail, Lock, Eye, EyeOff,
  BookOpen, Award, Users, ShieldCheck, Zap, Globe,
} from 'lucide-react';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  remember: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '') ?? 'http://localhost:8003/api';

function OAuthButton({
  provider,
  label,
  icon,
}: {
  provider: 'google' | 'microsoft';
  label: string;
  icon: React.ReactNode;
}) {
  const handleOAuth = () => {
    window.location.href = `${API_URL}/auth/${provider}/redirect`;
  };
  return (
    <button
      type="button"
      onClick={handleOAuth}
      className="flex items-center justify-center gap-3 w-full py-2.5 px-4 border border-[#DDDDD8] rounded-lg bg-white hover:bg-[#F8F8F5] transition-colors text-sm font-medium text-[#1C2A3A]"
    >
      {icon}
      {label}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.4 2H2v9.4h9.4V2z" fill="#F25022"/>
      <path d="M22 2h-9.4v9.4H22V2z" fill="#7FBA00"/>
      <path d="M11.4 12.6H2V22h9.4v-9.4z" fill="#00A4EF"/>
      <path d="M22 12.6h-9.4V22H22v-9.4z" fill="#FFB900"/>
    </svg>
  );
}

function LoginForm() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
      toast.success('¡Bienvenido de vuelta!');
      router.push(redirect);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      toast.error(msg || 'Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F2F2EE' }}>
      {/* Left — Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#4A6FA5' }}>
              <GraduationCap size={22} className="text-white" />
            </div>
            <div>
              <p className="font-bold leading-none" style={{ color: '#1C2A3A' }}>Classroom Cloud 360</p>
              <p className="text-xs mt-0.5" style={{ color: '#8A9BB0' }}>Plataforma de aprendizaje</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-1" style={{ color: '#1C2A3A' }}>Iniciar sesión</h1>
          <p className="text-sm mb-6" style={{ color: '#6A7D92' }}>
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="font-medium hover:underline" style={{ color: '#4A6FA5' }}>
              Regístrate gratis
            </Link>
          </p>

          {/* OAuth buttons */}
          <div className="space-y-2.5 mb-6">
            <OAuthButton provider="google" label="Continuar con Google" icon={<GoogleIcon />} />
            <OAuthButton provider="microsoft" label="Continuar con Microsoft" icon={<MicrosoftIcon />} />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ backgroundColor: '#E5E5E0' }} />
            <span className="text-xs" style={{ color: '#9AABB8' }}>o con tu correo</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#E5E5E0' }} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@email.com"
              iconLeft={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Contraseña"
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              iconLeft={<Lock size={16} />}
              iconRight={
                <button type="button" onClick={() => setShowPass(!showPass)} className="text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('remember')} className="w-4 h-4 rounded border-slate-300 focus:ring-2" style={{ accentColor: '#4A6FA5' }} />
                <span className="text-sm" style={{ color: '#6A7D92' }}>Recordarme</span>
              </label>
              <Link href="/forgot-password" className="text-sm hover:underline" style={{ color: '#4A6FA5' }}>
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg font-semibold text-white transition-opacity disabled:opacity-60"
              style={{ backgroundColor: '#4A6FA5' }}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: '#F5F7FA', border: '1px solid #E5EBF4' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: '#7A8FA4' }}>Credenciales de demostración:</p>
            <div className="space-y-1 text-xs" style={{ color: '#5A6E82' }}>
              <p>Admin: <span className="font-mono">admin@classroomcloud360.com</span> / <span className="font-mono">Admin123!</span></p>
              <p>Instructor: <span className="font-mono">maria.gonzalez@classroomcloud360.com</span> / <span className="font-mono">Instructor123!</span></p>
              <p>Estudiante: <span className="font-mono">ana.lopez@example.com</span> / <span className="font-mono">Student123!</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Panel visual */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden" style={{ backgroundColor: '#3A5580' }}>
        <div className="absolute inset-0 opacity-5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${100 + i * 60}px`, height: `${100 + i * 60}px`,
                top: `${8 + i * 14}%`, left: `${4 + i * 8}%`,
                backgroundColor: 'white', opacity: 0.15,
              }}
            />
          ))}
        </div>

        <div className="relative text-center max-w-sm" style={{ color: 'white' }}>
          <div className="flex justify-center gap-4 mb-8">
            {[
              { Icon: BookOpen, label: 'Cursos' },
              { Icon: Award, label: 'Certificados' },
              { Icon: Users, label: 'Comunidad' },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                  <Icon size={26} className="text-white" />
                </div>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</span>
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-bold mb-4">Aprende sin límites</h2>
          <p className="leading-relaxed text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Accede a cursos en español, obtén certificados verificables y únete a la comunidad de aprendizaje.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { value: '50K+', label: 'Estudiantes' },
              { value: '1.2K+', label: 'Cursos' },
              { value: '98%', label: 'Satisfacción' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> Seguro</span>
            <span className="flex items-center gap-1.5"><Zap size={14} /> Rápido</span>
            <span className="flex items-center gap-1.5"><Globe size={14} /> Gratis</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full border-2 border-slate-200 w-8 h-8" style={{ borderTopColor: '#4A6FA5' }} /></div>}>
      <LoginForm />
    </Suspense>
  );
}
