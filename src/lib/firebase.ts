import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  collection, 
  getDocFromServer,
  writeBatch,
  deleteDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { 
  SiteSettings, 
  MarqueeSettings, 
  MobileDockConfig, 
  HealthPostMitra, 
  ServiceItem, 
  DigitalSystemItem, 
  NewsAnnouncement, 
  DriveFileItem,
  PosyanduItem
} from '../types';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Target designated Firestore database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Local quota & operation trackers for Admin Tab Metrics
export interface FirestoreMetricStats {
  totalWrites: number;
  totalReads: number;
  lastLatencyMs: number;
  isConnected: boolean;
  lastSyncTime: string | null;
  dailyWriteLimit: number; // e.g. 20,000 for Spark tier
  dailyReadLimit: number;  // e.g. 50,000 for Spark tier
  documentCounts: {
    config: number;
    services: number;
    news: number;
    mitra: number;
    posyandu: number;
    systems: number;
    gallery: number;
  };
}

const STORAGE_OPS_KEY = 'sipandu_firestore_ops';

function getStoredOps(): { writes: number; reads: number } {
  try {
    const saved = localStorage.getItem(STORAGE_OPS_KEY);
    return saved ? JSON.parse(saved) : { writes: 0, reads: 0 };
  } catch {
    return { writes: 0, reads: 0 };
  }
}

function recordOp(type: 'write' | 'read', count = 1) {
  try {
    const current = getStoredOps();
    if (type === 'write') current.writes += count;
    else current.reads += count;
    localStorage.setItem(STORAGE_OPS_KEY, JSON.stringify(current));
  } catch {
    // Ignore storage issues
  }
}

/**
 * Text-Only sanitizer: Ensures image links stored in Firestore are strictly text strings
 * (Google Drive preview URLs, file IDs, or web links) rather than raw binary or huge base64 data.
 */
