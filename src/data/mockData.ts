import {
  UserAccount,
  ServiceItem,
  DigitalSystemItem,
  IndicatorMetric,
  DocumentItem,
  ActivityLogItem,
  ComplaintItem,
  HealthPostMitra,
  NewsAnnouncement,
} from '../types';

export const PUSKESMAS_INFO = {
  name: 'UPTD Puskesmas Kepanjen',
  tagline: 'SIPANDU PEDULI — One Link, One Click Access',
  subtitle: 'Sistem Pantau Data Dukung Pelaksanaan, Dokumentasi, dan Evaluasi untuk Layanan Integratif',
  code: 'P3507080201',
  regency: 'Kabupaten Malang',
  address: 'Jl. Raya Jatirejoyoso No. 4, Kec. Kepanjen, Kab. Malang, Jawa Timur 65163',
  phone: '08889924444',
  whatsapp: '08889924444',
  whatsappUrl: 'https://wa.me/628889924444',
  email: 'puskesmaskepanjen@malangkab.go.id',
  instagram: '@pkm.kepanjen',
  instagramUrl: 'https://instagram.com/pkm.kepanjen',
  operationalHours: 'Senin – Kamis: 07.30 – 14.00 WIB | Jumat: 07.30 – 11.00 WIB | Sabtu: 07.30 – 12.30 WIB (UGD & Bersalin 24 Jam)',
  vision: 'Terwujudnya Masyarakat Kecamatan Kepanjen yang Sehat, Mandiri, dan Berdaya Saing Menuju Kabupaten Malang Makmur',
  mission: [
    'Meningkatkan mutu pelayanan kesehatan yang merata, terjangkau, dan paripurna berbasis integrasi layanan primer (ILP).',
    'Mendorong kemandirian masyarakat untuk hidup sehat melalui pemberdayaan dan promosi kesehatan aktif.',
    'Memperkuat pencegahan, pengendalian penyakit menular dan penyakit tidak menular serta penyehatan lingkungan.',
    'Mengembangkan tata kelola Puskesmas yang transparan, akuntabel, dan berbasis teknologi digital (Good Governance).'
  ],
  motto: 'Kepanjen PEDULI (Profesional, Empati, Disiplin, Unggul, Loyal, Inovatif)',
  maklumat: 'Dengan ini kami menyatakan sanggup menyelenggarakan pelayanan sesuai standar pelayanan yang telah ditetapkan dan apabila tidak menepati janji ini, kami siap menerima sanksi sesuai peraturan perundang-undangan yang berlaku.'
};

export const MOCK_USERS: UserAccount[] = [
  {
    id: 'user-1',
    name: 'Ir. Ahmad Subagyo, S.Kom',
    email: 'admin.sipandu@puskesmaskepanjen.id',
    nip: '198403122008011005',
    role: 'super_admin',
    unit: 'all',
    unitName: 'Semua Unit & Administrator',
    roleLabel: 'Super Admin',
    status: 'active'
  },
  {
    id: 'user-2',
    name: 'drg. Hj. Rina Puspitasari, M.Kes',
    email: 'kapus.kepanjen@malangkab.go.id',
    nip: '197605152003122004',
    role: 'pimpinan',
    unit: 'all',
    unitName: 'Pimpinan / Kepala Puskesmas',
    roleLabel: 'Pimpinan Puskesmas',
    status: 'active'
  },
  {
    id: 'user-3',
    name: 'Bd. Siti Nurjanah, S.Tr.Keb',
    email: 'kia.kepanjen@malangkab.go.id',
    nip: '198811202010012014',
    role: 'koordinator',
    unit: 'kia',
    unitName: 'Klaster 2: Kesehatan Ibu & Anak',
    roleLabel: 'Koordinator Klaster KIA',
    status: 'active'
  },
  {
    id: 'user-4',
    name: 'dr. Hendra Wicaksono',
    email: 'dewasa.kepanjen@malangkab.go.id',
    nip: '199002142017041002',
    role: 'koordinator',
    unit: 'dewasa_lansia',
    unitName: 'Klaster 3: Dewasa & Lansia (PTM & CKG)',
    roleLabel: 'Koordinator Klaster Dewasa & Lansia',
    status: 'active'
  },
  {
    id: 'user-5',
    name: 'Dwi Retno Hastuti, A.Md.Kep',
    email: 'staf.p2m@puskesmaskepanjen.id',
    nip: '199407082020122009',
    role: 'petugas',
    unit: 'p2m_kesling',
    unitName: 'Klaster 4: P2M & Kesling',
    roleLabel: 'Petugas / Staf Teknis',
    status: 'active'
  },
  {
    id: 'user-6',
    name: 'Drs. Bambang Sudirman (Auditor Dinkes)',
    email: 'monev.dinkes@malangkab.go.id',
    nip: '197302011998031003',
    role: 'viewer',
    unit: 'all',
    unitName: 'Lintas Klaster / Monev Dinkes',
    roleLabel: 'Viewer / Tim Monev',
    status: 'active'
  }
];

