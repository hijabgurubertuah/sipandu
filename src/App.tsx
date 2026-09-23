import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PublicArea from './components/PublicArea';
import PortalPegawai from './components/PortalPegawai';
import AdminPortal from './components/AdminPortal';
import Footer from './components/Footer';
import DocumentModal from './components/DocumentModal';
import AddDocumentModal from './components/AddDocumentModal';
import SearchModal from './components/SearchModal';
import {
  UserAccount,
  DocumentItem,
  IndicatorMetric,
  ActivityLogItem,
  ComplaintItem,
  SiteSettings,
  MarqueeSettings,
  HealthPostMitra,
  DriveFileItem,
  ServiceItem,
  DigitalSystemItem,
  NewsAnnouncement,
  MobileDockConfig,
  PosyanduItem
} from './types';
import {
  MOCK_USERS,
  MOCK_SERVICES,
  MOCK_DIGITAL_SYSTEMS,
  MOCK_INDICATORS,
  MOCK_DOCUMENTS,
  MOCK_ACTIVITY_LOGS,
  MOCK_COMPLAINTS,
  MOCK_MITRA,
  MOCK_NEWS,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_MARQUEE_SETTINGS,
  DEFAULT_DOCK_CONFIG,
  MOCK_DRIVE_GALLERY
} from './data/mockData';
import { generateDefault108Posyandu, sanitizePosyanduList } from './data/posyanduData';
import MobileDock from './components/MobileDock';
import PublicMobileSidebar from './components/PublicMobileSidebar';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { loadAllFromFirestore, saveSinglePosyanduToFirestore } from './lib/firebase';
import { cacheImageLocally, updateDynamicFavicon } from './lib/imageCache';

