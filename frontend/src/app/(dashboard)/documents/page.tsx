'use client';

import { useState, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileText, Upload, Download, Trash2, Search,
  File, Film, Image, BookOpen, Table2, PresentationIcon,
  Plus, X, Loader2, Eye, FolderOpen,
} from 'lucide-react';
import { documentsApi } from '@/lib/api';
import toast from 'react-hot-toast';

const typeIcon: Record<string, React.ElementType> = {
  pdf: FileText,
  video: Film,
  image: Image,
  spreadsheet: Table2,
  presentation: BookOpen,
  document: BookOpen,
  file: File,
};

const typeBg: Record<string, string> = {
  pdf: 'bg-red-50 text-red-600',
  video: 'bg-purple-50 text-purple-600',
  image: 'bg-green-50 text-green-600',
  spreadsheet: 'bg-emerald-50 text-emerald-600',
  presentation: 'bg-orange-50 text-orange-600',
  document: 'bg-blue-50 text-blue-600',
  file: 'bg-gray-50 text-gray-600',
};

interface DocItem {
  id: number;
  name: string;
  type: string;
  size_label: string;
  url: string;
  course?: { id: number; title: string } | null;
  is_public: boolean;
  uploader?: { name: string };
  created_at: string;
}

function UploadModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
  }, []);

  const handleUpload = async () => {
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('is_public', isPublic ? '1' : '0');
        await documentsApi.upload(fd);
      }
      toast.success(`${files.length} archivo(s) subidos exitosamente`);
      onSuccess();
      onClose();
    } catch {
      toast.error('Error al subir archivos');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Subir documentos</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><X size={18} /></button>
        </div>
        <div className="p-5">
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'}`}
          >
            <Upload size={32} className={`mx-auto mb-3 ${dragging ? 'text-blue-500' : 'text-gray-400'}`} />
            <p className="text-sm font-medium text-gray-700">Arrastra archivos aquí o haz clic</p>
            <p className="text-xs text-gray-400 mt-1">PDF, PPT, DOC, XLS, MP4, JPG — máx. 50MB</p>
            <input ref={inputRef} type="file" multiple className="hidden" onChange={e => e.target.files && setFiles(prev => [...prev, ...Array.from(e.target.files!)])} />
          </div>
          {files.length > 0 && (
            <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                  <File size={16} className="text-gray-500 flex-shrink-0" />
                  <span className="flex-1 text-sm text-gray-700 truncate">{f.name}</span>
                  <span className="text-xs text-gray-400">{(f.size / 1024).toFixed(0)} KB</span>
                  <button onClick={() => setFiles(f => f.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
                </div>
              ))}
            </div>
          )}
          <label className="flex items-center gap-2 mt-4 cursor-pointer">
            <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
            <span className="text-sm text-gray-700">Hacer público (visible para todos)</span>
          </label>
        </div>
        <div className="flex gap-3 p-5 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
          <button onClick={handleUpload} disabled={!files.length || uploading} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
            {uploading ? <><Loader2 size={14} className="animate-spin" /> Subiendo...</> : <><Upload size={14} /> Subir {files.length > 0 ? `(${files.length})` : ''}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showUpload, setShowUpload] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['documents', filterType],
    queryFn: async () => {
      try {
        const { data } = await documentsApi.list(filterType !== 'all' ? { type: filterType } : {});
        return (data?.data ?? []) as DocItem[];
      } catch { return [] as DocItem[]; }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => documentsApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['documents'] }); toast.success('Documento eliminado'); },
    onError: () => toast.error('Error al eliminar'),
  });

  const filtered = (data ?? []).filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onSuccess={() => qc.invalidateQueries({ queryKey: ['documents'] })} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Biblioteca de Documentos</h1>
          <p className="text-sm text-gray-500 mt-1">Sube y gestiona materiales de estudio</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          <Upload size={16} /> Subir documento
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Buscar documentos..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['all','pdf','document','presentation','spreadsheet','video','image'].map(t => (
            <button key={t} onClick={() => setFilterType(t)} className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap font-medium transition-colors ${filterType === t ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {t === 'all' ? 'Todos' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-lg mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <FolderOpen size={48} className="mb-4 opacity-30" />
          <p className="text-lg font-medium">Sin documentos</p>
          <p className="text-sm">Sube tu primer documento con el botón superior</p>
          <button onClick={() => setShowUpload(true)} className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            <Plus size={14} /> Subir ahora
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(doc => {
            const Icon = typeIcon[doc.type] ?? File;
            const colors = typeBg[doc.type] ?? typeBg.file;
            return (
              <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow group">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${colors} flex items-center justify-center`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Ver"><Eye size={14} /></a>
                    <a href={doc.url} download={doc.name} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Descargar"><Download size={14} /></a>
                    <button onClick={() => deleteMutation.mutate(doc.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600" title="Eliminar"><Trash2 size={14} /></button>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 truncate mb-1">{doc.name}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="uppercase font-medium">{doc.type}</span>
                  <span>·</span>
                  <span>{doc.size_label}</span>
                  {doc.is_public && <><span>·</span><span className="text-green-600 font-medium">Público</span></>}
                </div>
                {doc.course && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                    <BookOpen size={10} />
                    <span className="truncate">{doc.course.title}</span>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(doc.created_at).toLocaleDateString('es-CL')}
                  {doc.uploader && ` · ${doc.uploader.name}`}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
