'use client';
import { Award, Download, ExternalLink, Clock } from 'lucide-react';

const MOCK_CERTS = [
  { id: 1, course: 'Marketing Digital para Emprendedores', date: '2026-06-15', hours: 40, instructor: 'Carlos Mendoza' },
  { id: 2, course: 'Diseño UX/UI con Figma', date: '2026-05-30', hours: 35, instructor: 'María González' },
];

export default function CertificatesPage() {
  const formatDate = (d: string) => new Date(d).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Mis Certificados</h1>
        <p className="text-sm text-slate-500 mt-0.5">{MOCK_CERTS.length} certificados obtenidos</p>
      </div>
      {MOCK_CERTS.length === 0 ? (
        <div className="card p-16 text-center">
          <Award size={48} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium mb-1">Aún no tienes certificados</p>
          <p className="text-sm text-slate-400">Completa un curso para obtener tu certificado.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {MOCK_CERTS.map(cert => (
            <div key={cert.id} className="card p-5 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-50 to-transparent rounded-bl-full" />
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0">
                  <Award size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide">Certificado de Completitud</p>
                  <h3 className="text-sm font-bold text-slate-800 mt-1 line-clamp-2">{cert.course}</h3>
                  <p className="text-xs text-slate-500 mt-1">{cert.instructor}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span>{formatDate(cert.date)}</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {cert.hours}h</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 py-2 rounded-lg transition-colors">
                  <Download size={13} /> Descargar PDF
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 py-2 rounded-lg transition-colors">
                  <ExternalLink size={13} /> Compartir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