export const MOCK_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    name: 'Pelayanan Pemeriksaan Umum',
    category: 'Pelayanan Medis',
    schedule: 'Senin - Sabtu: 07.30 - 13.00 WIB',
    description: 'Pemeriksaan kesehatan umum, diagnosis medis, pengobatan penyakit akut dan kronis, serta rujukan berjenjang jika diperlukan.',
    requirements: ['Kartu Identitas (KTP/KK)', 'Kartu BPJS/KIS Faskes Kepanjen (Bagi peserta JKN)', 'Buku rekam medis / Nomor antrean online'],
    flow: ['Ambil Nomor Antrean di Mesin / Loket', 'Pendaftaran & Verifikasi Berkas', 'Pemeriksaan Tanda Vital & Skrining', 'Pemeriksaan Dokter di Ruang Pemeriksaan', 'Pengambilan Resep Obat / Lab / Pulang'],
    tariff: 'Gratis bagi peserta BPJS Kesehatan aktif; Pasien Umum sesuai Perbup Malang No. 12 Tahun 2023 (Rp 15.000)',
    room: 'Ruang Pemeriksaan Umum (Lantai 1)',
    doctorPic: 'dr. Muhammad Farhan & Tim Medis',
    bpjsCovered: true
  },
  {
    id: 'srv-2',
    name: 'Pelayanan Kesehatan Ibu, Anak & KB (KIA)',
    category: 'Klaster 2 (KIA)',
    schedule: 'Senin - Kamis: 07.30 - 13.00 WIB | Jumat - Sabtu: 07.30 - 11.30 WIB',
    description: 'Pemeriksaan kehamilan terpadu (ANC 6x + USG Dokter), nifas, imunisasi rutin balita, KB pasca persalinan, dan deteksi dini risiko tinggi kehamilan.',
    requirements: ['Buku KIA (Pink)', 'KTP / Kartu Keluarga', 'Kartu BPJS Kesehatan'],
    flow: ['Pendaftaran', 'Skrining Berat Badan & Tekanan Darah', 'Konsultasi Bidan & USG Dokter', 'Konseling Gizi / Gigi (ANC Terpadu)', 'Apotek'],
    tariff: 'Gratis (BPJS) / Sesuai Perbup',
    room: 'Ruang KIA-KB (Lantai 1)',
    doctorPic: 'Bd. Siti Nurjanah, S.Tr.Keb & dr. Spesialis Obgyn Konsulen',
    bpjsCovered: true
  },
  {
    id: 'srv-3',
    name: 'Pelayanan Kesehatan Gigi dan Mulut',
    category: 'Pelayanan Medis',
    schedule: 'Senin - Sabtu: 08.00 - 12.30 WIB',
    description: 'Pemeriksaan gigi, pencabutan gigi sulung dan tetap, penambalan komposit, scalling karang gigi dasar, dan edukasi kesehatan oral.',
    requirements: ['Identitas KTP/KK', 'Kartu BPJS Kesehatan'],
    flow: ['Pendaftaran', 'Anamnesis & Vital Sign', 'Tindakan Gigi oleh Dokter Gigi', 'Resep Obat'],
    tariff: 'Gratis (BPJS) / Sesuai Perbup',
    room: 'Poli Gigi (Lantai 1)',
    doctorPic: 'drg. Tri Wahyuni & Perawat Gigi',
    bpjsCovered: true
  },
  {
    id: 'srv-4',
    name: 'Pelayanan Lansia & Skrining PTM (CKG)',
    category: 'Klaster 3 (Dewasa & Lansia)',
    schedule: 'Senin - Sabtu: 07.30 - 13.00 WIB',
    description: 'Skrining kesehatan terpadu: Cek Kesehatan Gratis (CKG), gula darah, kolesterol, asam urat, tensi, serta konseling kesehatan geriatri dan PTM.',
    requirements: ['KTP Kepanjen / Kartu Lansia', 'Kartu BPJS'],
    flow: ['Pendaftaran Prioritas Lansia', 'Pengukuran Tekanan Darah & Antropometri', 'Pemeriksaan Lab Cepat CKG', 'Pemeriksaan Dokter & Konseling'],
    tariff: 'Gratis Program CKG / BPJS',
    room: 'Poli Ramah Lansia (Lantai 1 - Akses Khusus)',
    doctorPic: 'dr. Hendra Wicaksono',
    bpjsCovered: true
  },
  {
    id: 'srv-5',
    name: 'Pemeriksaan Balita Sakit (MTBS) & Tumbuh Kembang',
    category: 'Klaster 2 (KIA)',
    schedule: 'Senin - Sabtu: 08.00 - 12.00 WIB',
    description: 'Manajemen Terpadu Balita Sakit, pemantauan SDIDTK, pencegahan stunting, serta pemberian konseling gizi dan PMT balita gizi kurang.',
    requirements: ['Buku KIA', 'KTP Orang Tua / KK', 'Kartu BPJS'],
    flow: ['Pendaftaran', 'Penimbangan & Pengukuran Panjang Badan', 'Pemeriksaan MTBS', 'Konsultasi Gizi', 'Apotek'],
    tariff: 'Gratis (BPJS) / Perbup',
    room: 'Ruang MTBS & Pojok Tumbuh Kembang',
    doctorPic: 'Tim Perawat MTBS & Ahli Gizi',
    bpjsCovered: true
  },
  {
    id: 'srv-6',
    name: 'Unit Gawat Darurat (UGD) & Persalinan 24 Jam',
    category: 'Gawat Darurat',
    schedule: 'Buka 24 Jam Setiap Hari (Non-Stop)',
    description: 'Pertolongan pertama kasus kegawatdaruratan medik, kecelakaan lalu lintas, stabilisasi pasien, persalinan normal (PONED), dan ambulans siaga.',
    requirements: ['Dapat dilayani segera tanpa antrean registrasi di awal (prioritas triase keselamatan nyawa)'],
    flow: ['Triase Cepat di Pintu Masuk', 'Penanganan Darurat Dokter & Perawat', 'Penyelesaian Administrasi Keluarga', 'Observasi / Rujukan Ambulans'],
    tariff: 'Dijamin BPJS Gawat Darurat / Sesuai Tarif Tindakan Perbup',
    room: 'Gedung UGD 24 Jam Depan',
    doctorPic: 'Dokter Jaga UGD & Tim Siaga Ambulans',
    bpjsCovered: true
  },
  {
    id: 'srv-7',
    name: 'Laboratorium Klinik',
    category: 'Penunjang Medis',
    schedule: 'Senin - Sabtu: 07.30 - 13.00 WIB (UGD 24 Jam)',
    description: 'Pemeriksaan darah lengkap, urin rutin, gula darah, tes cepat HIV/Sifilis/Hepatitis B, TCM Dahak TB paru, dan malaria.',
    requirements: ['Pengantar Pemeriksaan dari Dokter Poliklinik'],
    flow: ['Penyerahan Formulir Lab', 'Pengambilan Sampel Darah/Urin/Dahak', 'Tunggu Hasil (15-45 Menit)', 'Hasil dikirim ke Ruang Dokter'],
    tariff: 'Ditanggung BPJS atas indikasi medis',
    room: 'Instalasi Laboratorium',
    doctorPic: 'Analis Kesehatan / Pranata Labkes',
    bpjsCovered: true
  },
  {
    id: 'srv-8',
    name: 'Farmasi & Apotek Pelayanan',
    category: 'Penunjang Medis',
    schedule: 'Senin - Sabtu: 07.45 - 14.00 WIB (24 Jam untuk UGD)',
    description: 'Pemberian obat sesuai resep dokter, Pelayanan Informasi Obat (PIO), dan konseling kepatuhan minum obat kronis (hipertensi, diabetes, TB).',
    requirements: ['Resep Resmi dari Poliklinik Puskesmas Kepanjen'],
    flow: ['Penyerahan Lembar Resep', 'Screening Resep & Peracikan Obat', 'Pemanggilan Nama Pasien & Verifikasi Identitas', 'Penjelasan Cara Pakai Obat'],
    tariff: 'Gratis sesuai formularium obat Puskesmas',
    room: 'Loket Apotek & Konseling Obat',
    doctorPic: 'Apt. Dewi Lestari, S.Farm & Tim Farmasi',
    bpjsCovered: true
  }
];

