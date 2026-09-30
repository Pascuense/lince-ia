import { useState } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { X, Download, Share, Plus, Smartphone, Monitor, Wifi, WifiOff, RefreshCw } from 'lucide-react';

const LINCE_ICON = '/assets/gSDtLqkjlQcuFnNK.png';

// ─── Translations ───
const translations: Record<string, Record<string, string>> = {
  es: {
    installTitle: '¡Instala LINCE!',
    installDesc: 'Accede más rápido y aprende IA sin conexión',
    installBtn: 'Instalar App',
    iosTitle: 'Instalar en iPhone/iPad',
    iosStep1: 'Toca el botón',
    iosStep1b: 'Compartir',
    iosStep2: 'Selecciona',
    iosStep2b: 'Añadir a pantalla de inicio',
    iosStep3: 'Toca',
    iosStep3b: 'Añadir',
    dismiss: 'Ahora no',
    offline: 'Sin conexión',
    online: 'Conectado',
    updateTitle: '¡Nueva versión disponible!',
    updateDesc: 'Hay una actualización de LINCE lista',
    updateBtn: 'Actualizar ahora',
    installed: '✓ App instalada',
  },
  en: {
    installTitle: 'Install LINCE!',
    installDesc: 'Access faster and learn AI offline',
    installBtn: 'Install App',
    iosTitle: 'Install on iPhone/iPad',
    iosStep1: 'Tap the',
    iosStep1b: 'Share',
    iosStep2: 'Select',
    iosStep2b: 'Add to Home Screen',
    iosStep3: 'Tap',
    iosStep3b: 'Add',
    dismiss: 'Not now',
    offline: 'Offline',
    online: 'Connected',
    updateTitle: 'New version available!',
    updateDesc: 'A LINCE update is ready',
    updateBtn: 'Update now',
    installed: '✓ App installed',
  },
  zh: {
    installTitle: '安装 LINCE！',
    installDesc: '更快访问，离线学习AI',
    installBtn: '安装应用',
    iosTitle: '在 iPhone/iPad 上安装',
    iosStep1: '点击',
    iosStep1b: '分享',
    iosStep2: '选择',
    iosStep2b: '添加到主屏幕',
    iosStep3: '点击',
    iosStep3b: '添加',
    dismiss: '以后再说',
    offline: '离线',
    online: '已连接',
    updateTitle: '新版本可用！',
    updateDesc: 'LINCE 更新已就绪',
    updateBtn: '立即更新',
    installed: '✓ 应用已安装',
  },
};

function getT() {
  try {
    const stored = localStorage.getItem('lince-prd-language');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && translations[parsed]) return translations[parsed];
    }
  } catch {}
  return translations.es;
}

