import { useState } from 'react';
import { Bell, BellOff, Flame, Target, Gift, Moon, Send, Wifi, WifiOff } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useServerPush } from '@/hooks/useServerPush';

const T: Record<string, Record<string, string>> = {
  es: {
    title: 'Notificaciones',
    status: 'Estado',
    enabled: 'Activadas',
    disabled: 'Desactivadas',
    blocked: 'Bloqueadas',
    enable: 'Activar',
    streakReminder: 'Recordatorio de racha',
    streakDesc: 'Te avisamos si no has jugado hoy',
    missionAlerts: 'Alertas de misiones',
    missionDesc: 'Nuevas misiones de bienvenida disponibles',
    dailyReward: 'Recompensa diaria',
    dailyRewardDesc: 'Recuerda reclamar tu recompensa',
    quietHours: 'Horas de silencio',
    quietDesc: 'No enviar notificaciones entre estas horas',
    from: 'Desde',
    to: 'Hasta',
    serverPush: 'Notificaciones del servidor',
    serverPushDesc: 'Recibe alertas incluso con la app cerrada',
    serverConnected: 'Conectado al servidor',
    serverDisconnected: 'No conectado',
    connecting: 'Conectando...',
    connect: 'Conectar',
    disconnect: 'Desconectar',
    testNotif: 'Enviar prueba',
    testSent: '¡Notificación de prueba enviada!',
    testFailed: 'Error al enviar. Verifica tu conexión.',
  },
  en: {
    title: 'Notifications',
    status: 'Status',
    enabled: 'Enabled',
    disabled: 'Disabled',
    blocked: 'Blocked',
    enable: 'Enable',
    streakReminder: 'Streak reminder',
    streakDesc: "We'll remind you if you haven't played today",
    missionAlerts: 'Mission alerts',
    missionDesc: 'New welcome missions available',
    dailyReward: 'Daily reward',
    dailyRewardDesc: 'Remember to claim your reward',
    quietHours: 'Quiet hours',
    quietDesc: "Don't send notifications between these hours",
    from: 'From',
    to: 'To',
    serverPush: 'Server notifications',
    serverPushDesc: 'Receive alerts even when the app is closed',
    serverConnected: 'Connected to server',
    serverDisconnected: 'Not connected',
    connecting: 'Connecting...',
    connect: 'Connect',
    disconnect: 'Disconnect',
    testNotif: 'Send test',
    testSent: 'Test notification sent!',
    testFailed: 'Failed to send. Check your connection.',
  },
  zh: {
    title: '通知',
    status: '状态',
    enabled: '已启用',
    disabled: '未启用',
    blocked: '已阻止',
    enable: '启用',
    streakReminder: '连续提醒',
    streakDesc: '如果你今天没有玩，我们会提醒你',
    missionAlerts: '任务提醒',
    missionDesc: '新的欢迎任务可用',
    dailyReward: '每日奖励',
    dailyRewardDesc: '记得领取你的奖励',
    quietHours: '安静时间',
    quietDesc: '在这些时间内不发送通知',
    from: '从',
    to: '到',
    serverPush: '服务器通知',
    serverPushDesc: '即使应用关闭也能接收提醒',
    serverConnected: '已连接到服务器',
    serverDisconnected: '未连接',
    connecting: '连接中...',
    connect: '连接',
    disconnect: '断开',
    testNotif: '发送测试',
    testSent: '测试通知已发送！',
    testFailed: '发送失败。请检查连接。',
  },
};

interface NotificationSettingsProps {
  lang?: 'es' | 'en' | 'zh';
  playerId?: number | null;
}