export const MOCK_DIGITAL_SYSTEMS: DigitalSystemItem[] = [
  {
    id: 'sys-epuskesmas',
    name: 'RME / e-Puskesmas Malang',
    category: 'pemerintah',
    categoryLabel: 'Sistem Rekam Medis Elektronik (RME)',
    description: 'Sistem Rekam Medis Elektronik dan pelayanan medis klinis resmi Puskesmas Kepanjen (Source of Truth Medis).',
    url: 'https://malang.epuskesmas.id/login',
    iconName: 'Activity',
    badge: 'Rekam Medis (RME)',
    isExternal: true,
    status: 'Online'
  },
  {
    id: 'sys-pcare',
    name: 'PCare JKN BPJS Kesehatan',
    category: 'pemerintah',
    categoryLabel: 'Sistem Pelayanan BPJS',
    description: 'Aplikasi Primary Care BPJS Kesehatan untuk entri klaim, rujukan terintegrasi, dan verifikasi kepesertaan JKN.',
    url: 'https://pcarejkn.bpjs-kesehatan.go.id/eclaim/login',
    iconName: 'ShieldCheck',
    badge: 'PCare BPJS',
    isExternal: true,
    status: 'Online'
  },
  {
    id: 'sys-1',
    name: 'SP4N LAPOR!',
    category: 'pemerintah',
    categoryLabel: 'Sistem Pemerintah Pusat',
    description: 'Layanan aspirasi dan pengaduan online rakyat yang terhubung langsung dengan KemenPAN-RB, Kemendagri, dan Ombudsman RI.',
    url: 'https://www.lapor.go.id',
    iconName: 'ShieldAlert',
    badge: 'Nasional',
    isExternal: true,
    status: 'Online'
  },
  {
    id: 'sys-2',
    name: 'SIPPN MENPAN RB',
    category: 'pemerintah',
    categoryLabel: 'Sistem Pemerintah Pusat',
    description: 'Sistem Informasi Pelayanan Publik Nasional untuk melihat standar pelayanan, maklumat, tarif, dan kepatuhan instansi pemerintah.',
    url: 'https://sippn.menpan.go.id',
    iconName: 'Building2',
    badge: 'Nasional',
    isExternal: true,
    status: 'Online'
  },
  {
    id: 'sys-3',
    name: 'SATUSEHAT Kemenkes',
    category: 'pemerintah',
    categoryLabel: 'Kementerian Kesehatan',
    description: 'Platform integrasi data rekam medis elektronik (RME) nasional yang menghubungkan faskes dengan aplikasi mobile masyarakat.',
    url: 'https://satusehat.kemkes.go.id',
    iconName: 'HeartPulse',
    badge: 'Kemenkes',
    isExternal: true,
    status: 'Online'
  },
  {
    id: 'sys-4',
    name: 'Mobile JKN (BPJS Kesehatan)',
    category: 'pemerintah',
    categoryLabel: 'BPJS Kesehatan',
    description: 'Pendaftaran antrean online, cek status kepesertaan, perubahan faskes, serta riwayat pelayanan tanpa antre lama.',
    url: 'https://bpjs-kesehatan.go.id',
    iconName: 'Smartphone',
    badge: 'Antrean Online',
    isExternal: true,
    status: 'Online'
  },
  {
    id: 'sys-5',
    name: 'Portal Resmi Pemkab Malang',
    category: 'pemerintah',
    categoryLabel: 'Pemerintah Daerah',
    description: 'Pusat informasi publik terintegrasi dan layanan publik digital Kabupaten Malang.',
    url: 'https://malangkab.go.id',
    iconName: 'Globe',
    badge: 'Pemkab Malang',
    isExternal: true,
    status: 'Online'
  },
  {
    id: 'sys-6',
    name: 'PINTAR ASIK (Pencatatan Imunisasi)',
    category: 'internal',
    categoryLabel: 'Aplikasi Program Puskesmas',
    description: 'Sistem digital pencatatan terpadu imunisasi, pemantauan status gizi balita, dan pelacakan drop-out imunisasi desa se-Kepanjen.',
    url: 'https://asik.kemkes.go.id',
    iconName: 'Baby',
    badge: 'Program KIA',
    isExternal: true,
    status: 'Online'
  },
  {
    id: 'sys-7',
    name: 'Dashboard CKG Kepanjen',
    category: 'internal',
    categoryLabel: 'Program Prioritas',
    description: 'Dashboard pemantauan capaian Cek Kesehatan Gratis (CKG) usia produktif dan lansia per desa se-Kecamatan Kepanjen.',
    url: 'https://docs.google.com/spreadsheets/d/1_mock_ckg_kepanjen/edit',
    iconName: 'Activity',
    badge: 'CKG 2026',
    isExternal: true,
    status: 'Online'
  },
  {
    id: 'sys-8',
    name: 'E-Kinerja BKN / Pemkab Malang',
    category: 'internal',
    categoryLabel: 'Manajemen Kepegawaian',
    description: 'Sistem pengelolaan dan evaluasi Sasaran Kinerja Pegawai (SKP) Aparatur Sipil Negara UPTD Puskesmas Kepanjen.',
    url: 'https://kinerja.bkn.go.id',
    iconName: 'Briefcase',
    badge: 'Pegawai ASN',
    isExternal: true,
    status: 'Online'
  },
  {
    id: 'sys-9',
    name: 'E-SAKIP Akuntabilitas Kinerja',
    category: 'internal',
    categoryLabel: 'Tata Kelola Pemerintahan',
    description: 'Sistem Akuntabilitas Kinerja Instansi Pemerintah untuk pemantauan target perjanjian kinerja tahunan Puskesmas.',
    url: 'https://esakip.malangkab.go.id',
    iconName: 'Award',
    badge: 'Akuntabilitas',
    isExternal: true,
    status: 'Online'
  }
];

