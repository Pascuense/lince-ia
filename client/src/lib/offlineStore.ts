/**
 * LINCE Offline Store
 * IndexedDB-based storage for offline progress tracking and sync queue.
 * © 2026 ACNB IA SL
 */

const DB_NAME = 'lince-offline';
const DB_VERSION = 1;

// Store names
const SYNC_QUEUE_STORE = 'syncQueue';
const OFFLINE_STATE_STORE = 'offlineState';

// ─── Types ───

export interface SyncQueueItem {
  id?: number;                // Auto-incremented IDB key
  type: 'progress' | 'levelComplete' | 'dailyReward' | 'promptResult' | 'coinsEarned';
  payload: Record<string, any>;
  playerId: number;
  timestamp: number;          // Unix ms
  /** Game session token, kept so the service worker (no localStorage) can authenticate the sync */
  gameToken?: string;
  retries: number;
  status: 'pending' | 'syncing' | 'failed';
}

export interface OfflineSnapshot {
  key: string;                // 'currentState'
  playerId: number;
  state: Record<string, any>;
  updatedAt: number;
}

// ─── Database Initialization ───

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Sync queue: stores pending actions to sync when online
      if (!db.objectStoreNames.contains(SYNC_QUEUE_STORE)) {
        const store = db.createObjectStore(SYNC_QUEUE_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('playerId', 'playerId', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // Offline state snapshot: stores the latest game state for offline recovery
      if (!db.objectStoreNames.contains(OFFLINE_STATE_STORE)) {
        db.createObjectStore(OFFLINE_STATE_STORE, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      console.error('[OfflineStore] Failed to open IndexedDB:', request.error);
      dbPromise = null;
      reject(request.error);
    };
  });

  return dbPromise;
}

// ─── Sync Queue Operations ───

/**
 * Add an action to the sync queue (called when offline or as backup)
 */
export async function addToSyncQueue(item: Omit<SyncQueueItem, 'id' | 'retries' | 'status'>): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
    const store = tx.objectStore(SYNC_QUEUE_STORE);
    const request = store.add({
      ...item,
      gameToken: item.gameToken ?? localStorage.getItem('lince-game-token') ?? undefined,
      retries: 0,
      status: 'pending',
    });
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get all pending items from the sync queue
 */
export async function getPendingSyncItems(): Promise<SyncQueueItem[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SYNC_QUEUE_STORE, 'readonly');
    const store = tx.objectStore(SYNC_QUEUE_STORE);
    const index = store.index('status');
    const request = index.getAll('pending');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get count of pending items
 */
export async function getPendingCount(): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SYNC_QUEUE_STORE, 'readonly');
    const store = tx.objectStore(SYNC_QUEUE_STORE);
    const index = store.index('status');
    const request = index.count('pending');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Update a sync queue item's status
 */
export async function updateSyncItemStatus(
  id: number,
  status: SyncQueueItem['status'],
  incrementRetry = false
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
    const store = tx.objectStore(SYNC_QUEUE_STORE);
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const item = getReq.result;
      if (!item) { resolve(); return; }
      item.status = status;
      if (incrementRetry) item.retries += 1;
      store.put(item);
      resolve();
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

/**
 * Remove a sync queue item (after successful sync)
 */
export async function removeSyncItem(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
    const store = tx.objectStore(SYNC_QUEUE_STORE);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Clear all synced items (cleanup)
 */
export async function clearSyncedItems(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
    const store = tx.objectStore(SYNC_QUEUE_STORE);
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Remove items that have exceeded max retries
 */
export async function cleanupFailedItems(maxRetries = 5): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
    const store = tx.objectStore(SYNC_QUEUE_STORE);
    const request = store.getAll();
    let removed = 0;
    request.onsuccess = () => {
      const items = request.result as SyncQueueItem[];
      for (const item of items) {
        if (item.retries >= maxRetries) {
          store.delete(item.id!);
          removed++;
        }
      }
      resolve(removed);
    };
    request.onerror = () => reject(request.error);
  });
}

// ─── Offline State Snapshot ───

/**
 * Save the current game state as an offline snapshot
 */
export async function saveOfflineState(playerId: number, state: Record<string, any>): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OFFLINE_STATE_STORE, 'readwrite');
    const store = tx.objectStore(OFFLINE_STATE_STORE);
    const request = store.put({
      key: 'currentState',
      playerId,
      state,
      updatedAt: Date.now(),
    });
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Load the offline state snapshot
 */