export function NotificationSettings({ lang = 'es', playerId = null }: NotificationSettingsProps) {
  const { permission, config, updateConfig, requestPermission, isSupported: localSupported } = useNotifications();
  const serverPush = useServerPush(playerId || null);
  const t = T[lang] || T.es;
  const [testMsg, setTestMsg] = useState<string | null>(null);

  if (!localSupported) return null;

  const isActive = permission === 'granted';

  const handleServerToggle = async () => {
    if (serverPush.isSubscribed) {
      await serverPush.unsubscribe();
    } else {
      await serverPush.subscribe({
        streakReminder: config.streakReminder,
        missionAlerts: config.missionAlerts,
        dailyRewardReminder: config.dailyRewardReminder,
        quietHoursStart: config.quietHoursStart,
        quietHoursEnd: config.quietHoursEnd,
      });
    }
  };

  const handleTest = async () => {
    const success = await serverPush.sendTest();
    setTestMsg(success ? t.testSent : t.testFailed);
    setTimeout(() => setTestMsg(null), 3000);
  };

  const handlePrefChange = (key: string, value: boolean | number) => {
    updateConfig({ [key]: value });
    // Sync to server if subscribed
    if (serverPush.isSubscribed) {
      const newConfig = { ...config, [key]: value };
      serverPush.updatePreferences({
        streakReminder: newConfig.streakReminder,
        missionAlerts: newConfig.missionAlerts,
        dailyRewardReminder: newConfig.dailyRewardReminder,
        quietHoursStart: newConfig.quietHoursStart,
        quietHoursEnd: newConfig.quietHoursEnd,
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-display font-bold text-lg flex items-center gap-2">
        <Bell className="w-5 h-5 text-[oklch(0.82_0.15_195)]" />
        {t.title}
      </h3>

      {/* Permission status */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
        <div className="flex items-center gap-3">
          {isActive ? (
            <Bell className="w-5 h-5 text-emerald-400" />
          ) : (
            <BellOff className="w-5 h-5 text-gray-500" />
          )}
          <div>
            <p className="text-sm font-medium">{t.status}</p>
            <p className={`text-xs ${isActive ? 'text-emerald-400' : permission === 'denied' ? 'text-red-400' : 'text-gray-500'}`}>
              {isActive ? t.enabled : permission === 'denied' ? t.blocked : t.disabled}
            </p>
          </div>
        </div>
        {permission === 'default' && (
          <button
            onClick={requestPermission}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[oklch(0.82_0.15_195)] text-black hover:brightness-110 transition-all"
          >
            {t.enable}
          </button>
        )}
      </div>

      {/* Server Push Status */}
      {isActive && playerId && serverPush.isSupported && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center gap-3">
            {serverPush.isSubscribed ? (
              <Wifi className="w-5 h-5 text-emerald-400" />
            ) : (
              <WifiOff className="w-5 h-5 text-gray-500" />
            )}
            <div>
              <p className="text-sm font-medium">{t.serverPush}</p>
              <p className={`text-xs ${serverPush.isSubscribed ? 'text-emerald-400' : 'text-gray-500'}`}>
                {serverPush.isLoading ? t.connecting : serverPush.isSubscribed ? t.serverConnected : t.serverDisconnected}
              </p>
              <p className="text-[10px] text-gray-600 mt-0.5">{t.serverPushDesc}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {serverPush.isSubscribed && (
              <button
                onClick={handleTest}
                disabled={serverPush.isLoading}
                className="px-2 py-1 text-[10px] font-medium rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                {t.testNotif}
              </button>
            )}
            <button
              onClick={handleServerToggle}
              disabled={serverPush.isLoading}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                serverPush.isSubscribed
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                  : 'bg-[oklch(0.82_0.15_195)] text-black hover:brightness-110'
              }`}
            >
              {serverPush.isLoading ? '...' : serverPush.isSubscribed ? t.disconnect : t.connect}
            </button>
          </div>
        </div>
      )}

      {/* Test notification feedback */}
      {testMsg && (
        <div className={`p-2 rounded-lg text-xs text-center ${testMsg === t.testSent ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {testMsg}
        </div>
      )}

      {/* Toggle options */}
      <div className="space-y-2">
        <ToggleRow
          icon={<Flame className="w-4 h-4 text-orange-400" />}
          label={t.streakReminder}
          desc={t.streakDesc}
          checked={config.streakReminder}
          onChange={(v) => handlePrefChange('streakReminder', v)}
          disabled={!isActive}
        />
        <ToggleRow
          icon={<Target className="w-4 h-4 text-[oklch(0.82_0.15_195)]" />}
          label={t.missionAlerts}
          desc={t.missionDesc}
          checked={config.missionAlerts}
          onChange={(v) => handlePrefChange('missionAlerts', v)}
          disabled={!isActive}
        />
        <ToggleRow
          icon={<Gift className="w-4 h-4 text-amber-400" />}
          label={t.dailyReward}
          desc={t.dailyRewardDesc}
          checked={config.dailyRewardReminder}
          onChange={(v) => handlePrefChange('dailyRewardReminder', v)}
          disabled={!isActive}
        />
      </div>

      {/* Quiet hours */}
      <div className={`p-3 rounded-xl bg-white/[0.03] border border-white/5 ${!isActive ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex items-center gap-2 mb-2">
          <Moon className="w-4 h-4 text-indigo-400" />
          <p className="text-sm font-medium">{t.quietHours}</p>
        </div>
        <p className="text-xs text-gray-500 mb-3">{t.quietDesc}</p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400">{t.from}</span>
            <select
              value={config.quietHoursStart}
              onChange={(e) => handlePrefChange('quietHoursStart', Number(e.target.value))}
              className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{String(i).padStart(2, '0')}:00</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400">{t.to}</span>
            <select
              value={config.quietHoursEnd}
              onChange={(e) => handlePrefChange('quietHoursEnd', Number(e.target.value))}
              className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{String(i).padStart(2, '0')}:00</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Toggle Row ───
function ToggleRow({
  icon,
  label,
  desc,
  checked,
  onChange,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled: boolean;
}) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>
      </div>
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`w-11 h-6 rounded-full transition-all relative ${
          checked ? 'bg-[oklch(0.82_0.15_195)]' : 'bg-white/10'
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
            checked ? 'translate-x-5.5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}