export const MOCK_INDICATORS: IndicatorMetric[] = [
  {
    id: 'ind-1',
    program: 'CKG',
    title: 'Cakupan Cek Kesehatan Gratis (Usia 15-59 Tahun)',
    target: 14500,
    current: 11230,
    unit: 'Jiwa',
    period: 'Januari - September 2026',
    status: 'On Track',
    cluster: 'dewasa_lansia',
    verificationStatus: 'Terverifikasi',
    lastUpdated: '08 September 2026'
  },
  {
    id: 'ind-2',
    program: 'CKG',
    title: 'Cakupan Skrining Lansia (Usia 60+ Tahun)',
    target: 5200,
    current: 4350,
    unit: 'Jiwa',
    period: 'Tahun 2026',
    status: 'Tercapai',
    cluster: 'dewasa_lansia',
    verificationStatus: 'Terverifikasi',
    lastUpdated: '09 September 2026'
  },
  {
    id: 'ind-3',
    program: 'SPM',
    title: 'Pelayanan Kesehatan Ibu Hamil Sesuai Standar (K4 & K6)',
    target: 100,
    current: 94.8,
    unit: '%',
    period: 'Triwulan III 2026',
    status: 'On Track',
    cluster: 'kia',
    verificationStatus: 'Terverifikasi',
    lastUpdated: '05 September 2026'
  },
  {
    id: 'ind-4',
    program: 'SPM',
    title: 'Pelayanan Kesehatan Penderita Hipertensi',
    target: 100,
    current: 82.4,
    unit: '%',
    period: 'Triwulan III 2026',
    status: 'Perlu Perhatian',
    cluster: 'dewasa_lansia',
    verificationStatus: 'Menunggu Review',
    lastUpdated: '04 September 2026'
  },
  {
    id: 'ind-5',
    program: 'SPM',
    title: 'Pelayanan Terduga Tuberkulosis (TB)',
    target: 100,
    current: 89.2,
    unit: '%',
    period: 'Triwulan III 2026',
    status: 'On Track',
    cluster: 'p2m_kesling',
    verificationStatus: 'Terverifikasi',
    lastUpdated: '07 September 2026'
  },
  {
    id: 'ind-6',
    program: 'PKP',
    title: 'Penilaian Kinerja Puskesmas (UKM Esensial)',
    target: 95.0,
    current: 96.2,
    unit: 'Skor Mutu (%)',
    period: 'Rekap Semester I 2026',
    status: 'Tercapai',
    cluster: 'manajemen',
    verificationStatus: 'Terverifikasi',
    lastUpdated: '01 September 2026'
  },
  {
    id: 'ind-7',
    program: 'PKP',
    title: 'Penilaian Kinerja Puskesmas (UKP & Farmasi)',
    target: 90.0,
    current: 91.5,
    unit: 'Skor Mutu (%)',
    period: 'Rekap Semester I 2026',
    status: 'Tercapai',
    cluster: 'lintas_klaster',
    verificationStatus: 'Terverifikasi',
    lastUpdated: '01 September 2026'
  },
  {
    id: 'ind-8',
    program: 'KIA',
    title: 'Balita Ditimbang Berat Badannya (D/S Posyandu)',
    target: 85.0,
    current: 86.7,
    unit: '%',
    period: 'Bulan Penimbangan Balita 2026',
    status: 'Tercapai',
    cluster: 'kia',
    verificationStatus: 'Terverifikasi',
    lastUpdated: '06 September 2026'
  }
];

export const MOCK_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    title: 'Rencana Pelaksanaan Kegiatan (RPK) Tahunan Puskesmas Kepanjen 2026',
    category: 'perencanaan',
    categoryLabel: 'Perencanaan',
    year: 2026,
    cluster: 'manajemen',
    clusterLabel: 'Klaster 1: Manajemen',
    driveUrl: 'https://drive.google.com/file/d/1_RPK_Puskesmas_Kepanjen_2026/view',
    fileType: 'sheet',
    size: '4.2 MB',
    uploaderName: 'Tim Manajemen Puskesmas',
    verificationStatus: 'Terverifikasi',
    updatedAt: '15 Januari 2026',
    isPublicDownload: false,
    description: 'Matriks alokasi anggaran, jadwal kegiatan per bulan, penanggung jawab program, dan target luaran tahun 2026.'
  },
  {
    id: 'doc-2',
    title: 'Rencana Usulan Kegiatan (RUK) Puskesmas Kepanjen Tahun Anggaran 2027',
    category: 'perencanaan',
    categoryLabel: 'Perencanaan',
    year: 2027,
    cluster: 'manajemen',
    clusterLabel: 'Klaster 1: Manajemen',
    driveUrl: 'https://drive.google.com/file/d/1_RUK_Puskesmas_Kepanjen_2027/view',
    fileType: 'doc',
    size: '3.8 MB',
    uploaderName: 'Tim Perencanaan (drg. Rina P)',
    verificationStatus: 'Terverifikasi',
    updatedAt: '28 Juli 2026',
    isPublicDownload: false,
    description: 'Analisis kebutuhan masyarakat, rekapitulasi SMD/MMD, serta usulan anggaran BOK dan BLUD 2027.'
  },
  {
    id: 'doc-3',
    title: 'Master Data Sasaran Penduduk & Program Puskesmas Kepanjen Tahun 2026',
    category: 'sasaran',
    categoryLabel: 'Data Sasaran',
    year: 2026,
    cluster: 'manajemen',
    clusterLabel: 'Semua Klaster',
    driveUrl: 'https://docs.google.com/spreadsheets/d/1_Data_Sasaran_Kepanjen_2026/edit',
    fileType: 'sheet',
    size: '8.5 MB',
    uploaderName: 'Koordinator SP2TP (Siti N)',
    verificationStatus: 'Terverifikasi',
    updatedAt: '02 Februari 2026',
    isPublicDownload: false,
    description: 'Breakdown proyeksi jumlah penduduk, sasaran bumil, bayi, balita, usia produktif, dan lansia per desa se-Kepanjen.'
  },
  {
    id: 'doc-4',
    title: 'Rekapitulasi Capaian Bulanan Penilaian Kinerja Puskesmas (PKP) 2026',
    category: 'pkp',
    categoryLabel: 'Program PKP',
    year: 2026,
    cluster: 'manajemen',
    clusterLabel: 'Klaster 1: Manajemen',
    driveUrl: 'https://docs.google.com/spreadsheets/d/1_PKP_Rekap_Bulanan_2026/edit',
    fileType: 'sheet',
    size: '5.1 MB',
    uploaderName: 'Tim Mutu & PKP',
    verificationStatus: 'Terverifikasi',
    updatedAt: '04 September 2026',
    isPublicDownload: false,
    description: 'Lembar telusur PKP bulanan, verifikasi dokumen eviden, dan capaian kumulatif per indikator pelayanan UKM dan UKP.'
  },
  {
    id: 'doc-5',
    title: 'Data Dukung & Rekapitulasi Cek Kesehatan Gratis (CKG) Semester I 2026',
    category: 'ckg',
    categoryLabel: 'Program CKG',
    year: 2026,
    cluster: 'dewasa_lansia',
    clusterLabel: 'Klaster 3: Dewasa & Lansia',
    driveUrl: 'https://docs.google.com/spreadsheets/d/1_CKG_Data_Dukung_2026/edit',
    fileType: 'sheet',
    size: '6.7 MB',
    uploaderName: 'dr. Hendra Wicaksono',
    verificationStatus: 'Terverifikasi',
    updatedAt: '05 September 2026',
    isPublicDownload: false,
    description: 'Hasil skrining 14 desa/kelurahan, deteksi dini hipertensi, diabetes, dan tindak lanjut rujukan faskes.'
  },
  {
    id: 'doc-6',
    title: 'Instrumen & Bukti Telusur Akreditasi Puskesmas (Bab 1 - 5)',
    category: 'akreditasi',
    categoryLabel: 'Akreditasi',
    year: 2026,
    cluster: 'all',
    clusterLabel: 'Lintas Klaster / Tim Mutu',
    driveUrl: 'https://drive.google.com/drive/folders/1_Folder_Akreditasi_Kepanjen',
    fileType: 'folder',
    size: '128 MB',
    uploaderName: 'Pokja Akreditasi Puskesmas',
    verificationStatus: 'Terverifikasi',
    updatedAt: '12 Agustus 2026',
    isPublicDownload: false,
    description: 'SK Kepala Puskesmas, SOP layanan klinis, Pedoman Tata Kelola (KMP), UKM, UKP, PMP, dan PPN.'
  },
  {
    id: 'doc-7',
    title: 'Laporan Monitoring & Evaluasi Bimtek Pembinaan Dinas Kesehatan Malang 2026',
    category: 'bimtek',
    categoryLabel: 'Bimtek • Desk • Monev',
    year: 2026,
    cluster: 'manajemen',
    clusterLabel: 'Manajemen & Lintas Klaster',
    driveUrl: 'https://drive.google.com/file/d/1_Monev_Bimtek_Dinkes_2026/view',
    fileType: 'pdf',
    size: '2.9 MB',
    uploaderName: 'Tim Manajemen (Ir. Ahmad S)',
    verificationStatus: 'Terverifikasi',
    updatedAt: '20 Agustus 2026',
    isPublicDownload: false,
    description: 'Notula desk monev indikator SPM dan tindak lanjut rekomendasi supervisi fasilitatif Dinkes Kab. Malang.'
  },
  {
    id: 'doc-8',
    title: 'Buku Saku Standar Pelayanan & Alur Pasien UPTD Puskesmas Kepanjen 2026',
    category: 'publik',
    categoryLabel: 'Unduhan Publik',
    year: 2026,
    cluster: 'all',
    clusterLabel: 'Area Publik',
    driveUrl: 'https://drive.google.com/file/d/1_Buku_Saku_Standar_Pelayanan_Publik/view',
    fileType: 'pdf',
    size: '3.4 MB',
    uploaderName: 'Humas & Tim Mutu',
    verificationStatus: 'Terverifikasi',
    updatedAt: '10 Februari 2026',
    isPublicDownload: true,
    description: 'Panduan resmi hak & kewajiban pasien, persyaratan loket, alur rujukan BPJS, dan tarif retribusi daerah.'
  },
  {
    id: 'doc-9',
    title: 'Jadwal Dokter & Petugas Jaga UGD / Bersalin Puskesmas Kepanjen Periode September 2026',
    category: 'publik',
    categoryLabel: 'Unduhan Publik',
    year: 2026,
    cluster: 'lintas_klaster',
    clusterLabel: 'Area Publik',
    driveUrl: 'https://drive.google.com/file/d/1_Jadwal_Dokter_September_2026/view',
    fileType: 'pdf',
    size: '1.1 MB',
    uploaderName: 'Subbag Tata Usaha',
    verificationStatus: 'Terverifikasi',
    updatedAt: '01 September 2026',
    isPublicDownload: true,
    description: 'Jadwal dinas harian dokter umum, dokter gigi, bidan siaga, dan paramedis UGD 24 jam.'
  }
];

