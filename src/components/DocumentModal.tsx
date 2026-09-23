import { X, ExternalLink, CheckCircle2, Clock, FileSpreadsheet, FileText, Folder, ShieldCheck } from 'lucide-react';
import { DocumentItem } from '../types';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface DocumentModalProps {
  document: DocumentItem | null;
  onClose: () => void;
  onVerify?: (id: string) => void;
  canVerify?: boolean;
}

export default function DocumentModal({ document, onClose, onVerify, canVerify }: DocumentModalProps) {
  useBodyScrollLock(!!document);
  if (!document) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'sheet':
        return <FileSpreadsheet className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />;
      case 'doc':
      case 'pdf':
        return <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />;
      case 'folder':
        return <Folder className="w-8 h-8 text-amber-600 dark:text-amber-400" />;
      default:
        return <FileText className="w-8 h-8 text-slate-600 dark:text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Sticky Header with Close Button always visible */}
        <div className="sticky top-0 z-10 shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
              {getIcon(document.fileType)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
                  {document.categoryLabel}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                  Tahun {document.year}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug truncate">
                {document.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shrink-0 transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="p-3 sm:p-4 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Arsitektur Gateway SIPANDU PEDULI:</strong> Dokumen ini bersumber resmi dari ekosistem Google Workspace UPTD Puskesmas Kepanjen. Sistem ini menghubungkan metadata dan kendali verifikasi tanpa menduplikasi data asli.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">Klaster / PJ</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{document.clusterLabel}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">Pengunggah / PIC</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{document.uploaderName}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">Status Verifikasi</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-xs">
                {document.verificationStatus === 'Terverifikasi' ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5" /> Menunggu Verifikasi
                  </span>
                )}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">Terakhir Diperbarui</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{document.updatedAt}</span>
            </div>
          </div>

          {document.description && (
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">Deskripsi Dokumen:</span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{document.description}</p>
            </div>
          )}

          {/* Simulated Sheet Preview / Link Box */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 bg-slate-100/70 dark:bg-slate-800/40 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Tautan Akses Gateway:</span>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                {document.fileType === 'sheet' ? 'Google Sheets' : document.fileType === 'folder' ? 'Google Drive Folder' : 'Google Drive Doc/PDF'}
              </span>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-mono text-slate-600 dark:text-slate-300 break-all select-all">
              {document.driveUrl}
            </div>
          </div>
        </div>

        {/* Sticky Footer Actions */}
        <div className="sticky bottom-0 z-10 shrink-0 bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-xs flex flex-wrap items-center justify-between gap-3 p-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            {canVerify && document.verificationStatus !== 'Terverifikasi' && (
              <button
                onClick={() => onVerify && onVerify(document.id)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Verifikasi Dokumen Ini
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium rounded-lg transition cursor-pointer"
            >
              Tutup
            </button>
            <a
              href={document.driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition"
            >
              <span>Buka di Drive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
