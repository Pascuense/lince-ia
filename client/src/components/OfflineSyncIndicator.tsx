/**
 * LINCE Offline Sync Indicator
 * Shows sync status, pending items, and offline state in a floating badge.
 * © 2026 ACNB IA SL
 */

import { useState } from 'react';
import { useOfflineProgress, type SyncStatus } from '@/hooks/useOfflineProgress';

const STATUS_CONFIG: Record<SyncStatus, {
  icon: string;
  label: { es: string; en: string; zh: string };
  color: string;
  bgColor: string;
  borderColor: string;
  pulse: boolean;
}> = {
  synced: {
    icon: '✓',
    label: { es: 'Sincronizado', en: 'Synced', zh: '已同步' },
    color: '#00E5FF',
    bgColor: 'rgba(0, 229, 255, 0.1)',
    borderColor: 'rgba(0, 229, 255, 0.3)',
    pulse: false,
  },
  pending: {
    icon: '↻',
    label: { es: 'Pendiente', en: 'Pending', zh: '待同步' },
    color: '#D4A843',
    bgColor: 'rgba(212, 168, 67, 0.1)',
    borderColor: 'rgba(212, 168, 67, 0.3)',
    pulse: true,
  },
  syncing: {
    icon: '⟳',
    label: { es: 'Sincronizando...', en: 'Syncing...', zh: '同步中...' },
    color: '#00E5FF',
    bgColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: 'rgba(0, 229, 255, 0.4)',
    pulse: true,
  },
  offline: {
    icon: '⚡',
    label: { es: 'Sin conexión', en: 'Offline', zh: '离线' },
    color: '#FF6B6B',
    bgColor: 'rgba(255, 107, 107, 0.1)',
    borderColor: 'rgba(255, 107, 107, 0.3)',
    pulse: true,
  },
  error: {
    icon: '⚠',
    label: { es: 'Error de sync', en: 'Sync error', zh: '同步错误' },
    color: '#FF6B6B',
    bgColor: 'rgba(255, 107, 107, 0.1)',
    borderColor: 'rgba(255, 107, 107, 0.3)',
    pulse: false,
  },
};

interface OfflineSyncIndicatorProps {
  language?: 'es' | 'en' | 'zh';
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  showAlways?: boolean;
}

export function OfflineSyncIndicator({
  language = 'es',
  position = 'bottom-left',
  showAlways = false,
}: OfflineSyncIndicatorProps) {
  const {
    syncStatus,
    isOnline,
    pendingCount,
    lastSyncAt,
    lastError,
    forceSync,
  } = useOfflineProgress();

  const [expanded, setExpanded] = useState(false);

  // Don't show if synced and not forced to show always
  if (!showAlways && syncStatus === 'synced' && isOnline && pendingCount === 0) {
    return null;
  }

  const config = STATUS_CONFIG[syncStatus];
  const lang = language as 'es' | 'en' | 'zh';

  const positionClasses: Record<string, string> = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-20 left-4',
    'top-right': 'top-20 right-4',
  };

  const formatTime = (ts: number | null) => {
    if (!ts) return language === 'es' ? 'Nunca' : language === 'zh' ? '从未' : 'Never';
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return language === 'es' ? 'Hace un momento' : language === 'zh' ? '刚刚' : 'Just now';
    if (diff < 3600) {
      const mins = Math.floor(diff / 60);
      return language === 'es' ? `Hace ${mins} min` : language === 'zh' ? `${mins}分钟前` : `${mins} min ago`;
    }
    return new Date(ts).toLocaleTimeString();
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 transition-all duration-300`}
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {/* Expanded panel */}
      {expanded && (
        <div
          className="mb-2 rounded-lg p-3 text-xs shadow-lg backdrop-blur-md"
          style={{
            background: 'rgba(10, 10, 10, 0.95)',
            border: `1px solid ${config.borderColor}`,
            minWidth: '220px',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-white text-sm">
              {language === 'es' ? 'Estado de Sync' : language === 'zh' ? '同步状态' : 'Sync Status'}
            </span>
            <button
              onClick={() => setExpanded(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-gray-400">
                {language === 'es' ? 'Conexión' : language === 'zh' ? '连接' : 'Connection'}
              </span>
              <span style={{ color: isOnline ? '#00E5FF' : '#FF6B6B' }}>
                {isOnline
                  ? (language === 'es' ? 'Online' : language === 'zh' ? '在线' : 'Online')
                  : (language === 'es' ? 'Offline' : language === 'zh' ? '离线' : 'Offline')}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">
                {language === 'es' ? 'Pendientes' : language === 'zh' ? '待处理' : 'Pending'}
              </span>
              <span style={{ color: pendingCount > 0 ? '#D4A843' : '#00E5FF' }}>
                {pendingCount}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">
                {language === 'es' ? 'Última sync' : language === 'zh' ? '上次同步' : 'Last sync'}
              </span>
              <span className="text-gray-300">{formatTime(lastSyncAt)}</span>
            </div>

            {lastError && (
              <div className="mt-1 p-1.5 rounded text-[10px]" style={{ background: 'rgba(255,107,107,0.1)' }}>
                <span className="text-red-400">{lastError}</span>
              </div>
            )}

            {pendingCount > 0 && isOnline && (
              <button
                onClick={forceSync}
                disabled={syncStatus === 'syncing'}
                className="w-full mt-2 py-1.5 rounded text-xs font-semibold transition-all"
                style={{
                  background: syncStatus === 'syncing' ? 'rgba(0,229,255,0.1)' : 'rgba(0,229,255,0.2)',
                  color: '#00E5FF',
                  border: '1px solid rgba(0,229,255,0.3)',
                  cursor: syncStatus === 'syncing' ? 'not-allowed' : 'pointer',
                }}
              >
                {syncStatus === 'syncing'
                  ? (language === 'es' ? 'Sincronizando...' : language === 'zh' ? '同步中...' : 'Syncing...')
                  : (language === 'es' ? 'Sincronizar ahora' : language === 'zh' ? '立即同步' : 'Sync now')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Compact badge */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-lg backdrop-blur-md hover:scale-105"
        style={{
          background: config.bgColor,
          border: `1px solid ${config.borderColor}`,
          color: config.color,
        }}
      >
        <span
          className={config.pulse ? 'animate-pulse' : ''}
          style={{ fontSize: '14px' }}
        >
          {config.icon}
        </span>
        <span>{config.label[lang]}</span>
        {pendingCount > 0 && (
          <span
            className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
            style={{
              background: config.color,
              color: '#0A0A0A',
            }}
          >
            {pendingCount}
          </span>
        )}
      </button>
    </div>
  );
}
