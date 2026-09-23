import React, { useState } from 'react';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import {
  X,
  ExternalLink,
  Save,
  CheckCircle2,
  Calendar,
  Building2,
  FileSpreadsheet,
  Users,
  Heart,
  Baby,
  Activity,
  Home,
  Link,
  AlertCircle
} from 'lucide-react';
import { PosyanduItem, PosyanduReportStatus } from '../types';
import { MONTH_NAMES } from '../data/posyanduData';

interface PosyanduReportFormModalProps {
  posyandu: PosyanduItem | null;
  onClose: () => void;
  onSubmitReport: (updated: PosyanduItem) => void;
  currentUserName?: string;
}

export default function PosyanduReportFormModal({
  posyandu,
  onClose,
  onSubmitReport,
  currentUserName = 'Kader Posyandu'
}: PosyanduReportFormModalProps) {
  useBodyScrollLock(!!posyandu);

  const [selectedMonth, setSelectedMonth] = useState<number>(9); // Bulan 9 = September
  const [executionDate, setExecutionDate] = useState<string>('2026-09-15');
  const [kaderName, setKaderName] = useState<string>(currentUserName);
  
  // Data Pelayanan ILP Siklus Hidup
  const [balitaCount, setBalitaCount] = useState<number>(38);
  const [ibuHamilCount, setIbuHamilCount] = useState<number>(6);
  const [usiaProduktifCount, setUsiaProduktifCount] = useState<number>(45);
  const [lansiaCount, setLansiaCount] = useState<number>(22);
  const [kunjunganRumahCount, setKunjunganRumahCount] = useState<number>(4);
  
  const [docDriveUrl, setDocDriveUrl] = useState<string>(posyandu?.docUrl || '');
  const [notes, setNotes] = useState<string>('Pelaksanaan posyandu ILP lancar. Seluruh sasaran balita dan lansia terlayani.');
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  if (!posyandu) return null;

  // Safe Google Form URL guaranteed to open
  const rawFormUrl = posyandu.reportFormUrl;
  const isBrokenOrDummy = !rawFormUrl || rawFormUrl.includes('sipandu-pelaporan-') || rawFormUrl === '#';
  const googleFormUrl = isBrokenOrDummy ? 'https://docs.google.com/forms/' : rawFormUrl;

  const handleOpenGoogleForm = () => {
    window.open(googleFormUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!posyandu) return;

    const nowStr = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }) + `, ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;

    const totalPelayanan = balitaCount + ibuHamilCount + usiaProduktifCount + lansiaCount;

    const updatedMonthly = {
      ...(posyandu.monthlyStatus || {}),
      [selectedMonth]: {
        status: 'SUDAH LAPOR' as PosyanduReportStatus,
        kunjunganCount: totalPelayanan,
        pelayananCount: totalPelayanan,
        kunjunganRumahCount,
        sasaranCount: totalPelayanan + 15,
        updatedAt: nowStr
      }
    };

    const updatedPosyandu: PosyanduItem = {
      ...posyandu,
      reportStatus: 'SUDAH LAPOR',
      lastUpdated: nowStr,
      docUrl: docDriveUrl.trim() || posyandu.docUrl,
      notes: notes.trim(),
      checklist: {
        kunjunganInputted: true,
        pelayananCompleted: true,
        kunjunganRumahInputted: kunjunganRumahCount > 0,
        administrasiCompleted: true
      },
      monthlyStatus: updatedMonthly
    };

    onSubmitReport(updatedPosyandu);
    setIsSuccessToast(true);
    setTimeout(() => {
      setIsSuccessToast(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Header */}
        <div className="relative bg-linear-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-6 sm:p-7">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-300 text-blue-950">
              ID: {posyandu.id}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/15 text-white border border-white/20">
              Desa {posyandu.village}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/15 text-blue-100 border border-white/20">
              #{posyandu.number} dari 108 Posyandu
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-blue-200 shrink-0" />
            <span>Formulir Pelaporan Posyandu</span>
          </h2>
          <p className="text-xs text-blue-100/90 mt-1">
            {posyandu.name} &bull; {posyandu.address}
          </p>
        </div>

        {/* Action Banner for Google Form */}
        <div className="bg-blue-50 dark:bg-blue-950/60 border-b border-blue-200 dark:border-blue-900/60 p-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ExternalLink className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-blue-950 dark:text-blue-100">
                Pilihan Pengisian Google Forms Resmi
              </h4>
              <p className="text-[11px] text-blue-800/80 dark:text-blue-300 line-clamp-1">
                {googleFormUrl}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleOpenGoogleForm}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
          >
            <span>Buka di Google Forms</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5 max-h-[65vh] overflow-y-auto text-xs">
          
          {isSuccessToast && (
            <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Laporan posyandu berhasil disimpan dan diperbarui di sistem!</span>
            </div>
          )}

          {/* Grid Informasi Umum */}
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Bulan Pelaporan
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={idx} value={idx + 1}>
                    {m} 2026
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tanggal Pelaksanaan
              </label>
              <input
                type="date"
                value={executionDate}
                onChange={(e) => setExecutionDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Kader Pelapor
              </label>
              <input
                type="text"
                value={kaderName}
                onChange={(e) => setKaderName(e.target.value)}
                placeholder="Nama kader..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                required
              />
            </div>
          </div>

          {/* Card Statistik Pelayanan ILP */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>Capaian Layanan Integrasi Layanan Primer (ILP)</span>
              </span>
              <span className="text-[10px] text-slate-500">Jumlah Sasaran yang Dilayani</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] font-bold text-slate-500 block">Bayi & Balita</span>
                <input
                  type="number"
                  min="0"
                  value={balitaCount}
                  onChange={(e) => setBalitaCount(Number(e.target.value))}
                  className="w-full text-center text-base font-black text-slate-900 dark:text-white mt-1 border-b border-blue-400 bg-transparent"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] font-bold text-slate-500 block">Ibu Hamil</span>
                <input
                  type="number"
                  min="0"
                  value={ibuHamilCount}
                  onChange={(e) => setIbuHamilCount(Number(e.target.value))}
                  className="w-full text-center text-base font-black text-slate-900 dark:text-white mt-1 border-b border-blue-400 bg-transparent"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] font-bold text-slate-500 block">Usia Produktif</span>
                <input
                  type="number"
                  min="0"
                  value={usiaProduktifCount}
                  onChange={(e) => setUsiaProduktifCount(Number(e.target.value))}
                  className="w-full text-center text-base font-black text-slate-900 dark:text-white mt-1 border-b border-blue-400 bg-transparent"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] font-bold text-slate-500 block">Lanjut Usia</span>
                <input
                  type="number"
                  min="0"
                  value={lansiaCount}
                  onChange={(e) => setLansiaCount(Number(e.target.value))}
                  className="w-full text-center text-base font-black text-slate-900 dark:text-white mt-1 border-b border-blue-400 bg-transparent"
                />
              </div>

              <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] font-bold text-slate-500 block">Kunjungan Rumah</span>
                <input
                  type="number"
                  min="0"
                  value={kunjunganRumahCount}
                  onChange={(e) => setKunjunganRumahCount(Number(e.target.value))}
                  className="w-full text-center text-base font-black text-slate-900 dark:text-white mt-1 border-b border-blue-400 bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* URL Eviden / Google Drive */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
              <span>Link Folder Google Drive / Bukti Eviden Foto</span>
              <span className="text-[10px] text-slate-400">Opsional</span>
            </label>
            <div className="relative">
              <Link className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={docDriveUrl}
                onChange={(e) => setDocDriveUrl(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Catatan Pelaporan */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              Catatan Hasil Kegiatan & Kendala (Jika Ada)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan pelaksanaan, temuan kasus berisiko, atau kendala alat..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Simpan & Kirim Laporan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
