import { useState, useEffect, type FormEvent } from 'react';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import {
  Activity,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Instagram,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Download,
  Send,
  HelpCircle,
  TrendingUp,
  AlertCircle,
  Building2,
  Search,
  MessageSquareHeart,
  ChevronDown,
  Layers,
  HeartPulse,
  Award,
  X
} from 'lucide-react';
import {
  ServiceItem,
  DigitalSystemItem,
  IndicatorMetric,
  DocumentItem,
  HealthPostMitra,
  NewsAnnouncement,
  ComplaintItem,
  SiteSettings
} from '../types';
import { PUSKESMAS_INFO, VILLAGES_KEPANJEN, POSYANDU_VILLAGE_SUMMARY } from '../data/mockData';

interface PublicAreaProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  services: ServiceItem[];
  systems: DigitalSystemItem[];
  indicators: IndicatorMetric[];
  documents: DocumentItem[];
  mitraList: HealthPostMitra[];
  newsList: NewsAnnouncement[];
  complaints: ComplaintItem[];
  onSubmitComplaint: (newComplaint: ComplaintItem) => void;
  onSelectDocument: (doc: DocumentItem) => void;
  onOpenPegawaiPortal: () => void;
  siteSettings?: SiteSettings;
}

export default function PublicArea({
  activeTab,
  onSelectTab,
  services,
  systems,
  indicators,
  documents,
  mitraList,
  newsList,
  complaints,
  onSubmitComplaint,
  onSelectDocument,
  onOpenPegawaiPortal,
  siteSettings
}: PublicAreaProps) {
  // Service filter state
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(services[0]);

  // Complaint Form state
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [serviceTarget, setServiceTarget] = useState('Pemeriksaan Umum');
  const [complaintCategory, setComplaintCategory] = useState('Waktu Tunggu & Antrean');
  const [complaintContent, setComplaintContent] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  // Ticket status checker state
  const [searchTicketId, setSearchTicketId] = useState('');
  const [searchedComplaint, setSearchedComplaint] = useState<ComplaintItem | null | 'not_found'>(null);

  // FAQ open accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // IKM survey quick response
  const [ikmRating, setIkmRating] = useState<number | null>(null);
  const [ikmSubmitted, setIkmSubmitted] = useState(false);

  // News Modal state
  const [selectedNews, setSelectedNews] = useState<NewsAnnouncement | null>(null);

  // Lock body scroll when news modal is open
  useBodyScrollLock(!!selectedNews);

  // Filter public downloadable documents
  const publicDocs = documents.filter((d) => d.isPublicDownload);

  const handleComplaintSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!reporterName.trim() || !complaintContent.trim()) return;

    const ticket = `KPJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newItem: ComplaintItem = {
      id: `cmp-${Date.now()}`,
      ticketId: ticket,
      reporterName: reporterName.trim(),
      reporterContact: reporterContact.trim(),
      serviceTarget,
      category: complaintCategory,
      content: complaintContent.trim(),
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
      status: 'Menunggu'
    };

    onSubmitComplaint(newItem);
    setSubmittedTicket(ticket);
    setReporterName('');
    setReporterContact('');
    setComplaintContent('');
  };

  const handleCheckTicket = (e: FormEvent) => {
    e.preventDefault();
    if (!searchTicketId.trim()) return;
    const found = complaints.find((c) => c.ticketId.toLowerCase() === searchTicketId.trim().toLowerCase());
    setSearchedComplaint(found || 'not_found');
  };

  const faqs = [
    {
      q: 'Apakah semua warga pemegang BPJS Kesehatan dilayani gratis di Puskesmas Kepanjen?',
      a: 'Ya, seluruh peserta BPJS Kesehatan / JKN KIS aktif dengan fasilitas kesehatan tingkat pertama (FKTP) Puskesmas Kepanjen dilayani tanpa biaya tambahan untuk seluruh tindakan dan obat yang masuk formularium nasional.'
    },
    {
      q: 'Bagaimana cara mendaftar antrean online agar tidak menunggu lama di loket?',
      a: 'Masyarakat dapat mendaftar antrean secara mandiri melalui aplikasi Mobile JKN (BPJS Kesehatan) pada menu Pendaftaran Pelayanan, atau menggunakan sistem pendaftaran mandiri saat tiba di lobi Puskesmas.'
    },
    {
      q: 'Apa itu program Cek Kesehatan Gratis (CKG) dan siapa saja yang berhak?',
      a: 'CKG adalah program prioritas deteksi dini faktor risiko penyakit tidak menular (seperti gula darah, tekanan darah, kolesterol) bagi seluruh warga usia 15 tahun ke atas di wilayah Kecamatan Kepanjen.'
    },
    {
      q: 'Apakah UGD dan layanan persalinan buka 24 jam?',
      a: 'Ya! Unit Gawat Darurat (UGD) dan Pelayanan Obstetri Neonatal Emergensi Dasar (PONED / Persalinan) UPTD Puskesmas Kepanjen siaga 24 jam non-stop setiap hari, termasuk hari libur dan tanggal merah.'
    }
  ];

  return (
    <div className="min-h-screen">
      
      {/* Tab 1: BERANDA */}
      {activeTab === 'beranda' && (
        <div>
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-950 text-white pt-6 sm:pt-8 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                
                <div className="lg:col-span-7 space-y-5">
                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                    {siteSettings?.heroTitle ? (
                      siteSettings.heroTitle
                    ) : (
                      <>
                        Satu Akses Terpadu <br />
                        <span className="text-emerald-300">Layanan Kesehatan Kepanjen</span>
                      </>
                    )}
                  </h1>

                  <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl leading-relaxed">
                    {siteSettings?.heroSubtitle || (
                      <>
                        <strong>SIPANDU PEDULI</strong> (Sistem Pantau Data Dukung Pelaksanaan, Dokumentasi, dan Evaluasi untuk Layanan Integratif) menghadirkan transparansi pelayanan, sistem digital, dan monitoring kesehatan dengan prinsip <em>One Link, One Click Access</em>.
                      </>
                    )}
                  </p>

                  {/* Hero Quick Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => onSelectTab('pelayanan')}
                      className="px-5 py-3 rounded-xl bg-white text-emerald-900 font-bold text-xs sm:text-sm hover:bg-emerald-50 shadow-lg shadow-black/20 transition flex items-center gap-2"
                    >
                      <span>Lihat Jadwal & Pelayanan</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <a
                      href="https://bpjs-kesehatan.go.id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 rounded-xl bg-emerald-700/80 hover:bg-emerald-600/90 text-white font-semibold text-xs sm:text-sm border border-emerald-500/40 backdrop-blur-xs transition flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4 text-emerald-300" />
                      <span>Antrean Online Mobile JKN</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </a>
                    <button
                      onClick={onOpenPegawaiPortal}
                      className="px-4 py-3 rounded-xl bg-teal-900/60 hover:bg-teal-800 text-teal-200 text-xs font-semibold border border-teal-700/50 transition"
                    >
                      Masuk Portal Pegawai
                    </button>
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-emerald-700/60">
                    <div className="p-3 bg-emerald-800/40 rounded-xl border border-emerald-700/40">
                      <div className="text-xl sm:text-2xl font-black text-emerald-300">18 Desa</div>
                      <div className="text-[11px] text-emerald-100/70">108 Posyandu Active Hub</div>
                    </div>
                    <div className="p-3 bg-emerald-800/40 rounded-xl border border-emerald-700/40">
                      <div className="text-xl sm:text-2xl font-black text-emerald-300">12 Layanan</div>
                      <div className="text-[11px] text-emerald-100/70">Poli & Fasilitas Medis</div>
                    </div>
                    <div className="p-3 bg-emerald-800/40 rounded-xl border border-emerald-700/40">
                      <div className="text-xl sm:text-2xl font-black text-emerald-300">98.4%</div>
                      <div className="text-[11px] text-emerald-100/70">Indeks Kepuasan (IKM)</div>
                    </div>
                    <div className="p-3 bg-emerald-800/40 rounded-xl border border-emerald-700/40">
                      <div className="text-xl sm:text-2xl font-black text-emerald-300">24 Jam</div>
                      <div className="text-[11px] text-emerald-100/70">UGD & Bersalin Siaga</div>
                    </div>
                  </div>

                </div>

                {/* Right Card: Quick Hotline & Important Status */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-6 rounded-2xl bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-700 shadow-2xl text-white">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                        Informasi Pelayanan Terkini
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400 text-emerald-950 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-900 animate-ping" />
                        Hari Ini Buka
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-xl bg-black/20 border border-white/10 flex items-start gap-3">
                        <Clock className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-white">Jadwal Pelayanan Poliklinik:</strong>
                          <p className="text-emerald-100/80 mt-0.5">Senin – Sabtu: 07.30 – 13.00 WIB</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-black/20 border border-white/10 flex items-start gap-3">
                        <Activity className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-white">UGD & Persalinan PONED:</strong>
                          <p className="text-emerald-100/80 mt-0.5">Buka 24 Jam Setiap Hari (Prioritas Gawat Darurat)</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-black/20 border border-white/10 flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-white">Lokasi Puskesmas Induk:</strong>
                          <p className="text-emerald-100/80 mt-0.5">{PUSKESMAS_INFO.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick WhatsApp Hotline */}
                    <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-emerald-200">Layanan Kontak Resmi:</div>
                        <div className="text-sm font-bold text-white">{PUSKESMAS_INFO.whatsapp}</div>
                      </div>
                      <a
                        href={PUSKESMAS_INFO.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs flex items-center gap-1.5 transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Chat WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Quick Access Gateway Bar */}
          <section className="py-6 bg-slate-100/80 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Akses Cepat Gateway Publik
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold cursor-pointer" onClick={() => onSelectTab('sistem')}>
                  Lihat Semua Sistem &rarr;
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {systems.slice(0, 6).map((sys) => (
                  <a
                    key={sys.id}
                    href={sys.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl hover:border-emerald-500 hover:shadow-md transition text-center group"
                  >
                    <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {sys.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {sys.badge || 'Portal'}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Highlights: Berita & Pengumuman Terbaru */}
          <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Informasi & Pengumuman Terkini
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Kabar kegiatan kesehatan, edukasi masyarakat, dan layanan terpadu Puskesmas Kepanjen
                </p>
              </div>
              <button
                onClick={() => onSelectTab('informasi')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Selengkapnya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {newsList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col justify-between"
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {item.category}
                      </span>
                      <span className="text-[11px] text-slate-400">{item.date}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug mb-2 hover:text-emerald-600 transition">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>Oleh: {item.author}</span>
                    <button
                      onClick={() => setSelectedNews(item)}
                      className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                    >
                      Baca Berita
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Wilayah Binaan & Peta Kecamatan Kepanjen */}
          <section className="py-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Wilayah Kerja Puskesmas</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    Menjangkau 18 Desa & Kelurahan dengan 108 Posyandu Binaan
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    UPTD Puskesmas Kepanjen mengoordinasikan ekosistem pelayanan kesehatan terintegrasi di 18 Desa/Kelurahan yang ditopang oleh 108 Posyandu aktif, 3 Pustu, UPKDK, dan Mitra Kesehatan dengan SIPANDU PEDULI sebagai Portal & Integration Hub resmi.
                  </p>

                  <div className="pt-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                      Daftar Desa / Kelurahan Binaan:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {VILLAGES_KEPANJEN.map((village, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                          {village}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex items-center gap-3">
                    <button
                      onClick={() => onSelectTab('mitra')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                    >
                      Lihat Jejaring Faskes & Pustu
                    </button>
                    <a
                      href="https://maps.google.com/?q=Puskesmas+Kepanjen+Malang"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
                    >
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>Petunjuk Arah Google Maps</span>
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/80 border border-emerald-100 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
                        <Building2 className="w-4 h-4 text-emerald-600" />
                        <span>Pusat Layanan Induk Kepanjen</span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Kode Faskes: {PUSKESMAS_INFO.code}</span>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Alamat Lengkap:</strong>
                          <div className="text-slate-600 dark:text-slate-300">{PUSKESMAS_INFO.address}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>WhatsApp Layanan Informasi:</strong>
                          <div className="text-slate-600 dark:text-slate-300">{PUSKESMAS_INFO.whatsapp}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Mail className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Email Resmi:</strong>
                          <div className="text-slate-600 dark:text-slate-300">{PUSKESMAS_INFO.email}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Instagram className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Instagram Resmi:</strong>
                          <div className="text-slate-600 dark:text-slate-300">{PUSKESMAS_INFO.instagram}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-emerald-100/60 dark:bg-emerald-950/40 rounded-xl text-[11px] text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                      <span>Maklumat Pelayanan Terakreditasi Paripurna Kemenkes RI</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Section: FAQ Interaktif */}
          <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Pertanyaan yang Sering Diajukan (FAQ)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Informasi ringkas seputar syarat berobat, BPJS, dan alur pelayanan di Puskesmas Kepanjen
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left p-4 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-emerald-600' : ''}`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="p-4 pt-0 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Tab 2: PELAYANAN & LAYANAN POLIKLINIK */}
      {(activeTab === 'pelayanan' || activeTab === 'layanan') && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>Standar Pelayanan Publik</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Jenis Layanan & Poliklinik Puskesmas Kepanjen
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Informasi jadwal, persyaratan berkas, alur pelayanan, tarif retribusi daerah, dan jaminan BPJS Kesehatan.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Left Poliklinik List */}
            <div className="lg:col-span-5 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Pilih Poliklinik / Fasilitas:
              </span>
              {services.map((srv) => {
                const isSelected = (selectedService?.id || services[0]?.id) === srv.id;
                return (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedService(srv)}
                    className={`p-4 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {srv.name}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {srv.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{srv.schedule}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Detail Card for Selected Service */}
            <div className="lg:col-span-7">
              {(() => {
                const activeSrv = selectedService || services[0];
                if (!activeSrv) return null;
                return (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-md space-y-6">
                    
                    <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
                      <div>
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                          {activeSrv.category} • {activeSrv.room}
                        </span>
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                          {activeSrv.name}
                        </h2>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          {activeSrv.description}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
                        {activeSrv.bpjsCovered ? 'Gratis BPJS' : 'Umum'}
                      </span>
                    </div>

                    {/* Doctor & Schedule */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Waktu Pelayanan:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{activeSrv.schedule}</span>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Penanggung Jawab Medis:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{activeSrv.doctorPic}</span>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Persyaratan Pendaftaran & Berkas:</span>
                      </h3>
                      <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                        {(activeSrv.requirements || []).map((req, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Service Flow */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-blue-600" />
                        <span>Alur Tahapan Pelayanan Pasien:</span>
                      </h3>
                      <div className="space-y-2">
                        {(activeSrv.flow || []).map((step, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-xs">
                            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                              {idx + 1}
                            </div>
                            <span className="text-slate-700 dark:text-slate-300">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tariff & BPJS guarantee */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <strong className="block text-slate-900 dark:text-white">Ketentuan Tarif & Retribusi Daerah:</strong>
                        <p className="text-slate-600 dark:text-slate-300 mt-0.5">{activeSrv.tariff}</p>
                      </div>
                    </div>

                    {/* Maklumat Pelayanan */}
                    <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
                      <strong className="block font-bold mb-1">Maklumat Standar Pelayanan:</strong>
                      &quot;{PUSKESMAS_INFO.maklumat}&quot;
                    </div>

                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: INFORMASI & PUBLIK */}
      {(activeTab === 'informasi' || activeTab === 'berita') && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Pusat Informasi & Unduhan Publik</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Profil, Berita & Dokumen Publik
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Transparansi dokumen perencanaan, edukasi promkes, profil Puskesmas, dan berkas unduhan resmi.
            </p>
          </div>

          {/* Profil Puskesmas & Tata Nilai */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>Visi, Misi & Tata Nilai UPTD Puskesmas Kepanjen</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-6 text-xs">
              <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-800 space-y-2">
                <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">Visi Puskesmas:</span>
                <p className="font-semibold text-slate-800 dark:text-white text-sm leading-relaxed">
                  &quot;{PUSKESMAS_INFO.vision}&quot;
                </p>
              </div>

              <div className="p-4 bg-teal-50/70 dark:bg-teal-950/40 rounded-xl border border-teal-200/80 dark:border-teal-800 space-y-2">
                <span className="text-[10px] font-bold uppercase text-teal-700 dark:text-teal-400">Motto Pelayanan:</span>
                <p className="font-semibold text-slate-800 dark:text-white text-sm leading-relaxed">
                  &quot;{PUSKESMAS_INFO.motto}&quot;
                </p>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">Misi Pembangunan Kesehatan:</span>
              <ul className="grid sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                {PUSKESMAS_INFO.mission.map((m, idx) => (
                  <li key={idx} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Unduhan Dokumen Publik */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Unduhan Dokumen & Standar Pelayanan Publik
                </h2>
                <p className="text-xs text-slate-500">Berkas resmi yang dapat diunduh langsung oleh masyarakat</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {publicDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex flex-col justify-between hover:shadow-md transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                        {doc.fileType.toUpperCase()} • {doc.size}
                      </span>
                      <span className="text-[10px] text-slate-400">{doc.year}</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1 leading-snug">
                      {doc.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {doc.description}
                    </p>
                  </div>
                  <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Diperbarui: {doc.updatedAt}</span>
                    <button
                      onClick={() => onSelectDocument(doc)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh Berkas</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Semua Berita & Promosi Kesehatan */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Semua Berita & Dokumentasi Kegiatan
            </h2>
            <div className="space-y-4">
              {newsList.map((n) => (
                <div
                  key={n.id}
                  onClick={() => setSelectedNews(n)}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6 space-y-3 shadow-xs hover:shadow-md transition overflow-hidden cursor-pointer group"
                >
                  {n.imageUrl && (
                    <img
                      src={n.imageUrl}
                      alt={n.title}
                      className="w-full max-h-72 object-cover rounded-xl border border-slate-200 dark:border-slate-700 group-hover:opacity-95 transition"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    {n.isBookmarked && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        ⭐ Unggulan
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {n.category}
                    </span>
                    <span className="text-xs text-slate-400">📅 {n.date}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-emerald-600 transition">
                    {n.title}
                  </h3>
                  {n.excerpt && (
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
                      {n.excerpt}
                    </p>
                  )}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-700 mt-2 text-xs">
                    <span className="text-slate-500">Oleh: {n.author}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Baca Berita <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 4: SISTEM DIGITAL (GATEWAY) */}
      {activeTab === 'sistem' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Sistem Digital Terintegrasi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Gateway Sistem Digital & Aplikasi Layanan
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              <em>Prinsip Gateway, Bukan Duplikasi:</em> Satu pintu akses cepat menuju sistem pemerintah pusat, daerah, dan internal Puskesmas Kepanjen.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systems.map((sys) => (
              <div
                key={sys.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between hover:shadow-lg hover:border-emerald-500/50 transition group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {sys.categoryLabel}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {sys.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition flex items-center gap-2">
                    <span>{sys.name}</span>
                    {sys.badge && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded font-normal">
                        {sys.badge}
                      </span>
                    )}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {sys.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 truncate max-w-[150px]">
                    {sys.url}
                  </span>
                  <a
                    href={sys.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                  >
                    <span>Buka Sistem</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Gateway Notice Box */}
          <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <strong className="text-slate-900 dark:text-white block font-semibold">
              Keterangan Penggunaan Gateway SIPANDU PEDULI:
            </strong>
            <p>
              Tautan di atas mengarahkan pengguna secara langsung ke URL server resmi instansi terkait. SIPANDU PEDULI tidak menyimpan atau memproses kata sandi akun eksternal pengguna.
            </p>
          </div>
        </div>
      )}

      {/* Tab 5: DATA & MONITORING (PUBLIK) */}
      {(activeTab === 'monitoring' || activeTab === 'dokumen') && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Transparansi Kinerja Publik</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Data & Monitoring Capaian Program Kesehatan
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Data agregat capaian Cek Kesehatan Gratis (CKG), Standar Pelayanan Minimal (SPM), dan Penilaian Kinerja Puskesmas (PKP) tanpa menampilkan data pribadi.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[11px] font-bold text-emerald-600 uppercase">Cakupan CKG Produktif</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">77.4%</div>
              <div className="text-[11px] text-slate-500 mt-1">11.230 dari target 14.500 jiwa</div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mt-3 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '77.4%' }} />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[11px] font-bold text-blue-600 uppercase">SPM Ibu Hamil (K6)</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">94.8%</div>
              <div className="text-[11px] text-slate-500 mt-1">Target SPM Nasional 100%</div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mt-3 overflow-hidden">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '94.8%' }} />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[11px] font-bold text-teal-600 uppercase">Skor PKP UKM Esensial</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">96.2%</div>
              <div className="text-[11px] text-slate-500 mt-1">Kategori Kinerja: Baik / Tercapai</div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mt-3 overflow-hidden">
                <div className="bg-teal-500 h-2 rounded-full" style={{ width: '96.2%' }} />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[11px] font-bold text-amber-600 uppercase">Skor IKM Kepuasan</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">98.4 / 100</div>
              <div className="text-[11px] text-slate-500 mt-1">Mutu Pelayanan: Sangat Baik (A)</div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mt-3 overflow-hidden">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '98.4%' }} />
              </div>
            </div>
          </div>

          {/* Indicator Progress Table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Rincian Capaian Indikator Prioritas Periode Berjalan 2026
              </h2>
              <span className="text-xs text-slate-400">Data Agregat Terverifikasi</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="p-4">Program</th>
                    <th className="p-4">Indikator Kinerja</th>
                    <th className="p-4">Target</th>
                    <th className="p-4">Realisasi</th>
                    <th className="p-4">Progres (%)</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Terakhir Diperbarui</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {indicators.map((ind) => {
                    const pct = Math.min(100, Math.round((ind.current / ind.target) * 100));
                    return (
                      <tr key={ind.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-4 font-bold text-emerald-700 dark:text-emerald-400">
                          {ind.program}
                        </td>
                        <td className="p-4 font-semibold text-slate-900 dark:text-white">
                          {ind.title}
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-300">
                          {ind.target.toLocaleString()} {ind.unit}
                        </td>
                        <td className="p-4 font-bold text-slate-900 dark:text-white">
                          {ind.current.toLocaleString()} {ind.unit}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  pct >= 90 ? 'bg-emerald-500' : pct >= 75 ? 'bg-blue-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="font-mono text-xs font-bold">{pct}%</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ind.status === 'Tercapai'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : ind.status === 'On Track'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {ind.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400 text-[11px]">{ind.lastUpdated}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: MITRA PUSKESMAS & 108 POSYANDU */}
      {activeTab === 'mitra' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Jaringan & Ekosistem 108 Posyandu</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Mitra & Direktori 108 Posyandu se-Kepanjen
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              SIPANDU PEDULI sebagai Integration Hub menghubungkan 3 Pustu, UPKDK, 108 Posyandu di 18 Desa/Kelurahan, serta jejaring klinik/TPMD tanpa menduplikasi rekam medis individu.
            </p>
          </div>

          {/* Section: Direktori Master 108 Posyandu di 18 Desa */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Master Data Resmi
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  Direktori 108 Posyandu Terintegrasi (18 Desa / Kelurahan)
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-400">108</span>
                <span className="text-xs text-slate-400 block">Posyandu Aktif Binaan</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {POSYANDU_VILLAGE_SUMMARY.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-emerald-500/60 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-300">{item.village}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-black">
                      {item.count} Posyandu
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.posyandus.slice(0, 4).map((pName, pIdx) => (
                      <span
                        key={pIdx}
                        className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-medium text-slate-300 border border-slate-700"
                      >
                        {pName}
                      </span>
                    ))}
                    {item.posyandus.length > 4 && (
                      <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
                        +{item.posyandus.length - 4} lagi
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Pustu, UPKDK & Faskes Jejaring
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mitraList.map((m) => (
                <div
                  key={m.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {m.type}
                      </span>
                      <span className="text-[11px] text-slate-400">{m.village}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                      {m.name}
                    </h3>
                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{m.address}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{m.operationalHours}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span>Penanggung Jawab: {m.pic}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">{m.phone}</span>
                    <a
                      href={`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Hubungi</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: PENGADUAN & UMPAN BALIK */}
      {activeTab === 'pengaduan' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
              <MessageSquareHeart className="w-3.5 h-3.5" />
              <span>Suara Warga & Kualitas Pelayanan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Pengaduan, Saran & Survei Kepuasan
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Sampaikan aspirasi dan kendala pelayanan Anda. Setiap aduan ditindaklanjuti secara akuntabel dengan nomor tiket resmi.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Form Pengaduan */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-600" />
                <span>Formulir Pengaduan / Aspirasi Pelayanan</span>
              </h2>

              {submittedTicket && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aduan Berhasil Disampaikan!</span>
                  </div>
                  <p>
                    Nomor Tiket Anda: <strong className="font-mono text-sm px-1.5 py-0.5 bg-emerald-200 dark:bg-emerald-900 rounded">{submittedTicket}</strong>
                  </p>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-400">
                    Simpan nomor tiket ini untuk mengecek status tindak lanjut aduan Anda pada kolom Cek Tiket di sebelah kanan.
                  </p>
                </div>
              )}

              <form onSubmit={handleComplaintSubmit} className="space-y-4 text-xs">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nomor HP / WhatsApp (Aktif) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={reporterContact}
                      onChange={(e) => setReporterContact(e.target.value)}
                      placeholder="08123456xxxx"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Unit / Layanan yang Dituju
                    </label>
                    <select
                      value={serviceTarget}
                      onChange={(e) => setServiceTarget(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <option value="Pemeriksaan Umum">Pemeriksaan Umum</option>
                      <option value="Poli KIA-KB">Poli KIA-KB</option>
                      <option value="Poli Gigi">Poli Gigi & Mulut</option>
                      <option value="Poli Lansia / CKG">Poli Lansia / CKG</option>
                      <option value="UGD 24 Jam">Unit Gawat Darurat (UGD)</option>
                      <option value="Loket Pendaftaran">Loket Pendaftaran / Antrean</option>
                      <option value="Laboratorium">Laboratorium</option>
                      <option value="Farmasi / Apotek">Farmasi / Obat</option>
                      <option value="Fasilitas & Parkir">Fasilitas, Parkir & Kebersihan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Kategori Masukan
                    </label>
                    <select
                      value={complaintCategory}
                      onChange={(e) => setComplaintCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <option value="Waktu Tunggu & Antrean">Waktu Tunggu & Antrean</option>
                      <option value="Sikap & Keramahan Petugas">Sikap & Keramahan Petugas</option>
                      <option value="Ketersediaan Obat">Ketersediaan Obat</option>
                      <option value="Fasilitas & Kenyamanan">Fasilitas & Kenyamanan</option>
                      <option value="Apresiasi & Saran Positif">Apresiasi & Saran Positif</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Isi Laporan / Saran Pengaduan *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={complaintContent}
                    onChange={(e) => setComplaintContent(e.target.value)}
                    placeholder="Ceritakan secara kronologis kendala atau saran yang Anda alami..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">
                    Kerahasiaan identitas pelapor dijamin sesuai kode etik pelayanan.
                  </span>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Pengaduan</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Cek Tiket & Quick Survey IKM */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Cek Status Tiket */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-600" />
                  <span>Cek Status Tindak Lanjut Tiket</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Masukkan nomor tiket aduan Anda (contoh: <code>KPJ-2026-0901</code>)
                </p>

                <form onSubmit={handleCheckTicket} className="flex gap-2">
                  <input
                    type="text"
                    value={searchTicketId}
                    onChange={(e) => setSearchTicketId(e.target.value)}
                    placeholder="KPJ-2026-XXXX"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs rounded-lg hover:opacity-90 transition shrink-0"
                  >
                    Cek
                  </button>
                </form>

                {searchedComplaint === 'not_found' && (
                  <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Nomor tiket tidak ditemukan. Mohon pastikan kode yang dimasukkan tepat.</span>
                  </div>
                )}

                {searchedComplaint && searchedComplaint !== 'not_found' && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {searchedComplaint.ticketId}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          searchedComplaint.status === 'Selesai'
                            ? 'bg-emerald-100 text-emerald-800'
                            : searchedComplaint.status === 'Diproses'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {searchedComplaint.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Pelapor: {searchedComplaint.reporterName} • {searchedComplaint.date}
                    </div>
                    <div className="text-slate-700 dark:text-slate-300 font-medium">
                      &quot;{searchedComplaint.content}&quot;
                    </div>
                    {searchedComplaint.response && (
                      <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg text-emerald-900 dark:text-emerald-200 text-[11px]">
                        <strong>Tindak Lanjut Puskesmas:</strong>
                        <p className="mt-0.5">{searchedComplaint.response}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Survey IKM (Indeks Kepuasan Masyarakat) */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/60 rounded-2xl border border-emerald-200 dark:border-slate-700 p-6 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4 text-emerald-600" />
                    <span>Survei Cepat Kepuasan (IKM)</span>
                  </h3>
                  <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded">
                    IKM 2026
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Bagaimana penilaian Anda terhadap keramahan dan kecepatan pelayanan hari ini?
                </p>

                {ikmSubmitted ? (
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl text-center text-xs text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300">
                    Terima kasih atas partisipasi Anda membangun Puskesmas Kepanjen!
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { score: 4, label: 'Sangat Puas', emoji: '😊' },
                        { score: 3, label: 'Puas', emoji: '🙂' },
                        { score: 2, label: 'Cukup', emoji: '😐' },
                        { score: 1, label: 'Kurang', emoji: '🙁' }
                      ].map((item) => (
                        <button
                          key={item.score}
                          onClick={() => {
                            setIkmRating(item.score);
                            setIkmSubmitted(true);
                          }}
                          className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 rounded-xl text-center transition group"
                        >
                          <div className="text-xl mb-1 group-hover:scale-110 transition">{item.emoji}</div>
                          <div className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 leading-tight">
                            {item.label}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="text-[10px] text-center text-slate-400">
                      Rata-rata kepuasan tahun berjalan: <strong>98.4% (Kategori Sangat Baik)</strong>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* News Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedNews(null)}
          />
          
          {/* Modal content */}
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex-1 truncate pr-4">
                {selectedNews.title}
              </h2>
              <button
                onClick={() => setSelectedNews(null)}
                className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 text-slate-500 rounded-full transition-colors"
                title="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  {selectedNews.category}
                </span>
                <span className="text-sm font-medium text-slate-500">
                  📅 {selectedNews.date}
                </span>
                <span className="text-sm font-medium text-slate-500">
                  ✍️ {selectedNews.author}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight mb-6">
                {selectedNews.title}
              </h1>

              {/* Cover Image */}
              {selectedNews.imageUrl && (
                <img
                  src={selectedNews.imageUrl}
                  alt={selectedNews.title}
                  className="w-full h-auto max-h-[400px] object-cover rounded-2xl mb-8 border border-slate-200 dark:border-slate-700 shadow-sm"
                  referrerPolicy="no-referrer"
                />
              )}

              {/* Content */}
              {selectedNews.isEmbed && selectedNews.embedCode ? (
                <div
                  className="w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
                  dangerouslySetInnerHTML={{ __html: selectedNews.embedCode }}
                />
              ) : (
                <div 
                  className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 rich-text-content"
                  dangerouslySetInnerHTML={{ __html: selectedNews.content }}
                />
              )}
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
              <button
                onClick={() => setSelectedNews(null)}
                className="px-6 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
