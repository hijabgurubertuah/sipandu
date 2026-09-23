import { useState, type FormEvent } from 'react';
import { X, UploadCloud, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { DocumentItem, UnitCluster, UserAccount } from '../types';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (doc: DocumentItem) => void;
  currentUser: UserAccount;
}

export default function AddDocumentModal({ isOpen, onClose, onAdd, currentUser }: AddDocumentModalProps) {
  useBodyScrollLock(isOpen);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentItem['category']>('pkp');
  const [year, setYear] = useState(2026);
  const [cluster, setCluster] = useState<UnitCluster>(currentUser.unit === 'all' ? 'manajemen' : currentUser.unit);
  const [fileType, setFileType] = useState<'sheet' | 'doc' | 'pdf' | 'folder'>('sheet');
  const [driveUrl, setDriveUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !driveUrl.trim()) {
      setError('Judul dan tautan Google Drive / Spreadsheet wajib diisi');
      return;
    }

    const categoryLabels: Record<DocumentItem['category'], string> = {
      perencanaan: 'Perencanaan',
      pkp: 'Program PKP',
      ckg: 'Program CKG',
      spm: 'Program SPM',
      akreditasi: 'Akreditasi',
      bimtek: 'Bimtek • Desk • Monev',
      sasaran: 'Data Sasaran',
      publik: 'Unduhan Publik',
      tu: 'Tata Usaha'
    };

    const clusterLabels: Record<UnitCluster, string> = {
      tu: 'Tata Usaha',
      manajemen: 'Klaster 1: Manajemen',
      kia: 'Klaster 2: KIA',
      dewasa_lansia: 'Klaster 3: Dewasa & Lansia',
      p2m_kesling: 'Klaster 4: P2M & Kesling',
      lintas_klaster: 'Lintas Klaster',
      all: 'Semua Klaster'
    };

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: title.trim(),
      category,
      categoryLabel: categoryLabels[category],
      year: Number(year),
      cluster,
      clusterLabel: clusterLabels[cluster],
      driveUrl: driveUrl.trim(),
      fileType,
      size: fileType === 'sheet' ? '4.5 MB' : '3.1 MB',
      uploaderName: currentUser.name,
      verificationStatus: (currentUser.role === 'super_admin' || currentUser.role === 'koordinator' || currentUser.role === 'pimpinan') ? 'Terverifikasi' : 'Menunggu Verifikasi',
      updatedAt: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
      isPublicDownload: isPublic,
      description: description.trim()
    };

    onAdd(newDoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full max-h-[85vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Sticky Header with Close Button Always Visible */}
        <div className="sticky top-0 z-10 shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/80 rounded-xl text-emerald-700 dark:text-emerald-300 shrink-0">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                Tautkan Data Dukung / Dokumen Baru
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Gateway: Hubungkan berkas Google Drive / Spreadsheet resmi
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shrink-0 transition cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Judul Dokumen / Data Dukung *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Rekapitulasi Capaian Imunisasi Balita Agustus 2026"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Program
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentItem['category'])}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="pkp">Penilaian Kinerja Puskesmas (PKP)</option>
                <option value="ckg">Cek Kesehatan Gratis (CKG)</option>
                <option value="spm">Standar Pelayanan Minimal (SPM)</option>
                <option value="perencanaan">Perencanaan (RUK/RPK/Renstra)</option>
                <option value="sasaran">Data Sasaran Penduduk & Program</option>
                <option value="akreditasi">Akreditasi Puskesmas</option>
                <option value="bimtek">Bimtek • Desk • Monev Dinkes</option>
                <option value="tu">Tata Usaha & Kepegawaian</option>
                <option value="publik">Unduhan Publik</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tahun Dokumen
              </label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value={2027}>2027 (Rancangan Mendatang)</option>
                <option value={2026}>2026 (Tahun Berjalan)</option>
                <option value={2025}>2025 (Arsip)</option>
                <option value={2024}>2024 (Arsip)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Unit / Klaster ILP
              </label>
              <select
                value={cluster}
                onChange={(e) => setCluster(e.target.value as UnitCluster)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="manajemen">Klaster 1: Manajemen</option>
                <option value="kia">Klaster 2: KIA & KB</option>
                <option value="dewasa_lansia">Klaster 3: Dewasa & Lansia</option>
                <option value="p2m_kesling">Klaster 4: P2M & Kesling</option>
                <option value="lintas_klaster">Lintas Klaster</option>
                <option value="tu">Tata Usaha</option>
                <option value="all">Semua Klaster / Puskesmas</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Format Tautan
              </label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="sheet">Google Spreadsheet (.xlsx)</option>
                <option value="doc">Google Docs / Word</option>
                <option value="pdf">Berkas PDF</option>
                <option value="folder">Google Drive Folder</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>URL Google Drive / Google Sheets Resmi *</span>
            </label>
            <input
              type="url"
              required
              value={driveUrl}
              onChange={(e) => setDriveUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/... atau https://drive.google.com/..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Catatan / Keterangan Dokumen
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan ringkas isi data dukung atau sasaran kegiatan..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="rounded-sm border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
            />
            <label htmlFor="isPublic" className="text-xs text-slate-700 dark:text-slate-300">
              Tampilkan juga di halaman Unduhan Dokumen Publik (Area Publik)
            </label>
          </div>

          </div>

          <div className="sticky bottom-0 z-10 shrink-0 bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-xs flex items-center justify-end gap-3 p-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer"
            >
              Simpan Tautan Gateway
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
