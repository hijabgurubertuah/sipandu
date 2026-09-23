import { useState } from 'react';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import {
  LayoutDashboard,
  FileSpreadsheet,
  FileText,
  Activity,
  Layers,
  Award,
  Users,
  Building2,
  FolderOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  ShieldCheck,
  Search,
  Filter,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  ChevronRight,
  Database,
  Lock,
  UserCheck,
  Briefcase
} from 'lucide-react';
import {
  UserAccount,
  DocumentItem,
  IndicatorMetric,
  ActivityLogItem,
  UnitCluster,
  ComplaintItem
} from '../types';
import { MOCK_USERS } from '../data/mockData';

interface PortalPegawaiProps {
  currentUser: UserAccount;
  onSelectUser: (user: UserAccount) => void;
  documents: DocumentItem[];
  indicators: IndicatorMetric[];
  activityLogs: ActivityLogItem[];
  complaints: ComplaintItem[];
  onOpenAddDocument: () => void;
  onSelectDocument: (doc: DocumentItem) => void;
  onVerifyDocument: (id: string) => void;
  onVerifyIndicator: (id: string) => void;
}

export default function PortalPegawai({
  currentUser,
  onSelectUser,
  documents,
  indicators,
  activityLogs,
  complaints,
  onOpenAddDocument,
  onSelectDocument,
  onVerifyDocument,
  onVerifyIndicator
}: PortalPegawaiProps) {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  
  useBodyScrollLock(isRoleModalOpen);
  
  // Navigation inside Portal Pegawai
  const [activeMenu, setActiveMenu] = useState<
    'dashboard' | 'tu' | 'klaster' | 'sasaran' | 'perencanaan' | 'prioritas' | 'monev' | 'akreditasi' | 'admin'
  >('dashboard');

  // Selected Cluster for Klaster ILP tab
  const [selectedCluster, setSelectedCluster] = useState<UnitCluster>(
    currentUser.unit === 'all' ? 'manajemen' : currentUser.unit
  );

  // Selected Year for Sasaran & Perencanaan
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Selected Priority Tab (CKG, PKP, SPM)
  const [priorityTab, setPriorityTab] = useState<'PKP' | 'CKG' | 'SPM'>('PKP');

  // Document filter query
  const [docSearch, setDocSearch] = useState('');

  // Check user permission
  const isSuperAdmin = currentUser.role === 'super_admin';
  const isAdmin = currentUser.role === 'super_admin' || currentUser.role === 'admin';
  const isPimpinan = currentUser.role === 'pimpinan';
  const canVerify = isSuperAdmin || isAdmin || isPimpinan || currentUser.role === 'koordinator';
  const canAdd = isSuperAdmin || isAdmin || currentUser.role === 'koordinator' || currentUser.role === 'petugas';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Pegawai', icon: LayoutDashboard },
    { id: 'tu', label: 'Tata Usaha', icon: Briefcase },
    { id: 'klaster', label: 'Klaster ILP', icon: Layers },
    { id: 'sasaran', label: 'Data Sasaran', icon: Database },
    { id: 'perencanaan', label: 'Perencanaan', icon: FolderOpen },
    { id: 'prioritas', label: 'Program Prioritas (PKP/CKG/SPM)', icon: Activity },
    { id: 'monev', label: 'Bimtek • Desk • Monev', icon: FileCheck },
    { id: 'akreditasi', label: 'Akreditasi', icon: Award },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin Central', icon: ShieldCheck }] : [])
  ];

  const clusterItems: { id: UnitCluster; label: string; desc: string }[] = [
    { id: 'manajemen', label: 'Klaster 1: Manajemen', desc: 'Perencanaan, Keuangan, Kepegawaian, Mutu, Sarpras' },
    { id: 'kia', label: 'Klaster 2: KIA & KB', desc: 'Kesehatan Ibu, Anak, Remaja, Imunisasi, Gizi' },
    { id: 'dewasa_lansia', label: 'Klaster 3: Dewasa & Lansia', desc: 'Usia Produktif, Skrining CKG, PTM, Hipertensi, DM, Geriatri' },
    { id: 'p2m_kesling', label: 'Klaster 4: P2M & Kesling', desc: 'TB, DBD, HIV, Imunisasi Lanjutan, Sanitasi & TPM' },
    { id: 'lintas_klaster', label: 'Lintas Klaster', desc: 'UGD 24 Jam, Farmasi/Apotek, Laboratorium Klinik' }
  ];

  const filteredDocs = documents.filter((d) => {
    if (!docSearch.trim()) return true;
    const q = docSearch.toLowerCase();
    return (
      d.title.toLowerCase().includes(q) ||
      d.categoryLabel.toLowerCase().includes(q) ||
      d.clusterLabel.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Welcome Bar & Role Badge */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
        
        {/* Quick User / Role Simulation Selector Above Name */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs max-w-full overflow-hidden">
          <div className="flex items-center gap-2 font-extrabold text-amber-900 dark:text-amber-200 shrink-0">
            <UserCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="text-xs font-bold">Simulasi Akun Pegawai:</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto min-w-0">
            <select
              value={currentUser.id}
              onChange={(e) => {
                const found = MOCK_USERS.find((u) => u.id === e.target.value);
                if (found) onSelectUser(found);
              }}
              className="flex-1 sm:w-60 min-w-0 max-w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700/80 rounded-lg text-slate-900 dark:text-white font-bold text-xs shadow-2xs focus:ring-2 focus:ring-amber-500 cursor-pointer truncate"
              title="Pilih Akun Simulasi"
            >
              {MOCK_USERS.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-extrabold text-[11px] shrink-0 transition cursor-pointer shadow-2xs whitespace-nowrap"
              title="Lihat Rincian Hak Akses All User"
            >
              Detail Role
            </button>
          </div>
        </div>

        {/* User Profile Header Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-extrabold text-lg shadow-md shadow-emerald-700/20 shrink-0">
              {currentUser.name.split(' ')[0][0]}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  Selamat Datang, {currentUser.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {currentUser.roleLabel}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Unit Tugas: <strong>{currentUser.unitName}</strong> • NIP: {currentUser.nip}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {canAdd && (
              <button
                onClick={onOpenAddDocument}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tautkan Dokumen / Data Dukung</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal Simulasi Hak Akses (Mobile-Responsive & Sticky Header) */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[85vh] sm:max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            {/* Sticky Header with Close Button Always Visible */}
            <div className="sticky top-0 z-10 shrink-0 border-b border-slate-100 dark:border-slate-800 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Simulasi Hak Akses & Akun Pegawai
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Pilih salah satu profil di bawah ini untuk menguji hak akses:
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shrink-0 transition cursor-pointer"
                aria-label="Tutup Modal Simulasi Hak Akses"
              >
                <span className="text-base font-bold">✕</span>
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {MOCK_USERS.map((user) => {
                const isCurrent = currentUser.id === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => {
                      onSelectUser(user);
                      setIsRoleModalOpen(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs transition flex items-center justify-between gap-3 cursor-pointer ${
                      isCurrent
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-sm leading-snug">{user.name}</div>
                      <div className={isCurrent ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}>
                        <strong>{user.roleLabel}</strong> • {user.unitName}
                      </div>
                      <div className={`text-[10px] font-mono ${isCurrent ? 'text-emerald-200' : 'text-slate-400'}`}>
                        NIP: {user.nip}
                      </div>
                    </div>
                    {isCurrent ? (
                      <span className="px-2.5 py-1 rounded-full bg-white text-emerald-900 font-extrabold text-[10px] shrink-0">
                        Aktif Sekarang
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-bold shrink-0">
                        Pilih Profil
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Sub-Bar */}
      <div className="bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex items-center gap-1 overflow-x-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= SECTION 1: DASHBOARD PEGAWAI ================= */}
      {activeMenu === 'dashboard' && (
        <div className="space-y-8">
          
          {/* KPI Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Dokumen Gateway</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {documents.length} Berkas
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Terhubung ke Google Drive</span>
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Indikator Dipantau</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {indicators.length} Indikator
              </div>
              <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
                <Activity className="w-3 h-3" />
                <span>PKP, CKG & SPM 2026</span>
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Aspirasi & Pengaduan</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {complaints.length} Laporan
              </div>
              <div className="text-[11px] text-teal-600 dark:text-teal-400 mt-1">
                {complaints.filter((c) => c.status === 'Selesai').length} Terselesaikan
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Status Akreditasi</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                PARIPURNA
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Standar Kemenkes RI 5 Bab</div>
            </div>
          </div>

          {/* Quick Shortcuts & Internal Notice */}
          <div className="grid lg:grid-cols-12 gap-6">
            
            {/* Shortcuts */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                  <span>Aksi Cepat & Shortcut Kerja Terpadu</span>
                </h2>
                <span className="text-xs text-slate-400">One Link, One Click Access</span>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setActiveMenu('prioritas')}
                  className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-left hover:border-emerald-500 transition group"
                >
                  <Activity className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition" />
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Input / Rekap PKP</div>
                  <div className="text-[10px] text-slate-500">Penilaian Kinerja Bulanan</div>
                </button>

                <button
                  onClick={() => setActiveMenu('prioritas')}
                  className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-left hover:border-emerald-500 transition group"
                >
                  <TrendingUp className="w-5 h-5 text-blue-600 mb-1 group-hover:scale-110 transition" />
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Dashboard CKG</div>
                  <div className="text-[10px] text-slate-500">Cek Kesehatan Gratis 18 Desa</div>
                </button>

                <button
                  onClick={() => setActiveMenu('sasaran')}
                  className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-left hover:border-emerald-500 transition group"
                >
                  <Database className="w-5 h-5 text-amber-600 mb-1 group-hover:scale-110 transition" />
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Data Sasaran 2026</div>
                  <div className="text-[10px] text-slate-500">Bumil, Bayi, Lansia per Desa</div>
                </button>
              </div>

              {/* Internal Announcements */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Pengumuman Internal Pegawai:
                </span>
                <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Batas Akhir Verifikasi Rekap PKP Triwulan III 2026</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Seluruh penanggung jawab program UKM Esensial dan Klaster ILP diimbau untuk menyelesaikan update link telusur eviden pada Google Spreadsheet sebelum tanggal 15 bulan berjalan.
                  </p>
                </div>
              </div>
            </div>

            {/* Audit Log / Recent Activity */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Aktivitas Sistem Terkini
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Live Audit</span>
              </div>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {activityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">{log.role}</span>
                      <span className="text-slate-400">{log.timestamp.split(',')[1]}</span>
                    </div>
                    <div className="font-medium text-slate-800 dark:text-slate-200 text-[11px]">
                      {log.action}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {log.target}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Repository Dokumen Singkat */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Daftar Berkas & Data Dukung Terkini
                </h2>
                <p className="text-xs text-slate-500">Tautan gateway menuju Google Drive & Spreadsheet</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={docSearch}
                    onChange={(e) => setDocSearch(e.target.value)}
                    placeholder="Saring dokumen..."
                    className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="p-3">Judul Berkas / Data Dukung</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Klaster</th>
                    <th className="p-3">Tahun</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{doc.title}</span>
                        </div>
                      </td>
                      <td className="p-3 text-slate-500">{doc.categoryLabel}</td>
                      <td className="p-3 text-slate-500">{doc.clusterLabel}</td>
                      <td className="p-3 font-mono">{doc.year}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            doc.verificationStatus === 'Terverifikasi'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {doc.verificationStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onSelectDocument(doc)}
                          className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white text-[11px] font-semibold transition"
                        >
                          Rincian & Tautan
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ================= SECTION 2: TATA USAHA ================= */}
      {activeMenu === 'tu' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              <span>Subbagian Tata Usaha & Kepegawaian</span>
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pengelolaan kepegawaian, Sasaran Kinerja Pegawai (E-Kinerja BKN), akuntabilitas (E-SAKIP), administrasi surat menyurat, dan arsip kepegawaian Puskesmas Kepanjen.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">E-Kinerja ASN (BKN)</span>
                <p className="text-[11px] text-slate-500">Penyusunan SKP, eviden bulanan, dan penilaian kinerja ASN.</p>
                <a
                  href="https://kinerja.bkn.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:underline pt-1"
                >
                  <span>Buka E-Kinerja BKN</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">E-SAKIP Pemkab Malang</span>
                <p className="text-[11px] text-slate-500">Sistem akuntabilitas kinerja instansi pemerintah dan perjanjian kinerja.</p>
                <a
                  href="https://esakip.malangkab.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:underline pt-1"
                >
                  <span>Buka E-SAKIP</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Administrasi Persuratan & SK</span>
                <p className="text-[11px] text-slate-500">Arsip SK Kepala Puskesmas, Surat Tugas, dan Surat Keputusan Tim.</p>
                <button
                  onClick={() => {
                    const doc = documents.find((d) => d.category === 'tu') || documents[0];
                    onSelectDocument(doc);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:underline pt-1"
                >
                  <span>Buka Arsip Surat Drive</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION 3: KLASTER ILP ================= */}
      {activeMenu === 'klaster' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Integrasi Layanan Primer (ILP) Puskesmas Kepanjen
            </h2>
            <p className="text-xs text-slate-500">
              Pengorganisasian program kesehatan berbasis siklus hidup dan fungsi klaster terpadu.
            </p>
          </div>

          {/* Cluster Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {clusterItems.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCluster(c.id)}
                className={`p-3 rounded-xl border text-left transition ${
                  selectedCluster === c.id
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-xs font-bold">{c.label}</div>
                <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{c.desc}</div>
              </button>
            ))}
          </div>

          {/* Selected Cluster Workspace */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  Workspace Klaster Aktif
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {clusterItems.find((c) => c.id === selectedCluster)?.label}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {clusterItems.find((c) => c.id === selectedCluster)?.desc}
                </p>
              </div>

              {canAdd && (
                <button
                  onClick={onOpenAddDocument}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Data Dukung Klaster</span>
                </button>
              )}
            </div>

            {/* Sub-components of Cluster */}
            <div className="grid md:grid-cols-2 gap-4">
              
              {/* Indikator Klaster Ini */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 space-y-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>Indikator Terkait Klaster Ini:</span>
                </span>
                {indicators
                  .filter((ind) => ind.cluster === selectedCluster || selectedCluster === 'manajemen')
                  .slice(0, 3)
                  .map((ind) => (
                    <div key={ind.id} className="p-2.5 bg-white dark:bg-slate-800 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 dark:text-white">{ind.title}</span>
                        <span className="text-[10px] font-mono text-emerald-600 font-bold">{ind.current} / {ind.target}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Status: {ind.status} • {ind.verificationStatus}</div>
                    </div>
                  ))}
              </div>

              {/* Berkas Drive Klaster Ini */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 space-y-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-blue-600" />
                  <span>Dokumen & Gateway Google Drive:</span>
                </span>
                {documents
                  .filter((doc) => doc.cluster === selectedCluster || doc.cluster === 'all')
                  .slice(0, 3)
                  .map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => onSelectDocument(doc)}
                      className="p-2.5 bg-white dark:bg-slate-800 rounded-lg text-xs flex items-center justify-between cursor-pointer hover:border-emerald-500 border border-transparent transition"
                    >
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-white line-clamp-1">{doc.title}</div>
                        <div className="text-[10px] text-slate-400">{doc.categoryLabel} • {doc.year}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  ))}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION 4: DATA SASARAN ================= */}
      {activeMenu === 'sasaran' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-600" />
                  <span>Data Sasaran Penduduk & Program Puskesmas</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Gateway menuju master Google Spreadsheet proyeksi penduduk, sasaran Bumil, Bayi, Balita, Usia Produktif, dan Lansia se-Kepanjen.
                </p>
              </div>

              {/* Year selector */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg text-xs font-bold">
                {[2026, 2025, 2024].map((y) => (
                  <button
                    key={y}
                    onClick={() => setSelectedYear(y)}
                    className={`px-3 py-1 rounded-md transition ${
                      selectedYear === y ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Tahun {y}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
              <div>
                <strong>Master Sasaran Penduduk Tahun {selectedYear}:</strong>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-0.5">
                  Terintegrasi dengan SP2TP dan BPS Kabupaten Malang untuk 18 Desa/Kelurahan.
                </p>
              </div>
              <button
                onClick={() => {
                  const doc = documents.find((d) => d.category === 'sasaran') || documents[2];
                  onSelectDocument(doc);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition"
              >
                <span>Buka di Google Spreadsheet</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION 5: PERENCANAAN (RUK, RPK, TOR, RENSTRA) ================= */}
      {activeMenu === 'perencanaan' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-emerald-600" />
              <span>Dokumen Perencanaan Puskesmas (RUK, RPK, TOR & Renstra)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Repository berkas perencanaan berjenjang UPTD Puskesmas Kepanjen yang tersimpan di Google Drive organisasi.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {documents
                .filter((d) => d.category === 'perencanaan')
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Tahun {doc.year}
                        </span>
                        <span className="text-[10px] text-slate-400">{doc.size}</span>
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                        {doc.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                        {doc.description}
                      </p>
                    </div>
                    <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Oleh: {doc.uploaderName}</span>
                      <button
                        onClick={() => onSelectDocument(doc)}
                        className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                      >
                        <span>Akses Dokumen</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION 6: PROGRAM PRIORITAS & INDIKATOR ================= */}
      {activeMenu === 'prioritas' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  <span>Monitoring & Evaluasi Program Prioritas</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Format laporan mandiri per program: PKP (Penilaian Kinerja Puskesmas), CKG (Cek Kesehatan Gratis), dan SPM.
                </p>
              </div>

              {/* Sub tabs */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg text-xs font-bold">
                {(['PKP', 'CKG', 'SPM'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setPriorityTab(tab)}
                    className={`px-3.5 py-1.5 rounded-md transition ${
                      priorityTab === tab ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Program {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Indicators for Active Priority Program */}
            <div className="space-y-3">
              {indicators
                .filter((ind) => ind.program === priorityTab)
                .map((ind) => {
                  const pct = Math.min(100, Math.round((ind.current / ind.target) * 100));
                  return (
                    <div
                      key={ind.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {ind.title}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                            {ind.period}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Target: {ind.target.toLocaleString()} {ind.unit} • Realisasi: {ind.current.toLocaleString()} {ind.unit} ({pct}%)
                        </div>
                        <div className="w-48 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${pct >= 90 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            ind.verificationStatus === 'Terverifikasi'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {ind.verificationStatus}
                        </span>

                        {canVerify && ind.verificationStatus !== 'Terverifikasi' && (
                          <button
                            onClick={() => onVerifyIndicator(ind.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition"
                          >
                            Verifikasi
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION 7: BIMTEK • DESK • MONEV ================= */}
      {activeMenu === 'monev' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <span>Bimtek • Desk • Monitoring & Evaluasi</span>
            </h2>
            <p className="text-xs text-slate-500">
              Repository pembinaan dari Dinas Kesehatan Kabupaten Malang, hasil desk evaluasi, dan tindak lanjut perbaikan.
            </p>

            <div className="space-y-3">
              {documents
                .filter((d) => d.category === 'bimtek')
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{doc.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {doc.description} • Terakhir diupdate {doc.updatedAt}
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectDocument(doc)}
                      className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white text-xs font-bold rounded-lg transition"
                    >
                      Buka Dokumen
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION 8: AKREDITASI ================= */}
      {activeMenu === 'akreditasi' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span>Standar Akreditasi Puskesmas (5 Bab)</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Kepmenkes No. 165/2023: Kepemimpinan, UKM, UKP, PMP, dan Program Prioritas Nasional (PPN).
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Paripurna Aktif
              </span>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { bab: 'Bab 1', title: 'Kepemimpinan & Manajemen Puskesmas (KMP)', docs: '48 SOP & SK' },
                { bab: 'Bab 2', title: 'Penyelenggaraan UKM Esensial & Pengembangan', docs: '62 Dokumen Telusur' },
                { bab: 'Bab 3', title: 'Penyelenggaraan UKP, Laboratorium & Farmasi', docs: '84 SOP Klinis' },
                { bab: 'Bab 4', title: 'Program Prioritas Nasional (PPN: Stunting, TB, Kematian Ibu)', docs: '35 Laporan Audit' },
                { bab: 'Bab 5', title: 'Peningkatan Mutu Puskesmas & Keselamatan Pasien', docs: '41 Indikator Mutu' }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-emerald-600">{item.bab}</span>
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{item.title}</div>
                  <div className="text-[10px] text-slate-400">{item.docs}</div>
                  <button
                    onClick={() => {
                      const doc = documents.find((d) => d.category === 'akreditasi') || documents[5];
                      onSelectDocument(doc);
                    }}
                    className="text-[11px] font-bold text-emerald-600 hover:underline block pt-1"
                  >
                    Buka Folder Bukti Telusur &rarr;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION 9: ADMIN CENTRAL ================= */}
      {activeMenu === 'admin' && isAdmin && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Admin Central & Manajemen Hak Akses (RBAC)</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Kelola akun pengguna pegawai, peran/role, klaster penugasan, dan rekam audit log sistem.
                </p>
              </div>

              <button
                onClick={onOpenAddDocument}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Tautkan Berkas Baru</span>
              </button>
            </div>

            {/* User List Table */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                Daftar Akun Pegawai Terdaftar (RBAC Terkonfigurasi)
              </h3>
              <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-700">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="p-3">Nama Pegawai & NIP</th>
                      <th className="p-3">Email Akun</th>
                      <th className="p-3">Role / Hak Akses</th>
                      <th className="p-3">Klaster / Unit</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {MOCK_USERS.map((usr) => (
                      <tr key={usr.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">
                          <div>{usr.name}</div>
                          <div className="text-[10px] text-slate-400">NIP: {usr.nip}</div>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                          {usr.email}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {usr.roleLabel}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500">{usr.unitName}</td>
                        <td className="p-3">
                          <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Aktif
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Audit Log Trail */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                Audit Trail Log Aktivitas Sistem
              </h3>
              <div className="space-y-2">
                {activityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{log.userName}</span>
                      <span className="text-slate-400 mx-2">•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{log.action}:</span>
                      <span className="text-slate-600 dark:text-slate-300 ml-1.5">{log.target}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                      <span>IP: {log.ipAddress}</span>
                      <span>•</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
