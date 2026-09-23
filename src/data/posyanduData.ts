import { PosyanduItem, VillageData, PosyanduReportStatus } from '../types';

export const VILLAGES_18_DATA: VillageData[] = [
  {
    id: 'kepanjen',
    name: 'KEPANJEN',
    type: 'Kelurahan',
    linktreeUrl: 'https://linktr.ee/DataInformasiKepanjen',
    posyanduCount: 16
  },
  {
    id: 'cepokomulyo',
    name: 'CEPOKOMULYO',
    type: 'Kelurahan',
    linktreeUrl: 'https://linktr.ee/DataInformasiCepokomulyo',
    posyanduCount: 7
  },
  {
    id: 'penarukan',
    name: 'PENARUKAN',
    type: 'Kelurahan',
    linktreeUrl: 'https://linktr.ee/DataInformasiPenarukan',
    posyanduCount: 5
  },
  {
    id: 'ardirejo',
    name: 'ARDIREJO',
    type: 'Kelurahan',
    linktreeUrl: 'https://linktr.ee/DataInformasiArdirejo',
    posyanduCount: 7
  },
  {
    id: 'dilem',
    name: 'DILEM',
    type: 'Desa',
    linktreeUrl: 'https://linktr.ee/DataInformasiDilem',
    posyanduCount: 5
  },
  {
    id: 'talangagung',
    name: 'TALANGAGUNG',
    type: 'Desa',
    linktreeUrl: 'https://linktr.ee/DataInformasiTalangagung',
    posyanduCount: 7
  },
  {
    id: 'ngadilangkung',
    name: 'NGADILANGKUNG',
    type: 'Desa',
    linktreeUrl: 'https://linktr.ee/DataInformasiNgadilangkung',
    posyanduCount: 6
  },
  {
    id: 'mojosari',
    name: 'MOJOSARI',
    type: 'Desa',
    linktreeUrl: 'https://linktr.ee/datainformasimojosari',
    posyanduCount: 4
  },
  {
    id: 'jatirejoyoso',
    name: 'JATIREJOYOSO',
    type: 'Desa',
    linktreeUrl: 'https://linktr.ee/DataInformasiJatirejoyoso',
    posyanduCount: 6
  },
  {
    id: 'curungrejo',
    name: 'CURUNGREJO',
    type: 'Desa',
    linktreeUrl: 'https://linktr.ee/DataInformasiCurungrejo1',
    posyanduCount: 5
  },
  {
    id: 'sukoraharjo',
    name: 'SUKORAHARJO',
    type: 'Desa',
    linktreeUrl: 'https://linktr.ee/DataInformasiSukoraharjo',
    posyanduCount: 7
  },
  {
    id: 'kedungpedaringan',
    name: 'KEDUNGPEDARINGAN',
    type: 'Desa',
    linktreeUrl: 'https://linktr.ee/DataInformasiKedungpedaringan',
    posyanduCount: 3
  },
  {
    id: 'tegalsari',
    name: 'TEGALSARI',
    type: 'Desa',
    linktreeUrl: 'https://linktr.ee/DataInformasiTegalsari',
    posyanduCount: 3
  },
  {
    id: 'panggungrejo',
    name: 'PANGGUNGREJO',
    type: 'Desa',
    linktreeUrl: 'https://linktr.ee/DataInformasiPanggungrejo',
    posyanduCount: 8
  },
  {
    id: 'mangunrejo',
    name: 'MANGUNREJO',
    type: 'Desa',
    linktreeUrl: 'https://linktr.ee/DataInformasiMangunrejo',
    posyanduCount: 6
  },
  {
    id: 'kemiri',
    name: 'KEMIRI',
    type: 'Desa',
    linktreeUrl: 'https://linktr.ee/datainformasikemiri',
    posyanduCount: 3
  },
  {
    id: 'jenggolo',
    name: 'JENGGOLO',
    type: 'Desa',
    linktreeUrl: 'https://linktr.ee/DataInformasiJenggolo',
    posyanduCount: 6
  },
  {
    id: 'sengguruh',
    name: 'SENGGURUH',
    type: 'Desa',
    linktreeUrl: 'https://linktr.ee/DataInformasiSengguruh',
    posyanduCount: 4
  }
];

export const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const MONTH_SHORT_NAMES = [
  'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN',
  'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'
];