export default function App() {
  // Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('sipandu_theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sipandu_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sipandu_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // View state: 'public', 'pegawai', or 'admin'
  const [currentView, setCurrentView] = useState<'public' | 'pegawai' | 'admin'>('public');

  // Navigation tab for Public area
  const [activePublicTab, setActivePublicTab] = useState<string>('beranda');

  // Navigation tab for Pegawai area
  const [activePegawaiTab, setActivePegawaiTab] = useState<string>('dashboard');

  // Active User for RBAC simulation
  const [currentUser, setCurrentUser] = useState<UserAccount>(MOCK_USERS[0]); // Default Super Admin

  // CMS States with LocalStorage Persistence
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('sipandu_site_settings');
      return saved ? { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SITE_SETTINGS;
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  });

  const [marqueeSettings, setMarqueeSettings] = useState<MarqueeSettings>(() => {
    try {
      const saved = localStorage.getItem('sipandu_marquee_settings');
      return saved ? { ...DEFAULT_MARQUEE_SETTINGS, ...JSON.parse(saved) } : DEFAULT_MARQUEE_SETTINGS;
    } catch {
      return DEFAULT_MARQUEE_SETTINGS;
    }
  });

  const [mitraList, setMitraList] = useState<HealthPostMitra[]>(() => {
    try {
      const saved = localStorage.getItem('sipandu_mitra_list');
      return saved ? JSON.parse(saved) : MOCK_MITRA;
    } catch {
      return MOCK_MITRA;
    }
  });

  const [driveGallery, setDriveGallery] = useState<DriveFileItem[]>(() => {
    try {
      const saved = localStorage.getItem('sipandu_drive_gallery');
      return saved ? JSON.parse(saved) : MOCK_DRIVE_GALLERY;
    } catch {
      return MOCK_DRIVE_GALLERY;
    }
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem('sipandu_services');
      return saved ? JSON.parse(saved) : MOCK_SERVICES;
    } catch {
      return MOCK_SERVICES;
    }
  });

  const [systems, setSystems] = useState<DigitalSystemItem[]>(() => {
    try {
      const saved = localStorage.getItem('sipandu_systems');
      return saved ? JSON.parse(saved) : MOCK_DIGITAL_SYSTEMS;
    } catch {
      return MOCK_DIGITAL_SYSTEMS;
    }
  });

  const [newsList, setNewsList] = useState<NewsAnnouncement[]>(() => {
    try {
      const saved = localStorage.getItem('sipandu_news');
      return saved ? JSON.parse(saved) : MOCK_NEWS;
    } catch {
      return MOCK_NEWS;
    }
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('sipandu_admin_pwd') || 'sipandu123';
  });

  // Master 108 Posyandu State with LocalStorage & Cloud Persistence
  const [posyanduList, setPosyanduList] = useState<PosyanduItem[]>(() => {
    try {
      const saved = localStorage.getItem('sipandu_posyandu_list');
      const list = saved ? JSON.parse(saved) : generateDefault108Posyandu();
      return sanitizePosyanduList(list);
    } catch {
      return generateDefault108Posyandu();
    }
  });

  useEffect(() => {
    localStorage.setItem('sipandu_posyandu_list', JSON.stringify(posyanduList));
  }, [posyanduList]);

  // Helper to migrate legacy dock items (e.g. Chat WA -> Info, SIPANDU -> Berita)
  const sanitizeDockConfig = (cfg: MobileDockConfig): MobileDockConfig => {
    if (!cfg || !Array.isArray(cfg.items)) return DEFAULT_DOCK_CONFIG;
    const items = cfg.items.map((item) => {
      if (item.id === 'dock-berita' || item.id === 'dock-dokumen' || item.label === 'SIPANDU' || (item.label === 'Berita' && item.target === 'dokumen')) {
        return { ...item, id: 'dock-berita', label: 'Berita', icon: 'document' as const, actionType: 'tab' as const, target: 'informasi' };
      }
      if (item.id === 'dock-wa' || item.label === 'Chat WA' || item.icon === 'whatsapp' || item.id === 'dock-info' || item.label === 'Info') {
        return { ...item, id: 'dock-pegawai', label: 'Portal Pegawai', icon: 'building' as const, actionType: 'portal_pegawai' as const, target: 'pegawai' };
      }
      return item;
    });
    return { ...DEFAULT_DOCK_CONFIG, ...cfg, items };
  };

  // Mobile Docker Config state
  const [dockConfig, setDockConfig] = useState<MobileDockConfig>(() => {
    try {
      const saved = localStorage.getItem('sipandu_dock_config');
      return saved ? sanitizeDockConfig(JSON.parse(saved)) : DEFAULT_DOCK_CONFIG;
    } catch {
      return DEFAULT_DOCK_CONFIG;
    }
  });

  // Public Mobile Sidebar Drawer Open/Close state
  const [publicSidebarOpen, setPublicSidebarOpen] = useState(false);

  // Sync CMS state changes to localStorage and dynamic favicon/PWA manifest
  useEffect(() => {
    localStorage.setItem('sipandu_site_settings', JSON.stringify(siteSettings));
    
    // Dynamic Favicon sync
    if (siteSettings.logoUrl) {
      updateDynamicFavicon(siteSettings.logoUrl);
      cacheImageLocally(siteSettings.logoUrl);
    }
    if (siteSettings.kabupatenLogoUrl) {
      cacheImageLocally(siteSettings.kabupatenLogoUrl);
    }
    if (siteSettings.bannerUrl) {
      cacheImageLocally(siteSettings.bannerUrl);
    }
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('sipandu_marquee_settings', JSON.stringify(marqueeSettings));
  }, [marqueeSettings]);

  useEffect(() => {
    localStorage.setItem('sipandu_mitra_list', JSON.stringify(mitraList));
  }, [mitraList]);

  useEffect(() => {
    localStorage.setItem('sipandu_drive_gallery', JSON.stringify(driveGallery));
  }, [driveGallery]);

  useEffect(() => {
    localStorage.setItem('sipandu_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('sipandu_systems', JSON.stringify(systems));
  }, [systems]);

  useEffect(() => {
    localStorage.setItem('sipandu_news', JSON.stringify(newsList));
  }, [newsList]);

  useEffect(() => {
    localStorage.setItem('sipandu_dock_config', JSON.stringify(dockConfig));
  }, [dockConfig]);

  useEffect(() => {
    localStorage.setItem('sipandu_admin_pwd', adminPassword);
  }, [adminPassword]);

  // Initial load from Firebase Firestore (Public & Admin sync)
  const fetchCloudData = async () => {
    try {
      const data = await loadAllFromFirestore();
      if (data.siteSettings) setSiteSettings(data.siteSettings);
      if (data.marqueeSettings) setMarqueeSettings(data.marqueeSettings);
      if (data.dockConfig) setDockConfig(sanitizeDockConfig(data.dockConfig));
      if (data.mitraList && data.mitraList.length > 0) setMitraList(data.mitraList);
      if (data.services && data.services.length > 0) setServices(data.services);
      if (data.systems && data.systems.length > 0) setSystems(data.systems);
      if (data.newsList && data.newsList.length > 0) setNewsList(data.newsList);
      if (data.gallery && data.gallery.length > 0) setDriveGallery(data.gallery);
      if (data.posyanduList && data.posyanduList.length > 0) setPosyanduList(sanitizePosyanduList(data.posyanduList));
    } catch (e) {
      console.warn('Initial cloud sync error:', e);
    }
  };

  useEffect(() => {
    fetchCloudData();
  }, []);

  const handleUpdateSinglePosyandu = (updated: PosyanduItem) => {
    setPosyanduList((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    saveSinglePosyanduToFirestore(updated).catch((e) => console.warn('Cloud sync error for Posyandu:', e));
  };

  // Operational Data states with persistence
  const [documents, setDocuments] = useState<DocumentItem[]>(MOCK_DOCUMENTS);
  const [indicators, setIndicators] = useState<IndicatorMetric[]>(MOCK_INDICATORS);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(MOCK_ACTIVITY_LOGS);
  const [complaints, setComplaints] = useState<ComplaintItem[]>(MOCK_COMPLAINTS);

  // Modals state
  const [selectedDocModal, setSelectedDocModal] = useState<DocumentItem | null>(null);
  const [isAddDocOpen, setIsAddDocOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Handlers
  const handleAddDocument = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);

    // Add activity log
    const newLog: ActivityLogItem = {
      id: `log-${Date.now()}`,
      userName: currentUser.name,
      role: currentUser.roleLabel,
      action: 'Penambahan Tautan Berkas Gateway',
      target: newDoc.title,
      timestamp: new Date().toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' WIB',
      ipAddress: '192.168.1.104',
      type: 'document'
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const handleVerifyDocument = (id: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, verificationStatus: 'Terverifikasi' } : doc
      )
    );

    const doc = documents.find((d) => d.id === id);
    if (doc) {
      const newLog: ActivityLogItem = {
        id: `log-${Date.now()}`,
        userName: currentUser.name,
        role: currentUser.roleLabel,
        action: 'Verifikasi Dokumen Resmi',
        target: doc.title,
        timestamp: new Date().toLocaleString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) + ' WIB',
        ipAddress: '192.168.1.104',
        type: 'verification'
      };
      setActivityLogs((prev) => [newLog, ...prev]);
    }

    if (selectedDocModal && selectedDocModal.id === id) {
      setSelectedDocModal((prev) =>
        prev ? { ...prev, verificationStatus: 'Terverifikasi' } : null
      );
    }
  };

  const handleVerifyIndicator = (id: string) => {
    setIndicators((prev) =>
      prev.map((ind) =>
        ind.id === id ? { ...ind, verificationStatus: 'Terverifikasi' } : ind
      )
    );

    const ind = indicators.find((i) => i.id === id);
    if (ind) {
      const newLog: ActivityLogItem = {
        id: `log-${Date.now()}`,
        userName: currentUser.name,
        role: currentUser.roleLabel,
        action: 'Verifikasi Capaian Indikator',
        target: ind.title,
        timestamp: new Date().toLocaleString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) + ' WIB',
        ipAddress: '192.168.1.104',
        type: 'verification'
      };
      setActivityLogs((prev) => [newLog, ...prev]);
    }
  };

  const handleSubmitComplaint = (newComplaint: ComplaintItem) => {
    setComplaints((prev) => [newComplaint, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white font-sans transition-colors duration-200">
      
      {/* Top Navigation */}
      {currentView !== 'admin' && (
        <Navbar
          currentView={currentView}
          onSelectView={(v) => {
            setCurrentView(v);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          currentUser={currentUser}
          onSelectUser={setCurrentUser}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onOpenSearch={() => setIsSearchOpen(true)}
          activePublicTab={activePublicTab}
          onSelectPublicTab={(t) => {
            setActivePublicTab(t);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          activePegawaiTab={activePegawaiTab}
          onSelectPegawaiTab={(t) => {
            setActivePegawaiTab(t);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          siteSettings={siteSettings}
          marqueeSettings={marqueeSettings}
          onOpenMobileSidebar={() => setPublicSidebarOpen(true)}
        />
      )}

      {/* Main Content Area with safe padding for Mobile Dock */}
      <main className={`grow ${currentView === 'public' && dockConfig.enabled ? 'pb-24 md:pb-0' : ''}`}>
        {currentView === 'public' ? (
          <PublicArea
            activeTab={activePublicTab}
            onSelectTab={(tab) => {
              setActivePublicTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            services={services}
            systems={systems}
            indicators={indicators}
            documents={documents}
            mitraList={mitraList}
            newsList={newsList}
            complaints={complaints}
            onSubmitComplaint={handleSubmitComplaint}
            onSelectDocument={setSelectedDocModal}
            onOpenPegawaiPortal={() => {
              setCurrentView('pegawai');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            siteSettings={siteSettings}
            posyanduList={posyanduList}
            onUpdatePosyandu={handleUpdateSinglePosyandu}
          />
        ) : currentView === 'pegawai' ? (
          <PortalPegawai
            currentUser={currentUser}
            onSelectUser={setCurrentUser}
            documents={documents}
            indicators={indicators}
            activityLogs={activityLogs}
            complaints={complaints}
            onOpenAddDocument={() => setIsAddDocOpen(true)}
            onSelectDocument={setSelectedDocModal}
            onVerifyDocument={handleVerifyDocument}
            onVerifyIndicator={handleVerifyIndicator}
            posyanduList={posyanduList}
            onUpdatePosyandu={handleUpdateSinglePosyandu}
          />
        ) : (
          <AdminPortal
            siteSettings={siteSettings}
            onUpdateSiteSettings={setSiteSettings}
            marqueeSettings={marqueeSettings}
            onUpdateMarqueeSettings={setMarqueeSettings}
            mitraList={mitraList}
            onUpdateMitraList={setMitraList}
            driveGallery={driveGallery}
            onUpdateDriveGallery={setDriveGallery}
            services={services}
            onUpdateServices={setServices}
            systems={systems}
            onUpdateSystems={setSystems}
            newsList={newsList}
            onUpdateNewsList={setNewsList}
            dockConfig={dockConfig}
            onUpdateDockConfig={setDockConfig}
            adminPassword={adminPassword}
            onUpdateAdminPassword={setAdminPassword}
            posyanduList={posyanduList}
            onUpdatePosyanduList={setPosyanduList}
            onExitAdmin={() => {
              setCurrentView('public');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenPegawaiPortal={() => {
              setCurrentView('pegawai');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onRefreshData={fetchCloudData}
          />
        )}
      </main>

      {/* Footer (Hidden on Admin Portal) */}
      {currentView !== 'admin' && (
        <Footer
          onSelectTab={(tab) => {
            setActivePublicTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectView={(v) => {
            setCurrentView(v);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          siteSettings={siteSettings}
        />
      )}

      {/* Mobile Floating Dock (At the bottom of screen on Mobile) */}
      {currentView === 'public' && (
        <MobileDock
          config={dockConfig}
          activeTab={activePublicTab}
          onSelectTab={(tab) => {
            setActivePublicTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenSidebar={() => setPublicSidebarOpen(true)}
          onOpenPegawaiPortal={() => {
            setCurrentView('pegawai');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          logoUrl={siteSettings.logoUrl}
        />
      )}

      {/* Public Mobile Sidebar Drawer */}
      <PublicMobileSidebar
        isOpen={publicSidebarOpen}
        onClose={() => setPublicSidebarOpen(false)}
        activeTab={activePublicTab}
        onSelectTab={(tab) => {
          setActivePublicTab(tab);
          setPublicSidebarOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPegawaiPortal={() => {
          setCurrentView('pegawai');
          setPublicSidebarOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdminPortal={() => {
          setCurrentView('admin');
          setPublicSidebarOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        siteSettings={siteSettings}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* PWA Install Notification Prompt with Uploaded Logo */}
      <PWAInstallPrompt logoUrl={siteSettings.logoUrl} appName={siteSettings.name} />

      {/* Document Gateway Detail Modal */}
      <DocumentModal
        document={selectedDocModal}
        onClose={() => setSelectedDocModal(null)}
        onVerify={handleVerifyDocument}
        canVerify={
          currentUser.role === 'super_admin' ||
          currentUser.role === 'admin' ||
          currentUser.role === 'pimpinan' ||
          currentUser.role === 'koordinator'
        }
      />

      {/* Add Document Gateway Modal */}
      <AddDocumentModal
        isOpen={isAddDocOpen}
        onClose={() => setIsAddDocOpen(false)}
        onAdd={handleAddDocument}
        currentUser={currentUser}
      />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        documents={documents}
        services={services}
        systems={systems}
        onSelectDocument={setSelectedDocModal}
      />

    </div>
  );
}