export const MOCK_ACTIVITY_LOGS: ActivityLogItem[] = [
  {
    id: 'log-1',
    userName: 'Ir. Ahmad Subagyo, S.Kom (Super Admin)',
    role: 'Super Admin',
    action: 'Verifikasi Dokumen & Metadata',
    target: 'Data Dukung CKG Semester I 2026 (Klaster 3)',
    timestamp: '11 September 2026, 09:14 WIB',
    ipAddress: '192.168.1.104',
    type: 'verification'
  },
  {
    id: 'log-2',
    userName: 'Bd. Siti Nurjanah, S.Tr.Keb',
    role: 'Koordinator KIA',
    action: 'Pembaruan Tautan Gateway Data',
    target: 'Capaian SPM Ibu Hamil Triwulan III 2026',
    timestamp: '10 September 2026, 15:42 WIB',
    ipAddress: '192.168.1.118',
    type: 'document'
  },
  {
    id: 'log-3',
    userName: 'drg. Hj. Rina Puspitasari, M.Kes',
    role: 'Pimpinan Puskesmas',
    action: 'Tinjauan Dashboard Eksekutif',
    target: 'Monitoring PKP UKM & UKP Semester I 2026',
    timestamp: '10 September 2026, 11:20 WIB',
    ipAddress: '192.168.1.101',
    type: 'system'
  },
  {
    id: 'log-4',
    userName: 'Dwi Retno Hastuti, A.Md.Kep',
    role: 'Petugas / Staf',
    action: 'Unggah Berkas Pendukung',
    target: 'Notula Evaluasi Klaster P2M & Sanitasi Agustus 2026',
    timestamp: '09 September 2026, 14:05 WIB',
    ipAddress: '192.168.1.125',
    type: 'document'
  },
  {
    id: 'log-5',
    userName: 'Ir. Ahmad Subagyo, S.Kom (Super Admin)',
    role: 'Super Admin',
    action: 'Login Berhasil (Autentikasi SSO)',
    target: 'Portal Pegawai SIPANDU PEDULI',
    timestamp: '09 September 2026, 07:45 WIB',
    ipAddress: '192.168.1.104',
    type: 'auth'
  }
];

export const MOCK_COMPLAINTS: ComplaintItem[] = [
  {
    id: 'cmp-1',
    ticketId: 'KPJ-2026-0901',
    reporterName: 'Suryanto Hendro',
    reporterContact: '08123344xxxx',
    serviceTarget: 'Poli Umum',
    category: 'Waktu Tunggu & Antrean',
    content: 'Pagi tadi nomor antrean poli umum bergerak agak lama sekitar 40 menit setelah pendaftaran, mohon info apakah ada penambahan dokter di jam padat.',
    date: '03 September 2026',
    status: 'Selesai',
    response: 'Terima kasih atas masukannya Bapak Suryanto. Pada pukul 08.00-09.00 satu dokter sedang mendampingi kasus gawat darurat di UGD. Saat ini kami telah menyiagakan dokter pengganti cadangan di poli umum pada jam puncak.'
  },
  {
    id: 'cmp-2',
    ticketId: 'KPJ-2026-0902',
    reporterName: 'Ibu Ratna Dewi',
    reporterContact: '08571234xxxx',
    serviceTarget: 'Poli KIA-KB',
    category: 'Fasilitas & Ruang Tunggu',
    content: 'Ruang tunggu KIA sangat sejuk dan ramah anak, namun mohon ditambah kursi tunggu khusus ibu hamil trimester akhir.',
    date: '07 September 2026',
    status: 'Diproses',
    response: 'Terima kasih Ibu Ratna. Usulan penambahan 4 unit kursi prioritas dengan bantalan empuk telah diajukan ke bagian sarana prasarana dan dijadwalkan dipasang pekan ini.'
  }
];