// ─── Install Banner (Android/Desktop) ───
function InstallBanner({
  onInstall,
  onDismiss,
}: {
  onInstall: () => void;
  onDismiss: () => void;
}) {
  const t = getT();
  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] mx-auto max-w-md animate-slide-up">
      <div className="relative bg-gradient-to-r from-[#0A0A0A] to-[#111] border border-[#00E5FF]/30 rounded-2xl p-4 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
        {/* Close button */}
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 text-[#666] hover:text-white transition-colors p-1"
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-3">
          {/* App icon */}
          <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border border-[#D4A843]/30 shadow-[0_0_10px_rgba(212,168,67,0.2)]">
            <img
              src={LINCE_ICON}
              alt="LINCE"
              className="w-full h-full object-cover"
              style={{ pointerEvents: 'auto' }}
            />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-white text-sm leading-tight">
              {t.installTitle}
            </h3>
            <p className="text-[#B0B0B0] text-xs mt-0.5 leading-tight">
              {t.installDesc}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Smartphone size={12} className="text-[#00E5FF]" />
              <Monitor size={12} className="text-[#00E5FF]" />
              <span className="text-[#00E5FF] text-[10px] font-medium">
                iOS · Android · Desktop
              </span>
            </div>
          </div>

          {/* Install button */}
          <button
            onClick={onInstall}
            className="flex-shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] text-black font-bold text-xs px-4 py-2.5 rounded-xl hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] active:scale-95"
          >
            <Download size={14} />
            {t.installBtn}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── iOS Install Guide ───
function IOSInstallGuide({ onDismiss }: { onDismiss: () => void }) {
  const t = getT();
  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] mx-auto max-w-md animate-slide-up">
      <div className="relative bg-gradient-to-r from-[#0A0A0A] to-[#111] border border-[#00E5FF]/30 rounded-2xl p-4 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 text-[#666] hover:text-white transition-colors p-1"
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-[#D4A843]/30">
            <img
              src={LINCE_ICON}
              alt="LINCE"
              className="w-full h-full object-cover"
              style={{ pointerEvents: 'auto' }}
            />
          </div>

          <div className="flex-1">
            <h3 className="font-display font-bold text-white text-sm mb-2">
              {t.iosTitle}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#B0B0B0]">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] flex items-center justify-center text-[10px] font-bold">
                  1
                </span>
                <span>
                  {t.iosStep1}{' '}
                  <Share size={12} className="inline text-[#00E5FF]" />{' '}
                  <strong className="text-white">{t.iosStep1b}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#B0B0B0]">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] flex items-center justify-center text-[10px] font-bold">
                  2
                </span>
                <span>
                  {t.iosStep2}{' '}
                  <Plus size={12} className="inline text-[#00E5FF]" />{' '}
                  <strong className="text-white">{t.iosStep2b}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#B0B0B0]">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] flex items-center justify-center text-[10px] font-bold">
                  3
                </span>
                <span>
                  {t.iosStep3}{' '}
                  <strong className="text-white">{t.iosStep3b}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="w-full mt-3 text-center text-[#666] text-xs hover:text-[#B0B0B0] transition-colors"
        >
          {t.dismiss}
        </button>
      </div>
    </div>
  );
}

// ─── Update Banner ───
function UpdateBanner({ onUpdate }: { onUpdate: () => void }) {
  const t = getT();
  return (
    <div className="fixed top-4 left-4 right-4 z-[9999] mx-auto max-w-md animate-slide-down">
      <div className="bg-gradient-to-r from-[#0A0A0A] to-[#111] border border-[#D4A843]/30 rounded-2xl p-3 shadow-[0_0_20px_rgba(212,168,67,0.15)]">
        <div className="flex items-center gap-3">
          <RefreshCw size={20} className="text-[#D4A843] animate-spin-slow flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-display font-bold text-white text-xs">
              {t.updateTitle}
            </h3>
            <p className="text-[#B0B0B0] text-[10px]">{t.updateDesc}</p>
          </div>
          <button
            onClick={onUpdate}
            className="flex-shrink-0 bg-[#D4A843] text-black font-bold text-xs px-3 py-1.5 rounded-lg hover:brightness-110 transition-all"
          >
            {t.updateBtn}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Offline Indicator ───
function OfflineIndicator() {
  const t = getT();
  return (
    <div className="fixed top-0 left-0 right-0 z-[10000] bg-red-900/90 text-white text-center py-1 text-xs font-medium flex items-center justify-center gap-1.5 backdrop-blur-sm">
      <WifiOff size={12} />
      {t.offline}
    </div>
  );
}

// ─── Main PWA Component ───
export function PWAInstallBanner() {
  const {
    showInstallBanner,
    showIOSInstallGuide,
    isOnline,
    swUpdateAvailable,
    installApp,
    dismissInstall,
    updateApp,
  } = usePWA();

  return (
    <>
      {/* Offline indicator */}
      {!isOnline && <OfflineIndicator />}

      {/* Update banner */}
      {swUpdateAvailable && <UpdateBanner onUpdate={updateApp} />}

      {/* Install banner (Android/Desktop) */}
      {showInstallBanner && (
        <InstallBanner onInstall={installApp} onDismiss={dismissInstall} />
      )}

      {/* iOS install guide */}
      {showIOSInstallGuide && <IOSInstallGuide onDismiss={dismissInstall} />}
    </>
  );
}

export default PWAInstallBanner;
