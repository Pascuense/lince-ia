import { useEffect, useRef } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { useGame } from '@/contexts/GameContext';

/**
 * NotificationScheduler - invisible component that runs notification checks.
 * 
 * It checks periodically (every 30 minutes) whether to send:
 * 1. Streak reminder — if user hasn't played today
 * 2. Mission alert — if there are uncompleted welcome missions
 * 3. Daily reward reminder — if reward is unclaimed
 * 4. Level up celebration — when user reaches a new level
 * 5. New content alert — when new challenges are available
 * 6. Weekly progress — summary every Sunday
 * 7. Challenge reminder — daily challenge not completed
 * 8. Inactivity nudge — after 3+ days without playing
 * 
 * All notifications respect quiet hours and daily limits (max 1 per type per day).
 */

const MISSION_KEYS = [
  'lince-mission-tutorial',
  'lince-mission-chat',
  'lince-mission-image',
  'lince-mission-arsenal',
  'lince-mission-lincelin',
];

function countPendingMissions(): number {
  let pending = 0;
  for (const key of MISSION_KEYS) {
    try {
      if (!localStorage.getItem(key)) pending++;
    } catch { /* ignore */ }
  }
  return pending;
}

interface NotificationSchedulerProps {
  lang?: string;
}

export function NotificationScheduler({ lang = 'es' }: NotificationSchedulerProps) {
  const {
    permission,
    checkStreakReminder,
    checkMissionAlert,
    checkRewardReminder,
    checkLevelUpNotification,
    checkNewContentAlert,
    checkWeeklyProgress,
    checkChallengeReminder,
    checkInactivityNudge,
  } = useNotifications();
  const { state, canClaimDailyReward: canClaimFn } = useGame();
  const canClaim = typeof canClaimFn === 'function' ? canClaimFn() : canClaimFn;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasRunRef = useRef(false);
  const lastLevelRef = useRef(state.currentLevel);

  // Track level changes for level-up notification
  useEffect(() => {
    if (permission !== 'granted') return;
    if (state.currentLevel > lastLevelRef.current) {
      checkLevelUpNotification(state.currentLevel, lang);
    }
    lastLevelRef.current = state.currentLevel;
  }, [state.currentLevel, permission, lang, checkLevelUpNotification]);

  useEffect(() => {
    if (permission !== 'granted') return;

    const runChecks = () => {
      const today = new Date().toISOString().split('T')[0];

      // 1. Streak reminder — if user hasn't played today
      if (state.lastPlayedDate !== today) {
        checkStreakReminder(state.streak, lang);
      }

      // 2. Mission alert — if there are pending missions
      const pendingMissions = countPendingMissions();
      if (pendingMissions > 0) {
        checkMissionAlert(pendingMissions, lang);
      }

      // 3. Daily reward reminder — if unclaimed
      if (canClaim) {
        checkRewardReminder(true, lang);
      }

      // 4. New content alert
      try {
        const lastKnownCount = parseInt(localStorage.getItem('lince-last-challenge-count') || '0', 10);
        const currentCount = 30;
        if (currentCount > lastKnownCount && lastKnownCount > 0) {
          checkNewContentAlert(currentCount - lastKnownCount, lang);
        }
        localStorage.setItem('lince-last-challenge-count', String(currentCount));
      } catch { /* ignore */ }

      // 5. Weekly progress summary (Sundays only)
      checkWeeklyProgress(state.xp, state.totalPromptsWritten || 0, lang);

      // 6. Daily challenge reminder
      try {
        const todayChallenge = localStorage.getItem('lince-reto-completed-' + today);
        if (!todayChallenge) {
          checkChallengeReminder(true, lang);
        }
      } catch { /* ignore */ }

      // 7. Inactivity nudge — if 3+ days without playing
      checkInactivityNudge(state.lastPlayedDate, lang);
    };

    // Run checks after a short delay on mount (not immediately to avoid annoying UX)
    if (!hasRunRef.current) {
      const initialDelay = setTimeout(() => {
        runChecks();
        hasRunRef.current = true;
      }, 5000); // 5 second delay

      // Then check every 30 minutes
      intervalRef.current = setInterval(runChecks, 30 * 60 * 1000);

      return () => {
        clearTimeout(initialDelay);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }

    // If already run, just set up interval
    intervalRef.current = setInterval(runChecks, 30 * 60 * 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [permission, state.lastPlayedDate, state.streak, state.xp, state.totalPromptsWritten, canClaim, lang,
    checkStreakReminder, checkMissionAlert, checkRewardReminder, checkNewContentAlert,
    checkWeeklyProgress, checkChallengeReminder, checkInactivityNudge]);

  // This component renders nothing — it's purely for side effects
  return null;
}