export const MOCK_MITRA: HealthPostMitra[] = [
  {
    id: 'mitra-1',
    name: 'Puskesmas Pembantu (Pustu) Curungrejo',
    type: 'Pustu',
    village: 'Desa Curungrejo',
    address: 'Jl. Melati No. 12, Curungrejo, Kec. Kepanjen',
    pic: 'Bd. Endang S., A.Md.Keb',
    phone: '085233112233',
    operationalHours: 'Senin - Kamis: 08.00 - 12.00 WIB'
  },
  {
    id: 'mitra-2',
    name: 'Puskesmas Pembantu (Pustu) Mangunrejo',
    type: 'Pustu',
    village: 'Desa Mangunrejo',
    address: 'Jl. Raya Mangunrejo RT 03 RW 02, Kepanjen',
    pic: 'Perawat Yulianto, A.Md.Kep',
    phone: '081334556677',
    operationalHours: 'Senin - Kamis: 08.00 - 12.00 WIB'
  },
  {
    id: 'mitra-3',
    name: 'Puskesmas Pembantu (Pustu) Sukoraharjo',
    type: 'Pustu',
    village: 'Desa Sukoraharjo',
    address: 'Jl. Kencana No. 5, Sukoraharjo, Kepanjen',
    pic: 'Bd. Anita Kusuma, S.ST',
    phone: '087855667788',
    operationalHours: 'Senin - Kamis: 08.00 - 12.00 WIB'
  },
  {
    id: 'mitra-4',
    name: 'UPKDK Kelurahan Ardirejo',
    type: 'UPKDK',
    village: 'Kelurahan Ardirejo',
    address: 'Balai Kelurahan Ardirejo, Kepanjen',
    pic: 'Tim Kader Kesehatan Mandiri',
    phone: '08889924444',
    operationalHours: 'Sesuai Jadwal Posyandu & Skrining'
  },
  {
    id: 'mitra-5',
    name: 'Klinik Pratama Rawat Jalan Kasih Ibu (Jejaring)',
    type: 'Klinik',
    village: 'Kelurahan Kepanjen',
    address: 'Jl. Kawi No. 18, Kepanjen',
    pic: 'dr. Satria Wibowo',
    phone: '0341-395xxx',
    operationalHours: '07.00 - 20.00 WIB'
  },
  {
    id: 'mitra-6',
    name: 'Tempat Praktik Mandiri Dokter (TPMD) dr. Anwar',
    type: 'TPMD',
    village: 'Desa Sengguruh',
    address: 'Jl. Diponegoro No. 44, Sengguruh, Kepanjen',
    pic: 'dr. M. Anwar',
    phone: '081234889900',
    operationalHours: '16.00 - 20.00 WIB'
  }
];

export const MOCK_NEWS: NewsAnnouncement[] = [
  {
    id: 'news-1',
    title: 'Pelaksanaan Cek Kesehatan Gratis (CKG) Serentak di 14 Desa se-Kecamatan Kepanjen',
    category: 'Berita',
    date: '08 September 2026',
    excerpt: 'Puskesmas Kepanjen menggelar program CKG menyasar usia produktif dan lansia untuk deteksi dini risiko penyakit kardiovaskular.',
    content: 'Kepanjen — Dalam rangka percepatan program prioritas nasional dan peningkatan derajat kesehatan masyarakat, UPTD Puskesmas Kepanjen melaksanakan kegiatan Cek Kesehatan Gratis (CKG) serentak di 14 desa/kelurahan wilayah kerja. Skrining meliputi penimbangan antropometri, tensi darah, glukosa puasa, kolesterol, serta konsultasi gaya hidup sehat bersama dokter keluarga.',
    author: 'Tim Promkes Puskesmas Kepanjen',
    isImportant: true
  },
  {
    id: 'news-2',
    title: 'Jadwal Layanan Imunisasi Rutin & Vitamin A Bulan Penimbangan Balita 2026',
    category: 'Pengumuman',
    date: '05 September 2026',
    excerpt: 'Bunda dan Balita diimbau hadir tepat waktu di Posyandu terdekat untuk pemantauan tumbuh kembang serta vitamin A gratis.',
    content: 'Diberitahukan kepada seluruh warga masyarakat Kecamatan Kepanjen yang memiliki balita usia 6-59 bulan, pos pelayanan penimbangan balita dan pemberian vitamin A kapsul biru/merah serta imunisasi rutin antigen ganda tetap berjalan sesuai jadwal Posyandu desa masing-masing.',
    author: 'Koordinator KIA & Gizi',
    isImportant: true
  },
  {
    id: 'news-3',
    title: 'Edukasi 5 Langkah Cegah Demam Berdarah Dengue (DBD) Memasuki Musim Penghujan',
    category: 'Edukasi Kesehatan',
    date: '02 September 2026',
    excerpt: 'Lakukan Pemberantasan Sarang Nyamuk (PSN) 3M Plus secara rutin satu kali seminggu untuk melindungi keluarga dari gigitan nyamuk Aedes aegypti.',
    content: 'Pencegahan DBD yang paling efektif dan berkesinambungan adalah dengan gerakan 3M Plus: Menguras tempat penampungan air, Menutup rapat wadah air, serta Mendaur ulang barang bekas yang berpotensi menampung air hujan.',
    author: 'Sanitarian Puskesmas'
  }
];

export const VILLAGES_KEPANJEN = [
  'Kepanjen (Kelurahan) — 16 Posyandu',
  'Cepokomulyo (Kelurahan) — 7 Posyandu',
  'Penarukan (Kelurahan) — 5 Posyandu',
  'Ardirejo (Kelurahan) — 7 Posyandu',
  'Dilem — 5 Posyandu',
  'Talangagung — 7 Posyandu',
  'Ngadilangkung — 6 Posyandu',
  'Mojosari — 4 Posyandu',
  'Jatirejoyoso (Lokasi Induk) — 6 Posyandu',
  'Curungrejo — 5 Posyandu',
  'Sukoraharjo — 7 Posyandu',
  'Kedungpedaringan — 3 Posyandu',
  'Tegalsari — 3 Posyandu',
  'Panggungrejo — 8 Posyandu',
  'Mangunrejo — 6 Posyandu',
  'Kemiri — 3 Posyandu',
  'Jenggolo — 6 Posyandu',
  'Sengguruh — 4 Posyandu'
];

