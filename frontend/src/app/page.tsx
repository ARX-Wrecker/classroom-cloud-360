import Link from 'next/link';
import {
  BookOpen, Users, Award, Zap, Globe, Shield, BarChart3, Clock, Star,
  ArrowRight, GraduationCap, Play,
} from 'lucide-react';

const features = [
  { icon: BookOpen, title: 'Contenido de calidad', desc: 'Cursos creados por expertos de la industria con material actualizado.' },
  { icon: Users, title: 'Aprendizaje colaborativo', desc: 'Foros, mensajería y grupos de estudio para aprender en comunidad.' },
  { icon: Award, title: 'Certificados verificables', desc: 'Obtén certificados con código QR verificable y compartibles en LinkedIn.' },
  { icon: Zap, title: 'A tu propio ritmo', desc: 'Aprende cuando quieras, donde quieras, en cualquier dispositivo.' },
  { icon: Globe, title: 'Contenido en español', desc: 'Toda la plataforma y los cursos disponibles en español latinoamericano.' },
  { icon: BarChart3, title: 'Seguimiento de progreso', desc: 'Analytics detallados de tu aprendizaje y progreso por curso.' },
];

const stats = [
  { value: '50,000+', label: 'Estudiantes activos' },
  { value: '1,200+', label: 'Cursos disponibles' },
  { value: '300+', label: 'Instructores expertos' },
  { value: '98%', label: 'Tasa de satisfacción' },
];

const mockCourses = [
  { id: 1, title: 'Desarrollo Web Full Stack con Next.js 15', category: 'Desarrollo', level: 'Intermedio', price: 'Gratis', students: 3420, rating: 4.9 },
  { id: 2, title: 'Data Science con Python y Machine Learning', category: 'Datos', level: 'Avanzado', price: '$49.990', students: 2180, rating: 4.8 },
  { id: 3, title: 'Diseño UX/UI con Figma desde cero', category: 'Diseño', level: 'Principiante', price: 'Gratis', students: 5600, rating: 4.9 },
  { id: 4, title: 'Marketing Digital y Redes Sociales', category: 'Marketing', level: 'Principiante', price: '$29.990', students: 1890, rating: 4.7 },
  { id: 5, title: 'Seguridad Informática y Ethical Hacking', category: 'Seguridad', level: 'Avanzado', price: '$59.990', students: 980, rating: 4.8 },
  { id: 6, title: 'Inteligencia Artificial con Python', category: 'IA', level: 'Intermedio', price: 'Gratis', students: 4200, rating: 4.9 },
];

const levelColors: Record<string, string> = {
  Principiante: 'bg-emerald-100 text-emerald-700',
  Intermedio: 'bg-amber-100 text-amber-700',
  Avanzado: 'bg-red-100 text-red-700',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">Classroom Cloud 360</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors">Características</Link>
            <Link href="#courses" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors">Cursos</Link>
            <Link href="#stats" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors">Estadísticas</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary-600 transition-colors">
              Iniciar sesión
            </Link>
            <Link href="/register" className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
              Comenzar gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdi02aC02djZoNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-primary-100 dark:border-primary-800">
            <Zap size={12} />
            La plataforma LMS más moderna de Latinoamérica
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
            La plataforma de{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
              aprendizaje
            </span>{' '}
            del futuro
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Aprende las habilidades más demandadas del mercado con cursos en español, certificados verificables y una comunidad de miles de estudiantes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5"
            >
              Comenzar gratis
              <ArrowRight size={18} />
            </Link>
            <Link
              href="#courses"
              className="flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-8 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              <Play size={16} className="text-primary-500" />
              Ver cursos
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 mt-12 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex -space-x-2">
              {['A', 'B', 'C', 'D'].map((l) => (
                <div key={l} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 border-2 border-white dark:border-slate-950 flex items-center justify-center text-white text-xs font-bold">
                  {l}
                </div>
              ))}
            </div>
            <span>+50,000 estudiantes ya aprenden con nosotros</span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star size={14} fill="currentColor" />
              <span className="text-slate-700 dark:text-slate-300 font-semibold">4.9/5</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-16 bg-gradient-to-r from-primary-500 to-secondary-600">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-white mb-1">{s.value}</p>
              <p className="text-primary-100 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Todo lo que necesitas para aprender</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Diseñado para estudiantes modernos que quieren aprender de manera efectiva y flexible.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700/50 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200">
                <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                  <f.icon size={22} className="text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Preview */}
      <section id="courses" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Cursos más populares</h2>
              <p className="text-slate-500 dark:text-slate-400">Aprende las habilidades más demandadas del mercado</p>
            </div>
            <Link href="/courses" className="hidden sm:flex items-center gap-1.5 text-primary-600 font-medium text-sm hover:text-primary-700 transition-colors">
              Ver todos <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCourses.map((course) => (
              <Link key={course.id} href="/login" className="group block bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-card overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
                <div className="h-40 bg-gradient-to-br from-primary-400 to-secondary-500 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen size={40} className="text-white/30" />
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${course.price === 'Gratis' ? 'bg-emerald-500 text-white' : 'bg-white/90 text-slate-800'}`}>
                      {course.price}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${levelColors[course.level]}`}>{course.level}</span>
                    <span className="text-xs text-slate-400">{course.category}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{course.title}</h3>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Users size={12} />
                      {course.students.toLocaleString()} estudiantes
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={12} fill="currentColor" />
                      <span className="text-slate-600 dark:text-slate-400">{course.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Listo para empezar tu viaje de aprendizaje?</h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            Únete a más de 50,000 estudiantes que ya están transformando sus carreras con Classroom Cloud 360.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-primary-600 font-semibold px-8 py-3.5 rounded-xl hover:bg-primary-50 transition-all shadow-lg"
          >
            Crear cuenta gratis
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <GraduationCap size={18} className="text-white" />
              </div>
              <span className="font-bold text-white">Classroom Cloud 360</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="#" className="hover:text-white transition-colors">Términos</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacidad</Link>
              <Link href="#" className="hover:text-white transition-colors">Soporte</Link>
              <Link href="#" className="hover:text-white transition-colors">Contacto</Link>
            </div>
            <p className="text-sm">© 2024 Classroom Cloud 360. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