export function sanitizeToDriveTextUrl(val?: string | null): string {
  if (!val) return '';
  const trimmed = val.trim();
  if (trimmed.startsWith('data:image')) {
    console.warn('Gambar base64 terdeteksi dan dibersihkan dari penyimpanan Firebase untuk meminimalkan kuota.');
    return ''; // Block base64 strings from being written to Firestore to prevent security rule payload errors
  }
  // If user pasted a Google Drive share link, convert it to a reliable direct embed text URL
  if (trimmed.includes('drive.google.com/file/d/')) {
    const idMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`;
    }
  }
  return trimmed;
}

/**
 * Sanitizes WYSIWYG HTML content to remove any embedded base64 images
 * to prevent bloated payloads and Firestore write failures.
 */
export function sanitizeRichTextContent(htmlContent: string): string {
  if (!htmlContent) return '';
  
  // Replace base64 img src with a warning style placeholder to prevent rule/quota failures
  const sanitized = htmlContent.replace(
    /src="data:image\/[^;]+;base64,[^"]+"/g,
    'src="" data-base64-removed="true" style="border: 2px dashed #ef4444; padding: 12px; margin: 8px 0; display: block; border-radius: 8px; font-weight: bold; font-size: 11px; text-align: center; color: #ef4444; background: #fef2f2; content: \'[Gambar telah dihapus otomatis untuk menghemat kuota Firebase free tier. Silakan gunakan tombol unggah gambar ke Google Drive.]\'"'
  );
  
  return sanitized;
}

/**
 * Test live connectivity to Firestore and measure roundtrip latency
 */
export async function testFirestoreConnection(): Promise<{ success: boolean; latencyMs: number; message: string }> {
  const start = performance.now();
  try {
    const testRef = doc(db, 'test', 'ping');
    // Write a tiny ping document
    await setDoc(testRef, {
      ping: 'ok',
      clientTime: new Date().toISOString(),
      timestamp: Date.now()
    }, { merge: true });
    
    // Read directly from server (bypassing local cache) as mandated by Firebase skill
    await getDocFromServer(testRef);
    const latencyMs = Math.round(performance.now() - start);
    recordOp('write', 1);
    recordOp('read', 1);
    return {
      success: true,
      latencyMs,
      message: `Koneksi Firestore Berhasil! Respons server: ${latencyMs} ms`
    };
  } catch (error: any) {
    const latencyMs = Math.round(performance.now() - start);
    return {
      success: false,
      latencyMs,
      message: error?.message || 'Gagal terhubung ke Firestore'
    };
  }
}

/**
 * Save Site Settings to Firestore (config/siteSettings)
 */
export async function saveSiteSettingsToFirestore(settings: SiteSettings): Promise<void> {
  const ref = doc(db, 'config', 'siteSettings');
  const sanitized: SiteSettings = {
    ...settings,
    logoUrl: sanitizeToDriveTextUrl(settings.logoUrl)
  };
  await setDoc(ref, sanitized, { merge: true });
  recordOp('write', 1);
}

/**
 * Save Marquee Settings to Firestore (config/marqueeSettings)
 */
export async function saveMarqueeSettingsToFirestore(settings: MarqueeSettings): Promise<void> {
  const ref = doc(db, 'config', 'marqueeSettings');
  await setDoc(ref, settings, { merge: true });
  recordOp('write', 1);
}

/**
 * Save Mobile Dock Config to Firestore (config/dockConfig)
 */
export async function saveDockConfigToFirestore(config: MobileDockConfig): Promise<void> {
  const ref = doc(db, 'config', 'dockConfig');
  await setDoc(ref, config, { merge: true });
  recordOp('write', 1);
}

/**
 * Save Mitra List to Firestore
 */
export async function saveMitraToFirestore(mitraList: HealthPostMitra[]): Promise<void> {
  const batch = writeBatch(db);
  mitraList.forEach((m) => {
    const ref = doc(db, 'mitra', m.id);
    batch.set(ref, m, { merge: true });
  });
  await batch.commit();
  recordOp('write', mitraList.length || 1);
}

/**
 * Save Services List to Firestore
 */
export async function saveServicesToFirestore(services: ServiceItem[]): Promise<void> {
  const batch = writeBatch(db);
  services.forEach((s) => {
    const ref = doc(db, 'services', s.id);
    batch.set(ref, s, { merge: true });
  });
  await batch.commit();
  recordOp('write', services.length || 1);
}

/**
 * Save Digital Systems to Firestore
 */
export async function saveSystemsToFirestore(systems: DigitalSystemItem[]): Promise<void> {
  const batch = writeBatch(db);
  systems.forEach((sys) => {
    const ref = doc(db, 'systems', sys.id);
    batch.set(ref, sys, { merge: true });
  });
  await batch.commit();
  recordOp('write', systems.length || 1);
}

/**
 * Save News to Firestore
 */
export async function saveNewsToFirestore(newsList: NewsAnnouncement[]): Promise<void> {
  const batch = writeBatch(db);
  newsList.forEach((n) => {
    const ref = doc(db, 'news', n.id);
    const sanitizedObj = {
      ...n,
      content: sanitizeRichTextContent(n.content),
      imageUrl: sanitizeToDriveTextUrl(n.imageUrl)
    };
    // Remove undefined values to prevent Firestore error
    const cleanObj = Object.fromEntries(Object.entries(sanitizedObj).filter(([_, v]) => v !== undefined));
    
    batch.set(ref, cleanObj, { merge: true });
  });
  await batch.commit();
  recordOp('write', newsList.length || 1);
}

/**
 * Save a single news document to Firestore (safest & consumes least quota)
 */
export async function saveSingleNewsToFirestore(news: NewsAnnouncement): Promise<void> {
  const ref = doc(db, 'news', news.id);
  const sanitized = {
    ...news,
    content: sanitizeRichTextContent(news.content),
    imageUrl: sanitizeToDriveTextUrl(news.imageUrl)
  };
  
  // Remove undefined values to prevent Firestore error
  const cleanObj = Object.fromEntries(Object.entries(sanitized).filter(([_, v]) => v !== undefined));

  await setDoc(ref, cleanObj, { merge: true });
  recordOp('write', 1);
}

/**
 * Save Posyandu List to Firestore (Chunks of up to 400 for safety)
 */
export async function savePosyanduListToFirestore(posyanduList: PosyanduItem[]): Promise<void> {
  const chunkSize = 400;
  for (let i = 0; i < posyanduList.length; i += chunkSize) {
    const chunk = posyanduList.slice(i, i + chunkSize);
    const batch = writeBatch(db);
    chunk.forEach((p) => {
      const ref = doc(db, 'posyandu', p.id);
      const sanitizedObj = {
        ...p,
        systemUrl: sanitizeToDriveTextUrl(p.systemUrl),
        reportFormUrl: sanitizeToDriveTextUrl(p.reportFormUrl),
        docUrl: sanitizeToDriveTextUrl(p.docUrl),
        villageInfoUrl: sanitizeToDriveTextUrl(p.villageInfoUrl)
      };
      const cleanObj = Object.fromEntries(Object.entries(sanitizedObj).filter(([_, v]) => v !== undefined));
      batch.set(ref, cleanObj, { merge: true });
    });
    await batch.commit();
  }
  recordOp('write', posyanduList.length || 1);
}

/**
 * Save a single Posyandu document to Firestore
 */
export async function saveSinglePosyanduToFirestore(posyandu: PosyanduItem): Promise<void> {
  const ref = doc(db, 'posyandu', posyandu.id);
  const sanitizedObj = {
    ...posyandu,
    systemUrl: sanitizeToDriveTextUrl(posyandu.systemUrl),
    reportFormUrl: sanitizeToDriveTextUrl(posyandu.reportFormUrl),
    docUrl: sanitizeToDriveTextUrl(posyandu.docUrl),
    villageInfoUrl: sanitizeToDriveTextUrl(posyandu.villageInfoUrl)
  };
  const cleanObj = Object.fromEntries(Object.entries(sanitizedObj).filter(([_, v]) => v !== undefined));
  await setDoc(ref, cleanObj, { merge: true });
  recordOp('write', 1);
}

export async function deletePosyanduFromFirestore(id: string): Promise<void> {
  const ref = doc(db, 'posyandu', id);
  await deleteDoc(ref);
  recordOp('write', 1);
}

/**
 * Save Gallery Metadata to Firestore (Links & IDs stored purely as text)
 */
export async function saveGalleryToFirestore(gallery: DriveFileItem[]): Promise<void> {
  const batch = writeBatch(db);
  gallery.forEach((g) => {
    const ref = doc(db, 'gallery', g.id);
    batch.set(ref, {
      ...g,
      driveUrl: sanitizeToDriveTextUrl(g.driveUrl),
      thumbnailUrl: sanitizeToDriveTextUrl(g.thumbnailUrl)
    }, { merge: true });
  });
  await batch.commit();
  recordOp('write', gallery.length || 1);
}

/**
 * Load all application data from Firestore with fallback to defaults
 */
export async function loadAllDataFromFirestore(): Promise<{
  siteSettings?: SiteSettings;
  marqueeSettings?: MarqueeSettings;
  dockConfig?: MobileDockConfig;
  mitraList?: HealthPostMitra[];
  posyanduList?: PosyanduItem[];
  services?: ServiceItem[];
  systems?: DigitalSystemItem[];
  newsList?: NewsAnnouncement[];
  gallery?: DriveFileItem[];
  stats: FirestoreMetricStats;
}> {
  const ops = getStoredOps();
  const stats: FirestoreMetricStats = {
    totalWrites: ops.writes,
    totalReads: ops.reads,
    lastLatencyMs: 0,
    isConnected: true,
    lastSyncTime: new Date().toLocaleTimeString('id-ID'),
    dailyWriteLimit: 20000,
    dailyReadLimit: 50000,
    documentCounts: {
      config: 3,
      services: 0,
      news: 0,
      mitra: 0,
      posyandu: 0,
      systems: 0,
      gallery: 0
    }
  };

  const result: any = { stats };

  try {
    const start = performance.now();
    // 1. Configs
    const siteSnap = await getDoc(doc(db, 'config', 'siteSettings'));
    if (siteSnap.exists()) result.siteSettings = siteSnap.data() as SiteSettings;

    const marqueeSnap = await getDoc(doc(db, 'config', 'marqueeSettings'));
    if (marqueeSnap.exists()) result.marqueeSettings = marqueeSnap.data() as MarqueeSettings;

    const dockSnap = await getDoc(doc(db, 'config', 'dockConfig'));
    if (dockSnap.exists()) result.dockConfig = dockSnap.data() as MobileDockConfig;

    // 2. Services
    const sSnap = await getDocs(collection(db, 'services'));
    if (!sSnap.empty) {
      result.services = sSnap.docs.map((d) => d.data() as ServiceItem);
      stats.documentCounts.services = sSnap.size;
    }

    // 3. News
    const nSnap = await getDocs(collection(db, 'news'));
    if (!nSnap.empty) {
      result.newsList = nSnap.docs.map((d) => d.data() as NewsAnnouncement);
      stats.documentCounts.news = nSnap.size;
    }

    // 4. Mitra
    const mSnap = await getDocs(collection(db, 'mitra'));
    if (!mSnap.empty) {
      result.mitraList = mSnap.docs.map((d) => d.data() as HealthPostMitra);
      stats.documentCounts.mitra = mSnap.size;
    }

    // 4b. Posyandu 108
    const posyanduSnap = await getDocs(collection(db, 'posyandu'));
    if (!posyanduSnap.empty) {
      result.posyanduList = posyanduSnap.docs.map((d) => d.data() as PosyanduItem);
      stats.documentCounts.posyandu = posyanduSnap.size;
    }

    // 5. Systems
    const sysSnap = await getDocs(collection(db, 'systems'));
    if (!sysSnap.empty) {
      result.systems = sysSnap.docs.map((d) => d.data() as DigitalSystemItem);
      stats.documentCounts.systems = sysSnap.size;
    }

    // 6. Gallery
    const gSnap = await getDocs(collection(db, 'gallery'));
    if (!gSnap.empty) {
      result.gallery = gSnap.docs.map((d) => d.data() as DriveFileItem);
      stats.documentCounts.gallery = gSnap.size;
    }

    stats.lastLatencyMs = Math.round(performance.now() - start);
    recordOp('read', 7);
  } catch (err) {
    console.warn('Firestore load failed, falling back to local storage:', err);
    stats.isConnected = false;
  }

  return result;
}

export const loadAllFromFirestore = loadAllDataFromFirestore;

export async function deleteNewsFromFirestore(newsId: string): Promise<void> {
  const ref = doc(db, 'news', newsId);
  await deleteDoc(ref);
  recordOp('write', 1);
}

export async function deleteMitraFromFirestore(id: string): Promise<void> {
  const ref = doc(db, 'mitra', id);
  await deleteDoc(ref);
  recordOp('write', 1);
}

export async function deleteServiceFromFirestore(id: string): Promise<void> {
  const ref = doc(db, 'services', id);
  await deleteDoc(ref);
  recordOp('write', 1);
}

export async function deleteSystemFromFirestore(id: string): Promise<void> {
  const ref = doc(db, 'systems', id);
  await deleteDoc(ref);
  recordOp('write', 1);
}

export async function deleteGalleryFromFirestore(id: string): Promise<void> {
  const ref = doc(db, 'gallery', id);
  await deleteDoc(ref);
  recordOp('write', 1);
}
