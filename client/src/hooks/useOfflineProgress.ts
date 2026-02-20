/**
 * LINCE useOfflineProgress Hook
 * Manages offline progress tracking, sync queue, and connectivity state.
 * © 2026 ACNB IA SL
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  addToSyncQueue,
  getPendingCount,
  processSyncQueue,
  saveOfflineState,
  loadOfflineState,
  requestBackgroundSync,
  isIndexedDBAvailable,
  getStorageStats,
} from '@/lib/offlineStore';

// ─── Types ───

export type SyncStatus = 'synced' | 'pending' | 'syncing' | 'offline' | 'error';

export interface OfflineProgressState {
  /** Current sync status */
  syncStatus: SyncStatus;
  /** Whether the device is currently online */
  isOnline: boolean;
  /** Number of pending items in the sync queue */
  pendingCount: number;
  /** Whether IndexedDB is available */
  isAvailable: boolean;
  /** Last successful sync timestamp */
  lastSyncAt: number | null;
  /** Error message if sync failed */
  lastError: string | null;
}

export interface UseOfflineProgressReturn extends OfflineProgressState {
  /** Queue a progress action for sync (works offline) */
  queueAction: (
    type: 'progress' | 'levelComplete' | 'dailyReward' | 'promptResult' | 'coinsEarned',
    payload: Record<string, any>,
    playerId: number
  ) => Promise<void>;
  /** Save current game state snapshot for offline recovery */
  saveSnapshot: (playerId: number, state: Record<string, any>) => Promise<void>;
  /** Load the last offline state snapshot */
  loadSnapshot: () => Promise<Record<string, any> | null>;
  /** Force sync now (when online) */
  forceSync: () => Promise<void>;
  /** Refresh the pending count */
  refreshStatus: () => Promise<void>;
}

// ─── Hook ───