// Raw definition of 108 Posyandu exactly per PRD Section 8
const RAW_108_POSYANDU: { number: number; name: string; village: string }[] = [
  // KEPANJEN – 16 POSYANDU
  { number: 1, name: 'ANGGREK 1 KEPANJEN', village: 'KEPANJEN' },
  { number: 2, name: 'ANGGREK 2 KEPANJEN', village: 'KEPANJEN' },
  { number: 3, name: 'ANGGREK 3 KEPANJEN', village: 'KEPANJEN' },
  { number: 4, name: 'ANGGREK 4 KEPANJEN', village: 'KEPANJEN' },
  { number: 5, name: 'MELATI 1 KEPANJEN', village: 'KEPANJEN' },
  { number: 6, name: 'MELATI 2 KEPANJEN', village: 'KEPANJEN' },
  { number: 7, name: 'MELATI 3 KEPANJEN', village: 'KEPANJEN' },
  { number: 8, name: 'MELATI 4 KEPANJEN', village: 'KEPANJEN' },
  { number: 9, name: 'MAWAR 1 KEPANJEN', village: 'KEPANJEN' },
  { number: 10, name: 'MAWAR 2 KEPANJEN', village: 'KEPANJEN' },
  { number: 11, name: 'NUSA INDAH 1 KEPANJEN', village: 'KEPANJEN' },
  { number: 12, name: 'NUSA INDAH 2 KEPANJEN', village: 'KEPANJEN' },
  { number: 13, name: 'NUSA INDAH 3 KEPANJEN', village: 'KEPANJEN' },
  { number: 14, name: 'KENANGA 1 KEPANJEN', village: 'KEPANJEN' },
  { number: 15, name: 'KENANGA 2 KEPANJEN', village: 'KEPANJEN' },
  { number: 16, name: 'KENANGA 3 KEPANJEN', village: 'KEPANJEN' },

  // CEPOKOMULYO – 7 POSYANDU
  { number: 17, name: 'POS 1 CEPOKOMULYO', village: 'CEPOKOMULYO' },
  { number: 18, name: 'POS 2 CEPOKOMULYO', village: 'CEPOKOMULYO' },
  { number: 19, name: 'POS 3 CEPOKOMULYO', village: 'CEPOKOMULYO' },
  { number: 20, name: 'POS 4 CEPOKOMULYO', village: 'CEPOKOMULYO' },
  { number: 21, name: 'POS 5 CEPOKOMULYO', village: 'CEPOKOMULYO' },
  { number: 22, name: 'POS 6 CEPOKOMULYO', village: 'CEPOKOMULYO' },
  { number: 23, name: 'POS 7 CEPOKOMULYO', village: 'CEPOKOMULYO' },

  // PENARUKAN – 5 POSYANDU
  { number: 24, name: 'MELATI 1 PENARUKAN', village: 'PENARUKAN' },
  { number: 25, name: 'MELATI 2 PENARUKAN', village: 'PENARUKAN' },
  { number: 26, name: 'MELATI 3 PENARUKAN', village: 'PENARUKAN' },
  { number: 27, name: 'MELATI 4 PENARUKAN', village: 'PENARUKAN' },
  { number: 28, name: 'MELATI 5 PENARUKAN', village: 'PENARUKAN' },

  // ARDIREJO – 7 POSYANDU
  { number: 29, name: 'MELATI ARDIREJO', village: 'ARDIREJO' },
  { number: 30, name: 'MAWAR ARDIREJO', village: 'ARDIREJO' },
  { number: 31, name: 'ANGGREK ARDIREJO', village: 'ARDIREJO' },
  { number: 32, name: 'DAHLIA ARDIREJO', village: 'ARDIREJO' },
  { number: 33, name: 'FLAMBOYAN ARDIREJO', village: 'ARDIREJO' },
  { number: 34, name: 'TERATAI A ARDIREJO', village: 'ARDIREJO' },
  { number: 35, name: 'TERATAI B ARDIREJO', village: 'ARDIREJO' },

  // DILEM – 5 POSYANDU
  { number: 36, name: 'ANGGREK 1 DILEM', village: 'DILEM' },
  { number: 37, name: 'ANGGREK 2 DILEM', village: 'DILEM' },
  { number: 38, name: 'ANGGREK 3 DILEM', village: 'DILEM' },
  { number: 39, name: 'ANGGREK 4 DILEM', village: 'DILEM' },
  { number: 40, name: 'ANGGREK 5 DILEM', village: 'DILEM' },

  // TALANGAGUNG – 7 POSYANDU
  { number: 41, name: 'POS KARTINI 1 TALANGAGUNG', village: 'TALANGAGUNG' },
  { number: 42, name: 'POS KARTINI 2 TALANGAGUNG', village: 'TALANGAGUNG' },
  { number: 43, name: 'POS KARTINI 3 TALANGAGUNG', village: 'TALANGAGUNG' },
  { number: 44, name: 'POS KARTINI 4 TALANGAGUNG', village: 'TALANGAGUNG' },
  { number: 45, name: 'POS KARTINI 5 TALANGAGUNG', village: 'TALANGAGUNG' },
  { number: 46, name: 'POS KARTINI 6 TALANGAGUNG', village: 'TALANGAGUNG' },
  { number: 47, name: 'POS KARTINI 7 TALANGAGUNG', village: 'TALANGAGUNG' },

  // NGADILANGKUNG – 6 POSYANDU
  { number: 48, name: 'DAHLIA 1 NGADILANGKUNG', village: 'NGADILANGKUNG' },
  { number: 49, name: 'DAHLIA 2 NGADILANGKUNG', village: 'NGADILANGKUNG' },
  { number: 50, name: 'DAHLIA 3 NGADILANGKUNG', village: 'NGADILANGKUNG' },
  { number: 51, name: 'DAHLIA 4 NGADILANGKUNG', village: 'NGADILANGKUNG' },
  { number: 52, name: 'DAHLIA 5 NGADILANGKUNG', village: 'NGADILANGKUNG' },
  { number: 53, name: 'DAHLIA 6 NGADILANGKUNG', village: 'NGADILANGKUNG' },

  // MOJOSARI – 4 POSYANDU
  { number: 54, name: 'MELATI PUTIH 1 MOJOSARI', village: 'MOJOSARI' },
  { number: 55, name: 'MELATI PUTIH 2 MOJOSARI', village: 'MOJOSARI' },
  { number: 56, name: 'MELATI PUTIH 3 MOJOSARI', village: 'MOJOSARI' },
  { number: 57, name: 'MELATI PUTIH 4 MOJOSARI', village: 'MOJOSARI' },

  // JATIREJOYOSO – 6 POSYANDU
  { number: 58, name: 'KLENGKENG 1 JATIREJOYOSO', village: 'JATIREJOYOSO' },
  { number: 59, name: 'KLENGKENG 2 JATIREJOYOSO', village: 'JATIREJOYOSO' },
  { number: 60, name: 'KLENGKENG 3 JATIREJOYOSO', village: 'JATIREJOYOSO' },
  { number: 61, name: 'KLENGKENG 4 JATIREJOYOSO', village: 'JATIREJOYOSO' },
  { number: 62, name: 'KLENGKENG 5 JATIREJOYOSO', village: 'JATIREJOYOSO' },
  { number: 63, name: 'KLENGKENG 6 JATIREJOYOSO', village: 'JATIREJOYOSO' },

  // CURUNGREJO – 5 POSYANDU
  { number: 64, name: 'FLAMBOYAN 1 CURUNGREJO', village: 'CURUNGREJO' },
  { number: 65, name: 'FLAMBOYAN 2 CURUNGREJO', village: 'CURUNGREJO' },
  { number: 66, name: 'FLAMBOYAN 3 CURUNGREJO', village: 'CURUNGREJO' },
  { number: 67, name: 'FLAMBOYAN 4 CURUNGREJO', village: 'CURUNGREJO' },
  { number: 68, name: 'FLAMBOYAN 5 CURUNGREJO', village: 'CURUNGREJO' },

  // SUKORAHARJO – 7 POSYANDU
  { number: 69, name: 'MELATI SUKORAHARJO', village: 'SUKORAHARJO' },
  { number: 70, name: 'SERUNI SUKORAHARJO', village: 'SUKORAHARJO' },
  { number: 71, name: 'DAHLIA SUKORAHARJO', village: 'SUKORAHARJO' },
  { number: 72, name: 'ANGGREK SUKORAHARJO', village: 'SUKORAHARJO' },
  { number: 73, name: 'FLAMBOYAN SUKORAHARJO', village: 'SUKORAHARJO' },
  { number: 74, name: 'TULIP SUKORAHARJO', village: 'SUKORAHARJO' },
  { number: 75, name: 'KAMBOJA SUKORAHARJO', village: 'SUKORAHARJO' },

  // KEDUNGPEDARINGAN – 3 POSYANDU
  { number: 76, name: 'MAWAR 1 KEDUNGPEDARINGAN', village: 'KEDUNGPEDARINGAN' },
  { number: 77, name: 'MAWAR 2 KEDUNGPEDARINGAN', village: 'KEDUNGPEDARINGAN' },
  { number: 78, name: 'MAWAR 3 KEDUNGPEDARINGAN', village: 'KEDUNGPEDARINGAN' },

  // TEGALSARI – 3 POSYANDU
  { number: 79, name: 'POSYANDU A TEGALSARI', village: 'TEGALSARI' },
  { number: 80, name: 'POSYANDU B TEGALSARI', village: 'TEGALSARI' },
  { number: 81, name: 'POSYANDU C TEGALSARI', village: 'TEGALSARI' },

  // PANGGUNGREJO – 8 POSYANDU
  { number: 82, name: 'KEMUNING 1 PANGGUNGREJO', village: 'PANGGUNGREJO' },
  { number: 83, name: 'KEMUNING 2 PANGGUNGREJO', village: 'PANGGUNGREJO' },
  { number: 84, name: 'KEMUNING 3 PANGGUNGREJO', village: 'PANGGUNGREJO' },
  { number: 85, name: 'KEMUNING 4 PANGGUNGREJO', village: 'PANGGUNGREJO' },
  { number: 86, name: 'KEMUNING 5 PANGGUNGREJO', village: 'PANGGUNGREJO' },
  { number: 87, name: 'KEMUNING 6 PANGGUNGREJO', village: 'PANGGUNGREJO' },
  { number: 88, name: 'KEMUNING 7 PANGGUNGREJO', village: 'PANGGUNGREJO' },
  { number: 89, name: 'KEMUNING 8 PANGGUNGREJO', village: 'PANGGUNGREJO' },

  // MANGUNREJO – 6 POSYANDU
  { number: 90, name: 'POS 1 MANGUNREJO', village: 'MANGUNREJO' },
  { number: 91, name: 'POS 2 MANGUNREJO', village: 'MANGUNREJO' },
  { number: 92, name: 'POS 3 MANGUNREJO', village: 'MANGUNREJO' },
  { number: 93, name: 'POS 4 MANGUNREJO', village: 'MANGUNREJO' },
  { number: 94, name: 'POS 5 MANGUNREJO', village: 'MANGUNREJO' },
  { number: 95, name: 'POS 6 MANGUNREJO', village: 'MANGUNREJO' },

  // KEMIRI – 3 POSYANDU
  { number: 96, name: 'MAWAR 1 KEMIRI', village: 'KEMIRI' },
  { number: 97, name: 'MAWAR 2 KEMIRI', village: 'KEMIRI' },
  { number: 98, name: 'MAWAR 3 KEMIRI', village: 'KEMIRI' },

  // JENGGOLO – 6 POSYANDU
  { number: 99, name: 'NUSA INDAH 1 JENGGOLO', village: 'JENGGOLO' },
  { number: 100, name: 'NUSA INDAH 2 JENGGOLO', village: 'JENGGOLO' },
  { number: 101, name: 'NUSA INDAH 3 JENGGOLO', village: 'JENGGOLO' },
  { number: 102, name: 'NUSA INDAH 4 JENGGOLO', village: 'JENGGOLO' },
  { number: 103, name: 'NUSA INDAH 5 JENGGOLO', village: 'JENGGOLO' },
  { number: 104, name: 'NUSA INDAH 6 JENGGOLO', village: 'JENGGOLO' },

  // SENGGURUH – 4 POSYANDU
  { number: 105, name: 'DAHLIA 1 SENGGURUH', village: 'SENGGURUH' },
  { number: 106, name: 'DAHLIA 2 SENGGURUH', village: 'SENGGURUH' },
  { number: 107, name: 'DAHLIA 3 SENGGURUH', village: 'SENGGURUH' },
  { number: 108, name: 'DAHLIA 4 SENGGURUH', village: 'SENGGURUH' }
];

