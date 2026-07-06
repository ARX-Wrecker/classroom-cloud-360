import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = { title: 'Política de Cookies' };

export default function CookiesPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8', color: '#1C2A3A' }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-70 transition-opacity" style={{ color: '#4A6FA5' }}>
          <ArrowLeft size={16} /> Volver al inicio
        </Link>
        <h1 className="text-4xl font-extrabold mb-2" style={{ color: '#1C2A3A' }}>Política de Cookies</h1>
        <p className="text-sm mb-10" style={{ color: '#9AABB8' }}>Última actualización: julio 2026</p>

        {[
          {
            title: '¿Qué son las Cookies?',
            body: 'Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Nos permiten recordar tus preferencias y mejorar tu experiencia de navegación.',
          },
          {
            title: 'Cookies Esenciales',
            body: 'Estas cookies son necesarias para el funcionamiento básico de la plataforma: gestión de sesión, autenticación, y seguridad. No pueden desactivarse.',
          },
          {
            title: 'Cookies de Rendimiento',
            body: 'Nos ayudan a entender cómo los usuarios interactúan con la plataforma mediante estadísticas anónimas. Usamos estas métricas para mejorar continuamente el servicio.',
          },
          {
            title: 'Cookies de Funcionalidad',
            body: 'Recuerdan tus preferencias (idioma, tema, progreso en cursos) para personalizar tu experiencia en visitas futuras.',
          },
          {
            title: 'Control de Cookies',
            body: 'Puedes controlar y/o eliminar las cookies según desees. Puedes eliminar todas las cookies almacenadas en tu computadora y configurar la mayoría de los navegadores para bloquear su instalación.',
          },
          {
            title: 'Contacto',
            body: 'Si tienes preguntas sobre nuestra política de cookies, contáctanos en soporte@classcloud360.cl',
          },
        ].map((s) => (
          <div key={s.title} className="mb-8">
            <h2 className="text-lg font-bold mb-2" style={{ color: '#1C2A3A' }}>{s.title}</h2>
            <p className="leading-relaxed" style={{ color: '#6A7D92' }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
