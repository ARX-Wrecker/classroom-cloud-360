'use client';
import { Certificate } from '@/types';
import { formatDate } from '@/lib/utils';
import { Award, Download, Share2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { certificatesApi } from '@/lib/api';

export function CertificateCard({ cert }: { cert: Certificate }) {
  const handleDownload = async () => {
    try {
      const { data } = await certificatesApi.download(cert.id);
      const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificado-${cert.course.slug}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Error al descargar el certificado');
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/verify/${cert.verification_code}`;
    await navigator.clipboard.writeText(url);
    toast.success('¡Enlace copiado al portapapeles!');
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-card overflow-hidden group">
      {/* Certificate header */}
      <div className="relative h-32 bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-700 flex flex-col items-center justify-center p-4">
        <Award size={36} className="text-white/80 mb-1" />
        <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Certificado de finalización</p>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2 mb-1">
          {cert.course.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          Emitido el {formatDate(cert.issued_at)}
        </p>

        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-700/50 rounded-lg px-2.5 py-1.5 mb-4">
          <span className="text-xs text-slate-400">Código:</span>
          <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 truncate">
            {cert.verification_code}
          </span>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="primary" iconLeft={<Download size={13} />} onClick={handleDownload} fullWidth>
            Descargar
          </Button>
          <Button size="sm" variant="ghost" iconLeft={<Share2 size={13} />} onClick={handleShare}>
            Compartir
          </Button>
        </div>
      </div>
    </div>
  );
}
