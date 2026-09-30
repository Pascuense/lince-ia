import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Types ───
export type NotificationPermissionState = 'default' | 'granted' | 'denied';

interface NotificationConfig {
  streakReminder: boolean;     // Daily streak reminder
  missionAlerts: boolean;      // New mission available alerts
  dailyRewardReminder: boolean; // Unclaimed daily reward
  levelUpCelebration: boolean; // Level up celebration
  newContentAlert: boolean;    // New content/challenges available
  weeklyProgress: boolean;     // Weekly progress summary
  challengeReminder: boolean;  // Daily challenge reminder
  inactivityNudge: boolean;    // Inactivity nudge after 3+ days
  quietHoursStart: number;     // 0-23 hour (default 22)
  quietHoursEnd: number;       // 0-23 hour (default 8)
}

const DEFAULT_CONFIG: NotificationConfig = {
  streakReminder: true,
  missionAlerts: true,
  dailyRewardReminder: true,
  levelUpCelebration: true,
  newContentAlert: true,
  weeklyProgress: true,
  challengeReminder: true,
  inactivityNudge: true,
  quietHoursStart: 22,
  quietHoursEnd: 8,
};

const STORAGE_KEY = 'lince-notification-config';
const LAST_STREAK_NOTIF_KEY = 'lince-last-streak-notif';
const LAST_MISSION_NOTIF_KEY = 'lince-last-mission-notif';
const LAST_REWARD_NOTIF_KEY = 'lince-last-reward-notif';
const LAST_LEVELUP_NOTIF_KEY = 'lince-last-levelup-notif';
const LAST_NEWCONTENT_NOTIF_KEY = 'lince-last-newcontent-notif';
const LAST_WEEKLY_NOTIF_KEY = 'lince-last-weekly-notif';
const LAST_CHALLENGE_NOTIF_KEY = 'lince-last-challenge-notif';
const LAST_INACTIVITY_NOTIF_KEY = 'lince-last-inactivity-notif';

// ─── Translations ───
const T: Record<string, Record<string, string>> = {
  es: {
    streakTitle: '¡No pierdas tu racha! 🔥',
    streakBody: 'Llevas {streak} días seguidos aprendiendo IA. ¡No pares ahora!',
    streakBodyZero: '¡Empieza una nueva racha hoy! Entra y juega para aprender IA.',
    missionTitle: '¡Nuevas misiones disponibles! 🎯',
    missionBody: 'Tienes {count} misiones de bienvenida por completar. ¡Gana LinceCoins!',
    rewardTitle: '¡Recompensa diaria lista! 🎁',
    rewardBody: 'Tu recompensa diaria te espera. ¡Reclámala antes de que termine el día!',
    permissionTitle: 'Activar Notificaciones',
    permissionDesc: 'Recibe recordatorios de tu racha diaria y nuevas misiones.',
    enable: 'Activar',
    later: 'Más tarde',
    denied: 'Notificaciones bloqueadas. Actívalas en la configuración de tu navegador.',
  },
  en: {
    streakTitle: "Don't lose your streak! 🔥",
    streakBody: "You've been learning AI for {streak} days straight. Don't stop now!",
    streakBodyZero: 'Start a new streak today! Log in and play to learn AI.',
    missionTitle: 'New missions available! 🎯',
    missionBody: 'You have {count} welcome missions to complete. Earn LinceCoins!',
    rewardTitle: 'Daily reward ready! 🎁',
    rewardBody: 'Your daily reward is waiting. Claim it before the day ends!',
    levelUpTitle: 'You leveled up! \u2b50',
    levelUpBody: 'Congratulations! You reached level {level}. Keep it up!',
    newContentTitle: 'New content available! \u2728',
    newContentBody: 'There are {count} new challenges waiting for you. Discover them!',
    weeklyTitle: 'Your weekly summary \ud83d\udcca',
    weeklyBody: 'This week you earned {xp} XP and completed {challenges} challenges. Keep improving!',
    challengeTitle: 'Daily challenge available! \u26a1',
    challengeBody: 'A new challenge awaits you today. Complete it and earn rewards!',
    inactivityTitle: 'We miss you! \ud83d\udc4b',
    inactivityBody: "It's been {days} days since we saw you. Come back and keep learning AI!",
    permissionTitle: 'Enable Notifications',
    permissionDesc: 'Get reminders for your daily streak and new missions.',
    enable: 'Enable',
    later: 'Later',
    denied: 'Notifications blocked. Enable them in your browser settings.',
  },
  zh: {
    streakTitle: '不要断了你的连续记录！🔥',
    streakBody: '你已经连续{streak}天学习AI了。不要停下来！',
    streakBodyZero: '今天开始新的连续记录！登录并玩游戏学习AI。',
    missionTitle: '新任务可用！🎯',
    missionBody: '你有{count}个欢迎任务待完成。赚取LinceCoins！',
    rewardTitle: '每日奖励已就绪！🎁',
    rewardBody: '你的每日奖励在等你。在一天结束前领取吧！',
    permissionTitle: '启用通知',
    permissionDesc: '接收每日连续和新任务的提醒。',
    enable: '启用',
    later: '稍后',
    denied: '通知已被阻止。请在浏览器设置中启用。',
  },
};

