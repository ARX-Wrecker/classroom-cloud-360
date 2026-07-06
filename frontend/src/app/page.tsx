'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import {
  BookOpen, Users, Award, Zap, Globe, Shield, BarChart3, Star,
  ArrowRight, GraduationCap, Play, Lock,
  TrendingUp, Terminal, Server, CheckCircle,
} from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Seguimiento de progreso',
    desc: 'Analytics detallados de tu aprendizaje y progreso por curso.',
    img: '/qa.jpg',
  },
  {
    icon: BookOpen,
    title: 'Contenido de calidad',
    desc: 'Cursos creados por expertos de la industria con material actualizado.',
    img: '/seguimiento.jpg',
  },
  {
    icon: Users,
    title: 'Aprendizaje colaborativo',
    desc: 'Foros, mensajería y grupos de estudio para aprender en comunidad.',
    img: '/aprendizaje-colaborativo.jpg',
  },
  {
    icon: Award,
    title: 'Certificados verificables',
    desc: 'Obtén certificados con código QR verificable y compartibles en LinkedIn.',
    img: '/certificados.jpg',
  },
  {
    icon: Zap,
    title: 'A tu propio ritmo',
    desc: 'Aprende cuando quieras, donde quieras, en cualquier dispositivo.',
    img: '/atupropio_ritmo.jpg',
  },
  {
    icon: Globe,
    title: 'Contenido en Español e Inglés',
    desc: 'Toda la plataforma y los cursos disponibles en español e inglés para mayor alcance.',
    img: '/spanish-english.jpg',
  },
];

const mockCourses = [
  {
    id: 2, icon: Lock,
    title: 'Ciberseguridad y Ethical Hacking',
    category: 'Seguridad', level: 'Avanzado',
    students: 2750, rating: 4.8,
    color: 'from-red-500 to-rose-600',
  },
  {
    id: 5, icon: Server,
    title: 'Infraestructura de Servidores y Datacenter',
    category: 'Infraestructura', level: 'Intermedio',
    students: 1430, rating: 4.7,
    color: 'from-slate-500 to-gray-600',
  },
  {
    id: 7, icon: Shield,
    title: 'Informática Básica · Intermedia · Avanzada · macOS · Seguridad',
    category: 'Computación', level: 'Principiante',
    students: 4100, rating: 4.8,
    color: 'from-teal-500 to-cyan-600',
  },
  {
    id: 9, icon: Terminal,
    title: 'Scripting con PowerShell',
    category: 'Automatización', level: 'Intermedio',
    students: 980, rating: 4.6,
    color: 'from-indigo-500 to-blue-700',
  },
];

const levelColors: Record<string, string> = {
  Principiante: 'bg-emerald-100 text-emerald-700',
  Intermedio:   'bg-amber-100 text-amber-700',
  Avanzado:     'bg-red-100 text-red-700',
};