export function useOfflineProgress(): UseOfflineProgressReturn {
  const [state, setState] = useState<OfflineProgressState>({
    syncStatus: 'synced',
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    pendingCount: 0,
    isAvailable: isIndexedDBAvailable(),
    lastSyncAt: null,
    lastError: null,
  });

  const syncingRef = useRef(false);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Online/Offline Detection ───
  useEffect(() => {
    const handleOnline = () => {
      console.log('[OfflineProgress] Device is online');
      setState(s => ({ ...s, isOnline: true }));
      // Trigger sync when coming back online
      attemptSync();
    };

    const handleOffline = () => {
      console.log('[OfflineProgress] Device is offline');
      setState(s => ({ ...s, isOnline: false, syncStatus: 'offline' }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ─── Listen for SW sync messages ───
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleMessage = (event: MessageEvent) => {
      const { type, count } = event.data || {};

      if (type === 'SYNC_COMPLETE') {
        console.log(`[OfflineProgress] SW sync complete: ${count} items`);
        setState(s => ({
          ...s,
          syncStatus: 'synced',
          pendingCount: Math.max(0, s.pendingCount - (count || 0)),
          lastSyncAt: Date.now(),
          lastError: null,
        }));
        refreshPendingCount();
      }

      if (type === 'FORCE_SYNC_COMPLETE') {
        setState(s => ({ ...s, syncStatus: 'synced', lastSyncAt: Date.now() }));
        refreshPendingCount();
      }

      if (type === 'FORCE_SYNC_FAILED') {
        setState(s => ({ ...s, syncStatus: 'error', lastError: event.data.error }));
      }

      if (type === 'SYNC_STATUS') {
        setState(s => ({
          ...s,
          pendingCount: event.data.pendingCount || 0,
          syncStatus: event.data.pendingCount > 0 ? 'pending' : 'synced',
        }));
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);
    return () => navigator.serviceWorker.removeEventListener('message', handleMessage);
  }, []);

  // ─── Refresh pending count ───
  const refreshPendingCount = useCallback(async () => {
    if (!state.isAvailable) return;
    try {
      const count = await getPendingCount();
      setState(s => ({
        ...s,
        pendingCount: count,
        syncStatus: count > 0
          ? (s.isOnline ? 'pending' : 'offline')
          : 'synced',
      }));
    } catch (err) {
      console.warn('[OfflineProgress] Failed to get pending count:', err);
    }
  }, [state.isAvailable]);

  // Initial status check
  useEffect(() => {
    refreshPendingCount();
  }, [refreshPendingCount]);

  // ─── Attempt Sync ───
  const attemptSync = useCallback(async () => {
    if (syncingRef.current) return;
    if (!navigator.onLine) return;

    syncingRef.current = true;
    setState(s => ({ ...s, syncStatus: 'syncing' }));

    try {
      // First try Background Sync API (browser handles retry)
      const bgSyncRegistered = await requestBackgroundSync();

      if (!bgSyncRegistered) {
        // Fallback: process queue directly from the frontend
        const result = await processSyncQueue();
        console.log(`[OfflineProgress] Direct sync: ${result.synced} synced, ${result.failed} failed`);

        if (result.failed > 0) {
          setState(s => ({ ...s, syncStatus: 'error', lastError: `${result.failed} items failed` }));
          // Schedule retry in 30 seconds
          if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
          retryTimerRef.current = setTimeout(() => attemptSync(), 30000);
        } else {
          setState(s => ({
            ...s,
            syncStatus: 'synced',
            lastSyncAt: Date.now(),
            lastError: null,
          }));
        }
      } else {
        // Background Sync registered — SW will handle it
        setState(s => ({ ...s, syncStatus: 'pending' }));
      }
    } catch (err) {
      console.warn('[OfflineProgress] Sync attempt failed:', err);
      setState(s => ({
        ...s,
        syncStatus: 'error',
        lastError: err instanceof Error ? err.message : 'Sync failed',
      }));
    } finally {
      syncingRef.current = false;
      await refreshPendingCount();
    }
  }, [refreshPendingCount]);

  // ─── Queue Action ───
  const queueAction = useCallback(async (
    type: 'progress' | 'levelComplete' | 'dailyReward' | 'promptResult' | 'coinsEarned',
    payload: Record<string, any>,
    playerId: number
  ) => {
    if (!state.isAvailable) {
      console.warn('[OfflineProgress] IndexedDB not available, skipping queue');
      return;
    }

    try {
      await addToSyncQueue({
        type,
        payload,
        playerId,
        timestamp: Date.now(),
      });

      setState(s => ({
        ...s,
        pendingCount: s.pendingCount + 1,
        syncStatus: s.isOnline ? 'pending' : 'offline',
      }));

      // If online, attempt to sync immediately
      if (navigator.onLine) {
        // Small delay to batch rapid actions
        if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
        retryTimerRef.current = setTimeout(() => attemptSync(), 2000);
      } else {
        // Register background sync for when we come back online
        await requestBackgroundSync();
      }
    } catch (err) {
      console.error('[OfflineProgress] Failed to queue action:', err);
    }
  }, [state.isAvailable, attemptSync]);

  // ─── Save Snapshot ───
  const saveSnapshot = useCallback(async (playerId: number, gameState: Record<string, any>) => {
    if (!state.isAvailable) return;
    try {
      await saveOfflineState(playerId, gameState);
    } catch (err) {
      console.warn('[OfflineProgress] Failed to save snapshot:', err);
    }
  }, [state.isAvailable]);

  // ─── Load Snapshot ───
  const loadSnapshot = useCallback(async (): Promise<Record<string, any> | null> => {
    if (!state.isAvailable) return null;
    try {
      const snapshot = await loadOfflineState();
      return snapshot?.state || null;
    } catch (err) {
      console.warn('[OfflineProgress] Failed to load snapshot:', err);
      return null;
    }
  }, [state.isAvailable]);

  // ─── Force Sync ───
  const forceSync = useCallback(async () => {
    if (!navigator.onLine) {
      setState(s => ({ ...s, lastError: 'No hay conexión a Internet' }));
      return;
    }

    // Try to ask the SW to sync
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (registration.active) {
          registration.active.postMessage({ type: 'FORCE_SYNC' });
          setState(s => ({ ...s, syncStatus: 'syncing' }));
          return;
        }
      } catch (err) {
        console.warn('[OfflineProgress] SW force sync failed, using fallback:', err);
      }
    }

    // Fallback: direct sync
    await attemptSync();
  }, [attemptSync]);

  // ─── Refresh Status ───
  const refreshStatus = useCallback(async () => {
    await refreshPendingCount();
  }, [refreshPendingCount]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);

  return {
    ...state,
    queueAction,
    saveSnapshot,
    loadSnapshot,
    forceSync,
    refreshStatus,
  };
}
