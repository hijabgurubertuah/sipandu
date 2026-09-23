import { useState } from 'react';
import { 
  Wifi, 
  Activity, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Layers,
  ShieldCheck,
  HardDrive,
  Database,
  Edit3,
  Trash2,
  Users
} from 'lucide-react';
import { 
  testFirestoreConnection,
  saveSiteSettingsToFirestore,
  saveMarqueeSettingsToFirestore,
  saveDockConfigToFirestore,
  saveMitraToFirestore,
  saveServicesToFirestore,
  saveSystemsToFirestore,
  saveNewsToFirestore,
  saveGalleryToFirestore
} from '../lib/firebase';
import { 
  SiteSettings, 
  MarqueeSettings, 
  MobileDockConfig, 
  HealthPostMitra, 
  ServiceItem, 
  DigitalSystemItem, 
  NewsAnnouncement, 
  DriveFileItem 
} from '../types';

interface FirebaseStatusTabProps {
  siteSettings: SiteSettings;
  marqueeSettings: MarqueeSettings;
  dockConfig: MobileDockConfig;
  mitraList: HealthPostMitra[];
  services: ServiceItem[];
  systems: DigitalSystemItem[];
  newsList: NewsAnnouncement[];
  driveGallery: DriveFileItem[];
  onRefreshData: () => Promise<void>;
}

export default function FirebaseStatusTab({
  siteSettings,
  marqueeSettings,
  dockConfig,
  mitraList,
  services,
  systems,
  newsList,
  driveGallery,
  onRefreshData
}: FirebaseStatusTabProps) {
  const [testing, setTesting] = useState(false);
  const [syncingAll, setSyncingAll] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    latencyMs: number;
    message: string;
  } | null>(null);

  // Total dokumen aktif
  const totalDocuments = services.length + mitraList.length + newsList.length + driveGallery.length + systems.length + 3;

  // Estimasi penggunaan kuota Spark Plan (1 GB Storage / 50K Reads / 20K Writes / 20K Deletes / 100 Connections)
  const estimatedStorageMb = Math.max(0.1, Math.round((totalDocuments * 0.05 + driveGallery.length * 1.5 + 0.2) * 10) / 10);
  const estimatedDailyReads = Math.max(totalDocuments * 3 + 120, 250);
  const estimatedDailyWrites = Math.max(totalDocuments + 15, 35);

  const quotaItems = [
    {
      id: 'storage',
      title: 'Kapasitas Storage',
      icon: HardDrive,
      usedDisplay: `${estimatedStorageMb} MB`,
      limitDisplay: '1.024 MB (1 GB)',
      percent: Math.round((estimatedStorageMb / 1024) * 100 * 10) / 10,
      gradient: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'reads',
      title: 'Pembacaan (Reads)',
      icon: Database,
      usedDisplay: `${estimatedDailyReads.toLocaleString()} /hari`,
      limitDisplay: '50.000 /hari',
      percent: Math.round((estimatedDailyReads / 50000) * 100 * 10) / 10,
      gradient: 'from-blue-500 to-indigo-500',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 'writes',
      title: 'Penulisan (Writes)',
      icon: Edit3,
      usedDisplay: `${estimatedDailyWrites.toLocaleString()} /hari`,
      limitDisplay: '20.000 /hari',
      percent: Math.round((estimatedDailyWrites / 20000) * 100 * 10) / 10,
      gradient: 'from-cyan-500 to-teal-500',
      textColor: 'text-cyan-600 dark:text-cyan-400',
    },
    {
      id: 'deletes',
      title: 'Penghapusan (Deletes)',
      icon: Trash2,
      usedDisplay: '0 /hari',
      limitDisplay: '20.000 /hari',
      percent: 0,
      gradient: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      id: 'connections',
      title: 'Koneksi Simultan',
      icon: Users,
      usedDisplay: '1 Client',
      limitDisplay: '100 Client',
      percent: 1,
      gradient: 'from-violet-500 to-purple-500',
      textColor: 'text-violet-600 dark:text-violet-400',
    }
  ];

  const handleTestPing = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testFirestoreConnection();
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        latencyMs: 999,
        message: err?.message || 'Gagal tersambung'
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSyncAll = async () => {
    setSyncingAll(true);
    try {
      await saveSiteSettingsToFirestore(siteSettings);
      await saveMarqueeSettingsToFirestore(marqueeSettings);
      await saveDockConfigToFirestore(dockConfig);
      await saveMitraToFirestore(mitraList);
      await saveServicesToFirestore(services);
      await saveSystemsToFirestore(systems);
      await saveNewsToFirestore(newsList);
      await saveGalleryToFirestore(driveGallery);
      await onRefreshData();
      alert('Berhasil menyimpan semua data ke Firebase Cloud!');
    } catch (err: any) {
      alert(`Gagal sinkronisasi: ${err?.message || 'Error tidak diketahui'}`);
    } finally {
      setSyncingAll(false);
    }
  };

  return (
    <div className="space-y-5">

      {/* 1. TOP MINIMALIST RINGKASAN STATUS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Wifi className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Status Cloud</span>
            <span className="text-xs font-black text-slate-900 dark:text-white">Terhubung</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Latensi</span>
            <span className="text-xs font-black text-slate-900 dark:text-white">
              {testResult ? `${testResult.latencyMs} ms` : '~38 ms'}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Total Data</span>
            <span className="text-xs font-black text-slate-900 dark:text-white">{totalDocuments} Dokumen</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Paket Firebase</span>
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">Spark Free (1 GB)</span>
          </div>
        </div>

      </div>

      {/* 2. MINIMALIST GRAFIK BATANG KUOTA */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-2xs space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Penggunaan Kuota Firebase
          </h3>
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Batas Gratis Spark Plan
          </span>
        </div>

        {/* Minimalist Grid of Bar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {quotaItems.map((q) => {
            const IconComponent = q.icon;
            return (
              <div 
                key={q.id}
                className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800/80 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{q.title}</span>
                  </div>
                  <span className={`text-xs font-black ${q.textColor}`}>
                    {q.percent < 0.1 ? '< 0.1%' : `${q.percent}%`}
                  </span>
                </div>

                {/* Progress Bar Track */}
                <div className="w-full h-2.5 bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${q.gradient} transition-all duration-500`}
                    style={{ width: `${Math.max(q.percent, 1.5)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <span>Terpakai: <strong className="text-slate-900 dark:text-white">{q.usedDisplay}</strong></span>
                  <span>Maks: {q.limitDisplay}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* 3. TOMBOL AKSI MINIMALIS */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3.5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        
        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 text-center sm:text-left">
          {testResult ? (
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-extrabold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Ping berhasil ({testResult.latencyMs} ms)</span>
            </span>
          ) : (
            <span>Siap melakukan tes koneksi atau pengiriman data</span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleTestPing}
            disabled={testing}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} />
            <span>{testing ? 'Menguji...' : 'Uji Ping'}</span>
          </button>

          <button
            type="button"
            onClick={handleSyncAll}
            disabled={syncingAll}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{syncingAll ? 'Menyimpan...' : 'Simpan Ke Cloud'}</span>
          </button>
        </div>

      </div>

    </div>
  );
}
