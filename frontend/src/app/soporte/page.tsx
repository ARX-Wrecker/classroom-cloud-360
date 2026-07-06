import Link from 'next/link';
import { ArrowLeft, Mail, MessageCircle, BookOpen, Clock } from 'lucide-react';

export const metadata = { title: 'Soporte' };

export default function SoportePage() {
  const faqs = [
    { q: '¿Cómo me inscribo a un curso?', a: 'Crea una cuenta gratuita, ingresa al catálogo de cursos y haz clic en "Inscribirse". El acceso es inmediato.' },
    { q: '¿Los cursos son realmente gratis?', a: 'Sí, todos los cursos de Classroom Cloud 360 son 100% gratuitos. No necesitas tarjeta de crédito.' },
    { q: '¿Cómo obtengo mi certificado?', a: 'Al completar el 100% del curso y aprobar las evaluaciones, el certificado se genera automáticamente en tu perfil.' },
    { q: '¿Puedo acceder desde mi celular?', a: 'Sí, la plataforma es 100% responsive y funciona en cualquier dispositivo: computador, tablet o smartphone.' },
    { q: '¿Qué hago si olvidé mi contraseña?', a: 'En la pantalla de login haz clic en "¿Olvidaste tu contraseña?" e ingresa tu correo para recibir el enlace de restablecimiento.' },
    { q: '¿Los cursos tienen fecha de vencimiento?', a: 'No. Una vez inscrito, tienes acceso ilimitado al curso para siempre.' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8', color: '#1C2A3A' }}>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-70 transition-opacity" style={{ color: '#4A6FA5' }}>
          <ArrowLeft size={16} /> Volver al inicio
        </Link>
        <h1 className="text-4xl font-extrabold mb-2" style={{ color: '#1C2A3A' }}>Centro de Soporte</h1>
        <p className="mb-12" style={{ color: '#6A7D92' }}>Estamos aquí para ayudarte. Encuentra respuestas rápidas o contáctanos directamente.</p>

        {/* Canales de contacto */}
        <div className="grid md:grid-cols-3 gap-4 mb-16">
          {[
            { Icon: Mail, title: 'Email', desc: 'soporte@classcloud360.cl', sub: 'Respuesta en 24h' },
            { Icon: MessageCircle, title: 'Chat en vivo', desc: 'Disponible dentro de la plataforma', sub: 'Lun–Vie 9:00–18:00' },
            { Icon: Clock, title: 'Horario', desc: 'Lunes a Viernes', sub: '9:00 AM – 6:00 PM (Chile)' },
          ].map(({ Icon, title, desc, sub }) => (
            <div key={title} className="rounded-2xl p-5 bg-white" style={{ border: '1px solid #E8E8E2' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: '#EAF0F8' }}>
                <Icon size={20} style={{ color: '#4A6FA5' }} />
              </div>
              <h3 className="font-semibold mb-1" style={{ color: '#1C2A3A' }}>{title}</h3>
              <p className="text-sm" style={{ color: '#6A7D92' }}>{desc}</p>
              <p className="text-xs mt-1" style={{ color: '#9AABB8' }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="flex items-center gap-2 mb-6">
          <BookOpen size={20} style={{ color: '#4A6FA5' }} />
          <h2 className="text-2xl font-bold" style={{ color: '#1C2A3A' }}>Preguntas Frecuentes</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-2xl p-5 bg-white" style={{ border: '1px solid #E8E8E2' }}>
              <h3 className="font-semibold mb-2" style={{ color: '#1C2A3A' }}>{faq.q}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6A7D92' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