function getT(lang: string) {
  return T[lang] || T.es;
}

function isInQuietHours(config: NotificationConfig): boolean {
  const hour = new Date().getHours();
  if (config.quietHoursStart > config.quietHoursEnd) {
    // Wraps midnight: e.g., 22-8
    return hour >= config.quietHoursStart || hour < config.quietHoursEnd;
  }
  return hour >= config.quietHoursStart && hour < config.quietHoursEnd;
}

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

// ─── Hook ───
export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermissionState>(() => {
    if (typeof Notification === 'undefined') return 'denied';
    return Notification.permission as NotificationPermissionState;
  });

  const [config, setConfig] = useState<NotificationConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
    } catch { /* ignore */ }
    return DEFAULT_CONFIG;
  });

  const [showPrompt, setShowPrompt] = useState(false);
  const schedulerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Save config to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch { /* ignore */ }
  }, [config]);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<NotificationPermissionState> => {
    if (typeof Notification === 'undefined') return 'denied';

    try {
      const result = await Notification.requestPermission();
      setPermission(result as NotificationPermissionState);
      if (result === 'granted') {
        setShowPrompt(false);
      }
      return result as NotificationPermissionState;
    } catch {
      return 'denied';
    }
  }, []);

  // Show local notification
  const showNotification = useCallback((title: string, body: string, url: string = '/', tag?: string) => {
    if (permission !== 'granted') return;
    if (isInQuietHours(config)) return;

    // Try SW notification first (works when app is in background)
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        payload: { title, body, url, tag },
      });
    } else {
      // Fallback to Notification API
      try {
        new Notification(title, {
          body,
          icon: '/assets/ErVXkIKAFvfNHOyU.png',
          badge: '/assets/xnFQpNzJeJNRUUQe.png',
          tag: tag || 'lince-general',
          requireInteraction: false,
        });
      } catch { /* ignore */ }
    }
  }, [permission, config]);

  // Check and send streak reminder
  const checkStreakReminder = useCallback((streak: number, lang: string = 'es') => {
    if (!config.streakReminder) return;
    const today = getTodayKey();
    const lastNotif = localStorage.getItem(LAST_STREAK_NOTIF_KEY);
    if (lastNotif === today) return; // Already sent today

    const t = getT(lang);
    const body = streak > 0
      ? t.streakBody.replace('{streak}', String(streak))
      : t.streakBodyZero;

    showNotification(t.streakTitle, body, '/jugar', 'streak-reminder');
    localStorage.setItem(LAST_STREAK_NOTIF_KEY, today);
  }, [config.streakReminder, showNotification]);

  // Check and send mission alert
  const checkMissionAlert = useCallback((pendingMissions: number, lang: string = 'es') => {
    if (!config.missionAlerts || pendingMissions <= 0) return;
    const today = getTodayKey();
    const lastNotif = localStorage.getItem(LAST_MISSION_NOTIF_KEY);
    if (lastNotif === today) return;

    const t = getT(lang);
    const body = t.missionBody.replace('{count}', String(pendingMissions));
    showNotification(t.missionTitle, body, '/', 'mission-alert');
    localStorage.setItem(LAST_MISSION_NOTIF_KEY, today);
  }, [config.missionAlerts, showNotification]);

  // Check and send daily reward reminder
  const checkRewardReminder = useCallback((canClaim: boolean, lang: string = 'es') => {
    if (!config.dailyRewardReminder || !canClaim) return;
    const today = getTodayKey();
    const lastNotif = localStorage.getItem(LAST_REWARD_NOTIF_KEY);
    if (lastNotif === today) return;

    const t = getT(lang);
    showNotification(t.rewardTitle, t.rewardBody, '/recompensas', 'reward-reminder');
    localStorage.setItem(LAST_REWARD_NOTIF_KEY, today);
  }, [config.dailyRewardReminder, showNotification]);

  // Check and send level up celebration
  const checkLevelUpNotification = useCallback((level: number, lang: string = 'es') => {
    if (!config.levelUpCelebration) return;
    const key = `${LAST_LEVELUP_NOTIF_KEY}-${level}`;
    if (localStorage.getItem(key)) return; // Already notified for this level
    const t = getT(lang);
    showNotification(t.levelUpTitle, t.levelUpBody.replace('{level}', String(level)), '/mapa', 'level-up');
    localStorage.setItem(key, getTodayKey());
  }, [config.levelUpCelebration, showNotification]);

  // Check and send new content alert
  const checkNewContentAlert = useCallback((newChallengeCount: number, lang: string = 'es') => {
    if (!config.newContentAlert || newChallengeCount <= 0) return;
    const today = getTodayKey();
    const lastNotif = localStorage.getItem(LAST_NEWCONTENT_NOTIF_KEY);
    if (lastNotif === today) return;
    const t = getT(lang);
    showNotification(t.newContentTitle, t.newContentBody.replace('{count}', String(newChallengeCount)), '/reto-diario', 'new-content');
    localStorage.setItem(LAST_NEWCONTENT_NOTIF_KEY, today);
  }, [config.newContentAlert, showNotification]);

  // Check and send weekly progress summary (Sundays)
  const checkWeeklyProgress = useCallback((xp: number, challenges: number, lang: string = 'es') => {
    if (!config.weeklyProgress) return;
    const now = new Date();
    if (now.getDay() !== 0) return; // Only on Sundays
    const weekKey = `${now.getFullYear()}-W${Math.ceil(now.getDate() / 7)}`;
    const lastNotif = localStorage.getItem(LAST_WEEKLY_NOTIF_KEY);
    if (lastNotif === weekKey) return;
    const t = getT(lang);
    const body = t.weeklyBody.replace('{xp}', String(xp)).replace('{challenges}', String(challenges));
    showNotification(t.weeklyTitle, body, '/mapa', 'weekly-progress');
    localStorage.setItem(LAST_WEEKLY_NOTIF_KEY, weekKey);
  }, [config.weeklyProgress, showNotification]);

  // Check and send daily challenge reminder
  const checkChallengeReminder = useCallback((hasUncompletedChallenge: boolean, lang: string = 'es') => {
    if (!config.challengeReminder || !hasUncompletedChallenge) return;
    const today = getTodayKey();
    const lastNotif = localStorage.getItem(LAST_CHALLENGE_NOTIF_KEY);
    if (lastNotif === today) return;
    const t = getT(lang);
    showNotification(t.challengeTitle, t.challengeBody, '/reto-diario', 'challenge-reminder');
    localStorage.setItem(LAST_CHALLENGE_NOTIF_KEY, today);
  }, [config.challengeReminder, showNotification]);

  // Check and send inactivity nudge (3+ days without playing)
  const checkInactivityNudge = useCallback((lastPlayedDate: string | null, lang: string = 'es') => {
    if (!config.inactivityNudge || !lastPlayedDate) return;
    const today = getTodayKey();
    const lastNotif = localStorage.getItem(LAST_INACTIVITY_NOTIF_KEY);
    if (lastNotif === today) return;
    const lastPlayed = new Date(lastPlayedDate);
    const now = new Date();
    const daysSince = Math.floor((now.getTime() - lastPlayed.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince < 3) return; // Only nudge after 3+ days
    const t = getT(lang);
    showNotification(t.inactivityTitle, t.inactivityBody.replace('{days}', String(daysSince)), '/', 'inactivity-nudge');
    localStorage.setItem(LAST_INACTIVITY_NOTIF_KEY, today);
  }, [config.inactivityNudge, showNotification]);

  // Update individual config settings
  const updateConfig = useCallback((updates: Partial<NotificationConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  // Prompt user for permission (show after a delay, only once per session)
  const promptForPermission = useCallback(() => {
    if (permission === 'default') {
      setShowPrompt(true);
    }
  }, [permission]);

  const dismissPrompt = useCallback(() => {
    setShowPrompt(false);
    try {
      sessionStorage.setItem('lince-notif-prompt-dismissed', 'true');
    } catch { /* ignore */ }
  }, []);

  // Auto-prompt after user has been active for a while (only once per session)
  useEffect(() => {
    if (permission !== 'default') return;
    const dismissed = sessionStorage.getItem('lince-notif-prompt-dismissed');
    if (dismissed) return;

    // Show prompt after 60 seconds of activity
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 60000);

    return () => clearTimeout(timer);
  }, [permission]);

  // Cleanup scheduler on unmount
  useEffect(() => {
    return () => {
      if (schedulerRef.current) clearInterval(schedulerRef.current);
    };
  }, []);

  return {
    permission,
    config,
    showPrompt,
    requestPermission,
    showNotification,
    checkStreakReminder,
    checkMissionAlert,
    checkRewardReminder,
    checkLevelUpNotification,
    checkNewContentAlert,
    checkWeeklyProgress,
    checkChallengeReminder,
    checkInactivityNudge,
    updateConfig,
    promptForPermission,
    dismissPrompt,
    isSupported: typeof Notification !== 'undefined',
  };
}
