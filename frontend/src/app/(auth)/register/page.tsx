'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GraduationCap, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres').regex(/[A-Z]/, 'Debe tener al menos una mayúscula').regex(/[0-9]/, 'Debe tener al menos un número'),
  confirmPassword: z.string(),
  terms: z.boolean().refine(v => v, 'Debes aceptar los términos'),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const password = watch('password', '');
  const strength = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-500'];
  const strengthLabels = ['Muy débil', 'Débil', 'Moderada', 'Fuerte'];

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await authApi.register({ name: data.name, email: data.email, password: data.password, role: 'student' });
      toast.success('¡Cuenta creada! Por favor inicia sesión.');
      router.push('/login');
    } catch (err: unknown) {
      const errData = (err as { response?: { data?: Record<string, string[]> } })?.response?.data;
      const msg = errData ? Object.values(errData).flat()[0] : 'Error al crear la cuenta';
      toast.error(msg as string);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800 p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white leading-none">Classroom Cloud 360</p>
              <p className="text-xs text-slate-400 mt-0.5">Crea tu cuenta gratis</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Crear cuenta</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-primary-600 font-medium hover:underline">Iniciar sesión</Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Nombre completo"
              type="text"
              placeholder="Juan Pérez"
              iconLeft={<User size={16} />}
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@email.com"
              iconLeft={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
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
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < strength ? strengthColors[strength - 1] : 'bg-slate-200 dark:bg-slate-700'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">{strength > 0 ? strengthLabels[strength - 1] : 'Ingresa una contraseña'}</p>
                </div>
              )}
            </div>

            <Input
              label="Confirmar contraseña"
              type="password"
              placeholder="••••••••"
              iconLeft={<Lock size={16} />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">Rol de cuenta</p>
              <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <div className="w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                Estudiante (público)
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                {...register('terms')}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Acepto los{' '}
                <Link href="#" className="text-primary-600 hover:underline">Términos de servicio</Link>{' '}
                y la{' '}
                <Link href="#" className="text-primary-600 hover:underline">Política de privacidad</Link>
              </span>
            </label>
            {errors.terms && <p className="text-xs text-red-500 -mt-2">{errors.terms.message}</p>}

            <Button type="submit" fullWidth loading={isLoading} size="lg">
              Crear cuenta gratis
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
