// LINCE Service Worker v3.0 - Background Sync + Periodic Sync Edition
// © 2026 ACNB IA SL - Todos los derechos reservados

const CACHE_NAME = 'lince-v3';
const STATIC_CACHE = 'lince-static-v3';
const CDN_CACHE = 'lince-cdn-v3';

// IndexedDB constants (must match offlineStore.ts)
const DB_NAME = 'lince-offline';
const DB_VERSION = 1;
const SYNC_QUEUE_STORE = 'syncQueue';

// Background Sync tags
const SYNC_TAG = 'sync-progress';
const PERIODIC_SYNC_TAG = 'periodic-sync-progress';

// Core app shell to precache on install
const APP_SHELL = [
  '/',
  '/manifest.json',
];

// CDN assets to precache (icons)
const CDN_ASSETS = [
  'https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/ErVXkIKAFvfNHOyU.png',
  'https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/EWnZpbxxzKXqadGf.png',
];

// ─── IndexedDB Helper (for SW context) ───
function openSyncDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(SYNC_QUEUE_STORE)) {
        const store = db.createObjectStore(SYNC_QUEUE_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('playerId', 'playerId', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
      if (!db.objectStoreNames.contains('offlineState')) {
        db.createObjectStore('offlineState', { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getPendingItemsFromDB() {
  const db = await openSyncDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SYNC_QUEUE_STORE, 'readonly');
    const store = tx.objectStore(SYNC_QUEUE_STORE);
    const index = store.index('status');
    const request = index.getAll('pending');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function updateItemInDB(id, updates) {
  const db = await openSyncDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
    const store = tx.objectStore(SYNC_QUEUE_STORE);
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const item = getReq.result;
      if (!item) { resolve(); return; }
      Object.assign(item, updates);
      store.put(item);
      resolve();
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

async function removeItemFromDB(id) {
  const db = await openSyncDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
    const store = tx.objectStore(SYNC_QUEUE_STORE);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// ─── INSTALL ───
self.addEventListener('install', (event) => {
  console.log('[SW] Installing LINCE Service Worker v2 (Background Sync)');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(APP_SHELL).catch((err) => {
          console.warn('[SW] Some app shell resources failed to cache:', err);
        });
      }),
      caches.open(CDN_CACHE).then((cache) => {
        return Promise.allSettled(
          CDN_ASSETS.map((url) =>
            cache.add(url).catch((err) => {
              console.warn('[SW] Failed to cache CDN asset:', url, err);
            })
          )
        );
      }),
    ]).then(() => {
      console.log('[SW] Install complete');
      return self.skipWaiting();
    })
  );
});

// ─── ACTIVATE ───
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating LINCE Service Worker v2');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return (
              name !== CACHE_NAME &&
              name !== STATIC_CACHE &&
              name !== CDN_CACHE
            );
          })
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Claiming clients');
      return self.clients.claim();
    })
  );
});

// ─── FETCH STRATEGIES ───

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') return caches.match('/');
    throw error;
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cacheName = request.url.includes('manuscdn.com') ? CDN_CACHE : STATIC_CACHE;
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    if (request.destination === 'image') {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#0A0A0A" width="200" height="200"/><text fill="#00E5FF" x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="14">LINCE</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    throw error;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => cached);
  return cached || fetchPromise;
}

// ─── FETCH EVENT ───
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  // API requests: Network only
  if (url.pathname.startsWith('/api/')) return;

  // CDN images: Cache First
  if (url.hostname.includes('manuscdn.com') || url.hostname.includes('manus.space')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Google Fonts: Cache First
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Static assets: Stale While Revalidate
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|woff2?|ttf|eot|ico)$/)
  ) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // HTML navigation: Network First
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});

// ─── BACKGROUND SYNC ───
self.addEventListener('sync', (event) => {
  if (event.tag === SYNC_TAG) {
    console.log('[SW] Background Sync triggered:', SYNC_TAG);
    event.waitUntil(syncProgressFromSW());
  }
});

/**
 * Process the offline sync queue from the Service Worker context.
 * Reads pending items from IndexedDB, groups by player, sends batch requests.
 */
