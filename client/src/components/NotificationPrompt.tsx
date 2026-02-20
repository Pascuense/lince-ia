import { Bell, BellOff, X } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

const T: Record<string, Record<string, string>> = {
  es: {
    title: 'Activar Notificaciones',
    desc: 'Recibe recordatorios de tu racha diaria, nuevas misiones y recompensas.',
    enable: 'Activar',
    later: 'Más tarde',
    denied: 'Notificaciones bloqueadas en tu navegador.',
    deniedHint: 'Para activarlas, ve a la configuración de tu navegador y permite notificaciones para este sitio.',
  },
  en: {
    title: 'Enable Notifications',
    desc: 'Get reminders for your daily streak, new missions and rewards.',
    enable: 'Enable',
    later: 'Later',
    denied: 'Notifications blocked in your browser.',
    deniedHint: 'To enable them, go to your browser settings and allow notifications for this site.',
  },
  zh: {
    title: '启用通知',
    desc: '接收每日连续、新任务和奖励的提醒。',
    enable: '启用',
    later: '稍后',
    denied: '通知已在浏览器中被阻止。',
    deniedHint: '要启用它们，请转到浏览器设置并允许此站点的通知。',
  },
};

interface NotificationPromptProps {
  lang?: 'es' | 'en' | 'zh';
}

export function NotificationPrompt({ lang = 'es' }: NotificationPromptProps) {
  const { permission, showPrompt, requestPermission, dismissPrompt, isSupported } = useNotifications();
  const t = T[lang] || T.es;

  if (!isSupported || !showPrompt) return null;

  if (permission === 'denied') {
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-[60] animate-in slide-in-from-bottom-4 duration-300">
        <div className="bg-[oklch(0.14_0.015_240)] border border-red-500/20 rounded-xl p-4 shadow-2xl shadow-black/50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <BellOff className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-400">{t.denied}</p>
              <p className="text-xs text-gray-500 mt-1">{t.deniedHint}</p>
            </div>
            <button onClick={dismissPrompt} className="text-gray-500 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (permission === 'granted') return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-[60] animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[oklch(0.14_0.015_240)] border border-[oklch(0.82_0.15_195)]/20 rounded-xl p-4 shadow-2xl shadow-black/50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[oklch(0.82_0.15_195)]/10 flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5 text-[oklch(0.82_0.15_195)]" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-white">{t.title}</h4>
            <p className="text-xs text-gray-400 mt-1">{t.desc}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={requestPermission}
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-[oklch(0.82_0.15_195)] text-black hover:brightness-110 transition-all"
              >
                {t.enable}
              </button>
              <button
                onClick={dismissPrompt}
                className="px-4 py-1.5 text-xs font-medium rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-all"
              >
                {t.later}
              </button>
            </div>
          </div>
          <button onClick={dismissPrompt} className="text-gray-500 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
