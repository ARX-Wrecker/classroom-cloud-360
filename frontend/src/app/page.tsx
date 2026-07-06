'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import {
  BookOpen, Users, Award, Zap, Globe, Shield, BarChart3,
  Star, ArrowRight, GraduationCap, Play, Lock,
  Terminal, Server, Mail, MessageCircle, ExternalLink,
  CheckCircle, TrendingUp, BookMarked, Video,
} from 'lucide-react';

const features = [
  { icon: BarChart3, title: 'Seguimiento de progreso',      desc: 'Analytics detallados de tu aprendizaje y progreso por curso.',                                         img: '/qa.jpg' },
  { icon: BookOpen,  title: 'Contenido de calidad',         desc: 'Cursos creados por expertos de la industria con material actualizado.',                                img: '/seguimiento.jpg' },
  { icon: Users,     title: 'Aprendizaje colaborativo',     desc: 'Foros, mensajería y grupos de estudio para aprender en comunidad.',                                    img: '/aprendizaje-colaborativo.jpg' },
  { icon: Award,     title: 'Certificados verificables',    desc: 'Obtén certificados con código QR verificable y compartibles en LinkedIn.',                             img: '/certificados.jpg' },
  { icon: Zap,       title: 'A tu propio ritmo',            desc: 'Sube y descarga contenido cuando quieras, sin costo de acceso a la plataforma.',                       img: '/atupropio_ritmo.jpg' },
  { icon: Globe,     title: 'Contenido en Español e Inglés',desc: 'Toda la plataforma y los cursos disponibles en español e inglés para mayor alcance.',                  img: '/spanish-english.jpg' },
];

