import React, { useState, useMemo } from 'react';
import {
  Building2,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet,
  Calendar,
  MapPin,
  Sparkles,
  HelpCircle,
  FileText,
  RefreshCw,
  Eye,
  Info,
  SlidersHorizontal,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { PosyanduItem, VillageData, PosyanduReportStatus, UserRole } from '../types';
import { VILLAGES_18_DATA, MONTH_NAMES, MONTH_SHORT_NAMES } from '../data/posyanduData';
import PosyanduDetailModal from './PosyanduDetailModal';
import PosyanduVerifyModal from './PosyanduVerifyModal';
import PosyanduReportFormModal from './PosyanduReportFormModal';

interface PosyanduMonitoringHubProps {
  posyanduList: PosyanduItem[];
  onUpdatePosyandu: (updated: PosyanduItem) => void;
  currentUserRole?: UserRole;
  currentUserName?: string;
  isPortalPegawaiOrAdmin?: boolean;
}

export default function PosyanduMonitoringHub({
  posyanduList,
  onUpdatePosyandu,
  currentUserRole = 'viewer',
  currentUserName = 'Petugas Monev Puskesmas',
  isPortalPegawaiOrAdmin = false
}: PosyanduMonitoringHubProps) {
  // Navigation subtabs inside Posyandu Hub
  const [activeSubtab, setActiveSubtab] = useState<
    'direktori' | 'dashboard' | 'rekap_desa' | 'rekap_bulanan' | 'alur_verifikasi'
  >('direktori');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVillageFilter, setSelectedVillageFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<number>(9); // Default September (Month 9)

  // Modals state
  const [selectedPosyanduForDetail, setSelectedPosyanduForDetail] = useState<PosyanduItem | null>(null);
  const [selectedPosyanduForVerify, setSelectedPosyanduForVerify] = useState<PosyanduItem | null>(null);
  const [selectedPosyanduForReport, setSelectedPosyanduForReport] = useState<PosyanduItem | null>(null);

  // Drill-down filter in Dashboard
  const [drillDownVillage, setDrillDownVillage] = useState<string>('ALL');
  const [drillDownPosyanduId, setDrillDownPosyanduId] = useState<string>('ALL');

  // Check if current user can perform verification (Koordinator, Admin, Super Admin, Pimpinan, or in Pegawai/Admin portal)
  const canVerify = isPortalPegawaiOrAdmin || 
    currentUserRole === 'super_admin' || 
    currentUserRole === 'admin' || 
    currentUserRole === 'koordinator' || 
    currentUserRole === 'pimpinan';

  // Filtered Posyandu list for Directory
  const filteredPosyandus = useMemo(() => {
    return posyanduList.filter((item) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchVillage =
        selectedVillageFilter === 'ALL' || item.village === selectedVillageFilter;

      const matchStatus =
        selectedStatusFilter === 'ALL' || item.reportStatus === selectedStatusFilter;

      return matchSearch && matchVillage && matchStatus;
    });
  }, [posyanduList, searchQuery, selectedVillageFilter, selectedStatusFilter]);

  // Aggregate Stats for Dashboard
  const stats = useMemo(() => {
    const total = posyanduList.length;
    let sudahLapor = 0;
    let belumLapor = 0;
    let lengkap = 0; // Terverifikasi
    let belumLengkap = 0;
    let perluPerbaikan = 0;
    let draft = 0;

    posyanduList.forEach((p) => {
      if (p.reportStatus === 'TERVERIFIKASI') {
        lengkap++;
        sudahLapor++;
      } else if (p.reportStatus === 'SUDAH LAPOR' || p.reportStatus === 'MENUNGGU VERIFIKASI') {
        sudahLapor++;
      } else if (p.reportStatus === 'BELUM LENGKAP') {
        belumLengkap++;
        sudahLapor++;
      } else if (p.reportStatus === 'PERLU PERBAIKAN') {
        perluPerbaikan++;
        sudahLapor++;
      } else if (p.reportStatus === 'DRAFT') {
        draft++;
      } else {
        belumLapor++;
      }
    });

    const completionRate = total > 0 ? Math.round((lengkap / total) * 100) : 0;
    const reportingRate = total > 0 ? Math.round((sudahLapor / total) * 100) : 0;

    return {
      total,
      sudahLapor,
      belumLapor,
      lengkap,
      belumLengkap,
      perluPerbaikan,
      draft,
      completionRate,
      reportingRate
    };
  }, [posyanduList]);

  // Rekapitulasi per 18 Desa/Kelurahan
  const villageRecap = useMemo(() => {
    return VILLAGES_18_DATA.map((v) => {
      const posyandusInVillage = posyanduList.filter((p) => p.village === v.name);
      const total = posyandusInVillage.length;
      let lengkapCount = 0;
      let belumLengkapCount = 0;
      let belumLaporCount = 0;
      let perbaikanCount = 0;

      posyandusInVillage.forEach((p) => {
        if (p.reportStatus === 'TERVERIFIKASI') {
          lengkapCount++;
        } else if (p.reportStatus === 'BELUM LENGKAP') {
          belumLengkapCount++;
        } else if (p.reportStatus === 'PERLU PERBAIKAN') {
          perbaikanCount++;
        } else if (p.reportStatus === 'BELUM LAPOR') {
          belumLaporCount++;
        } else {
          // 'SUDAH LAPOR' or 'MENUNGGU VERIFIKASI'
          lengkapCount++;
        }
      });

      const percentage = total > 0 ? Math.round((lengkapCount / total) * 100) : 0;

      return {
        ...v,
        total,
        lengkapCount,
        belumLengkapCount,
        perbaikanCount,
        belumLaporCount,
        percentage
      };
    });
  }, [posyanduList]);

  // Rekapitulasi Bulanan (Januari - Desember)
  const monthlyRecap = useMemo(() => {
    return MONTH_NAMES.map((mName, idx) => {
      const monthIndex = idx + 1;
      let reported = 0;
      let verified = 0;
      let notReported = 0;
      let totalKunjungan = 0;
      let totalPelayanan = 0;
      let totalKunjunganRumah = 0;

      posyanduList.forEach((p) => {
        const m = p.monthlyStatus?.[monthIndex];
        if (m && m.status !== 'BELUM LAPOR') {
          reported++;
          if (m.status === 'TERVERIFIKASI') verified++;
          totalKunjungan += m.kunjunganCount || 0;
          totalPelayanan += m.pelayananCount || 0;
          totalKunjunganRumah += m.kunjunganRumahCount || 0;
        } else {
          notReported++;
        }
      });

      const percentage = posyanduList.length > 0
        ? Math.round((reported / posyanduList.length) * 100)
        : 0;

      return {
        monthIndex,
        monthName: mName,
        totalPosyandu: posyanduList.length,
        reported,
        verified,
        notReported,
        percentage,
        totalKunjungan,
        totalPelayanan,
        totalKunjunganRumah
      };
    });
  }, [posyanduList]);

  // Semester Recap
  const semester1Stats = useMemo(() => {
    const s1 = monthlyRecap.slice(0, 6);
    const avgPct = Math.round(s1.reduce((acc, m) => acc + m.percentage, 0) / 6);
    const totKunjungan = s1.reduce((acc, m) => acc + m.totalKunjungan, 0);
    return { avgPct, totKunjungan };
  }, [monthlyRecap]);

  const semester2Stats = useMemo(() => {
    const s2 = monthlyRecap.slice(6, 12);
    // Month 7, 8, 9 active, 10,11,12 upcoming
    const activeMonths = s2.slice(0, 3);
    const avgPct = Math.round(activeMonths.reduce((acc, m) => acc + m.percentage, 0) / 3);
    const totKunjungan = activeMonths.reduce((acc, m) => acc + m.totalKunjungan, 0);
    return { avgPct, totKunjungan };
  }, [monthlyRecap]);

  // CSV Export Handlers
  const handleExportPosyanduCSV = () => {
    const headers = ['ID', 'Nomor', 'Nama Posyandu', 'Desa/Kelurahan', 'Alamat', 'Status Keaktifan', 'Status Pelaporan', 'Link Sistem', 'Link Form Pelaporan', 'Link Dokumen', 'Link Informasi Desa', 'Terakhir Diperbarui'];
    const rows = posyanduList.map((p) => [
      `"${p.id}"`,
      p.number,
      `"${p.name}"`,
      `"${p.village}"`,
      `"${p.address.replace(/"/g, '""')}"`,
      `"${p.status}"`,
      `"${p.reportStatus}"`,
      `"${p.systemUrl || ''}"`,
      `"${p.reportFormUrl || ''}"`,
      `"${p.docUrl || ''}"`,
      `"${p.villageInfoUrl || ''}"`,
      `"${p.lastUpdated}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Master_108_Posyandu_Kepanjen_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportVillageCSV = () => {
    const headers = ['No', 'Desa/Kelurahan', 'Tipe', 'Jumlah Posyandu', 'Lengkap (Terverifikasi)', 'Belum Lengkap', 'Perlu Perbaikan', 'Belum Lapor', '% Kelengkapan', 'Link Informasi Desa'];
    const rows = villageRecap.map((v, idx) => [
      idx + 1,
      `"${v.name}"`,
      `"${v.type}"`,
      v.total,
      v.lengkapCount,
      v.belumLengkapCount,
      v.perbaikanCount,
      v.belumLaporCount,
      `"${v.percentage}%"`,
      `"${v.linktreeUrl}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_18_Desa_Posyandu_Kepanjen_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportMonthlyCSV = () => {
    const headers = ['Bulan', 'Jumlah Posyandu', 'Jumlah Laporan', 'Belum Lapor', '% Kelengkapan', 'Data Kunjungan Agregat', 'Data Pelayanan Agregat', 'Data Kunjungan Rumah'];
    const rows = monthlyRecap.map((m) => [
      `"${m.monthName}"`,
      m.totalPosyandu,
      m.reported,
      m.notReported,
      `"${m.percentage}%"`,
      m.totalKunjungan,
      m.totalPelayanan,
      m.totalKunjunganRumah
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Bulanan_Posyandu_2026_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* HEADER UTAMA MODUL POSYANDU */}
      <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modul Mitra Faskes &bull; Ekosistem 108 Posyandu</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Pencatatan, Pelaporan & Monitoring 108 Posyandu
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/85 leading-relaxed">
              SIPANDU PEDULI sebagai <strong>Integration Hub</strong> menghubungkan Puskesmas Kepanjen, 3 Pustu, 18 Desa/Kelurahan, dan 108 Posyandu tanpa menduplikasi data rekam medis individual.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={handleExportPosyanduCSV}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center gap-2 transition"
              title="Unduh data 108 Posyandu ke Excel/CSV"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span>Unduh Excel/CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center gap-2 transition"
              title="Cetak Ringkasan"
            >
              <Printer className="w-4 h-4 text-emerald-300" />
              <span>Cetak Rekap</span>
            </button>
          </div>
        </div>

        {/* SUBTAB NAVIGATION */}
        <div className="mt-8 pt-4 border-t border-emerald-800/60 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveSubtab('direktori')}
            className={`px-4 py-2 rounded-xl font-bold transition shrink-0 flex items-center gap-2 ${
              activeSubtab === 'direktori'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                : 'bg-white/10 text-emerald-100 hover:bg-white/20'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Direktori 108 Posyandu</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-950/30 text-[10px]">108</span>
          </button>

          <button
            onClick={() => setActiveSubtab('dashboard')}
            className={`px-4 py-2 rounded-xl font-bold transition shrink-0 flex items-center gap-2 ${
              activeSubtab === 'dashboard'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                : 'bg-white/10 text-emerald-100 hover:bg-white/20'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Dashboard Puskesmas</span>
          </button>

          <button
            onClick={() => setActiveSubtab('rekap_desa')}
            className={`px-4 py-2 rounded-xl font-bold transition shrink-0 flex items-center gap-2 ${
              activeSubtab === 'rekap_desa'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                : 'bg-white/10 text-emerald-100 hover:bg-white/20'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Rekap 18 Desa</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-950/30 text-[10px]">18</span>
          </button>

          <button
            onClick={() => setActiveSubtab('rekap_bulanan')}
            className={`px-4 py-2 rounded-xl font-bold transition shrink-0 flex items-center gap-2 ${
              activeSubtab === 'rekap_bulanan'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                : 'bg-white/10 text-emerald-100 hover:bg-white/20'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Rekap Bulanan & Semester</span>
          </button>

          <button
            onClick={() => setActiveSubtab('alur_verifikasi')}
            className={`px-4 py-2 rounded-xl font-bold transition shrink-0 flex items-center gap-2 ${
              activeSubtab === 'alur_verifikasi'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                : 'bg-white/10 text-emerald-100 hover:bg-white/20'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Alur Verifikasi Berjenjang</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          TAB 1: DIREKTORI 108 POSYANDU SE-KEPANJEN
      ====================================================================== */}
      {activeSubtab === 'direktori' && (
        <div className="space-y-6">
          
          {/* Quick Village Info Bar (18 Desa Badges with official Linktree) */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Pilih Wilayah 18 Desa / Kelurahan</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Klik untuk filter daftar posyandu &bull; Tombol linktree membuka portal informasi desa
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedVillageFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedVillageFilter === 'ALL'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700/70 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                }`}
              >
                Semua Desa (108)
              </button>

              {VILLAGES_18_DATA.map((v) => (
                <div key={v.id} className="inline-flex items-center rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setSelectedVillageFilter(v.name)}
                    className={`px-2.5 py-1.5 text-xs font-bold transition ${
                      selectedVillageFilter === v.name
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {v.name} ({v.posyanduCount})
                  </button>
                  <a
                    href={v.linktreeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 transition border-l border-slate-200 dark:border-slate-600"
                    title={`Buka Pusat Informasi Linktree ${v.name}`}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama posyandu, ID (KPN-001), desa, atau alamat RW..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold"
              >
                <option value="ALL">Semua Status Pelaporan</option>
                <option value="TERVERIFIKASI">✓ Terverifikasi</option>
                <option value="SUDAH LAPOR">⏳ Sudah Lapor</option>
                <option value="BELUM LENGKAP">⚠️ Belum Lengkap</option>
                <option value="PERLU PERBAIKAN">✕ Perlu Perbaikan</option>
                <option value="BELUM LAPOR">⏳ Belum Lapor</option>
              </select>

              <div className="text-right whitespace-nowrap text-slate-500 dark:text-slate-400">
                Menampilkan <strong className="text-emerald-600">{filteredPosyandus.length}</strong> dari 108
              </div>
            </div>
          </div>

          {/* Grid Direktori Posyandu */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosyandus.map((pos) => {
              const isVerified = pos.reportStatus === 'TERVERIFIKASI';
              const isPending = pos.reportStatus === 'BELUM LENGKAP' || pos.reportStatus === 'PERLU PERBAIKAN';
              const isWaiting = pos.reportStatus === 'SUDAH LAPOR' || pos.reportStatus === 'MENUNGGU VERIFIKASI';

              let statusBadgeClass = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
              if (isVerified) statusBadgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800';
              else if (isPending) statusBadgeClass = 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800';
              else if (isWaiting) statusBadgeClass = 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';

              return (
                <div
                  key={pos.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-xs hover:border-emerald-500/60 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    {/* Card Top: Badges */}
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold">
                          {pos.id}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[10px] text-slate-500 font-mono">
                          #{pos.number}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                        {pos.village}
                      </span>
                    </div>

                    {/* Card Title */}
                    <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1.5">
                      {pos.name}
                    </h3>

                    {/* Address */}
                    <div className="flex items-start gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{pos.address}</span>
                    </div>

                    {/* Status Pill */}
                    <div className="mb-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusBadgeClass}`}>
                        {isVerified && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {isPending && <AlertCircle className="w-3 h-3 text-amber-600" />}
                        {isWaiting && <Clock className="w-3 h-3 text-blue-600" />}
                        {!isVerified && !isPending && !isWaiting && <Clock className="w-3 h-3 text-slate-400" />}
                        <span>{pos.reportStatus}</span>
                      </span>
                    </div>

                    {/* 4 Quick Action Badges */}
                    <div className="grid grid-cols-2 gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-700/80 text-[10px] mb-3">
                      <a
                        href={pos.systemUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 font-semibold flex items-center justify-between transition"
                        title="Buka Sistem Posyandu"
                      >
                        <span className="truncate">Sistem Pos</span>
                        <ExternalLink className="w-3 h-3 shrink-0 ml-1" />
                      </a>
                      <button
                        type="button"
                        onClick={() => setSelectedPosyanduForReport(pos)}
                        className="px-2 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-800 dark:text-blue-300 font-semibold flex items-center justify-between transition cursor-pointer"
                        title="Formulir Pelaporan (Buka Google Forms)"
                      >
                        <span className="truncate">Pelaporan</span>
                        <ExternalLink className="w-3 h-3 shrink-0 ml-1" />
                      </button>
                      <a
                        href={pos.villageInfoUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-800 dark:text-purple-300 font-semibold flex items-center justify-between transition"
                        title="Portal Informasi Desa"
                      >
                        <span className="truncate">Info Desa</span>
                        <ExternalLink className="w-3 h-3 shrink-0 ml-1" />
                      </a>
                      <a
                        href={pos.docUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-800 dark:text-amber-300 font-semibold flex items-center justify-between transition"
                        title="Dokumen & Eviden"
                      >
                        <span className="truncate">Dokumen</span>
                        <ExternalLink className="w-3 h-3 shrink-0 ml-1" />
                      </a>
                    </div>
                  </div>

                  {/* Card Bottom: Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/80">
                    <button
                      onClick={() => setSelectedPosyanduForDetail(pos)}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat Detail</span>
                    </button>

                    {canVerify && (
                      <button
                        onClick={() => setSelectedPosyanduForVerify(pos)}
                        className="py-1.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1"
                        title="Verifikasi / Quality Control Laporan"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verifikasi</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredPosyandus.length === 0 && (
              <div className="col-span-full py-12 px-6 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  Tidak Ada Posyandu yang Sesuai Filter
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                  Tidak ditemukan data posyandu dengan filter atau kata kunci pencarian saat ini.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedVillageFilter('ALL');
                    setSelectedStatusFilter('ALL');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
                >
                  Reset Semua Filter (Tampilkan 108 Posyandu)
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* =====================================================================
          TAB 2: DASHBOARD & EXECUTIVE MONITORING PUSKESMAS
      ====================================================================== */}
      {activeSubtab === 'dashboard' && (
        <div className="space-y-6">
          
          {/* Executive KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Posyandu</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{stats.total}</span>
              <span className="text-[10px] text-slate-500">18 Desa Binaan</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Desa / Kelurahan</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">18</span>
              <span className="text-[10px] text-slate-500">Kec. Kepanjen</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">Sudah Lapor</span>
              <span className="text-2xl font-black text-blue-600 mt-1 block">{stats.sudahLapor}</span>
              <span className="text-[10px] text-slate-500">{stats.reportingRate}% Partisipasi</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Belum Lapor</span>
              <span className="text-2xl font-black text-slate-700 dark:text-slate-300 mt-1 block">{stats.belumLapor}</span>
              <span className="text-[10px] text-slate-400">Posyandu</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Lengkap / Terverifikasi</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">{stats.lengkap}</span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">{stats.completionRate}% Target</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">Belum Lengkap</span>
              <span className="text-2xl font-black text-amber-600 mt-1 block">{stats.belumLengkap}</span>
              <span className="text-[10px] text-amber-600 font-semibold">Tindak Lanjut</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">Perlu Perbaikan</span>
              <span className="text-2xl font-black text-rose-600 mt-1 block">{stats.perluPerbaikan}</span>
              <span className="text-[10px] text-rose-600 font-semibold">Revisi Kader</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-800 text-white shadow-xs">
              <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider block">% Kelengkapan</span>
              <span className="text-2xl font-black text-emerald-300 mt-1 block">{stats.completionRate}%</span>
              <span className="text-[10px] text-emerald-100">Capaian Agregat</span>
            </div>
          </div>

          {/* DRILL-DOWN MONITORING (Kecamatan -> Desa -> Posyandu -> Bulan -> Status Laporan) */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Fitur Penelusuran Mendalam (Drill Down)
                </span>
                <h3 className="text-sm font-black text-slate-900 dark:text-white mt-1">
                  Drill Down: Kecamatan &rarr; Desa &rarr; Posyandu &rarr; Bulan &rarr; Status Laporan
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Puskesmas dapat menelusuri detail hingga ke tingkat Posyandu satuan (PRD Pasal 41).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Pilih Bulan:</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white"
                >
                  {MONTH_NAMES.map((name, i) => (
                    <option key={i} value={i + 1}>
                      {name} 2026
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  1. Pilih Desa / Kelurahan:
                </label>
                <select
                  value={drillDownVillage}
                  onChange={(e) => {
                    setDrillDownVillage(e.target.value);
                    setDrillDownPosyanduId('ALL');
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="ALL">-- Semua 18 Desa / Kelurahan --</option>
                  {VILLAGES_18_DATA.map((v) => (
                    <option key={v.id} value={v.name}>
                      {v.name} ({v.posyanduCount} Posyandu)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  2. Pilih Posyandu Spesifik:
                </label>
                <select
                  value={drillDownPosyanduId}
                  onChange={(e) => setDrillDownPosyanduId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="ALL">-- Tampilkan Semua di Desa Ini --</option>
                  {posyanduList
                    .filter((p) => drillDownVillage === 'ALL' || p.village === drillDownVillage)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.id} - {p.name} ({p.village})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Drill Down Results Display */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80">
              {drillDownPosyanduId !== 'ALL' ? (
                (() => {
                  const targetPos = posyanduList.find((p) => p.id === drillDownPosyanduId);
                  if (!targetPos) return null;
                  const monthData = targetPos.monthlyStatus?.[selectedMonth];
                  return (
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                            {targetPos.id} &bull; {targetPos.name}
                          </span>
                          <p className="text-xs text-slate-500">{targetPos.address}</p>
                        </div>
                        <button
                          onClick={() => setSelectedPosyanduForDetail(targetPos)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs self-start sm:self-auto"
                        >
                          Buka Detail & Tautan Posyandu
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border">
                          <span className="text-[10px] text-slate-400 block">Bulan Terpilih</span>
                          <strong className="text-slate-800 dark:text-slate-200">{MONTH_NAMES[selectedMonth - 1]} 2026</strong>
                        </div>
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border">
                          <span className="text-[10px] text-slate-400 block">Status Laporan</span>
                          <strong className="text-emerald-600">{monthData?.status || targetPos.reportStatus}</strong>
                        </div>
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border">
                          <span className="text-[10px] text-slate-400 block">Data Kunjungan</span>
                          <strong>{monthData?.kunjunganCount || 0} Orang</strong>
                        </div>
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border">
                          <span className="text-[10px] text-slate-400 block">Kunjungan Rumah</span>
                          <strong>{monthData?.kunjunganRumahCount || 0} Sasaran</strong>
                        </div>
                      </div>
                      {targetPos.notes && (
                        <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                          <strong>Catatan Monev:</strong> {targetPos.notes}
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : (
                <div className="text-xs text-slate-500 dark:text-slate-400 text-center py-2">
                  Silakan pilih Posyandu spesifik di atas untuk meninjau riwayat pelaporan pada bulan {MONTH_NAMES[selectedMonth - 1]} 2026.
                </div>
              )}
            </div>
          </div>

          {/* POSYANDU YANG BELUM MELAPOR / PERLU PERBAIKAN HIGHLIGHT */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Belum Lapor */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>Posyandu Belum Lapor ({stats.belumLapor})</span>
                </h4>
                <span className="text-[10px] text-slate-400">Periode September 2026</span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {posyanduList
                  .filter((p) => p.reportStatus === 'BELUM LAPOR')
                  .map((p) => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{p.name}</span>
                        <span className="text-[11px] text-slate-500 block">{p.village} &bull; {p.id}</span>
                      </div>
                      <button
                        onClick={() => setSelectedPosyanduForDetail(p)}
                        className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white text-[11px] font-bold transition"
                      >
                        Ingatkan / Detail
                      </button>
                    </div>
                  ))}
                {posyanduList.filter((p) => p.reportStatus === 'BELUM LAPOR').length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-400">
                    Semua posyandu telah mengirimkan laporan!
                  </div>
                )}
              </div>
            </div>

            {/* Perlu Perbaikan / Belum Lengkap */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Perlu Perbaikan / Belum Lengkap ({stats.belumLengkap + stats.perluPerbaikan})</span>
                </h4>
                <span className="text-[10px] text-slate-400">Quality Control Koordinator</span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {posyanduList
                  .filter((p) => p.reportStatus === 'BELUM LENGKAP' || p.reportStatus === 'PERLU PERBAIKAN')
                  .map((p) => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-white">{p.name}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                            {p.reportStatus}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 block truncate max-w-xs">{p.notes || p.village}</span>
                      </div>
                      <button
                        onClick={() => setSelectedPosyanduForVerify(p)}
                        className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold transition"
                      >
                        Periksa
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* =====================================================================
          TAB 3: REKAPITULASI 18 DESA / KELURAHAN
      ====================================================================== */}
      {activeSubtab === 'rekap_desa' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Tabel Rekapitulasi Status Pelaporan Posyandu per Desa / Kelurahan
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Data agregat pemantauan 18 Desa/Kelurahan wilayah kerja UPTD Puskesmas Kepanjen (PRD Pasal 16 & 18).
                </p>
              </div>

              <button
                onClick={handleExportVillageCSV}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto transition shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ekspor Rekap Desa (.CSV)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="p-4">No</th>
                    <th className="p-4">Desa / Kelurahan</th>
                    <th className="p-4 text-center">Tipe</th>
                    <th className="p-4 text-center">Jumlah Posyandu</th>
                    <th className="p-4 text-center">Lengkap (Terverifikasi)</th>
                    <th className="p-4 text-center">Belum Lengkap</th>
                    <th className="p-4 text-center">Perlu Perbaikan</th>
                    <th className="p-4 text-center">Belum Lapor</th>
                    <th className="p-4 text-center">% Kelengkapan</th>
                    <th className="p-4 text-center">Portal Informasi Desa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/80">
                  {villageRecap.map((v, idx) => (
                    <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="p-4 font-mono text-slate-400">{idx + 1}</td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white">
                        {v.name}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${v.type === 'Kelurahan' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'}`}>
                          {v.type}
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold text-slate-900 dark:text-white">
                        {v.total}
                      </td>
                      <td className="p-4 text-center font-bold text-emerald-600">
                        {v.lengkapCount}
                      </td>
                      <td className="p-4 text-center text-amber-600 font-semibold">
                        {v.belumLengkapCount}
                      </td>
                      <td className="p-4 text-center text-rose-600 font-semibold">
                        {v.perbaikanCount}
                      </td>
                      <td className="p-4 text-center text-slate-400">
                        {v.belumLaporCount}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                v.percentage >= 90 ? 'bg-emerald-500' : v.percentage >= 70 ? 'bg-blue-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${v.percentage}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold">{v.percentage}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <a
                          href={v.linktreeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-semibold transition"
                        >
                          <span>Linktree</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 dark:bg-slate-900 font-bold border-t border-slate-200 dark:border-slate-700">
                  <tr>
                    <td colSpan={3} className="p-4 text-slate-700 dark:text-slate-300">TOTAL 18 DESA / KELURAHAN</td>
                    <td className="p-4 text-center text-slate-900 dark:text-white">{stats.total}</td>
                    <td className="p-4 text-center text-emerald-600">{stats.lengkap}</td>
                    <td className="p-4 text-center text-amber-600">{stats.belumLengkap}</td>
                    <td className="p-4 text-center text-rose-600">{stats.perluPerbaikan}</td>
                    <td className="p-4 text-center text-slate-400">{stats.belumLapor}</td>
                    <td className="p-4 text-center font-mono text-emerald-700 dark:text-emerald-400">{stats.completionRate}%</td>
                    <td className="p-4 text-center">-</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: REKAPITULASI BULANAN & SEMESTER
      ====================================================================== */}
      {activeSubtab === 'rekap_bulanan' && (
        <div className="space-y-6">
          
          {/* Semester Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-linear-to-br from-emerald-800 to-teal-900 text-white shadow-sm space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-emerald-200 uppercase tracking-wider">
                Semester 1 (Januari – Juni 2026)
              </span>
              <h4 className="text-lg font-black">Capaian Pelaporan Semester I</h4>
              <div className="flex items-center gap-6 pt-2">
                <div>
                  <span className="text-2xl font-black text-emerald-300">{semester1Stats.avgPct}%</span>
                  <span className="text-[11px] text-emerald-100 block">Rata-Rata Kelengkapan</span>
                </div>
                <div className="border-l border-white/20 pl-6">
                  <span className="text-2xl font-black text-white">{semester1Stats.totKunjungan.toLocaleString()}</span>
                  <span className="text-[11px] text-emerald-100 block">Total Kunjungan Balita & Lansia</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-linear-to-br from-blue-800 to-indigo-900 text-white shadow-sm space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-blue-200 uppercase tracking-wider">
                Semester 2 (Juli – Desember 2026)
              </span>
              <h4 className="text-lg font-black">Capaian Pelaporan Semester II (Berjalan)</h4>
              <div className="flex items-center gap-6 pt-2">
                <div>
                  <span className="text-2xl font-black text-blue-300">{semester2Stats.avgPct}%</span>
                  <span className="text-[11px] text-blue-100 block">Kelengkapan Triwulan 3</span>
                </div>
                <div className="border-l border-white/20 pl-6">
                  <span className="text-2xl font-black text-white">{semester2Stats.totKunjungan.toLocaleString()}</span>
                  <span className="text-[11px] text-blue-100 block">Kunjungan Terpantau</span>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Tabel Rekapitulasi Bulanan Posyandu Tahun 2026
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Data agregat per bulan mencakup kunjungan, sasaran pelayanan, dan kunjungan rumah (PRD Pasal 19).
                </p>
              </div>

              <button
                onClick={handleExportMonthlyCSV}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto transition shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ekspor Rekap Bulanan (.CSV)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="p-4">Bulan</th>
                    <th className="p-4 text-center">Jumlah Posyandu</th>
                    <th className="p-4 text-center">Jumlah Laporan</th>
                    <th className="p-4 text-center">Belum Lapor</th>
                    <th className="p-4 text-center">% Kelengkapan</th>
                    <th className="p-4 text-center">Data Kunjungan Agregat</th>
                    <th className="p-4 text-center">Data Pelayanan Agregat</th>
                    <th className="p-4 text-center">Kunjungan Rumah Agregat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/80">
                  {monthlyRecap.map((m) => (
                    <tr key={m.monthIndex} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="p-4 font-bold text-slate-900 dark:text-white">
                        {m.monthName}
                      </td>
                      <td className="p-4 text-center text-slate-600 dark:text-slate-300">
                        {m.totalPosyandu}
                      </td>
                      <td className="p-4 text-center font-bold text-emerald-600">
                        {m.reported}
                      </td>
                      <td className="p-4 text-center text-slate-400">
                        {m.notReported}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                m.percentage >= 85 ? 'bg-emerald-500' : m.percentage >= 60 ? 'bg-blue-500' : 'bg-slate-400'
                              }`}
                              style={{ width: `${m.percentage}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold">{m.percentage}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-center font-mono">
                        {m.totalKunjungan > 0 ? `${m.totalKunjungan.toLocaleString()} Orang` : '-'}
                      </td>
                      <td className="p-4 text-center font-mono">
                        {m.totalPelayanan > 0 ? `${m.totalPelayanan.toLocaleString()} Orang` : '-'}
                      </td>
                      <td className="p-4 text-center font-mono">
                        {m.totalKunjunganRumah > 0 ? `${m.totalKunjunganRumah.toLocaleString()} KK` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: ALUR PELAPORAN & QUALITY CONTROL VERIFIKASI BERJENJANG
      ====================================================================== */}
      {activeSubtab === 'alur_verifikasi' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-6">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 uppercase tracking-wider">
                PRD Pasal 12 & 13
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                Alur Pelaporan & Verifikasi Berjenjang Posyandu
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Kader Koordinator Desa bertindak sebagai <strong>Quality Control Awal</strong> sebelum laporan diteruskan ke Desa dan Puskesmas.
              </p>
            </div>

            {/* 6 Tahapan Visual */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h4 className="text-sm font-bold text-white">Kegiatan Posyandu</h4>
                <p className="text-xs text-slate-300">
                  Kader Posyandu melaksanakan pelayanan (balita, ibu hamil, lansia, CKG) sesuai jadwal yang telah ditentukan di masing-masing RW.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h4 className="text-sm font-bold text-white">Pencatatan Hasil</h4>
                <p className="text-xs text-slate-300">
                  Kader mengisi kartu bantu, formulir pelaporan online, atau sistem mandiri posyandu (data kunjungan, pelayanan, kunjungan rumah).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800 border border-emerald-500/50 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h4 className="text-sm font-bold text-emerald-400">Quality Control Koordinator</h4>
                <p className="text-xs text-slate-300">
                  Kader Koordinator Desa memeriksa 4 kelengkapan: data kunjungan, data pelayanan, kunjungan rumah, dan administrasi buku posyandu.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-sm">
                  4
                </div>
                <h4 className="text-sm font-bold text-white">Penetapan Status Kelengkapan</h4>
                <p className="text-xs text-slate-300">
                  Jika <strong>Lengkap</strong> &rarr; Diberi status Terverifikasi dan diteruskan. Jika <strong>Belum Lengkap</strong> &rarr; Dikembalikan ke kader dengan catatan revisi.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center text-sm">
                  5
                </div>
                <h4 className="text-sm font-bold text-white">Monitoring Puskesmas & Desa</h4>
                <p className="text-xs text-slate-300">
                  Puskesmas dan Desa memantau progres pelaporan real-time melalui Dashboard SIPANDU PEDULI tanpa harus membuka arsip fisik satu per satu.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 font-bold flex items-center justify-center text-sm">
                  6
                </div>
                <h4 className="text-sm font-bold text-white">Evaluasi & Tindak Lanjut</h4>
                <p className="text-xs text-slate-300">
                  Hasil pemantauan agregat digunakan untuk pembinaan teknis, logistik vaksin/alat, intervensi stunting, dan evaluasi berkala.
                </p>
              </div>
            </div>

            {/* BATASAN SIPANDU BANNER */}
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Batasan SIPANDU Terkait Data Pasien (PRD Pasal 2):</strong>
                SIPANDU bukan RME dan TIDAK menyimpan identitas lengkap pasien, NIK, anamnesis, diagnosis klinis, atau resep obat. Seluruh data klinis individual tetap berada pada sistem RME / e-Puskesmas yang berwenang. SIPANDU hanya menampilkan data agregat, monitoring, dan status pelaporan.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {selectedPosyanduForDetail && (
        <PosyanduDetailModal
          posyandu={selectedPosyanduForDetail}
          onClose={() => setSelectedPosyanduForDetail(null)}
          canVerify={canVerify}
          onOpenReportForm={(p) => {
            setSelectedPosyanduForDetail(null);
            setSelectedPosyanduForReport(p);
          }}
          onVerifyReport={(p) => {
            setSelectedPosyanduForDetail(null);
            setSelectedPosyanduForVerify(p);
          }}
        />
      )}

      {selectedPosyanduForReport && (
        <PosyanduReportFormModal
          posyandu={selectedPosyanduForReport}
          currentUserName={currentUserName}
          onClose={() => setSelectedPosyanduForReport(null)}
          onSubmitReport={(updated) => {
            onUpdatePosyandu(updated);
            setSelectedPosyanduForReport(null);
          }}
        />
      )}

      {selectedPosyanduForVerify && (
        <PosyanduVerifyModal
          posyandu={selectedPosyanduForVerify}
          currentUserName={currentUserName}
          onClose={() => setSelectedPosyanduForVerify(null)}
          onSaveVerification={(updated) => {
            onUpdatePosyandu(updated);
            setSelectedPosyanduForVerify(null);
          }}
        />
      )}
    </div>
  );
}
