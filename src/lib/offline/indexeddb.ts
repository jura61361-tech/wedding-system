import { WeddingGift, WeddingGiftInsert } from '@/types/wedding';

const DB_NAME = 'wedding_gift_db';
const DB_VERSION = 1;
const STORE_GIFTS = 'gifts';
const STORE_QUEUE = 'offline_queue';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_GIFTS)) {
        db.createObjectStore(STORE_GIFTS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_QUEUE)) {
        db.createObjectStore(STORE_QUEUE, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveAllGiftsLocally(gifts: WeddingGift[]): Promise<void> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_GIFTS, 'readwrite');
    const store = tx.objectStore(STORE_GIFTS);
    store.clear();
    for (const gift of gifts) {
      store.put(gift);
    }
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to cache gifts in IndexedDB:', err);
  }
}

export async function getLocalGifts(): Promise<WeddingGift[]> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_GIFTS, 'readonly');
    const store = tx.objectStore(STORE_GIFTS);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Failed to retrieve cached gifts from IndexedDB:', err);
    return [];
  }
}

export async function addToOfflineQueue(gift: WeddingGiftInsert): Promise<WeddingGift> {
  const offlineGift: WeddingGift = {
    ...gift,
    id: 'offline_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
    status: gift.status || 'pending',
    created_at: new Date().toISOString(),
    is_offline: true,
  };

  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_QUEUE, 'readwrite');
    const store = tx.objectStore(STORE_QUEUE);
    store.put(offlineGift);

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to store offline gift:', err);
  }

  return offlineGift;
}

export async function getOfflineQueue(): Promise<WeddingGift[]> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_QUEUE, 'readonly');
    const store = tx.objectStore(STORE_QUEUE);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Failed to read offline queue from IndexedDB:', err);
    return [];
  }
}

export async function removeOfflineQueueItem(id: string): Promise<void> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_QUEUE, 'readwrite');
    const store = tx.objectStore(STORE_QUEUE);
    store.delete(id);

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to remove offline queue item:', err);
  }
}

export async function clearOfflineQueue(): Promise<void> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_QUEUE, 'readwrite');
    tx.objectStore(STORE_QUEUE).clear();
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to clear offline queue:', err);
  }
}
