import React, { useState, useEffect } from 'react';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Save,
  FileCheck,
  Building2,
  MapPin,
  Sparkles
} from 'lucide-react';
import { PosyanduItem, PosyanduReportStatus, PosyanduChecklist } from '../types';

interface PosyanduVerifyModalProps {
  posyandu: PosyanduItem | null;
  onClose: () => void;
  onSaveVerification: (updated: PosyanduItem) => void;
  currentUserName?: string;
}

export default function PosyanduVerifyModal({
  posyandu,
  onClose,
  onSaveVerification,
  currentUserName = 'Kader Koordinator Desa'
}: PosyanduVerifyModalProps) {
  useBodyScrollLock(!!posyandu);

  const [status, setStatus] = useState<PosyanduReportStatus>('TERVERIFIKASI');
  const [checklist, setChecklist] = useState<PosyanduChecklist>({
    kunjunganInputted: true,
    pelayananCompleted: true,
    kunjunganRumahInputted: true,
    administrasiCompleted: true
  });
  const [notes, setNotes] = useState('');
  const [verifierName, setVerifierName] = useState(currentUserName);

  useEffect(() => {
    if (posyandu) {
      setStatus(posyandu.reportStatus || 'TERVERIFIKASI');
      setChecklist(posyandu.checklist || {
        kunjunganInputted: true,
        pelayananCompleted: true,
        kunjunganRumahInputted: true,
        administrasiCompleted: true
      });
      setNotes(posyandu.notes || '');
      setVerifierName(posyandu.verifiedBy || currentUserName);
    }
  }, [posyandu, currentUserName]);

  if (!posyandu) return null;

  // Auto-adjust status based on checklist toggle
  const handleChecklistChange = (key: keyof PosyanduChecklist, val: boolean) => {
    const updated = { ...checklist, [key]: val };
    setChecklist(updated);

    const allChecked = Object.values(updated).every(Boolean);
    if (!allChecked && status === 'TERVERIFIKASI') {
      setStatus('BELUM LENGKAP');
    } else if (allChecked && status === 'BELUM LENGKAP') {
      setStatus('TERVERIFIKASI');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!posyandu) return;

    const allChecked = Object.values(checklist).every(Boolean);
    const finalStatus: PosyanduReportStatus = allChecked && status === 'BELUM LENGKAP' ? 'TERVERIFIKASI' : status;

    const nowStr = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }) + `, ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;

    const updatedPosyandu: PosyanduItem = {
      ...posyandu,
      reportStatus: finalStatus,
      checklist,
      notes: notes.trim(),
      verifiedBy: verifierName.trim() || 'Kader Koordinator Desa',
      verifiedAt: nowStr,
      lastUpdated: nowStr
    };

    onSaveVerification(updatedPosyandu);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-800 to-teal-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Verifikasi Berjenjang Posyandu
                </h3>
                <p className="text-xs text-emerald-200">
                  Quality Control Awal Kader Koordinator & Puskesmas (PRD Pasal 12–14)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-white/10 border border-white/15 text-xs text-white flex items-center justify-between">
            <div>
              <span className="font-extrabold text-sm block">{posyandu.name}</span>
              <span className="text-emerald-200">Desa/Kelurahan: {posyandu.village} &bull; ID: {posyandu.id}</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-[10px] font-mono font-bold text-emerald-300">
              No. {posyandu.number}/108
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 text-xs">
          
          {/* 4 CHECKLIST QUALITY CONTROL */}
          <div>
            <label className="block font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider text-[11px]">
              Pemeriksaan Kelengkapan (4 Poin Standar) *
            </label>
            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checklist.kunjunganInputted}
                  onChange={(e) => handleChecklistChange('kunjunganInputted', e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                    1. Apakah data kunjungan sudah diinput?
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Jumlah hadir balita, bumil, lansia sesuai rekapitulasi harian.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checklist.pelayananCompleted}
                  onChange={(e) => handleChecklistChange('pelayananCompleted', e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                    2. Apakah data pelayanan sudah lengkap?
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Penimbangan, imunisasi, skrining PTM/CKG terisi penuh.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checklist.kunjunganRumahInputted}
                  onChange={(e) => handleChecklistChange('kunjunganRumahInputted', e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                    3. Apakah data kunjungan rumah sudah diinput?
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Catatan pemantauan sasaran berisiko / dropout posyandu.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checklist.administrasiCompleted}
                  onChange={(e) => handleChecklistChange('administrasiCompleted', e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                    4. Apakah administrasi kegiatan sudah lengkap?
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Buku bantu posyandu, dokumentasi & tandatangan ketua kader.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* STATUS SELECTION */}
          <div>
            <label className="block font-bold text-slate-900 dark:text-white mb-1.5 uppercase tracking-wider text-[11px]">
              Status Hasil Verifikasi *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PosyanduReportStatus)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold text-xs"
            >
              <option value="TERVERIFIKASI">✓ TERVERIFIKASI (Lengkap & Diteruskan ke Desa/Puskesmas)</option>
              <option value="SUDAH LAPOR">⏳ SUDAH LAPOR (Menunggu Verifikasi Akhir)</option>
              <option value="BELUM LENGKAP">⚠️ BELUM LENGKAP (Memerlukan Pengisian Ulang)</option>
              <option value="PERLU PERBAIKAN">✕ PERLU PERBAIKAN (Dikembalikan ke Kader Posyandu)</option>
              <option value="DRAFT">📝 DRAFT (Sedang Dikerjakan)</option>
              <option value="BELUM LAPOR">⏳ BELUM LAPOR</option>
            </select>
          </div>

          {/* CATATAN REVISI / REKOMENDASI */}
          <div>
            <label className="block font-bold text-slate-900 dark:text-white mb-1.5 uppercase tracking-wider text-[11px]">
              Catatan Evaluasi / Rekomendasi Verifikator
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Seluruh data kunjungan balita lengkap. Mohon kunjungan rumah ditindaklanjuti pada tanggal 20."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs placeholder:text-slate-400"
            />
          </div>

          {/* NAMA VERIFIKATOR */}
          <div>
            <label className="block font-bold text-slate-900 dark:text-white mb-1.5 uppercase tracking-wider text-[11px]">
              Nama Kader Koordinator / Tim Monev Puskesmas
            </label>
            <input
              type="text"
              value={verifierName}
              onChange={(e) => setVerifierName(e.target.value)}
              placeholder="Contoh: Bd. Siti Nurjanah (Koordinator Desa Kepanjen)"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
            />
          </div>

          {/* FOOTER ACTIONS */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs transition flex items-center gap-1.5 text-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Status Verifikasi</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