export default function LandingPage() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let pos = 0;
    const speed = 0.5;
    const step = () => {
      pos += speed;
      if (pos >= track.scrollWidth / 2) pos = 0;
      track.style.transform = `translateX(-${pos}px)`;
      requestAnimationFrame(step);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8', color: '#1C2A3A' }}>

      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderBottom: '1px solid #E8E8E2' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo 3D flotante en el navbar */}
            <div className="relative" style={{ filter: 'drop-shadow(0 4px 12px rgba(74,111,165,0.45))' }}>
              <Image
                src="/logo-cc360.jpg"
                alt="Classroom Cloud 360"
                width={44}
                height={44}
                className="rounded-xl object-cover"
                style={{ animation: 'logoFloat 3s ease-in-out infinite' }}
                priority
              />
            </div>
            <span className="font-bold text-[#1C2A3A]">Classroom Cloud 360</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="#quienes-somos" className="text-sm text-[#6A7D92] hover:text-[#4A6FA5] transition-colors">Quiénes Somos</Link>
            <Link href="#mision"        className="text-sm text-[#6A7D92] hover:text-[#4A6FA5] transition-colors">Nuestra Misión</Link>
            <Link href="#courses"       className="text-sm text-[#6A7D92] hover:text-[#4A6FA5] transition-colors">Cursos</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-[#1C2A3A] hover:text-[#4A6FA5] transition-colors">
              Iniciar sesión
            </Link>
            <Link href="/register" className="text-sm font-semibold px-4 py-2 rounded-xl text-white transition-all hover:-translate-y-0.5" style={{ backgroundColor: '#4A6FA5' }}>
              Comenzar gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative pt-28 pb-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #F5F7FA 0%, #FAFAF8 50%, #EAF0F8 100%)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">

            {/* Text */}
            <div className="flex-1 text-center lg:text-left">
              <Link
                href="https://www.superprof.cl/hola-soy-ingeniero-computacion-informatica-con-mas-anos-experiencia-tecnologias-informacion-cuento.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 hover:opacity-80 transition-opacity"
                style={{ backgroundColor: '#FFF8E7', color: '#92400E', border: '1px solid #FCD34D' }}
              >
                <Star size={12} fill="currentColor" className="text-amber-500" />
                Instructor verificado en Superprof · 5 estrellas
              </Link>

              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6" style={{ color: '#1C2A3A' }}>
                La plataforma de{' '}
                <span style={{ color: '#4A6FA5' }}>aprendizaje</span>{' '}
                del futuro
              </h1>

              <p className="text-lg mb-10 max-w-xl" style={{ color: '#6A7D92', lineHeight: '1.7' }}>
                Aprende las habilidades más demandadas del mercado con cursos en español, certificados verificables y una comunidad de miles de estudiantes. <strong style={{ color: '#4A6FA5' }}>100% gratuito.</strong>
              </p>

              <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4 mb-10">
                <Link
                  href="/register"
                  className="flex items-center gap-2 font-semibold px-8 py-3.5 rounded-xl text-white shadow-lg transition-all hover:-translate-y-0.5"
                  style={{ backgroundColor: '#4A6FA5', boxShadow: '0 8px 24px rgba(74,111,165,0.3)' }}
                >
                  Comenzar gratis
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="#courses"
                  className="flex items-center gap-2 font-semibold px-8 py-3.5 rounded-xl transition-all hover:bg-[#F0F4FA]"
                  style={{ backgroundColor: 'white', color: '#4A6FA5', border: '1px solid #C8D8EE' }}
                >
                  <Play size={16} style={{ color: '#4A6FA5' }} />
                  Ver cursos
                </Link>
              </div>

              <div className="flex items-center gap-5 text-sm" style={{ color: '#8A9BB0' }}>
                <div className="flex -space-x-2">
                  {['A','B','C','D'].map((l) => (
                    <div key={l} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: '#4A6FA5' }}>
                      {l}
                    </div>
                  ))}
                </div>
                <span>+50,000 estudiantes activos</span>
                <div className="flex items-center gap-1">
                  <Star size={13} fill="#F59E0B" className="text-amber-400" />
                  <span className="font-semibold" style={{ color: '#1C2A3A' }}>4.9/5</span>
                </div>
              </div>
            </div>

            {/* Logo 3D grande flotante */}
            <div className="flex-shrink-0 flex flex-col items-center gap-4">
              <div
                className="relative"
                style={{
                  filter: 'drop-shadow(0 32px 64px rgba(74,111,165,0.45)) drop-shadow(0 8px 24px rgba(74,111,165,0.3))',
                  animation: 'heroFloat 4s ease-in-out infinite',
                }}
              >
                {/* Halo glow */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(74,111,165,0.25) 0%, transparent 70%)',
                    transform: 'scale(1.6)',
                    zIndex: 0,
                    animation: 'pulse 4s ease-in-out infinite',
                  }}
                />
                <Image
                  src="/logo-cc360.jpg"
                  alt="Classroom Cloud 360"
                  width={380}
                  height={380}
                  className="relative rounded-3xl object-cover"
                  style={{ zIndex: 1 }}
                  priority
                />
              </div>
              <div className="flex gap-3 mt-2">
                {[
                  { Icon: CheckCircle, text: 'Gratis',       color: '#059669' },
                  { Icon: Award,       text: 'Certificados', color: '#4A6FA5' },
                  { Icon: Globe,       text: 'En español',   color: '#7C3AED' },
                ].map(({ Icon, text, color }) => (
                  <div key={text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white shadow-md" style={{ color, border: `1px solid ${color}33` }}>
                    <Icon size={12} />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Quiénes Somos ─── */}
      <section id="quienes-somos" className="py-20" style={{ backgroundColor: '#3A5580' }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Quiénes Somos?</h2>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: '#A3BDE1', lineHeight: '1.8' }}>
            Somos una plataforma educativa chilena creada por un Ingeniero en Computación e Informática con más de 15 años de experiencia en Tecnologías de la Información. Nuestra misión es democratizar el acceso al conocimiento tecnológico en América Latina.
          </p>
        </div>
      </section>

      {/* ─── Nuestra Misión ─── */}
      <section id="mision" className="py-20" style={{ backgroundColor: '#EAF0F8' }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#1C2A3A' }}>Nuestra Misión</h2>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: '#6A7D92', lineHeight: '1.8' }}>
            Brindar educación tecnológica de alta calidad, completamente gratuita, con certificados verificables y en dos idiomas — Español e Inglés — para que ninguna barrera económica ni lingüística detenga tu crecimiento profesional.
          </p>
        </div>
      </section>

      {/* ─── Features con imágenes ─── */}
      <section id="features" className="py-24" style={{ backgroundColor: '#F4F4F0' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1C2A3A' }}>Todo lo que necesitas para aprender</h2>
            <p className="max-w-xl mx-auto" style={{ color: '#6A7D92' }}>
              Diseñado para estudiantes modernos que quieren aprender de manera efectiva y flexible.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-200"
                style={{ border: '1px solid #E8E8E2', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
              >
                <div className="h-40 overflow-hidden relative">
                  <Image
                    src={f.img}
                    alt={f.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.15))' }} />
                </div>
                <div className="p-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: '#EAF0F8' }}>
                    <f.icon size={20} style={{ color: '#4A6FA5' }} />
                  </div>
                  <h3 className="font-semibold mb-1.5" style={{ color: '#1C2A3A' }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6A7D92' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Instructor Superprof ─── */}
      <section id="instructor" className="py-16 bg-white" style={{ borderTop: '1px solid #E8E8E2', borderBottom: '1px solid #E8E8E2' }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#8A9BB0' }}>Instructor Principal</p>
            <h2 className="text-2xl font-bold" style={{ color: '#1C2A3A' }}>Certificado en Superprof · 5 estrellas</h2>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-2xl" style={{ backgroundColor: '#F5F7FA', border: '1px solid #E8E8E2' }}>
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#EAF0F8' }}>
              <GraduationCap size={36} style={{ color: '#4A6FA5' }} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-bold mb-1" style={{ color: '#1C2A3A' }}>Ingeniero en Computación e Informática</h3>
              <p className="text-sm mb-3" style={{ color: '#6A7D92' }}>
                Más de 15 años de experiencia en Tecnologías de la Información. Especialista en ciberseguridad, desarrollo web, inteligencia artificial e infraestructura de servidores.
              </p>
              <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="#F59E0B" className="text-amber-400" />)}
                  <span className="ml-1 font-bold" style={{ color: '#1C2A3A' }}>5.0</span>
                </div>
                <span className="text-sm" style={{ color: '#9AABB8' }}>·</span>
                <Link
                  href="https://www.superprof.cl/hola-soy-ingeniero-computacion-informatica-con-mas-anos-experiencia-tecnologias-informacion-cuento.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-full transition-all hover:opacity-80"
                  style={{ backgroundColor: '#4A6FA5', color: 'white' }}
                >
                  Ver perfil en Superprof
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <div className="shrink-0 text-center">
              <div className="text-4xl font-extrabold mb-1" style={{ color: '#4A6FA5' }}>5.0</div>
              <div className="text-xs" style={{ color: '#8A9BB0' }}>Calificación Superprof</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Courses Carousel ─── */}
      <section id="courses" className="py-24 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 mb-10">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#1C2A3A' }}>Cursos más populares</h2>
              <p style={{ color: '#6A7D92' }}>Aprende las habilidades más demandadas del mercado · <strong style={{ color: '#059669' }}>Todos 100% gratuitos</strong></p>
            </div>
            <Link href="/login" className="hidden sm:flex items-center gap-1.5 font-medium text-sm hover:opacity-80 transition-opacity" style={{ color: '#4A6FA5' }}>
              Ver todos <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Infinite scroll carousel */}
        <div className="overflow-hidden">
          <div ref={trackRef} className="flex gap-6 w-max" style={{ willChange: 'transform' }}>
            {/* Duplicated for infinite loop */}
            {[...mockCourses, ...mockCourses, ...mockCourses].map((course, idx) => (
              <Link
                key={`${course.id}-${idx}`}
                href="/login"
                className="group block rounded-2xl overflow-hidden flex-shrink-0 hover:-translate-y-1 transition-all duration-200"
                style={{
                  width: '300px',
                  border: '1px solid #E8E8E2',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  backgroundColor: 'white',
                }}
              >
                <div className={`h-36 bg-gradient-to-br ${course.color} relative flex items-center justify-center`}>
                  <course.icon size={44} className="text-white/25" />
                  <div className="absolute top-3 right-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-white">
                      Gratis
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${levelColors[course.level]}`}>{course.level}</span>
                    <span className="text-xs" style={{ color: '#9AABB8' }}>{course.category}</span>
                  </div>
                  <h3 className="font-semibold text-sm line-clamp-2 mb-3 group-hover:text-[#4A6FA5] transition-colors" style={{ color: '#1C2A3A' }}>
                    {course.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs" style={{ color: '#9AABB8' }}>
                    <div className="flex items-center gap-1">
                      <Users size={12} />
                      {course.students.toLocaleString()} estudiantes
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={12} fill="currentColor" />
                      <span style={{ color: '#6A7D92' }}>{course.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24" style={{ background: 'linear-gradient(135deg, #3A5580 0%, #4A6FA5 100%)' }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Listo para empezar tu viaje de aprendizaje?</h2>
          <p className="mb-8 max-w-xl mx-auto" style={{ color: '#A3BDE1' }}>
            Únete a más de 50,000 estudiantes que ya están transformando sus carreras. Completamente gratis.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg hover:-translate-y-0.5"
            style={{ backgroundColor: 'white', color: '#4A6FA5' }}
          >
            Crear cuenta gratis
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-12 px-6" style={{ backgroundColor: '#1C2A3A' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image src="/logo-cc360.jpg" alt="CC360" width={36} height={36} className="rounded-lg object-cover" style={{ filter: 'drop-shadow(0 2px 8px rgba(74,111,165,0.5))' }} />
              <span className="font-bold text-white">Classroom Cloud 360</span>
            </div>
            <div className="flex items-center gap-4 text-sm flex-wrap justify-center" style={{ color: '#8A9BB0' }}>
              <Link href="/terminos"   className="hover:text-white transition-colors">Términos</Link>
              <Link href="/cookies"    className="hover:text-white transition-colors">Cookies</Link>
              <Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
              <Link href="/soporte"    className="hover:text-white transition-colors">Soporte</Link>
              <Link href="/contacto"   className="hover:text-white transition-colors">Contacto</Link>
            </div>
            <p className="text-sm" style={{ color: '#6A7D92' }}>© 2026 Classroom Cloud 360. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%       { transform: translateY(-14px) rotate(1deg); }
          66%       { transform: translateY(-7px) rotate(-0.5deg); }
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-3px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1.6); }
          50%       { opacity: 1; transform: scale(1.8); }
        }
      `}</style>
    </div>
  );
}
