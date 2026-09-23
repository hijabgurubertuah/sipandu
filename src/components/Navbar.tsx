import { useState, useRef, useEffect } from 'react';
import {
  Activity,
  Sun,
  Moon,
  Menu,
  X,
  Search,
  LogIn,
  LogOut,
  UserCheck,
  ChevronDown,
  Building2,
  Lock,
  Settings,
  Shield,
  Sparkles
} from 'lucide-react';
import { UserAccount, SiteSettings, MarqueeSettings } from '../types';
import { MOCK_USERS } from '../data/mockData';

interface NavbarProps {
  currentView: 'public' | 'pegawai' | 'admin';
  onSelectView: (view: 'public' | 'pegawai' | 'admin') => void;
  currentUser: UserAccount;
  onSelectUser: (user: UserAccount) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSearch: () => void;
  activePublicTab: string;
  onSelectPublicTab: (tab: string) => void;
  activePegawaiTab: string;
  onSelectPegawaiTab: (tab: string) => void;
  siteSettings: SiteSettings;
  marqueeSettings: MarqueeSettings;
  onOpenMobileSidebar?: () => void;
}

export default function Navbar({
  currentView,
  onSelectView,
  currentUser,
  onSelectUser,
  darkMode,
  onToggleDarkMode,
  onOpenSearch,
  activePublicTab,
  onSelectPublicTab,
  activePegawaiTab,
  onSelectPegawaiTab,
  siteSettings,
  marqueeSettings,
  onOpenMobileSidebar
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close role simulator dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setRoleDropdownOpen(false);
      }
    }
    if (roleDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [roleDropdownOpen]);

  const publicNavItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'pelayanan', label: 'Pelayanan' },
    { id: 'informasi', label: 'Informasi & Publik' },
    { id: 'sistem', label: 'Sistem Digital' },
    { id: 'monitoring', label: 'Data & Monitoring' },
    { id: 'mitra', label: 'Mitra Faskes' },
    { id: 'pengaduan', label: 'Pengaduan' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      
      {/* Top Banner Notice / Teks Berjalan (Marquee) */}
      {marqueeSettings.enabled ? (
        <div
          className={`text-white text-[11px] py-1 px-4 text-center font-medium overflow-hidden flex items-center shadow-xs ${
            marqueeSettings.variant === 'amber'
              ? 'bg-amber-600'
              : marqueeSettings.variant === 'rose'
              ? 'bg-rose-700'
              : marqueeSettings.variant === 'blue'
              ? 'bg-blue-700'
              : 'bg-emerald-700 dark:bg-emerald-950'
          }`}
        >
          <div className="flex items-center gap-2 shrink-0 mr-3">
            <span className="px-1.5 py-0.5 rounded bg-white/20 text-[9px] font-black uppercase tracking-wider">
              {marqueeSettings.badge || 'PENGUMUMAN'}
            </span>
          </div>

          <div className="whitespace-nowrap overflow-hidden flex-1 text-left">
            <div className="inline-block animate-marquee font-medium">
              {marqueeSettings.text} • Hotline 24 Jam: <strong>{marqueeSettings.hotline}</strong> • {siteSettings.name}
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 ml-3 shrink-0 text-[11px]">
            <span className="opacity-75">|</span>
            <button
              onClick={() => onSelectView('admin')}
              className="hover:underline opacity-90 text-[10px] font-bold flex items-center gap-1"
            >
              <Settings className="w-3 h-3" />
              <span>Edit Teks</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-700 dark:bg-emerald-950 text-white text-[11px] py-1 px-4 text-center font-medium flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            <span>{siteSettings.headerBadgeText || `${siteSettings.name} — Integration Hub & Portal Resmi`}</span>
          </div>
          <div className="mx-auto sm:mx-0 flex items-center gap-4 text-[11px]">
            <span>Hotline UGD 24 Jam: <strong>{marqueeSettings.hotline || siteSettings.phone}</strong></span>
            <span className="hidden md:inline text-emerald-200">|</span>
            <span className="hidden md:inline text-emerald-100">{siteSettings.address.split(',')[0]}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectView('public')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 overflow-hidden p-1">
              {siteSettings.logoUrl ? (
                <img
                  src={siteSettings.logoUrl}
                  alt="Logo Puskesmas"
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <Activity className="w-6 h-6 stroke-[2.2]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                  SIPANDU
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white tracking-wider">
                  PEDULI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[200px] sm:max-w-xs">
                {siteSettings.name}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          {currentView === 'public' ? (
            <nav className="hidden lg:flex items-center space-x-1">
              {publicNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectPublicTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activePublicTab === item.id
                      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                      : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          ) : currentView === 'pegawai' ? (
            <div className="hidden lg:flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1.5 border border-emerald-300/60 dark:border-emerald-800">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                Mode Portal Pegawai
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {currentUser.unitName}
              </span>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 flex items-center gap-1.5 border border-teal-300/60 dark:border-teal-800">
                <Shield className="w-3.5 h-3.5 text-teal-600" />
                Mode Pengelola Tampilan (CMS)
              </span>
            </div>
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              title="Cari Dokumen, Layanan atau Sistem"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Cari Dokumen"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              title={darkMode ? 'Beralih ke Terang' : 'Beralih ke Gelap'}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Ubah Tema Gelap Terang"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Portal Admin Button */}
            <button
              onClick={() => onSelectView('admin')}
              title="Portal Admin Pengelola Tampilan & Konten"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-teal-700 text-white ring-2 ring-teal-400'
                  : 'bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Portal Admin</span>
            </button>

            {/* Portal Switcher CTA Button */}
            {currentView === 'public' ? (
              <button
                onClick={() => onSelectView('pegawai')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Portal Pegawai</span>
              </button>
            ) : currentView === 'pegawai' ? (
              <button
                onClick={() => onSelectView('public')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Lihat Area Publik</span>
              </button>
            ) : (
              <button
                onClick={() => onSelectView('public')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Area Publik</span>
              </button>
            )}

            {/* Mobile Hamburger Button (Only on non-public views, since public view uses MobileDock) */}
            {currentView !== 'public' && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-2">
          <div className="flex flex-col gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              Navigasi Halaman Utama
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  onSelectView('admin');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-teal-600 text-white flex items-center justify-center gap-1.5"
              >
                <Settings className="w-4 h-4" />
                <span>Admin CMS (Edit Tampilan)</span>
              </button>

              <button
                onClick={() => {
                  onSelectView(currentView === 'public' ? 'pegawai' : 'public');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-emerald-600 text-white flex items-center justify-center gap-1.5"
              >
                {currentView === 'public' ? 'Portal Pegawai' : 'Lihat Area Publik'}
              </button>
            </div>
          </div>

          {currentView === 'public' ? (
            <div className="grid grid-cols-2 gap-1 pt-1">
              {publicNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectPublicTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                    activePublicTab === item.id
                      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300 pt-1">
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="block text-[10px] text-slate-400">Pengguna Login:</span>
                <span className="font-bold">{currentUser.name}</span> ({currentUser.roleLabel})
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
