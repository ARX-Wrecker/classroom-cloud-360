'use client';
import { useState } from 'react';
import { FileText, Download, Search, Upload, File, Image, Film, Archive, Plus, BookOpen, Clock } from 'lucide-react';

const MOCK_DOCS = [
  { id: 1, name: 'Guía Completa Laravel 11.pdf', type: 'pdf', size: '4.2 MB', course: 'Desarrollo Web con Laravel 11', uploaded: '2026-07-01', downloads: 34 },
  { id: 2, name: 'Slides — Módulo 1: Fundamentos.pptx', type: 'ppt', size: '8.7 MB', course: 'Desarrollo Web con Laravel 11', uploaded: '2026-07-01', downloads: 28 },
  { id: 3, name: 'Plantilla Plan de Marketing Digital.xlsx', type: 'excel', size: '1.1 MB', course: 'Marketing Digital para Emprendedores', uploaded: '2026-06-28', downloads: 52 },
  { id: 4, name: 'Recursos de Diseño — Figma Kit.zip', type: 'zip', size: '23.4 MB', course: 'Diseño UX/UI con Figma', uploaded: '2026-06-30', downloads: 41 },
  { id: 5, name: 'Rúbrica Proyecto Final.pdf', type: 'pdf', size: '0.5 MB', course: 'Desarrollo Web con Laravel 11', uploaded: '2026-07-03', downloads: 67 },
  { id: 6, name: 'Case Study — Airbnb UX Redesign.pdf', type: 'pdf', size: '6.8 MB', course: 'Diseño UX/UI con Figma', uploaded: '2026-07-02', downloads: 19 },
];

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  pdf:   { icon: <FileText size={18} />, color: 'text-red-600', bg: 'bg-red-50' },
  ppt:   { icon: <File size={18} />, color: 'text-orange-600', bg: 'bg-orange-50' },
  excel: { icon: <File size={18} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  zip:   { icon: <Archive size={18} />, color: 'text-slate-600', bg: 'bg-slate-100' },
  img:   { icon: <Image size={18} />, color: 'text-blue-600', bg: 'bg-blue-50' },
  video: { icon: <Film size={18} />, color: 'text-violet-600', bg: 'bg-violet-50' },
};

export default function DocumentsPage() {
  const [search, setSearch] = useState('');
  const filtered = MOCK_DOCS.filter(d => !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.course.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Biblioteca de Documentos</h1>
          <p className="text-sm text-slate-500 mt-0.5">{MOCK_DOCS.length} archivos disponibles</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors">
          <Upload size={15} /> Subir archivo
        </button>
      </div>

      <div className="card p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text" placeholder="Buscar documentos..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(doc => {
          const tc = TYPE_CONFIG[doc.type] ?? TYPE_CONFIG.pdf;
          return (
            <div key={doc.id} className="card p-4 hover:shadow-card-hover transition-all group">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tc.bg}`}>
                  <span className={tc.color}>{tc.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug">{doc.name}</p>
                  <p className="text-[11px] text-primary-600 mt-1 font-medium truncate">{doc.course}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>{doc.size}</span>
                  <span className="flex items-center gap-0.5"><Download size={10} /> {doc.downloads}</span>
                  <span className="flex items-center gap-0.5"><Clock size={10} /> {new Date(doc.uploaded).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}</span>
                </div>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors group-hover:scale-105">
                  <Download size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
