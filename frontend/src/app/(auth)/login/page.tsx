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
import { GraduationCap, Mail, Lock, Eye, EyeOff, BookOpen, Award, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  remember: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

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
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white dark:bg-slate-900">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white leading-none">Classroom Cloud 360</p>
              <p className="text-xs text-slate-400 mt-0.5">Plataforma de aprendizaje</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Iniciar sesión</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-primary-600 font-medium hover:underline">
              Regístrate gratis
            </Link>
          </p>

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
                <input type="checkbox" {...register('remember')} className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Recordarme</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-primary-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button type="submit" fullWidth loading={isLoading} size="lg">
              Iniciar sesión
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Credenciales de demostración:</p>
            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
              <p>Admin: <span className="font-mono">admin@classroomcloud360.com</span> / <span className="font-mono">Admin123!</span></p>
              <p>Instructor: <span className="font-mono">maria.gonzalez@classroomcloud360.com</span> / <span className="font-mono">Instructor123!</span></p>
              <p>Estudiante: <span className="font-mono">ana.lopez@example.com</span> / <span className="font-mono">Student123!</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${80 + i * 40}px`,
                height: `${80 + i * 40}px`,
                top: `${10 + i * 15}%`,
                left: `${5 + i * 10}%`,
                opacity: 0.3 - i * 0.04,
              }}
            />
          ))}
        </div>

        <div className="relative text-center text-white max-w-sm">
          <div className="flex justify-center gap-4 mb-8">
            {[BookOpen, Award, Users].map((Icon, i) => (
              <div key={i} className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                <Icon size={28} className="text-white" />
              </div>
            ))}
          </div>
          <h2 className="text-3xl font-bold mb-4">Aprende sin límites</h2>
          <p className="text-primary-100 leading-relaxed">
            Accede a más de 1,200 cursos en español, obtén certificados verificables y únete a la comunidad de aprendizaje más grande de Latinoamérica.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { value: '50K+', label: 'Estudiantes' },
              { value: '1.2K+', label: 'Cursos' },
              { value: '98%', label: 'Satisfacción' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-3">
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-primary-200">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full border-2 border-slate-200 border-t-primary-500 w-8 h-8" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
