export type UserRole = 'super_admin' | 'admin' | 'pimpinan' | 'koordinator' | 'petugas' | 'viewer';

export type UnitCluster = 
  | 'tu' 
  | 'manajemen' 
  | 'kia' 
  | 'dewasa_lansia' 
  | 'p2m_kesling' 
  | 'lintas_klaster' 
  | 'all';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  nip: string;
  role: UserRole;
  unit: UnitCluster;
  unitName: string;
  roleLabel: string;
  avatar?: string;
  status: 'active' | 'inactive';
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  schedule: string;
  description: string;
  requirements: string[];
  flow: string[];
  tariff: string;
  room: string;
  doctorPic: string;
  bpjsCovered: boolean;
}

export interface DigitalSystemItem {
  id: string;
  name: string;
  category: 'pemerintah' | 'internal' | 'dinkes';
  categoryLabel: string;
  description: string;
  url: string;
  iconName: string;
  badge?: string;
  isExternal: boolean;
  status: 'Online' | 'Maintenance';
}

export interface IndicatorMetric {
  id: string;
  program: 'PKP' | 'CKG' | 'SPM' | 'KIA' | 'P2M';
  title: string;
  target: number;
  current: number;
  unit: string;
  period: string;
  status: 'Tercapai' | 'On Track' | 'Perlu Perhatian';
  cluster: UnitCluster;
  verificationStatus: 'Terverifikasi' | 'Menunggu Review' | 'Draft';
  lastUpdated: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'perencanaan' | 'pkp' | 'ckg' | 'spm' | 'akreditasi' | 'bimtek' | 'sasaran' | 'publik' | 'tu';
  categoryLabel: string;
  year: number;
  cluster: UnitCluster;
  clusterLabel: string;
  driveUrl: string;
  fileType: 'sheet' | 'doc' | 'pdf' | 'folder';
  size?: string;
  uploaderName: string;
  verificationStatus: 'Terverifikasi' | 'Menunggu Verifikasi' | 'Draft';
  updatedAt: string;
  isPublicDownload: boolean;
  description?: string;
}

export interface ActivityLogItem {
  id: string;
  userName: string;
  role: string;
  action: string;
  target: string;
  timestamp: string;
  ipAddress: string;
  type: 'auth' | 'document' | 'verification' | 'system';
}

export interface ComplaintItem {
  id: string;
  ticketId: string;
  reporterName: string;
  reporterContact: string;
  serviceTarget: string;
  category: string;
  content: string;
  date: string;
  status: 'Menunggu' | 'Diproses' | 'Selesai';
  response?: string;
}

export interface HealthPostMitra {
  id: string;
  name: string;
  type: 'Pustu' | 'UPKDK' | 'Posyandu' | 'Klinik' | 'TPMD';
  village: string;
  address: string;
  pic: string;
  phone: string;
  operationalHours: string;
}

export type PosyanduReportStatus = 
  | 'BELUM LAPOR'
  | 'DRAFT'
  | 'SUDAH LAPOR'
  | 'BELUM LENGKAP'
  | 'MENUNGGU VERIFIKASI'
  | 'TERVERIFIKASI'
  | 'PERLU PERBAIKAN';

export interface PosyanduChecklist {
  kunjunganInputted: boolean;     // 1. Apakah data kunjungan sudah diinput?
  pelayananCompleted: boolean;    // 2. Apakah data pelayanan sudah lengkap?
  kunjunganRumahInputted: boolean;// 3. Apakah data kunjungan rumah sudah diinput?
  administrasiCompleted: boolean; // 4. Apakah administrasi kegiatan sudah lengkap?
}

export interface PosyanduMonthlyRecord {
  status: PosyanduReportStatus;
  kunjunganCount?: number;
  pelayananCount?: number;
  kunjunganRumahCount?: number;
  sasaranCount?: number;
  updatedAt?: string;
}

export interface PosyanduItem {
  id: string;               // e.g. "KPN-001"
  number: number;           // 1 to 108
  name: string;             // e.g. "ANGGREK 1 KEPANJEN"
  village: string;          // e.g. "KEPANJEN"
  address: string;          // e.g. "RW 01, Kelurahan Kepanjen"
  status: 'Aktif' | 'Nonaktif';
  isActive?: boolean;
  systemUrl: string;        // Link Sistem/Portal Posyandu
  reportFormUrl: string;    // Link Form Pelaporan
  docUrl: string;           // Link Dokumen/Data
  villageInfoUrl: string;   // Link Informasi Desa (Linktree)
  reportStatus: PosyanduReportStatus;
  lastUpdated: string;
  reportPeriodMonth?: string;
  checklist?: PosyanduChecklist;
  notes?: string;           // Catatan evaluasi/revisi kader koordinator
  verificationNotes?: string;
  verifiedBy?: string;      // Nama verifikator (Kader Koordinator Desa / Puskesmas)
  verifiedAt?: string;
  monthlyStatus?: Record<number, PosyanduMonthlyRecord>; // Month 1-12 (Jan - Des)
}

export interface VillageData {
  id: string;
  name: string;
  type: 'Kelurahan' | 'Desa';
  linktreeUrl: string;
  posyanduCount: number;
}

export interface NewsAnnouncement {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  author: string;
  isImportant?: boolean;
  status?: 'Published' | 'Draft';
  storageType?: 'Cloud' | 'Lokal';
  coverType?: 'drive' | 'galeri' | 'webp' | 'link';
  embedCode?: string;
  isEmbed?: boolean;
  isBookmarked?: boolean;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  subtitle: string;
  code: string;
  regency: string;
  address: string;
  phone: string;
  whatsapp: string;
  whatsappUrl: string;
  email: string;
  instagram: string;
  instagramUrl: string;
  operationalHours: string;
  vision: string;
  mission: string[];
  motto: string;
  maklumat: string;
  logoUrl: string;
  headerBadgeText: string;
  heroTitle?: string;
  heroSubtitle?: string;
}

export interface MarqueeSettings {
  enabled: boolean;
  text: string;
  secondaryText?: string;
  speed: 'slow' | 'medium' | 'fast';
  variant: 'emerald' | 'amber' | 'blue' | 'rose' | 'dark';
  hotline: string;
  badge: string;
}

export interface DriveFileItem {
  id: string;
  name: string;
  driveUrl: string;
  thumbnailUrl: string;
  mimeType: string;
  size: string;
  category: 'logo' | 'banner' | 'dokumentasi' | 'berkas' | 'lainnya';
  uploadedAt: string;
  isCurrentLogo?: boolean;
}

export interface MobileDockItem {
  id: string;
  label: string;
  icon: 'menu' | 'home' | 'services' | 'document' | 'mitra' | 'complaint' | 'phone' | 'whatsapp' | 'emergency' | 'info' | 'building' | 'users';
  actionType: 'sidebar' | 'tab' | 'url' | 'tel' | 'scroll' | 'portal_pegawai';
  target: string;
  isEnabled: boolean;
  isHighlight?: boolean;
  badge?: string;
}

export interface MobileDockConfig {
  enabled: boolean;
  blurEffect: boolean;
  showLabels: boolean;
  items: MobileDockItem[];
}