async function syncProgressFromSW() {
  try {
    const pending = await getPendingItemsFromDB();
    if (!pending || pending.length === 0) {
      console.log('[SW] No pending sync items');
      return;
    }

    console.log(`[SW] Processing ${pending.length} pending sync items`);

    // Group by playerId
    const byPlayer = {};
    for (const item of pending) {
      if (!byPlayer[item.playerId]) byPlayer[item.playerId] = [];
      byPlayer[item.playerId].push(item);
    }

    for (const playerId of Object.keys(byPlayer)) {
      const items = byPlayer[playerId];
      try {
        // Mark as syncing
        for (const item of items) {
          await updateItemInDB(item.id, { status: 'syncing' });
        }

        // Build batch payload
        const actions = items
          .sort((a, b) => a.timestamp - b.timestamp)
          .map((item) => ({
            type: item.type,
            payload: item.payload,
            timestamp: item.timestamp,
          }));

        const response = await fetch('/api/trpc/gamePlayer.batchSyncProgress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            json: { playerId: Number(playerId), actions },
          }),
        });

        if (response.ok) {
          // Remove synced items
          for (const item of items) {
            await removeItemFromDB(item.id);
          }
          console.log(`[SW] Synced ${items.length} items for player ${playerId}`);

          // Notify the client
          const clients = await self.clients.matchAll({ type: 'window' });
          for (const client of clients) {
            client.postMessage({
              type: 'SYNC_COMPLETE',
              playerId: Number(playerId),
              count: items.length,
            });
          }
        } else {
          console.warn(`[SW] Sync failed with status ${response.status}`);
          for (const item of items) {
            await updateItemInDB(item.id, {
              status: 'pending',
              retries: (item.retries || 0) + 1,
            });
          }
          // If server error, throw to trigger retry
          if (response.status >= 500) {
            throw new Error(`Server error: ${response.status}`);
          }
        }
      } catch (error) {
        console.warn(`[SW] Sync error for player ${playerId}:`, error);
        for (const item of items) {
          await updateItemInDB(item.id, {
            status: 'pending',
            retries: (item.retries || 0) + 1,
          });
        }
        // Re-throw to let the browser know sync failed (will retry)
        throw error;
      }
    }

    // Cleanup items with too many retries
    try {
      const allItems = await getPendingItemsFromDB();
      for (const item of (allItems || [])) {
        if (item.retries >= 5) {
          await removeItemFromDB(item.id);
          console.log(`[SW] Removed item ${item.id} after ${item.retries} failed retries`);
        }
      }
    } catch (e) {
      console.warn('[SW] Cleanup error:', e);
    }

  } catch (error) {
    console.error('[SW] Background sync failed:', error);
    throw error; // Let the browser retry
  }
}

// ─── MESSAGE HANDLER ───
self.addEventListener('message', (event) => {
  const { type } = event.data || {};

  if (type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (type === 'FORCE_SYNC') {
    console.log('[SW] Force sync requested by client');
    syncProgressFromSW().then(() => {
      event.source?.postMessage({ type: 'FORCE_SYNC_COMPLETE' });
    }).catch((err) => {
      event.source?.postMessage({ type: 'FORCE_SYNC_FAILED', error: err.message });
    });
  }

  if (type === 'GET_SYNC_STATUS') {
    getPendingItemsFromDB().then((items) => {
      event.source?.postMessage({
        type: 'SYNC_STATUS',
        pendingCount: (items || []).length,
      });
    });
  }

  // Local notification dispatch from client
  if (type === 'SHOW_NOTIFICATION') {
    const { title, body, url, tag } = event.data.payload || {};
    self.registration.showNotification(title || 'LINCE', {
      body: body || '',
      icon: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/ErVXkIKAFvfNHOyU.png',
      badge: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/xnFQpNzJeJNRUUQe.png',
      vibrate: [100, 50, 100],
      tag: tag || 'lince-local',
      data: { url: url || '/' },
      requireInteraction: false,
    });
  }
});

// ─── PUSH NOTIFICATIONS (Server-Side Web Push) ───
self.addEventListener('push', (event) => {
  if (!event.data) {
    console.log('[SW] Push event received with no data');
    return;
  }

  let data;
  try {
    data = event.data.json();
  } catch (e) {
    console.warn('[SW] Failed to parse push data:', e);
    data = { title: 'LINCE', body: event.data.text() };
  }

  const options = {
    body: data.body || 'Tienes una nueva notificación de LINCE',
    icon: data.icon || 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/ErVXkIKAFvfNHOyU.png',
    badge: data.badge || 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/xnFQpNzJeJNRUUQe.png',
    vibrate: [100, 50, 100],
    tag: data.tag || 'lince-push',
    renotify: !!data.tag, // Re-alert if same tag
    data: { url: data.url || '/' },
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false,
    silent: data.silent || false,
  };

  console.log('[SW] Showing push notification:', data.title);
  event.waitUntil(
    self.registration.showNotification(data.title || 'LINCE', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});

// ─── PERIODIC BACKGROUND SYNC ───
self.addEventListener('periodicsync', (event) => {
  if (event.tag === PERIODIC_SYNC_TAG) {
    console.log('[SW] Periodic Background Sync triggered:', PERIODIC_SYNC_TAG);
    event.waitUntil(periodicSyncHandler());
  }
});

async function periodicSyncHandler() {
  try {
    // 1. Sync any pending offline progress
    await syncProgressFromSW();

    // 2. Pre-fetch latest content for offline availability
    const cache = await caches.open(CACHE_NAME);
    const urlsToRefresh = ['/', '/manifest.json'];
    await Promise.allSettled(
      urlsToRefresh.map(async (url) => {
        try {
          const response = await fetch(url, { cache: 'no-cache' });
          if (response.ok) {
            await cache.put(url, response);
          }
        } catch (e) {
          console.warn('[SW] Periodic sync: failed to refresh', url, e);
        }
      })
    );

    console.log('[SW] Periodic sync complete');
  } catch (error) {
    console.error('[SW] Periodic sync failed:', error);
  }
}

console.log('[SW] LINCE Service Worker v2 loaded (Background Sync + Periodic Sync enabled)');