const mockCourses = [
  { id: 5, icon: Server,   title: 'Infraestructura de Servidores y Datacenter', category: 'Infraestructura', level: 'Intermedio',   students: 1430, rating: 4.7, color: 'from-slate-500 to-gray-600',  img: '/infraestructura.jpg' },
  { id: 7, icon: Shield,   title: 'Informática Básica · Intermedia · Avanzada', category: 'Computación',     level: 'Principiante', students: 4100, rating: 4.8, color: 'from-teal-500 to-cyan-600',   img: '/informatica.jpg' },
  { id: 9, icon: Terminal, title: 'Scripting con PowerShell',                   category: 'Automatización',  level: 'Intermedio',   students: 980,  rating: 4.6, color: 'from-indigo-500 to-blue-700', img: '/powershell.jpg' },
  { id: 2, icon: Lock,     title: 'Ciberseguridad y Ethical Hacking',           category: 'Seguridad',       level: 'Avanzado',     students: 2750, rating: 4.8, color: 'from-red-500 to-rose-600',    img: '/ciberseguridad.jpg' },
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
    let raf: number;
    const step = () => {
      pos += 0.4;
      if (pos >= track.scrollWidth / 2) pos = 0;
      track.style.transform = `translateX(-${pos}px)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8', color: '#1C2A3A' }}>

      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: 'rgba(255,255,255,0.97)', borderBottom: '2px solid #E8E8E2', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">

          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div style={{ filter: 'drop-shadow(0 4px 14px rgba(74,111,165,0.45))' }}>
              <Image src="/logo-cc360.jpg" alt="Class Cloud 360" width={84} height={84} className="rounded-2xl object-cover" priority />
            </div>
            <div className="hidden lg:block">
              <p className="font-extrabold text-lg leading-tight" style={{ color: '#1C2A3A' }}>Class Cloud 360</p>
              <p className="text-xs" style={{ color: '#8A9BB0' }}>Plataforma educativa</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {[
              { href: '#quienes-somos', label: 'Nosotros' },
              { href: '#mision',        label: 'Nuestra Misión' },
              { href: '#courses',       label: 'Cursos' },
              { href: '#instructor',    label: 'Instructor' },
              { href: '/soporte',       label: 'Soporte' },
              { href: '/contacto',      label: 'Contacto' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium px-3 py-2 rounded-lg transition-all hover:bg-[#EAF0F8] hover:text-[#4A6FA5]"
                style={{ color: '#4A5568' }}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/login" className="text-sm font-medium px-4 py-2 rounded-lg transition-all hover:bg-[#F4F4F0]" style={{ color: '#4A5568' }}>
              Iniciar sesión
            </Link>
            <Link href="/register" className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-all hover:-translate-y-0.5 shadow-md" style={{ backgroundColor: '#4A6FA5', boxShadow: '0 4px 14px rgba(74,111,165,0.35)' }}>
              Acceso al Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero split-layout ─── */}
      <section className="relative pt-28 pb-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #F5F7FA 0%, #FAFAF8 50%, #EAF0F8 100%)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Texto + CTA */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: '#EAF0F8', color: '#4A6FA5', border: '1px solid #C8D8EE' }}>
                <CheckCircle size={13} /> Plataforma de acceso libre
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6" style={{ color: '#1C2A3A' }}>
                La plataforma de{' '}
                <span style={{ color: '#4A6FA5' }}>aprendizaje</span>{' '}
                del futuro
              </h1>
              <p className="text-lg mb-8" style={{ color: '#6A7D92', lineHeight: '1.8' }}>
                Accede al contenido, sube y descarga material educativo sin costo. La enseñanza de los cursos es lo que mantiene esta plataforma activa y en constante mejora.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-10">
                <Link href="/register" className="flex items-center gap-2 font-semibold px-8 py-3.5 rounded-xl text-white shadow-lg transition-all hover:-translate-y-0.5" style={{ backgroundColor: '#4A6FA5', boxShadow: '0 8px 24px rgba(74,111,165,0.3)' }}>
                  Acceso al Portal <ArrowRight size={18} />
                </Link>
                <Link href="#courses" className="flex items-center gap-2 font-semibold px-8 py-3.5 rounded-xl transition-all hover:bg-[#F0F4FA]" style={{ backgroundColor: 'white', color: '#4A6FA5', border: '1px solid #C8D8EE' }}>
                  <Play size={16} /> Ver cursos
                </Link>
              </div>
              <div className="flex items-center gap-6 text-sm" style={{ color: '#8A9BB0' }}>
                <div className="flex items-center gap-1.5"><CheckCircle size={15} style={{ color: '#4A6FA5' }} /> Español e Inglés</div>
                <div className="flex items-center gap-1.5"><CheckCircle size={15} style={{ color: '#4A6FA5' }} /> Certificados verificables</div>
                <div className="flex items-center gap-1.5"><CheckCircle size={15} style={{ color: '#4A6FA5' }} /> 15+ años experiencia</div>
              </div>
            </div>

            {/* Mockup dashboard */}
            <div className="relative hidden lg:block">
              <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: 'linear-gradient(135deg, #1C2A3A 0%, #2E4060 100%)', border: '1px solid #3A5580', padding: '20px' }}>
                {/* Barra superior mockup */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400 opacity-80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400 opacity-80"></div>
                  <div className="flex-1 mx-3 h-6 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}></div>
                </div>
                {/* Header mockup */}
                <div className="flex items-center justify-between mb-5 p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-2">
                    <Image src="/logo-cc360.jpg" alt="" width={28} height={28} className="rounded-lg object-cover" />
                    <span className="text-white text-xs font-bold">Class Cloud 360</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
                    <div className="w-7 h-7 rounded-full" style={{ backgroundColor: '#4A6FA5' }}></div>
                  </div>
                </div>
                {/* Stats cards */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { icon: BookMarked, label: 'Cursos', value: '4+', color: '#4A6FA5' },
                    { icon: Users,      label: 'Estudiantes', value: '9.2K', color: '#25D366' },
                    { icon: TrendingUp, label: 'Completados', value: '98%', color: '#F59E0B' },
                  ].map((s) => (
                    <div key={s.label} className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <s.icon size={16} style={{ color: s.color }} className="mb-1" />
                      <p className="text-white font-bold text-lg leading-none">{s.value}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#7A9BB8' }}>{s.label}</p>
                    </div>
                  ))}
                </div>
                {/* Course rows */}
                {[
                  { icon: Lock,     label: 'Ciberseguridad y Ethical Hacking', progress: 78, color: '#EF4444' },
                  { icon: Server,   label: 'Infraestructura de Servidores',    progress: 52, color: '#64748B' },
                  { icon: Terminal, label: 'Scripting con PowerShell',         progress: 91, color: '#6366F1' },
                ].map((c) => (
                  <div key={c.label} className="flex items-center gap-3 mb-2.5 p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: c.color + '22' }}>
                      <c.icon size={14} style={{ color: c.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white truncate mb-1">{c.label}</p>
                      <div className="h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${c.progress}%`, backgroundColor: c.color }}></div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold shrink-0" style={{ color: '#7A9BB8' }}>{c.progress}%</span>
                  </div>
                ))}
                {/* Video row */}
                <div className="flex items-center gap-3 mt-3 p-3 rounded-xl" style={{ backgroundColor: '#4A6FA522', border: '1px solid #4A6FA544' }}>
                  <Video size={16} style={{ color: '#4A6FA5' }} />
                  <p className="text-xs text-white flex-1">Módulo 3: Hardening de Sistemas</p>
                  <span className="text-xs font-semibold" style={{ color: '#4A6FA5' }}>EN VIVO</span>
                </div>
              </div>
              {/* Badge flotante */}
              <div className="absolute -bottom-4 -left-4 px-4 py-2.5 rounded-2xl shadow-xl text-sm font-semibold text-white" style={{ backgroundColor: '#25D366', boxShadow: '0 8px 24px rgba(37,211,102,0.4)' }}>
                ★ 5.0 Superprof
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
            Brindar educación tecnológica de alta calidad en dos idiomas — Español e Inglés — donde el acceso a la plataforma, subida y descarga de contenido es libre. Los cursos son impartidos por instructores certificados y tienen un costo que sustenta y mejora continuamente la plataforma.
          </p>
        </div>
      </section>

      {/* ─── Features con imágenes ─── */}
      <section id="features" className="py-24" style={{ backgroundColor: '#F4F4F0' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1C2A3A' }}>Todo lo que necesitas para aprender</h2>
            <p className="max-w-xl mx-auto" style={{ color: '#6A7D92' }}>Plataforma de acceso libre — la enseñanza de los cursos es lo que la mantiene viva.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform duration-200" style={{ border: '1px solid #E8E8E2', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div className="h-40 overflow-hidden relative">
                  <Image src={f.img} alt={f.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" />
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
              <p className="text-sm mb-3" style={{ color: '#6A7D92' }}>Más de 15 años de experiencia en Tecnologías de la Información. Especialista en ciberseguridad, desarrollo web, inteligencia artificial e infraestructura de servidores.</p>
              <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="#F59E0B" className="text-amber-400" />)}
                  <span className="ml-1 font-bold" style={{ color: '#1C2A3A' }}>5.0</span>
                </div>
                <span style={{ color: '#9AABB8' }}>·</span>
                <Link href="https://www.superprof.cl/hola-soy-ingeniero-computacion-informatica-con-mas-anos-experiencia-tecnologias-informacion-cuento.html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-full transition-all hover:opacity-80" style={{ backgroundColor: '#4A6FA5', color: 'white' }}>
                  Ver perfil en Superprof <ExternalLink size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Cursos Carousel ─── */}
      <section id="courses" className="py-24 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 mb-10">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#1C2A3A' }}>Cursos disponibles</h2>
              <p style={{ color: '#6A7D92' }}>Enseñanza profesional impartida por instructores certificados</p>
            </div>
            <Link href="/login" className="hidden sm:flex items-center gap-1.5 font-medium text-sm hover:opacity-80 transition-opacity" style={{ color: '#4A6FA5' }}>
              Ver todos <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div className="overflow-hidden">
          <div ref={trackRef} className="flex gap-6 w-max" style={{ willChange: 'transform' }}>
            {[...mockCourses, ...mockCourses, ...mockCourses].map((course, idx) => (
              <Link key={`${course.id}-${idx}`} href="/login" className="group block rounded-2xl overflow-hidden flex-shrink-0 hover:-translate-y-1 transition-transform duration-200" style={{ width: '300px', border: '1px solid #E8E8E2', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', backgroundColor: 'white' }}>
                <div className="h-44 overflow-hidden relative">
                  <Image src={course.img} alt={course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="300px" loading="lazy" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${levelColors[course.level]}`}>{course.level}</span>
                    <span className="text-xs" style={{ color: '#9AABB8' }}>{course.category}</span>
                  </div>
                  <h3 className="font-semibold text-sm line-clamp-2 mb-3 group-hover:text-[#4A6FA5] transition-colors" style={{ color: '#1C2A3A' }}>{course.title}</h3>
                  <div className="flex items-center justify-between text-xs" style={{ color: '#9AABB8' }}>
                    <div className="flex items-center gap-1">
                      <Users size={12} /> {course.students.toLocaleString()} estudiantes
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={12} fill="#F59E0B" className="text-amber-400" />
                      <span style={{ color: '#6A7D92' }}>{course.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Contacto Profesional con imagen de fondo ─── */}
      <section className="relative py-28 overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <Image
            src="/trabajo-educativo.jpg"
            alt="Educación profesional"
            fill
            className="object-cover"
            sizes="100vw"
          />
          {/* Overlay oscuro profesional */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(10,18,32,0.88) 0%, rgba(18,30,52,0.82) 50%, rgba(10,18,32,0.92) 100%)' }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#5A8BC0', letterSpacing: '0.25em' }}>Contacto directo</p>
          <h2 className="text-5xl font-extrabold text-white mb-4 leading-tight">¿Listo para comenzar?</h2>
          <p className="text-lg mb-14 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: '1.7' }}>
            Escríbeme directamente — respondo en menos de 24 horas con orientación personalizada para tu aprendizaje.
          </p>

          {/* Tarjetas */}
          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            {/* Email */}
            <a
              href="mailto:fernando_gonzalez@live.cl"
              className="group flex flex-col items-center gap-5 p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
            >
              <div className="w-18 h-18 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300" style={{ width: 68, height: 68, background: 'linear-gradient(135deg, #4A6FA5, #3A5A90)', boxShadow: '0 12px 32px rgba(74,111,165,0.55)' }}>
                <Mail size={30} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#6A9FD8', letterSpacing: '0.18em' }}>Correo Electrónico</p>
                <p className="font-bold text-white text-xl mb-1">fernando_gonzalez@live.cl</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Consultas generales · Inscripción a cursos</p>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/56XXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-5 p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(37,211,102,0.25)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
            >
              <div className="rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300" style={{ width: 68, height: 68, background: 'linear-gradient(135deg, #25D366, #1DB954)', boxShadow: '0 12px 32px rgba(37,211,102,0.45)' }}>
                <MessageCircle size={30} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#4DB87A', letterSpacing: '0.18em' }}>WhatsApp</p>
                <p className="font-bold text-white text-xl mb-1">+56 9 XXXX XXXX</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Respuesta inmediata · Consultas personalizadas</p>
              </div>
            </a>
          </div>

          {/* CTA */}
          <Link
            href="/register"
            className="inline-flex items-center gap-3 px-12 py-4 rounded-2xl font-bold text-white text-lg transition-all hover:-translate-y-1"
            style={{ background: 'linear-gradient(135deg, #4A6FA5, #3A5A90)', boxShadow: '0 12px 40px rgba(74,111,165,0.6)' }}
          >
            Acceder al Portal <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* ─── Footer estilo profesional ─── */}
      <footer style={{ backgroundColor: '#0A0A0A' }}>
        {/* Créditos del creador */}
        <div className="py-10 px-6 text-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
            This platform was strategically designed, architected and developed by
          </p>
          <p className="text-2xl font-extrabold mb-1" style={{ color: '#7B6FE8' }}>Fernando González</p>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.2em' }}>
            Computer &amp; Information Systems Engineer
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Enterprise Technology · Cloud Architecture · Cybersecurity · Digital Transformation
          </p>
        </div>
        {/* Links + copyright */}
        <div className="py-5 px-6">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
            <span>© 2026 Class Cloud 360</span>
            <span className="hidden sm:inline" style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
            <Link href="/terminos"   className="hover:text-white transition-colors">Términos</Link>
            <Link href="/cookies"    className="hover:text-white transition-colors">Cookies</Link>
            <Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
            <Link href="/soporte"    className="hover:text-white transition-colors">Soporte</Link>
            <Link href="/contacto"   className="hover:text-white transition-colors">Contacto</Link>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; }
        }
      `}</style>
    </div>
  );
}
