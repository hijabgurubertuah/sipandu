// Lightweight utility for local caching of uploaded logos and dynamic favicon updates
// Strictly preserves the standard PWA manifest to prevent duplicate apps or launch failures

const LOCAL_STORAGE_IMG_PREFIX = 'sipandu_img_cache_';
const CACHE_NAME = 'sipandu-img-cache-v1';

/**
 * Cache an image URL locally in CacheStorage and LocalStorage (as Base64 Data URL)
 */
export async function cacheImageLocally(url: string): Promise<string> {
  if (!url || url.startsWith('data:')) {
    return url || '';
  }

  // 1. Check LocalStorage cache first
  const cacheKey = LOCAL_STORAGE_IMG_PREFIX + url;
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    // 2. Fetch with abort timeout so it never hangs or lags the UI
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, { mode: 'cors', signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) return url;

    const blob = await response.blob();
    
    // Save to CacheStorage API
    if ('caches' in window) {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(url, new Response(blob.slice(0), { headers: response.headers }));
      } catch (_) {}
    }

    // If small enough (< 800KB), store in LocalStorage for 0ms instant display
    if (blob.size < 800000) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          try {
            localStorage.setItem(cacheKey, base64data);
          } catch (e) {
            console.warn('LocalStorage limit reached:', e);
          }
          resolve(base64data);
        };
        reader.onerror = () => resolve(url);
        reader.readAsDataURL(blob);
      });
    }

    return url;
  } catch (err) {
    // Graceful fallback to raw URL
    return url;
  }
}

/**
 * Get synchronously cached image if available, else returns the original URL
 */
export function getSyncCachedImage(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('data:')) return url;
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_IMG_PREFIX + url);
    if (cached) return cached;
  } catch (_) {}
  return url;
}

/**
 * Dynamically updates document favicon and apple-touch-icon with the uploaded logo
 * Note: Keeps standard /manifest.webmanifest intact to guarantee 100% stable PWA installation
 */
export function updateDynamicFavicon(logoUrl: string) {
  if (!logoUrl) return;

  try {
    const resolvedUrl = getSyncCachedImage(logoUrl) || logoUrl;

    // 1. Update <link rel="icon">
    let linkIcon: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!linkIcon) {
      linkIcon = document.createElement('link');
      linkIcon.rel = 'icon';
      document.head.appendChild(linkIcon);
    }
    linkIcon.href = resolvedUrl;

    // 2. Update <link rel="apple-touch-icon">
    let appleIcon: HTMLLinkElement | null = document.querySelector("link[rel='apple-touch-icon']");
    if (!appleIcon) {
      appleIcon = document.createElement('link');
      appleIcon.rel = 'apple-touch-icon';
      document.head.appendChild(appleIcon);
    }
    appleIcon.href = resolvedUrl;

    // 3. Ensure manifest link points to the official static manifest, removing any stale blob URLs
    const manifestLink: HTMLLinkElement | null = document.querySelector("link[rel='manifest']");
    if (manifestLink && manifestLink.href.startsWith('blob:')) {
      manifestLink.href = '/manifest.webmanifest';
    }
  } catch (e) {
    console.warn('Failed to update favicon:', e);
  }
}
