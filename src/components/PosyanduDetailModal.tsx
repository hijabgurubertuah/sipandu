import React from 'react';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import {
  X,
  ExternalLink,
  MapPin,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  FileSpreadsheet,
  FileText,
  Layers,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { PosyanduItem, PosyanduReportStatus } from '../types';
import { MONTH_SHORT_NAMES, MONTH_NAMES } from '../data/posyanduData';

interface PosyanduDetailModalProps {
  posyandu: PosyanduItem | null;
  onClose: () => void;
  onOpenReportForm?: (posyandu: PosyanduItem) => void;
  onVerifyReport?: (posyandu: PosyanduItem) => void;
  canVerify?: boolean;
}

export default function PosyanduDetailModal({
  posyandu,
  onClose,
  onOpenReportForm,
  onVerifyReport,
  canVerify = false
}: PosyanduDetailModalProps) {
  useBodyScrollLock(!!posyandu);

  if (!posyandu) return null;

  const getStatusBadge = (status: PosyanduReportStatus) => {
    switch (status) {
      case 'TERVERIFIKASI':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
          label: 'Terverifikasi (Lengkap)'
        };
      case 'SUDAH LAPOR':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
          icon: <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />,
          label: 'Sudah Lapor (Menunggu Verifikasi)'
        };
      case 'MENUNGGU VERIFIKASI':
        return {
          bg: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800',
          icon: <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />,
          label: 'Menunggu Verifikasi'
        };
      case 'BELUM LENGKAP':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
          icon: <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
          label: 'Belum Lengkap'
        };
      case 'PERLU PERBAIKAN':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800',
          icon: <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />,
          label: 'Perlu Perbaikan (Revisi)'
        };
      case 'DRAFT':
        return {
          bg: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
          icon: <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />,
          label: 'Draft Simpanan'
        };
      case 'BELUM LAPOR':
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
          icon: <Clock className="w-3.5 h-3.5 text-slate-500" />,
          label: 'Belum Lapor'
        };
    }
  };

  const statusInfo = getStatusBadge(posyandu.reportStatus);
  const checklist = posyandu.checklist || {
    kunjunganInputted: false,
    pelayananCompleted: false,
    kunjunganRumahInputted: false,
    administrasiCompleted: false
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="relative bg-linear-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-6 sm:p-7">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-400 text-emerald-950">
              ID: {posyandu.id}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/15 text-white border border-white/20">
              No. Urut: {posyandu.number} / 108
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/15 text-emerald-200 border border-white/20">
              Wilayah: {posyandu.village}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${posyandu.status === 'Aktif' ? 'bg-emerald-500/30 text-emerald-200' : 'bg-rose-500/30 text-rose-200'}`}>
              Status: {posyandu.status}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {posyandu.name}
          </h2>

          <div className="flex items-center gap-2 text-xs text-emerald-100/90 mt-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span>{posyandu.address}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Status Pelaporan Terkini (Bulan Berjalan)
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.bg}`}>
                  {statusInfo.icon}
                  <span>{statusInfo.label}</span>
                </span>
                <span className="text-xs text-slate-400">
                  Update: {posyandu.lastUpdated}
                </span>
              </div>
            </div>

            {canVerify && onVerifyReport && (
              <button
                onClick={() => onVerifyReport(posyandu)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verifikasi Kader Koordinator</span>
              </button>
            )}
          </div>

          {/* 4 PINTU AKSES INTEGRASI */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Tautan Sistem & Portal Posyandu (One Link Access)</span>
              </h3>
              <span className="text-[11px] text-slate-400">Dikelola oleh Admin / Posyandu</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {/* 1. Buka Sistem Posyandu */}
              <a
                href={posyandu.systemUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/90 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                      Sistem Posyandu
                    </span>
                    <ExternalLink className="w-4 h-4 text-emerald-700 dark:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Buka Sistem / Aplikasi Posyandu
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {posyandu.systemUrl || 'Belum diatur'}
                  </p>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mt-3 inline-flex items-center gap-1">
                  Buka Portal Posyandu &rarr;
                </span>
              </a>

              {/* 2. Form Pelaporan */}
              <a
                href={posyandu.reportFormUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-blue-50 hover:bg-blue-100/90 dark:bg-blue-950/40 dark:hover:bg-blue-950/70 border border-blue-200 dark:border-blue-800/80 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-200">
                      Pelaporan Online
                    </span>
                    <ExternalLink className="w-4 h-4 text-blue-700 dark:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Formulir Pelaporan Bulanan
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {posyandu.reportFormUrl || 'Belum diatur'}
                  </p>
                </div>
                <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 mt-3 inline-flex items-center gap-1">
                  Input / Perbarui Laporan &rarr;
                </span>
              </a>

              {/* 3. Linktree Informasi Desa */}
              <a
                href={posyandu.villageInfoUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-purple-50 hover:bg-purple-100/90 dark:bg-purple-950/40 dark:hover:bg-purple-950/70 border border-purple-200 dark:border-purple-800/80 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-200">
                      Informasi Desa
                    </span>
                    <ExternalLink className="w-4 h-4 text-purple-700 dark:text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Pusat Informasi {posyandu.village}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {posyandu.villageInfoUrl || 'Linktree desa'}
                  </p>
                </div>
                <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400 mt-3 inline-flex items-center gap-1">
                  Kunjungi Linktree Desa &rarr;
                </span>
              </a>

              {/* 4. Dokumen & Data Pendukung */}
              <a
                href={posyandu.docUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100/90 dark:bg-amber-950/40 dark:hover:bg-amber-950/70 border border-amber-200 dark:border-amber-800/80 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                      Eviden & Data Dukung
                    </span>
                    <ExternalLink className="w-4 h-4 text-amber-700 dark:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Google Drive Folder Dokumen
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {posyandu.docUrl || 'Drive folder'}
                  </p>
                </div>
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mt-3 inline-flex items-center gap-1">
                  Buka Folder Dokumen &rarr;
                </span>
              </a>
            </div>
          </div>

          {/* QUALITY CONTROL KELENGKAPAN OLEH KADER KOORDINATOR */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Verifikasi Berjenjang (Quality Control Kader Koordinator Desa)
                </h4>
              </div>
              <span className="text-[11px] text-slate-400">PRD Pasal 12 & 13</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-2 text-xs">
              <div className={`p-3 rounded-xl border flex items-center gap-2 ${checklist.kunjunganInputted ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}>
                <CheckCircle2 className={`w-4 h-4 ${checklist.kunjunganInputted ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>1. Data Kunjungan sudah diinput</span>
              </div>
              <div className={`p-3 rounded-xl border flex items-center gap-2 ${checklist.pelayananCompleted ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}>
                <CheckCircle2 className={`w-4 h-4 ${checklist.pelayananCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>2. Data Pelayanan sudah lengkap</span>
              </div>
              <div className={`p-3 rounded-xl border flex items-center gap-2 ${checklist.kunjunganRumahInputted ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}>
                <CheckCircle2 className={`w-4 h-4 ${checklist.kunjunganRumahInputted ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>3. Data Kunjungan Rumah diinput</span>
              </div>
              <div className={`p-3 rounded-xl border flex items-center gap-2 ${checklist.administrasiCompleted ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}>
                <CheckCircle2 className={`w-4 h-4 ${checklist.administrasiCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>4. Administrasi kegiatan lengkap</span>
              </div>
            </div>

            {posyandu.notes && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 mt-2">
                <strong>Catatan Verifikator:</strong> {posyandu.notes}
                {posyandu.verifiedBy && (
                  <span className="block text-[11px] text-amber-700 dark:text-amber-300 mt-1">
                    Diverifikasi oleh: {posyandu.verifiedBy} {posyandu.verifiedAt ? `pada ${posyandu.verifiedAt}` : ''}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* MONITORING BULANAN 12 BULAN (JAN - DES) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Monitoring Status Bulanan Tahun 2026 (Januari – Desember)</span>
              </h4>
              <span className="text-[11px] text-slate-400">PRD Pasal 15</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
              {MONTH_SHORT_NAMES.map((mName, idx) => {
                const monthIndex = idx + 1;
                const mData = posyandu.monthlyStatus?.[monthIndex];
                const isVerified = mData?.status === 'TERVERIFIKASI';
                const isCurrent = monthIndex === 9; // September
                const isReported = mData?.status === 'SUDAH LAPOR' || isVerified;
                const isPending = mData?.status === 'BELUM LENGKAP' || mData?.status === 'PERLU PERBAIKAN';
                const isNotReported = !mData || mData?.status === 'BELUM LAPOR';

                let bgClass = 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700';
                let icon = '-';
                if (isVerified) {
                  bgClass = 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800';
                  icon = '✓';
                } else if (isPending) {
                  bgClass = 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800';
                  icon = '!';
                } else if (isReported) {
                  bgClass = 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
                  icon = '⏳';
                }

                return (
                  <div
                    key={idx}
                    className={`p-2 rounded-xl border text-center flex flex-col items-center justify-center ${bgClass} ${isCurrent ? 'ring-2 ring-emerald-500 font-extrabold' : ''}`}
                    title={`${MONTH_NAMES[idx]}: ${mData?.status || 'Belum Lapor'}`}
                  >
                    <span className="text-[10px] font-black uppercase">{mName}</span>
                    <span className="text-sm font-bold mt-0.5">{icon}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-2">
              <span className="inline-flex items-center gap-1"><span className="text-emerald-600 font-bold">✓</span> Terverifikasi</span>
              <span className="inline-flex items-center gap-1"><span className="text-blue-600 font-bold">⏳</span> Sudah Lapor</span>
              <span className="inline-flex items-center gap-1"><span className="text-amber-600 font-bold">!</span> Perlu Perbaikan / Belum Lengkap</span>
              <span className="inline-flex items-center gap-1"><span className="text-slate-400 font-bold">-</span> Belum Lapor</span>
            </div>
          </div>

          {/* DATA AGREGAT (BUKAN RME / BUKAN DATA INDIVIDU) */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                Data Agregat Kegiatan Posyandu (September 2026)
              </h4>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Sesuai batasan SIPANDU (PRD Pasal 2 & 42), SIPANDU hanya menyimpan data agregat dan capaian indikator tanpa menyimpan rekam medis atau identitas individual pasien.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Sasaran Posyandu</span>
                <span className="text-base font-black text-slate-900 dark:text-white">65 Jiwa</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Jumlah Hadir/Kunjungan</span>
                <span className="text-base font-black text-emerald-600">54 Orang</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Pelayanan Selesai</span>
                <span className="text-base font-black text-blue-600">52 Orang</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Kunjungan Rumah</span>
                <span className="text-base font-black text-purple-600">6 KK</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 dark:text-slate-400 text-[11px]">
            Sistem Pantau Posyandu Kecamatan Kepanjen &bull; SIPANDU PEDULI
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              Tutup
            </button>
            <a
              href={posyandu.reportFormUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <span>Buka Formulir Pelaporan</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
