import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = { title: 'Política de Privacidad' };

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8', color: '#1C2A3A' }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-70 transition-opacity" style={{ color: '#4A6FA5' }}>
          <ArrowLeft size={16} /> Volver al inicio
        </Link>
        <h1 className="text-4xl font-extrabold mb-2" style={{ color: '#1C2A3A' }}>Política de Privacidad</h1>
        <p className="text-sm mb-10" style={{ color: '#9AABB8' }}>Última actualización: julio 2026</p>

        {[
          {
            title: '1. Información que Recopilamos',
            body: 'Recopilamos información que nos proporcionas directamente: nombre, correo electrónico, contraseña cifrada (bcrypt), y opcionalmente foto de perfil. También recopilamos datos de uso anónimos para mejorar la plataforma.',
          },
          {
            title: '2. Cómo Usamos tu Información',
            body: 'Usamos tus datos para: gestionar tu cuenta y sesión, enviarte notificaciones importantes sobre tus cursos, generar y verificar certificados, y mejorar la experiencia de la plataforma.',
          },
          {
            title: '3. Compartición de Datos',
            body: 'No vendemos ni compartimos tu información personal con terceros con fines comerciales. Solo compartimos datos con proveedores de servicios necesarios para operar la plataforma (hosting, email transaccional).',
          },
          {
            title: '4. Seguridad',
            body: 'Implementamos medidas de seguridad técnicas y organizativas: cifrado AES-256 en reposo, TLS 1.3 en tránsito, hashing Argon2 para contraseñas, y auditorías periódicas de seguridad.',
          },
          {
            title: '5. Tus Derechos (Ley 19.628 Chile / GDPR)',
            body: 'Tienes derecho a acceder, rectificar, cancelar y oponerte al tratamiento de tus datos personales. Para ejercer estos derechos, escríbenos a privacidad@classcloud360.cl.',
          },
          {
            title: '6. Retención de Datos',
            body: 'Conservamos tus datos mientras tu cuenta esté activa. Si eliminas tu cuenta, procederemos a borrar tus datos personales en un plazo máximo de 30 días.',
          },
          {
            title: '7. Menores de Edad',
            body: 'La plataforma no está dirigida a menores de 13 años. No recopilamos conscientemente datos de menores. Si eres padre/tutor y crees que tu hijo ha proporcionado datos, contáctanos.',
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