export const DEFAULT_MASTER_GOOGLE_FORM_URL = 'https://docs.google.com/forms/';

export function generateDefault108Posyandu(): PosyanduItem[] {
  const villageLinkMap: Record<string, string> = {};
  VILLAGES_18_DATA.forEach(v => {
    villageLinkMap[v.name] = v.linktreeUrl;
  });

  return RAW_108_POSYANDU.map((raw) => {
    const padNum = String(raw.number).padStart(3, '0');
    const id = `KPN-${padNum}`;
    const villageUrl = villageLinkMap[raw.village] || 'https://linktr.ee/puskesmaskepanjen';

    // Simulate realistic baseline reporting status based on PRD Section 17 & 40
    // Total 108: 85 Terverifikasi, 9 Sudah Lapor, 4 Belum Lengkap, 5 Perlu Perbaikan, 5 Belum Lapor
    let reportStatus: PosyanduReportStatus = 'TERVERIFIKASI';
    let checklist = {
      kunjunganInputted: true,
      pelayananCompleted: true,
      kunjunganRumahInputted: true,
      administrasiCompleted: true
    };
    let notes = 'Laporan lengkap, data kunjungan balita & lansia terverifikasi.';

    if (raw.number === 21 || raw.number === 44 || raw.number === 73 || raw.number === 93) {
      reportStatus = 'BELUM LENGKAP';
      checklist = {
        kunjunganInputted: true,
        pelayananCompleted: false,
        kunjunganRumahInputted: false,
        administrasiCompleted: true
      };
      notes = 'Data skrining lansia belum lengkap di kartu bantu.';
    } else if (raw.number === 10 || raw.number === 35 || raw.number === 62 || raw.number === 85 || raw.number === 106) {
      reportStatus = 'PERLU PERBAIKAN';
      checklist = {
        kunjunganInputted: true,
        pelayananCompleted: true,
        kunjunganRumahInputted: false,
        administrasiCompleted: false
      };
      notes = 'Hasil kunjungan rumah belum ditandatangani kader koordinator desa.';
    } else if (raw.number % 12 === 0) {
      reportStatus = 'SUDAH LAPOR';
      checklist = {
        kunjunganInputted: true,
        pelayananCompleted: true,
        kunjunganRumahInputted: true,
        administrasiCompleted: true
      };
      notes = 'Menunggu verifikasi kader koordinator desa.';
    } else if (raw.number === 77 || raw.number === 81 || raw.number === 98 || raw.number === 104 || raw.number === 108) {
      reportStatus = 'BELUM LAPOR';
      checklist = {
        kunjunganInputted: false,
        pelayananCompleted: false,
        kunjunganRumahInputted: false,
        administrasiCompleted: false
      };
      notes = 'Belum mengirimkan rekapitulasi bulanan.';
    }

    // Monthly status Jan - Des (Month 1 - 12)
    const monthlyStatus: Record<number, any> = {};
    for (let m = 1; m <= 12; m++) {
      if (m <= 8) {
        // Jan - Agu: past months mostly complete/verified
        monthlyStatus[m] = {
          status: (raw.number % 25 === 0 && m === 8) ? 'BELUM LENGKAP' : 'TERVERIFIKASI',
          kunjunganCount: 45 + ((raw.number * 3 + m) % 35),
          pelayananCount: 42 + ((raw.number * 2 + m) % 32),
          kunjunganRumahCount: 4 + ((raw.number + m) % 6),
          sasaranCount: 60 + (raw.number % 15),
          updatedAt: `2026-0${m}-25`
        };
      } else if (m === 9) {
        // September: current month matching reportStatus
        monthlyStatus[m] = {
          status: reportStatus,
          kunjunganCount: reportStatus === 'BELUM LAPOR' ? 0 : 48 + (raw.number % 20),
          pelayananCount: reportStatus === 'BELUM LAPOR' ? 0 : 44 + (raw.number % 18),
          kunjunganRumahCount: reportStatus === 'BELUM LAPOR' ? 0 : 5,
          sasaranCount: 65,
          updatedAt: '2026-09-15'
        };
      } else {
        // Okt - Des: upcoming months
        monthlyStatus[m] = {
          status: 'BELUM LAPOR',
          kunjunganCount: 0,
          pelayananCount: 0,
          kunjunganRumahCount: 0,
          sasaranCount: 65,
          updatedAt: '-'
        };
      }
    }

    return {
      id,
      number: raw.number,
      name: raw.name,
      village: raw.village,
      address: `Wilayah RW ${String((raw.number % 8) + 1).padStart(2, '0')}, ${raw.village.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}, Kec. Kepanjen`,
      status: 'Aktif',
      systemUrl: `https://posyandu.kepanjen.id/portal/${id.toLowerCase()}`,
      reportFormUrl: DEFAULT_MASTER_GOOGLE_FORM_URL,
      docUrl: `https://drive.google.com/drive/folders/posyandu-data-${id.toLowerCase()}`,
      villageInfoUrl: villageUrl,
      reportStatus,
      lastUpdated: '15 September 2026',
      checklist,
      notes,
      verifiedBy: reportStatus === 'TERVERIFIKASI' ? `Kader Koordinator ${raw.village}` : undefined,
      verifiedAt: reportStatus === 'TERVERIFIKASI' ? '16 September 2026, 10:30 WIB' : undefined,
      monthlyStatus
    };
  });
}

export function sanitizePosyanduList(list: PosyanduItem[]): PosyanduItem[] {
  if (!Array.isArray(list)) return [];
  return list.map((item) => {
    const isBrokenFormUrl = !item.reportFormUrl || item.reportFormUrl.includes('sipandu-pelaporan-') || item.reportFormUrl === '#';
    return {
      ...item,
      reportFormUrl: isBrokenFormUrl ? DEFAULT_MASTER_GOOGLE_FORM_URL : item.reportFormUrl
    };
  });
}
