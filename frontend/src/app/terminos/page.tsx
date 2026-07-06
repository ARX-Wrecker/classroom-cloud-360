import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = { title: 'Términos de Uso' };

export default function TerminosPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8', color: '#1C2A3A' }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-70 transition-opacity" style={{ color: '#4A6FA5' }}>
          <ArrowLeft size={16} /> Volver al inicio
        </Link>
        <h1 className="text-4xl font-extrabold mb-2" style={{ color: '#1C2A3A' }}>Términos de Uso</h1>
        <p className="text-sm mb-10" style={{ color: '#9AABB8' }}>Última actualización: julio 2026</p>

        {[
          {
            title: '1. Aceptación de los Términos',
            body: 'Al acceder y utilizar Classroom Cloud 360, aceptas quedar vinculado por estos Términos de Uso. Si no estás de acuerdo con alguna parte de los términos, no podrás acceder al servicio.',
          },
          {
            title: '2. Descripción del Servicio',
            body: 'Classroom Cloud 360 es una plataforma de aprendizaje en línea (LMS) que ofrece cursos gratuitos en tecnología, ciberseguridad, informática e inteligencia artificial, con certificados verificables.',
          },
          {
            title: '3. Registro de Cuenta',
            body: 'Para acceder a ciertos servicios deberás crear una cuenta. Eres responsable de mantener la confidencialidad de tu contraseña y de toda actividad que ocurra bajo tu cuenta.',
          },
          {
            title: '4. Propiedad Intelectual',
            body: 'Todo el contenido de la plataforma — cursos, videos, materiales y logos — son propiedad de Classroom Cloud 360 o sus instructores. Queda prohibida su reproducción sin autorización escrita.',
          },
          {
            title: '5. Conducta del Usuario',
            body: 'Está prohibido usar la plataforma para actividades ilegales, distribuir malware, acosar a otros usuarios o infringir derechos de terceros. Nos reservamos el derecho de suspender cuentas que violen estas normas.',
          },
          {
            title: '6. Modificaciones',
            body: 'Podemos modificar estos términos en cualquier momento. Notificaremos los cambios relevantes por correo electrónico o mediante avisos en la plataforma.',
          },
          {
            title: '7. Ley Aplicable',
            body: 'Estos términos se rigen por las leyes de la República de Chile. Cualquier disputa será resuelta ante los tribunales competentes de Santiago de Chile.',
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
