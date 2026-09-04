/**
 * Safe localStorage wrapper that handles QuotaExceededError and private browsing restrictions.
 */

export function safeGetItem<T = any>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (err) {
    console.warn(`[safeStorage] Failed to read ${key}:`, err);
    return fallback;
  }
}

export function safeSetItem(key: string, value: any): boolean {
  try {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (err: any) {
    console.warn(`[safeStorage] Failed to write ${key} to localStorage:`, err?.message || err);

    // If quota exceeded, clean up non-essential cache to free up space
    try {
      if (key === 'ayesha_cotton_products') {
        // Products are loaded from Supabase or initialData, do not let it block the browser
        localStorage.removeItem('ayesha_cotton_products');
      } else {
        // Remove large products cache to let critical state (cart, auth, orders) save
        localStorage.removeItem('ayesha_cotton_products');
        // Try saving once more
        const serialized = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, serialized);
        return true;
      }
    } catch {
      // Storage completely unavailable or full
    }
    return false;
  }
}

export function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`[safeStorage] Failed to remove ${key}:`, err);
  }
}

/**
 * Compresses an image file to a lightweight data URL (max 1024px, JPEG 0.78 quality)
 * to keep image size under ~80-120KB instead of 5MB+.
 */
export async function compressImageFile(file: File, maxDimension = 1024, quality = 0.78): Promise<string> {
  return new Promise((resolve) => {
    // If it's not an image, fallback to normal FileReader
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || '');
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve((e.target?.result as string) || '');
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };

      img.onerror = () => {
        resolve((e.target?.result as string) || '');
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}
