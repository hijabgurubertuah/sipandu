import {
  Menu,
  Home,
  HeartPulse,
  FileText,
  Users,
  MessageSquare,
  Phone,
  MessageCircle,
  AlertCircle,
  ExternalLink,
  Info,
  Building2
} from 'lucide-react';
import { MobileDockConfig, MobileDockItem } from '../types';

interface MobileDockProps {
  config: MobileDockConfig;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSidebar: () => void;
  onOpenPegawaiPortal?: () => void;
  logoUrl?: string;
}

export default function MobileDock({
  config,
  activeTab,
  onSelectTab,
  onOpenSidebar,
  onOpenPegawaiPortal,
  logoUrl
}: MobileDockProps) {
  if (!config.enabled) return null;

  const getIcon = (iconName: MobileDockItem['icon'], isHighlighted?: boolean) => {
    const className = `w-5 h-5 transition-transform group-hover:scale-110 ${
      isHighlighted ? 'text-white' : ''
    }`;

    switch (iconName) {
      case 'menu':
        return <Menu className={className} />;
      case 'home':
        return <Home className={className} />;
      case 'services':
        return <HeartPulse className={className} />;
      case 'document':
        return <FileText className={className} />;
      case 'mitra':
        return <Users className={className} />;
      case 'complaint':
        return <MessageSquare className={className} />;
      case 'whatsapp':
        return <MessageCircle className={className} />;
      case 'emergency':
        return <AlertCircle className={className} />;
      case 'info':
        return <Info className={className} />;
      case 'building':
        return <Building2 className={className} />;
      case 'users':
        return <Users className={className} />;
      case 'phone':
      default:
        return <Phone className={className} />;
    }
  };

  const handleItemClick = (item: MobileDockItem) => {
    if (item.actionType === 'sidebar') {
      onOpenSidebar();
    } else if (item.actionType === 'portal_pegawai') {
      if (onOpenPegawaiPortal) onOpenPegawaiPortal();
    } else if (item.actionType === 'tab') {
      onSelectTab(item.target);
    } else if (item.actionType === 'tel') {
      window.location.href = item.target.startsWith('tel:') ? item.target : `tel:${item.target}`;
    } else if (item.actionType === 'url') {
      window.open(item.target, '_blank', 'noopener,noreferrer');
    } else if (item.actionType === 'scroll' || item.target === 'footer') {
      const footerEl = document.getElementById('app-footer') || document.querySelector('footer');
      if (footerEl) {
        footerEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    }
  };

  // Reorder active items so home is in the center if 5 items exist
  const rawActiveItems = config.items.filter((item) => item.isEnabled);
  const homeIndex = rawActiveItems.findIndex(
    (item) => item.icon === 'home' || item.id === 'dock-beranda' || item.target === 'beranda'
  );

  let activeItems = [...rawActiveItems];
  if (homeIndex !== -1 && activeItems.length === 5 && homeIndex !== 2) {
    const [homeItem] = activeItems.splice(homeIndex, 1);
    activeItems.splice(2, 0, homeItem);
  }

  return (
    <aside
      aria-label="Navigasi Bawah Mobile"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 pt-1 pointer-events-none"
    >
      <div
        className={`pointer-events-auto max-w-md mx-auto rounded-2xl shadow-2xl border transition-all duration-200 ${
          config.blurEffect
            ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-slate-200/80 dark:border-slate-800'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
        } px-2 py-1.5 flex items-center justify-around gap-1`}
      >
        {activeItems.map((item, idx) => {
          const isLeftmost = idx === 0;
          const isActive =
            item.actionType === 'tab' && activeTab === item.target;
          
          const isCenterHome = item.icon === 'home' || item.id === 'dock-beranda' || item.target === 'beranda';

          // Center Diamond Home Button
          if (isCenterHome) {
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="group relative flex flex-col items-center justify-center flex-1 min-w-[56px] -mt-6 transition-all text-center cursor-pointer"
                title="Beranda"
              >
                {/* Diamond Outer Container */}
                <div
                  className={`w-13 h-13 rounded-2xl rotate-45 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 ring-4 ring-emerald-400/30 dark:ring-emerald-500/40 shadow-emerald-600/60 scale-105'
                      : 'bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-600 ring-4 ring-white dark:ring-slate-900 shadow-emerald-700/40'
                  }`}
                >
                  {/* Un-rotate inner wrapper so image stays straight & apply 3D Y-axis rotate */}
                  <div className="-rotate-45 flex items-center justify-center w-full h-full p-1 transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="Logo"
                        className="w-8 h-8 object-contain rounded drop-shadow-md"
                      />
                    ) : (
                      <Home className="w-7 h-7 text-white drop-shadow-md" />
                    )}
                  </div>
                </div>

                {/* Hide default "Beranda" text label under diamond home button */}
                {config.showLabels && item.label && item.label.toLowerCase() !== 'beranda' && item.label.toLowerCase() !== 'home' && (
                  <span
                    className={`text-[9px] leading-tight font-extrabold truncate max-w-[56px] mt-1 ${
                      isActive
                        ? 'text-emerald-700 dark:text-emerald-400 font-black'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </button>
            );
          }

          if (item.isHighlight) {
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="group relative flex flex-col items-center justify-center flex-1 min-w-[50px] py-1 px-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold shadow-md shadow-rose-600/30 hover:scale-105 active:scale-95 transition-all text-center cursor-pointer"
              >
                {item.badge && (
                  <span className="absolute -top-2.5 px-1.5 py-0.2 bg-white text-rose-700 text-[8px] font-black uppercase rounded-full shadow-xs tracking-wider">
                    {item.badge}
                  </span>
                )}
                <div className="w-5 h-5 flex items-center justify-center">
                  {getIcon(item.icon, true)}
                </div>
                {config.showLabels && (
                  <span className="text-[9px] leading-tight font-extrabold truncate max-w-[62px] mt-0.5">
                    {item.label}
                  </span>
                )}
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`group relative flex flex-col items-center justify-center flex-1 min-w-[48px] py-1.5 px-1 rounded-xl transition-all text-center cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/15 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-black shadow-sm shadow-emerald-500/10'
                  : isLeftmost
                  ? 'text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50/60 dark:hover:bg-slate-800/60'
              }`}
            >
              {item.badge && item.badge !== 'Semua' && item.actionType !== 'sidebar' && (
                <span className="absolute -top-1.5 px-1.5 py-0.1 bg-emerald-600 text-white text-[7px] font-black uppercase rounded-full shadow-xs">
                  {item.badge}
                </span>
              )}

              <div
                className={`w-5 h-5 flex items-center justify-center transition-colors ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 scale-110'
                    : isLeftmost
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-600 dark:text-slate-400 group-hover:text-emerald-600'
                }`}
              >
                {getIcon(item.icon)}
              </div>

              {config.showLabels && (
                <span
                  className={`text-[9px] leading-tight truncate max-w-[56px] mt-0.5 ${
                    isActive ? 'font-black text-emerald-700 dark:text-emerald-300' : 'font-medium'
                  }`}
                >
                  {item.label}
                </span>
              )}

              {/* Active Dot indicator */}
              {isActive && (
                <span className="w-1.5 h-1 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-0.5 shadow-xs animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
