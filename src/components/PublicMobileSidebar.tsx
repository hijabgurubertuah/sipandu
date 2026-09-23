import { useEffect } from 'react';
import {
  X,
  Home,
  FileText,
  HeartPulse,
  Users,
  MessageSquare,
  ShieldCheck,
  Building2,
  Settings,
  Phone,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Sun,
  Moon
} from 'lucide-react';
import { SiteSettings } from '../types';

interface PublicMobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenPegawaiPortal: () => void;
  onOpenAdminPortal: () => void;
  siteSettings: SiteSettings;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export default function PublicMobileSidebar({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  onOpenPegawaiPortal,
  onOpenAdminPortal,
  siteSettings,
  darkMode,
  onToggleDarkMode
}: PublicMobileSidebarProps) {
  // Prevent background page scrolling & touch swiping when sidebar drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;

      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const navLinks = [
    {
      id: 'beranda',
      label: 'Beranda',
      desc: 'Halaman utama & profil integratif',
      icon: Home,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/60'
    },
    {
      id: 'informasi',
      label: 'Informasi Publik',
      desc: 'Visi, misi, SPM & transparansi',
      icon: ShieldCheck,
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-950/60'
    },
    {
      id: 'dokumen',
      label: 'Dokumen SIPANDU',
      desc: 'SK, SOP, bukti ILP & data dukung',
      icon: FileText,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/60'
    },
    {
      id: 'layanan',
      label: 'Layanan & Poliklinik',
      desc: 'Poli umum, KIA, UGD 24 Jam & alur',
      icon: HeartPulse,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/60'
    },
    {
      id: 'mitra',
      label: 'Jejaring Pustu & Posyandu',
      desc: 'Faskes mitra & Posyandu ILP',
      icon: Users,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/60'
    },
    {
      id: 'pengaduan',
      label: 'Pengaduan & Aspirasi',
      desc: 'Kotak saran & respon masyarakat',
      icon: MessageSquare,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-950/60'
    }
  ];

  return (
    <div
      className="lg:hidden fixed inset-0 z-50 flex animate-in fade-in duration-200 overscroll-none touch-none"
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity touch-none"
        onClick={onClose}
        onTouchMove={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      />

      {/* Drawer Panel Sliding From Left */}
      <aside
        aria-label="Menu Navigasi Sidebar"
        className="relative w-80 max-w-[85vw] bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 animate-in slide-in-from-left duration-300 z-10 touch-auto overscroll-contain"
        onTouchMove={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-emerald-700 dark:bg-emerald-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 p-1 flex items-center justify-center overflow-hidden ring-1 ring-white/40 shrink-0">
              {siteSettings.logoUrl ? (
                <img
                  src={siteSettings.logoUrl}
                  alt="Logo Puskesmas"
                  className="w-full h-full object-contain"
                />
              ) : (
                <Building2 className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black tracking-widest text-emerald-200 uppercase">
                  SIPANDU PEDULI
                </span>
              </div>
              <h2 className="text-xs font-bold text-white truncate max-w-[170px]">
                {siteSettings.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {onToggleDarkMode && (
              <button
                onClick={onToggleDarkMode}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                title={darkMode ? 'Beralih ke Terang' : 'Beralih ke Gelap'}
                aria-label="Ubah Tema Gelap Terang"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-white" />}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              aria-label="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Nav List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2 px-1">
              Menu Navigasi Publik
            </span>
            <div className="space-y-1.5">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onClose();
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between group ${
                      isActive
                        ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-700/20'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isActive ? 'bg-white/20 text-white' : `${item.bg} ${item.color}`
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-bold leading-tight">{item.label}</div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity ${
                        isActive ? 'text-white' : 'text-slate-400'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick External Portals */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-1">
              Akses Khusus
            </span>

            <button
              onClick={() => {
                onOpenAdminPortal();
                onClose();
              }}
              className="w-full p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 flex items-center justify-between text-left transition"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-teal-600 text-white">
                  <Settings className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold">Portal Admin</div>
              </div>
              <ChevronRight className="w-4 h-4 text-teal-600" />
            </button>

            <button
              onClick={() => {
                onOpenPegawaiPortal();
                onClose();
              }}
              className="w-full p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-between text-left transition"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-slate-700 dark:bg-slate-600 text-white">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold">Portal Pegawai</div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Emergency / Hotline Banner */}
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>UGD & Rawat Inap 24 Jam</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`tel:${siteSettings.phone}`}
                className="flex-1 py-1.5 px-2 rounded-lg bg-rose-600 text-white text-[11px] font-bold text-center flex items-center justify-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Telepon UGD</span>
              </a>
              <a
                href={siteSettings.whatsappUrl || `https://wa.me/${siteSettings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 text-white text-[11px] font-bold text-center flex items-center justify-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat WA</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-center text-[10px] text-slate-400">
          <p className="font-semibold text-slate-600 dark:text-slate-400">
            {siteSettings.name}
          </p>
          <p className="mt-0.5">Satu Akses, Satu Klik Layanan Kesehatan</p>
        </div>
      </aside>
    </div>
  );
}