export async function loadOfflineState(): Promise<OfflineSnapshot | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OFFLINE_STATE_STORE, 'readonly');
    const store = tx.objectStore(OFFLINE_STATE_STORE);
    const request = store.get('currentState');
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

// ─── Background Sync Registration ───

/**
 * Request a Background Sync from the Service Worker
 */
export async function requestBackgroundSync(tag = 'sync-progress'): Promise<boolean> {
  if (!('serviceWorker' in navigator)) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    if ('sync' in registration) {
      await (registration as any).sync.register(tag);
      console.log('[OfflineStore] Background sync registered:', tag);
      return true;
    }
  } catch (error) {
    console.warn('[OfflineStore] Background sync registration failed:', error);
  }
  return false;
}

/**
 * Process the sync queue: attempt to sync all pending items
 * Called from both the SW and the frontend when online
 */
export async function processSyncQueue(): Promise<{ synced: number; failed: number }> {
  const pending = await getPendingSyncItems();
  if (pending.length === 0) return { synced: 0, failed: 0 };

  console.log(`[OfflineStore] Processing ${pending.length} pending sync items`);

  let synced = 0;
  let failed = 0;

  // Group items by playerId and merge into a single batch request
  const byPlayer = new Map<number, SyncQueueItem[]>();
  for (const item of pending) {
    const existing = byPlayer.get(item.playerId) || [];
    existing.push(item);
    byPlayer.set(item.playerId, existing);
  }

  for (const [playerId, items] of Array.from(byPlayer.entries())) {
    try {
      // Mark items as syncing
      for (const item of items) {
        await updateSyncItemStatus(item.id!, 'syncing');
      }

      // Build merged payload from all queued actions
      const mergedPayload = mergeProgressActions(playerId, items);

      // Send batch sync request
      const gameToken = localStorage.getItem('lince-game-token');
      const response = await fetch('/api/trpc/gamePlayer.batchSyncProgress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(gameToken ? { 'x-game-token': gameToken } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ json: mergedPayload }),
      });

      if (response.ok) {
        // Remove all synced items
        for (const item of items) {
          await removeSyncItem(item.id!);
        }
        synced += items.length;
        console.log(`[OfflineStore] Synced ${items.length} items for player ${playerId}`);
      } else {
        // Mark as pending again for retry
        for (const item of items) {
          await updateSyncItemStatus(item.id!, 'pending', true);
        }
        failed += items.length;
      }
    } catch (error) {
      console.warn(`[OfflineStore] Sync failed for player ${playerId}:`, error);
      for (const item of items) {
        await updateSyncItemStatus(item.id!, 'pending', true);
      }
      failed += items.length;
    }
  }

  // Cleanup items that exceeded max retries
  await cleanupFailedItems(5);

  return { synced, failed };
}

/**
 * Merge multiple progress actions into a single batch payload
 */
function mergeProgressActions(playerId: number, items: SyncQueueItem[]): Record<string, any> {
  // Sort by timestamp to apply in order
  const sorted = [...items].sort((a, b) => a.timestamp - b.timestamp);

  // Start with the earliest state and apply all changes
  let merged: Record<string, any> = { playerId, actions: [] };

  for (const item of sorted) {
    merged.actions.push({
      type: item.type,
      payload: item.payload,
      timestamp: item.timestamp,
    });
  }

  return merged;
}

// ─── Utility ───

/**
 * Check if IndexedDB is available
 */
export function isIndexedDBAvailable(): boolean {
  try {
    return typeof indexedDB !== 'undefined' && indexedDB !== null;
  } catch {
    return false;
  }
}

/**
 * Get storage stats
 */
export async function getStorageStats(): Promise<{
  pendingItems: number;
  hasOfflineState: boolean;
  dbAvailable: boolean;
}> {
  if (!isIndexedDBAvailable()) {
    return { pendingItems: 0, hasOfflineState: false, dbAvailable: false };
  }

  try {
    const pendingItems = await getPendingCount();
    const offlineState = await loadOfflineState();
    return {
      pendingItems,
      hasOfflineState: offlineState !== null,
      dbAvailable: true,
    };
  } catch {
    return { pendingItems: 0, hasOfflineState: false, dbAvailable: false };
  }
}
