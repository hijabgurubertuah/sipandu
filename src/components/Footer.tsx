import { Activity, MapPin, Phone, Mail, Instagram, ShieldCheck, HeartPulse } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onSelectView: (view: 'public' | 'pegawai' | 'admin') => void;
  siteSettings: SiteSettings;
}

export default function Footer({ onSelectTab, onSelectView, siteSettings }: FooterProps) {
  return (
    <footer id="app-footer" className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-extrabold shadow-md overflow-hidden p-1">
                {siteSettings.logoUrl ? (
                  <img
                    src={siteSettings.logoUrl}
                    alt="Logo"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <Activity className="w-6 h-6" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black text-white tracking-tight">SIPANDU</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500 text-slate-950 tracking-wider">
                    PEDULI
                  </span>
                </div>
                <p className="text-[11px] text-emerald-400 font-medium">{siteSettings.name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {siteSettings.subtitle}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-[11px] text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Terakreditasi Paripurna Kemenkes RI</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Akses Cepat Informasi
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    onSelectView('public');
                    onSelectTab('beranda');
                  }}
                  className="hover:text-emerald-400 transition"
                >
                  Beranda & Profil Puskesmas
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectView('public');
                    onSelectTab('pelayanan');
                  }}
                  className="hover:text-emerald-400 transition"
                >
                  Jadwal & Standar Pelayanan Poli
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectView('public');
                    onSelectTab('sistem');
                  }}
                  className="hover:text-emerald-400 transition"
                >
                  Gateway Sistem Digital (SP4N, JKN, SATUSEHAT)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectView('public');
                    onSelectTab('monitoring');
                  }}
                  className="hover:text-emerald-400 transition"
                >
                  Data & Transparansi Monitoring Capaian
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectView('public');
                    onSelectTab('pengaduan');
                  }}
                  className="hover:text-emerald-400 transition"
                >
                  Layanan Pengaduan & Aspirasi Warga
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Pegawai Internal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Portal Pegawai (ILP)
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectView('pegawai')}
                  className="hover:text-emerald-400 transition"
                >
                  Dashboard Pegawai & KPI
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('pegawai')}
                  className="hover:text-emerald-400 transition"
                >
                  Klaster 1 - 4 Integrasi Layanan Primer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('pegawai')}
                  className="hover:text-emerald-400 transition"
                >
                  Data Sasaran & Master Spreadsheet 2026
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('pegawai')}
                  className="hover:text-emerald-400 transition"
                >
                  Program Prioritas (PKP, CKG, SPM)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectView('pegawai')}
                  className="hover:text-emerald-400 transition"
                >
                  Repository Akreditasi & Bimtek Monev
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Kontak Resmi */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Kontak {siteSettings.name}
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{siteSettings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={siteSettings.whatsappUrl || `https://wa.me/${siteSettings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-emerald-400 font-bold"
                >
                  WA: {siteSettings.whatsapp}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${siteSettings.email}`} className="hover:text-emerald-400 truncate">
                  {siteSettings.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={siteSettings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400"
                >
                  {siteSettings.instagram}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <div className="p-2.5 bg-rose-950/40 border border-rose-900/60 rounded-xl text-[11px] text-rose-200 flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-400 shrink-0" />
                <span>UGD & Bersalin Buka 24 Jam Non-Stop</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            &copy; {new Date().getFullYear()} {siteSettings.name}, Dinas Kesehatan {siteSettings.regency}. Hak Cipta Dilindungi.
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            SIPANDU PEDULI — <em>One Link, One Click Access</em>
          </div>
        </div>

      </div>
    </footer>
  );
}
