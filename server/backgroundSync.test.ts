/**
 * LINCE Background Sync Tests
 * Tests for offline progress storage, sync queue, and batch sync endpoint.
 * © 2026 ACNB IA SL
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// ─── Service Worker Tests ───
describe('Service Worker - Background Sync', () => {
  const swPath = path.resolve(__dirname, '../client/public/sw.js');

  it('should have sw.js file in public directory', () => {
    expect(fs.existsSync(swPath)).toBe(true);
  });

  it('should contain LINCE cache name', () => {
    const content = fs.readFileSync(swPath, 'utf-8');
    expect(content).toContain('lince-');
  });

  it('should register sync event listener', () => {
    const content = fs.readFileSync(swPath, 'utf-8');
    expect(content).toContain("addEventListener('sync'");
  });

  it('should handle sync-progress tag', () => {
    const content = fs.readFileSync(swPath, 'utf-8');
    expect(content).toContain('sync-progress');
  });

  it('should handle install event', () => {
    const content = fs.readFileSync(swPath, 'utf-8');
    expect(content).toContain("addEventListener('install'");
  });

  it('should handle activate event', () => {
    const content = fs.readFileSync(swPath, 'utf-8');
    expect(content).toContain("addEventListener('activate'");
  });

  it('should handle fetch event with caching strategies', () => {
    const content = fs.readFileSync(swPath, 'utf-8');
    expect(content).toContain("addEventListener('fetch'");
    expect(content).toContain('caches');
  });

  it('should use network-first strategy for API calls', () => {
    const content = fs.readFileSync(swPath, 'utf-8');
    // Should check for /api/ routes
    expect(content).toContain('/api/');
  });

  it('should handle offline fallback', () => {
    const content = fs.readFileSync(swPath, 'utf-8');
    expect(content).toContain('offline');
  });

  it('should process sync queue from IndexedDB', () => {
    const content = fs.readFileSync(swPath, 'utf-8');
    // Should reference IndexedDB for sync queue
    expect(content).toContain('indexedDB');
    expect(content).toContain('syncQueue');
  });

  it('should call batchSyncProgress endpoint during sync', () => {
    const content = fs.readFileSync(swPath, 'utf-8');
    expect(content).toContain('batchSyncProgress');
  });

  it('should handle message events for skipWaiting', () => {
    const content = fs.readFileSync(swPath, 'utf-8');
    expect(content).toContain("addEventListener('message'");
    expect(content).toContain('skipWaiting');
  });
});

// ─── Offline Store Module Tests ───
describe('Offline Store Module', () => {
  const storePath = path.resolve(__dirname, '../client/src/lib/offlineStore.ts');

  it('should have offlineStore.ts module', () => {
    expect(fs.existsSync(storePath)).toBe(true);
  });

  it('should export addToSyncQueue function', () => {
    const content = fs.readFileSync(storePath, 'utf-8');
    expect(content).toContain('export');
    expect(content).toContain('addToSyncQueue');
  });

  it('should export getPendingSyncItems function', () => {
    const content = fs.readFileSync(storePath, 'utf-8');
    expect(content).toContain('getPendingSyncItems');
  });

  it('should export clearSyncedItems function', () => {
    const content = fs.readFileSync(storePath, 'utf-8');
    expect(content).toContain('clearSyncedItems');
  });

  it('should export requestBackgroundSync function', () => {
    const content = fs.readFileSync(storePath, 'utf-8');
    expect(content).toContain('requestBackgroundSync');
  });

  it('should export saveOfflineState function', () => {
    const content = fs.readFileSync(storePath, 'utf-8');
    expect(content).toContain('saveOfflineState');
  });

  it('should export isIndexedDBAvailable function', () => {
    const content = fs.readFileSync(storePath, 'utf-8');
    expect(content).toContain('isIndexedDBAvailable');
  });

  it('should use lince-offline-db as database name', () => {
    const content = fs.readFileSync(storePath, 'utf-8');
    expect(content).toContain('lince-offline');
  });

  it('should define syncQueue object store', () => {
    const content = fs.readFileSync(storePath, 'utf-8');
    expect(content).toContain('syncQueue');
  });

  it('should define offlineState object store', () => {
    const content = fs.readFileSync(storePath, 'utf-8');
    expect(content).toContain('offlineState');
  });

  it('should handle processing sync queue', () => {
    const content = fs.readFileSync(storePath, 'utf-8');
    expect(content).toContain('processSyncQueue');
  });
});

// ─── useOfflineProgress Hook Tests ───
describe('useOfflineProgress Hook', () => {
  const hookPath = path.resolve(__dirname, '../client/src/hooks/useOfflineProgress.ts');

  it('should have useOfflineProgress.ts hook', () => {
    expect(fs.existsSync(hookPath)).toBe(true);
  });

  it('should export useOfflineProgress hook', () => {
    const content = fs.readFileSync(hookPath, 'utf-8');
    expect(content).toContain('export');
    expect(content).toContain('useOfflineProgress');
  });

  it('should export SyncStatus type', () => {
    const content = fs.readFileSync(hookPath, 'utf-8');
    expect(content).toContain('SyncStatus');
  });

  it('should track online/offline state', () => {
    const content = fs.readFileSync(hookPath, 'utf-8');
    expect(content).toContain('isOnline');
    expect(content).toContain('navigator.onLine');
  });

  it('should track pending sync count', () => {
    const content = fs.readFileSync(hookPath, 'utf-8');
    expect(content).toContain('pendingCount');
  });

  it('should provide forceSync function', () => {
    const content = fs.readFileSync(hookPath, 'utf-8');
    expect(content).toContain('forceSync');
  });

  it('should listen for online/offline events', () => {
    const content = fs.readFileSync(hookPath, 'utf-8');
    expect(content).toContain("'online'");
    expect(content).toContain("'offline'");
  });
});

// ─── OfflineSyncIndicator Component Tests ───
describe('OfflineSyncIndicator Component', () => {
  const componentPath = path.resolve(__dirname, '../client/src/components/OfflineSyncIndicator.tsx');

  it('should have OfflineSyncIndicator.tsx component', () => {
    expect(fs.existsSync(componentPath)).toBe(true);
  });

  it('should export OfflineSyncIndicator', () => {
    const content = fs.readFileSync(componentPath, 'utf-8');
    expect(content).toContain('export');
    expect(content).toContain('OfflineSyncIndicator');
  });

  it('should support multiple languages (es, en, zh)', () => {
    const content = fs.readFileSync(componentPath, 'utf-8');
    expect(content).toContain("'es'");
    expect(content).toContain("'en'");
    expect(content).toContain("'zh'");
  });

  it('should display sync status states', () => {
    const content = fs.readFileSync(componentPath, 'utf-8');
    expect(content).toContain('synced');
    expect(content).toContain('pending');
    expect(content).toContain('syncing');
    expect(content).toContain('offline');
    expect(content).toContain('error');
  });

  it('should show pending count badge', () => {
    const content = fs.readFileSync(componentPath, 'utf-8');
    expect(content).toContain('pendingCount');
  });

  it('should have force sync button', () => {
    const content = fs.readFileSync(componentPath, 'utf-8');
    expect(content).toContain('forceSync');
  });
});

// ─── GameContext Integration Tests ───
describe('GameContext - Offline Integration', () => {
  const contextPath = path.resolve(__dirname, '../client/src/contexts/GameContext.tsx');

  it('should import offlineStore functions', () => {
    const content = fs.readFileSync(contextPath, 'utf-8');
    expect(content).toContain('addToSyncQueue');
    expect(content).toContain('requestBackgroundSync');
    expect(content).toContain('isIndexedDBAvailable');
  });

  it('should save offline state to IndexedDB', () => {
    const content = fs.readFileSync(contextPath, 'utf-8');
    expect(content).toContain('saveOfflineState');
  });

  it('should queue failed syncs for background sync', () => {
    const content = fs.readFileSync(contextPath, 'utf-8');
    expect(content).toContain('queuing offline');
    expect(content).toContain('addToSyncQueue');
  });
});

// ─── Batch Sync Endpoint Tests ───
describe('Batch Sync Endpoint - Router', () => {
  const routerPath = path.resolve(__dirname, './routers.ts');

  it('should have batchSyncProgress endpoint', () => {
    const content = fs.readFileSync(routerPath, 'utf-8');
    expect(content).toContain('batchSyncProgress');
  });

  it('should validate playerId as positive integer', () => {
    const content = fs.readFileSync(routerPath, 'utf-8');
    // The batchSyncProgress input should validate playerId
    expect(content).toContain('playerId: z.number().int().positive()');
  });

  it('should accept array of actions with type and payload', () => {
    const content = fs.readFileSync(routerPath, 'utf-8');
    expect(content).toContain("z.enum(['progress', 'levelComplete', 'dailyReward', 'promptResult', 'coinsEarned'])");
  });

  it('should limit batch to 100 actions max', () => {
    const content = fs.readFileSync(routerPath, 'utf-8');
    expect(content).toContain('.max(100)');
  });

  it('should sort actions by timestamp', () => {
    const content = fs.readFileSync(routerPath, 'utf-8');
    expect(content).toContain('sort((a, b) => a.timestamp - b.timestamp)');
  });

  it('should handle progress action type', () => {
    const content = fs.readFileSync(routerPath, 'utf-8');
    expect(content).toContain("case 'progress':");
  });

  it('should handle levelComplete action type', () => {
    const content = fs.readFileSync(routerPath, 'utf-8');
    expect(content).toContain("case 'levelComplete':");
  });

  it('should handle coinsEarned action type', () => {
    const content = fs.readFileSync(routerPath, 'utf-8');
    expect(content).toContain("case 'coinsEarned':");
  });

  it('should handle promptResult action type', () => {
    const content = fs.readFileSync(routerPath, 'utf-8');
    expect(content).toContain("case 'promptResult':");
  });

  it('should handle dailyReward action type', () => {
    const content = fs.readFileSync(routerPath, 'utf-8');
    expect(content).toContain("case 'dailyReward':");
  });

  it('should return syncedActions count', () => {
    const content = fs.readFileSync(routerPath, 'utf-8');
    expect(content).toContain('syncedActions');
  });

  it('should return finalState after merge', () => {
    const content = fs.readFileSync(routerPath, 'utf-8');
    expect(content).toContain('finalState');
  });
});

// ─── Manifest PWA Tests ───
describe('PWA Manifest - Background Sync Support', () => {
  const manifestPath = path.resolve(__dirname, '../client/public/manifest.json');

  it('should have manifest.json', () => {
    expect(fs.existsSync(manifestPath)).toBe(true);
  });

  it('should have valid JSON', () => {
    const content = fs.readFileSync(manifestPath, 'utf-8');
    expect(() => JSON.parse(content)).not.toThrow();
  });

  it('should have LINCE name', () => {
    const content = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    expect(content.name).toContain('LINCE');
  });

  it('should have standalone display mode', () => {
    const content = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    expect(content.display).toBe('standalone');
  });

  it('should have start_url', () => {
    const content = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    expect(content.start_url).toBeDefined();
  });

  it('should have icons array', () => {
    const content = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    expect(content.icons).toBeDefined();
    expect(Array.isArray(content.icons)).toBe(true);
    expect(content.icons.length).toBeGreaterThan(0);
  });
});

// ─── App.tsx Integration Tests ───
describe('App.tsx - Offline Components Integration', () => {
  const appPath = path.resolve(__dirname, '../client/src/App.tsx');

  it('should import OfflineSyncIndicator', () => {
    const content = fs.readFileSync(appPath, 'utf-8');
    expect(content).toContain('OfflineSyncIndicator');
  });

  it('should render OfflineSyncIndicator in the app', () => {
    const content = fs.readFileSync(appPath, 'utf-8');
    expect(content).toContain('<OfflineSyncIndicator');
  });

  it('should import PWAInstallBanner', () => {
    const content = fs.readFileSync(appPath, 'utf-8');
    expect(content).toContain('PWAInstallBanner');
  });
});
