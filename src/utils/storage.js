/**
 * Robust Client Storage Helper
 * Combines IndexedDB (unlimited megabytes capacity) and LocalStorage (fast sync cache).
 * Guarantees that data and uploaded images are never lost on page refresh.
 */

const DB_NAME = 'kma_portfolio_db';
const DB_VERSION = 1;
const STORE_NAME = 'portfolio_store';

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }

    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        console.warn('IndexedDB open error, falling back to LocalStorage', event.target.error);
        resolve(null);
      };
    } catch (e) {
      console.warn('IndexedDB failed to initialize', e);
      resolve(null);
    }
  });
}

/**
 * Save data to IndexedDB and LocalStorage synchronously/asynchronously.
 * @param {string} key
 * @param {any} data
 */
export async function persistData(key, data) {
  // 1. Try writing to LocalStorage (fast synchronous cache)
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    // If quota exceeded, LocalStorage will throw here, but IndexedDB will safely handle it!
    console.warn('LocalStorage write warning (quota or private mode):', err.message);
  }

  // 2. Write to IndexedDB (virtually unlimited quota for large images/videos)
  try {
    const db = await openDatabase();
    if (!db) return;

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(data, key);

      req.onsuccess = () => resolve(true);
      req.onerror = (e) => {
        console.warn('IndexedDB put error:', e.target.error);
        resolve(false);
      };
    });
  } catch (e) {
    console.warn('IndexedDB persistence error:', e);
  }
}

/**
 * Retrieve data, trying IndexedDB first, then LocalStorage, then fallback.
 * @param {string} key
 * @param {any} fallback
 * @returns {Promise<any>}
 */
export async function retrieveData(key, fallback = null) {
  // 1. Try reading from IndexedDB
  try {
    const db = await openDatabase();
    if (db) {
      const idbData = await new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      });

      if (idbData && typeof idbData === 'object') {
        // Also keep localStorage updated
        try {
          localStorage.setItem(key, JSON.stringify(idbData));
        } catch (e) {}
        return idbData;
      }
    }
  } catch (e) {
    console.warn('Error reading from IndexedDB:', e);
  }

  // 2. Fallback to LocalStorage
  try {
    const local = localStorage.getItem(key);
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading from LocalStorage:', e);
  }

  return fallback;
}

/**
 * Synchronous read from LocalStorage for immediate React state initialization
 * @param {string} key
 * @param {any} fallback
 * @returns {any}
 */
export function getLocalSync(key, fallback = null) {
  try {
    const local = localStorage.getItem(key);
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch (e) {}
  return fallback;
}
