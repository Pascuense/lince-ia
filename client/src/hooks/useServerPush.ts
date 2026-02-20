/**
 * useServerPush — Client hook for server-side Web Push notifications.
 * Handles subscribing/unsubscribing the browser to the push server via VAPID keys.
 * Works alongside the existing useNotifications hook for local notifications.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { trpc } from '@/lib/trpc';

const PUSH_SUB_STORAGE_KEY = 'lince-push-subscription';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function useServerPush(playerId: number | null) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const swRegistrationRef = useRef<ServiceWorkerRegistration | null>(null);

  // tRPC mutations
  const subscribeMut = trpc.pushNotifications.subscribe.useMutation();
  const unsubscribeMut = trpc.pushNotifications.unsubscribe.useMutation();
  const updatePrefsMut = trpc.pushNotifications.updatePreferences.useMutation();
  const sendTestMut = trpc.pushNotifications.sendTest.useMutation();

  // Get VAPID key from env (injected by Vite)
  const vapidPublicKey = (import.meta as any).env?.VITE_VAPID_PUBLIC_KEY || '';

  // Check if push is supported
  const isSupported = typeof window !== 'undefined'
    && 'serviceWorker' in navigator
    && 'PushManager' in window
    && !!vapidPublicKey;

  // Check current subscription status on mount
  useEffect(() => {
    if (!isSupported) return;

    navigator.serviceWorker.ready.then((registration) => {
      swRegistrationRef.current = registration;
      return registration.pushManager.getSubscription();
    }).then((subscription) => {
      setIsSubscribed(!!subscription);
    }).catch(() => {
      setIsSubscribed(false);
    });
  }, [isSupported]);

  /**
   * Subscribe the browser to server push notifications.
   */
  const subscribe = useCallback(async (preferences?: {
    streakReminder: boolean;
    missionAlerts: boolean;
    dailyRewardReminder: boolean;
    quietHoursStart: number;
    quietHoursEnd: number;
  }) => {
    if (!isSupported || !playerId) {
      setError('Push notifications not supported or not logged in');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Request notification permission if needed
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setError('Notification permission denied');
        setIsLoading(false);
        return false;
      }

      // 2. Get SW registration
      const registration = await navigator.serviceWorker.ready;
      swRegistrationRef.current = registration;

      // 3. Subscribe to push manager with VAPID key
      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey.buffer as ArrayBuffer,
      });

      // 4. Extract subscription data
      const subJson = subscription.toJSON();
      if (!subJson.endpoint || !subJson.keys?.p256dh || !subJson.keys?.auth) {
        throw new Error('Invalid subscription data');
      }

      // 5. Send to server
      await subscribeMut.mutateAsync({
        playerId,
        subscription: {
          endpoint: subJson.endpoint,
          keys: {
            p256dh: subJson.keys.p256dh,
            auth: subJson.keys.auth,
          },
        },
        userAgent: navigator.userAgent,
        preferences,
      });

      // 6. Save locally
      localStorage.setItem(PUSH_SUB_STORAGE_KEY, JSON.stringify({
        endpoint: subJson.endpoint,
        subscribedAt: new Date().toISOString(),
      }));

      setIsSubscribed(true);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error('[ServerPush] Subscribe error:', err);
      setError(err?.message || 'Failed to subscribe');
      setIsLoading(false);
      return false;
    }
  }, [isSupported, playerId, vapidPublicKey, subscribeMut]);

  /**
   * Unsubscribe the browser from server push notifications.
   */
  const unsubscribe = useCallback(async () => {
    if (!playerId) return false;

    setIsLoading(true);
    setError(null);

    try {
      const registration = swRegistrationRef.current || await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Unsubscribe from push manager
        await subscription.unsubscribe();

        // Remove from server
        await unsubscribeMut.mutateAsync({
          playerId,
          endpoint: subscription.endpoint,
        });
      }

      localStorage.removeItem(PUSH_SUB_STORAGE_KEY);
      setIsSubscribed(false);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error('[ServerPush] Unsubscribe error:', err);
      setError(err?.message || 'Failed to unsubscribe');
      setIsLoading(false);
      return false;
    }
  }, [playerId, unsubscribeMut]);

  /**
   * Update notification preferences on the server.
   */
  const updatePreferences = useCallback(async (preferences: {
    streakReminder: boolean;
    missionAlerts: boolean;
    dailyRewardReminder: boolean;
    quietHoursStart: number;
    quietHoursEnd: number;
  }) => {
    if (!playerId) return false;

    try {
      const registration = swRegistrationRef.current || await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await updatePrefsMut.mutateAsync({
          playerId,
          endpoint: subscription.endpoint,
          preferences,
        });
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('[ServerPush] Update preferences error:', err);
      return false;
    }
  }, [playerId, updatePrefsMut]);

  /**
   * Send a test notification to verify push is working.
   */
  const sendTest = useCallback(async () => {
    if (!playerId) return false;

    try {
      const result = await sendTestMut.mutateAsync({ playerId });
      return result.sent > 0;
    } catch (err: any) {
      console.error('[ServerPush] Test push error:', err);
      return false;
    }
  }, [playerId, sendTestMut]);

  return {
    isSupported,
    isSubscribed,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    updatePreferences,
    sendTest,
  };
}
