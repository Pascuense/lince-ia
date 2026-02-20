import { useState, useEffect, useCallback, useRef } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  swRegistered: boolean;
  swUpdateAvailable: boolean;
  platform: 'ios' | 'android' | 'desktop' | 'unknown';
}

export function usePWA() {
  const [state, setState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOnline: navigator.onLine,
    swRegistered: false,
    swUpdateAvailable: false,
    platform: detectPlatform(),
  });

  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() => {
    try {
      const stored = localStorage.getItem('lince-pwa-dismissed');
      if (!stored) return false;
      const { timestamp } = JSON.parse(stored);
      // Re-show after 7 days
      return Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000;
    } catch {
      return false;
    }
  });

  // Detect if already installed as PWA
  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setState((prev) => ({ ...prev, isInstalled: true }));
    }

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => {
      setState((prev) => ({ ...prev, isInstalled: e.matches }));
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Register Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('[PWA] Service Worker registered:', registration.scope);
          setState((prev) => ({ ...prev, swRegistered: true }));

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (
                  newWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  console.log('[PWA] New version available');
                  setState((prev) => ({ ...prev, swUpdateAvailable: true }));
                }
              });
            }
          });
        })
        .catch((error) => {
          console.warn('[PWA] Service Worker registration failed:', error);
        });
    }
  }, []);

  // Listen for beforeinstallprompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      setState((prev) => ({ ...prev, isInstallable: true }));
      console.log('[PWA] Install prompt captured');
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful install
    const installHandler = () => {
      setState((prev) => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
      }));
      deferredPromptRef.current = null;
      console.log('[PWA] App installed successfully');
    };
    window.addEventListener('appinstalled', installHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installHandler);
    };
  }, []);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () =>
      setState((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () =>
      setState((prev) => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Trigger install prompt
  const installApp = useCallback(async () => {
    const prompt = deferredPromptRef.current;
    if (!prompt) {
      console.warn('[PWA] No install prompt available');
      return false;
    }

    try {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      console.log('[PWA] Install prompt outcome:', outcome);

      if (outcome === 'accepted') {
        setState((prev) => ({
          ...prev,
          isInstalled: true,
          isInstallable: false,
        }));
        deferredPromptRef.current = null;
        return true;
      }
      return false;
    } catch (error) {
      console.error('[PWA] Install prompt error:', error);
      return false;
    }
  }, []);

  // Dismiss install banner
  const dismissInstall = useCallback(() => {
    setDismissed(true);
    localStorage.setItem(
      'lince-pwa-dismissed',
      JSON.stringify({ timestamp: Date.now() })
    );
  }, []);

  // Update Service Worker
  const updateApp = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  }, []);

  return {
    ...state,
    installApp,
    dismissInstall,
    updateApp,
    showInstallBanner:
      state.isInstallable && !state.isInstalled && !dismissed,
    showIOSInstallGuide:
      state.platform === 'ios' && !state.isInstalled && !dismissed,
  };
}

function detectPlatform(): 'ios' | 'android' | 'desktop' | 'unknown' {
  const ua = navigator.userAgent || '';
  if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) return 'ios';
  if (/android/i.test(ua)) return 'android';
  if (/Windows|Macintosh|Linux/.test(ua) && !/Mobile/.test(ua))
    return 'desktop';
  return 'unknown';
}