export const POSYANDU_VILLAGE_SUMMARY = [
  { village: 'Kepanjen (Kelurahan)', count: 16, posyandus: ['Posyandu Melati 1', 'Posyandu Melati 2', 'Posyandu Melati 3', 'Posyandu Melati 4', 'Posyandu Melati 5', 'Posyandu Melati 6', 'Posyandu Melati 7', 'Posyandu Melati 8', 'Posyandu Melati 9', 'Posyandu Melati 10', 'Posyandu Melati 11', 'Posyandu Melati 12', 'Posyandu Melati 13', 'Posyandu Melati 14', 'Posyandu Melati 15', 'Posyandu Melati 16 (ILP)'] },
  { village: 'Cepokomulyo (Kelurahan)', count: 7, posyandus: ['Posyandu Mawar 1', 'Posyandu Mawar 2', 'Posyandu Mawar 3', 'Posyandu Mawar 4', 'Posyandu Mawar 5', 'Posyandu Mawar 6', 'Posyandu Mawar 7 (ILP)'] },
  { village: 'Penarukan (Kelurahan)', count: 5, posyandus: ['Posyandu Anggrek 1', 'Posyandu Anggrek 2', 'Posyandu Anggrek 3', 'Posyandu Anggrek 4', 'Posyandu Anggrek 5 (ILP)'] },
  { village: 'Ardirejo (Kelurahan)', count: 7, posyandus: ['Posyandu Teratai 1', 'Posyandu Teratai 2', 'Posyandu Teratai 3', 'Posyandu Teratai 4', 'Posyandu Teratai 5', 'Posyandu Teratai 6', 'Posyandu Teratai 7 (ILP)'] },
  { village: 'Dilem', count: 5, posyandus: ['Posyandu Dahlia 1', 'Posyandu Dahlia 2', 'Posyandu Dahlia 3', 'Posyandu Dahlia 4', 'Posyandu Dahlia 5 (ILP)'] },
  { village: 'Talangagung', count: 7, posyandus: ['Posyandu Kenanga 1', 'Posyandu Kenanga 2', 'Posyandu Kenanga 3', 'Posyandu Kenanga 4', 'Posyandu Kenanga 5', 'Posyandu Kenanga 6', 'Posyandu Kenanga 7 (ILP)'] },
  { village: 'Ngadilangkung', count: 6, posyandus: ['Posyandu Flamboyan 1', 'Posyandu Flamboyan 2', 'Posyandu Flamboyan 3', 'Posyandu Flamboyan 4', 'Posyandu Flamboyan 5', 'Posyandu Flamboyan 6 (ILP)'] },
  { village: 'Mojosari', count: 4, posyandus: ['Posyandu Nusa Indah 1', 'Posyandu Nusa Indah 2', 'Posyandu Nusa Indah 3', 'Posyandu Nusa Indah 4 (ILP)'] },
  { village: 'Jatirejoyoso (Induk)', count: 6, posyandus: ['Posyandu Cempaka 1', 'Posyandu Cempaka 2', 'Posyandu Cempaka 3', 'Posyandu Cempaka 4', 'Posyandu Cempaka 5', 'Posyandu Cempaka 6 (ILP)'] },
  { village: 'Curungrejo', count: 5, posyandus: ['Posyandu Bougenville 1', 'Posyandu Bougenville 2', 'Posyandu Bougenville 3', 'Posyandu Bougenville 4', 'Posyandu Bougenville 5 (ILP)'] },
  { village: 'Sukoraharjo', count: 7, posyandus: ['Posyandu Kamboja 1', 'Posyandu Kamboja 2', 'Posyandu Kamboja 3', 'Posyandu Kamboja 4', 'Posyandu Kamboja 5', 'Posyandu Kamboja 6', 'Posyandu Kamboja 7 (ILP)'] },
  { village: 'Kedungpedaringan', count: 3, posyandus: ['Posyandu Sedap Malam 1', 'Posyandu Sedap Malam 2', 'Posyandu Sedap Malam 3 (ILP)'] },
  { village: 'Tegalsari', count: 3, posyandus: ['Posyandu Sakura 1', 'Posyandu Sakura 2', 'Posyandu Sakura 3 (ILP)'] },
  { village: 'Panggungrejo', count: 8, posyandus: ['Posyandu Tulip 1', 'Posyandu Tulip 2', 'Posyandu Tulip 3', 'Posyandu Tulip 4', 'Posyandu Tulip 5', 'Posyandu Tulip 6', 'Posyandu Tulip 7', 'Posyandu Tulip 8 (ILP)'] },
  { village: 'Mangunrejo', count: 6, posyandus: ['Posyandu Asoka 1', 'Posyandu Asoka 2', 'Posyandu Asoka 3', 'Posyandu Asoka 4', 'Posyandu Asoka 5', 'Posyandu Asoka 6 (ILP)'] },
  { village: 'Kemiri', count: 3, posyandus: ['Posyandu Seroja 1', 'Posyandu Seroja 2', 'Posyandu Seroja 3 (ILP)'] },
  { village: 'Jenggolo', count: 6, posyandus: ['Posyandu Lily 1', 'Posyandu Lily 2', 'Posyandu Lily 3', 'Posyandu Lily 4', 'Posyandu Lily 5', 'Posyandu Lily 6 (ILP)'] },
  { village: 'Sengguruh', count: 4, posyandus: ['Posyandu Jasmine 1', 'Posyandu Jasmine 2', 'Posyandu Jasmine 3', 'Posyandu Jasmine 4 (ILP)'] }
];

