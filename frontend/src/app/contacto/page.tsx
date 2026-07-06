'use client';
import Link from 'next/link';
import { ArrowLeft, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';

export default function ContactoPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF8', color: '#1C2A3A' }}>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-70 transition-opacity" style={{ color: '#4A6FA5' }}>
          <ArrowLeft size={16} /> Volver al inicio
        </Link>
        <h1 className="text-4xl font-extrabold mb-2" style={{ color: '#1C2A3A' }}>Contáctanos</h1>
        <p className="mb-12" style={{ color: '#6A7D92' }}>¿Tienes alguna consulta, propuesta o feedback? Escríbenos.</p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="text-xl font-bold mb-6" style={{ color: '#1C2A3A' }}>Información de Contacto</h2>
            <div className="space-y-5">
              {[
                { Icon: Mail,    label: 'Email',     value: 'contacto@classcloud360.cl' },
                { Icon: Phone,   label: 'Teléfono',  value: '+56 9 XXXX XXXX' },
                { Icon: MapPin,  label: 'Ubicación', value: 'Santiago, Chile' },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#EAF0F8' }}>
                    <Icon size={18} style={{ color: '#4A6FA5' }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: '#9AABB8' }}>{label}</p>
                    <p className="font-medium" style={{ color: '#1C2A3A' }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#EAF0F8', border: '1px solid #C8D8EE' }}>
                <div className="text-4xl mb-3">✓</div>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#1C2A3A' }}>¡Mensaje enviado!</h3>
                <p style={{ color: '#6A7D92' }}>Te responderemos en menos de 24 horas.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {(['nombre', 'email', 'asunto'] as const).map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium mb-1 capitalize" style={{ color: '#4A5568' }}>{field}</label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      required
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{ border: '1px solid #D8D8D0', backgroundColor: 'white', color: '#1C2A3A' }}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#4A5568' }}>Mensaje</label>
                  <textarea
                    required
                    rows={4}
                    value={form.mensaje}
                    onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                    style={{ border: '1px solid #D8D8D0', backgroundColor: 'white', color: '#1C2A3A' }}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-xl text-white transition-all hover:-translate-y-0.5"
                  style={{ backgroundColor: '#4A6FA5' }}
                >
                  <Send size={16} /> Enviar mensaje
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