export const DEFAULT_SITE_SETTINGS: import('../types').SiteSettings = {
  name: 'UPTD Puskesmas Kepanjen',
  tagline: 'SIPANDU PEDULI — One Link, One Click Access',
  subtitle: 'Sistem Pantau Data Dukung Pelaksanaan, Dokumentasi, dan Evaluasi untuk Layanan Integratif',
  code: 'P3507080201',
  regency: 'Kabupaten Malang',
  address: 'Jl. Raya Jatirejoyoso No. 4, Kec. Kepanjen, Kab. Malang, Jawa Timur 65163',
  phone: '08889924444',
  whatsapp: '08889924444',
  whatsappUrl: 'https://wa.me/628889924444',
  email: 'puskesmaskepanjen@malangkab.go.id',
  instagram: '@pkm.kepanjen',
  instagramUrl: 'https://instagram.com/pkm.kepanjen',
  operationalHours: 'Senin – Kamis: 07.30 – 14.00 WIB | Jumat: 07.30 – 11.00 WIB | Sabtu: 07.30 – 12.30 WIB (UGD & Bersalin 24 Jam)',
  vision: 'Terwujudnya Masyarakat Kecamatan Kepanjen yang Sehat, Mandiri, dan Berdaya Saing Menuju Kabupaten Malang Makmur',
  mission: [
    'Meningkatkan mutu pelayanan kesehatan yang merata, terjangkau, dan paripurna berbasis integrasi layanan primer (ILP).',
    'Mendorong kemandirian masyarakat untuk hidup sehat melalui pemberdayaan dan promosi kesehatan aktif.',
    'Memperkuat pencegahan, pengendalian penyakit menular dan penyakit tidak menular serta penyehatan lingkungan.',
    'Mengembangkan tata kelola Puskesmas yang transparan, akuntabel, dan berbasis teknologi digital (Good Governance).'
  ],
  motto: 'Kepanjen PEDULI (Profesional, Empati, Disiplin, Unggul, Loyal, Inovatif)',
  maklumat: 'Dengan ini kami menyatakan sanggup menyelenggarakan pelayanan sesuai standar pelayanan yang telah ditetapkan dan apabila tidak menepati janji ini, kami siap menerima sanksi sesuai peraturan perundang-undangan yang berlaku.',
  logoUrl: '',
  headerBadgeText: 'Portal Ekosistem Informasi Kesehatan Puskesmas Kepanjen',
  heroTitle: 'Satu Akses Terpadu Layanan Kesehatan Kepanjen',
  heroSubtitle: 'SIPANDU PEDULI (Sistem Pantau Data Dukung Pelaksanaan, Dokumentasi, dan Evaluasi) sebagai Portal & Integration Hub yang menghubungkan masyarakat, Puskesmas, Pustu, 108 Posyandu, dan sistem sumber (RME & PCare BPJS) dengan prinsip One Link, One Click Access.'
};

export const DEFAULT_MARQUEE_SETTINGS: import('../types').MarqueeSettings = {
  enabled: true,
  text: 'Selamat Datang di Portal SIPANDU PEDULI UPTD Puskesmas Kepanjen • Pelayanan Poli Rawat Jalan Buka Pukul 07.30 WIB • Layanan UGD & Persalinan Siaga 24 Jam Non-Stop • Antrean Online Tersedia di Aplikasi Mobile JKN BPJS • Cek Kesehatan Gratis (CKG) Hadir di Seluruh Posyandu Desa',
  secondaryText: 'Puskesmas Kepanjen Terakreditasi Paripurna Kemenkes RI',
  speed: 'medium',
  variant: 'emerald',
  hotline: '08889924444',
  badge: 'PENGUMUMAN RESMI'
};

export const MOCK_DRIVE_GALLERY: import('../types').DriveFileItem[] = [
  {
    id: 'drive-logo-1',
    name: 'Logo-Resmi-Puskesmas-Kepanjen-2026.png',
    driveUrl: 'https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9-LogoPuskesmas/view',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
    mimeType: 'image/png',
    size: '142 KB',
    category: 'logo',
    uploadedAt: '10 September 2026, 08:30 WIB',
    isCurrentLogo: false
  },
  {
    id: 'drive-banner-1',
    name: 'Banner-Gedung-Puskesmas-Kepanjen.jpg',
    driveUrl: 'https://drive.google.com/file/d/1B2C3D4E5F6G7H8I9-BannerGedung/view',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80',
    mimeType: 'image/jpeg',
    size: '840 KB',
    category: 'banner',
    uploadedAt: '08 September 2026, 14:15 WIB'
  },
  {
    id: 'drive-img-ckg',
    name: 'Dokumentasi-CKG-Desa-Jatirejoyoso.jpg',
    driveUrl: 'https://drive.google.com/file/d/1C2D3E4F5G6H7I8J9-DokumenCKG/view',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
    mimeType: 'image/jpeg',
    size: '620 KB',
    category: 'dokumentasi',
    uploadedAt: '05 September 2026, 10:00 WIB'
  },
  {
    id: 'drive-img-ugd',
    name: 'Kesiapsiagaan-UGD-24-Jam.jpg',
    driveUrl: 'https://drive.google.com/file/d/1D2E3F4G5H6I7J8K9-UGD24Jam/view',
    thumbnailUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&auto=format&fit=crop&q=80',
    mimeType: 'image/jpeg',
    size: '710 KB',
    category: 'dokumentasi',
    uploadedAt: '01 September 2026, 21:00 WIB'
  },
  {
    id: 'drive-img-posyandu',
    name: 'Pemeriksaan-Balita-Posyandu-Sukoraharjo.jpg',
    driveUrl: 'https://drive.google.com/file/d/1E2F3G4H5I6J7K8L9-Posyandu/view',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600&auto=format&fit=crop&q=80',
    mimeType: 'image/jpeg',
    size: '530 KB',
    category: 'dokumentasi',
    uploadedAt: '28 Agustus 2026, 09:40 WIB'
  },
  {
    id: 'drive-cert-akreditasi',
    name: 'Sertifikat-Akreditasi-Paripurna-Kemenkes.png',
    driveUrl: 'https://drive.google.com/file/d/1F2G3H4I5J6K7L8M9-Akreditasi/view',
    thumbnailUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    mimeType: 'image/png',
    size: '380 KB',
    category: 'berkas',
    uploadedAt: '15 Agustus 2026, 11:20 WIB'
  }
];

export const DEFAULT_DOCK_CONFIG: import('../types').MobileDockConfig = {
  enabled: true,
  blurEffect: true,
  showLabels: true,
  items: [
    {
      id: 'dock-menu',
      label: 'Menu',
      icon: 'menu',
      actionType: 'sidebar',
      target: 'sidebar',
      isEnabled: true,
      isHighlight: false
    },
    {
      id: 'dock-berita',
      label: 'Berita',
      icon: 'document',
      actionType: 'tab',
      target: 'informasi',
      isEnabled: true
    },
    {
      id: 'dock-beranda',
      label: 'Beranda',
      icon: 'home',
      actionType: 'tab',
      target: 'beranda',
      isEnabled: true,
      isHighlight: false
    },
    {
      id: 'dock-layanan',
      label: 'Layanan',
      icon: 'services',
      actionType: 'tab',
      target: 'layanan',
      isEnabled: true
    },
    {
      id: 'dock-pegawai',
      label: 'Portal Pegawai',
      icon: 'building',
      actionType: 'portal_pegawai',
      target: 'pegawai',
      isEnabled: true
    }
  ]
};
