/**
 * LINCE Push Notification Scheduler
 * Runs periodic tasks to send server-side push notifications:
 * - Streak reminders (every 4 hours, 10:00-22:00)
 * - Daily reward reminders (every 6 hours)
 * - Cleanup expired subscriptions (once daily)
 */
import {
  sendStreakReminders,
  sendDailyRewardReminders,
  cleanupExpiredSubscriptions,
} from "./pushService";

let streakInterval: ReturnType<typeof setInterval> | null = null;
let rewardInterval: ReturnType<typeof setInterval> | null = null;
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Start all scheduled push notification tasks.
 * Call this once when the server starts.
 */
export function startPushScheduler() {
  console.log("[PushScheduler] Starting scheduled push notification tasks...");

  // ─── Streak Reminders: every 4 hours ───
  streakInterval = setInterval(async () => {
    try {
      const hour = new Date().getUTCHours();
      // Only send between 8:00-22:00 UTC (roughly daytime for most users)
      if (hour < 8 || hour > 22) {
        console.log(`[PushScheduler] Skipping streak reminders (UTC hour: ${hour})`);
        return;
      }
      console.log("[PushScheduler] Sending streak reminders...");
      const result = await sendStreakReminders();
      console.log(`[PushScheduler] Streak reminders: ${result.sent} sent, ${result.skipped} skipped`);
    } catch (error) {
      console.error("[PushScheduler] Streak reminder error:", error);
    }
  }, 4 * 60 * 60 * 1000); // 4 hours

  // ─── Daily Reward Reminders: every 6 hours ───
  rewardInterval = setInterval(async () => {
    try {
      console.log("[PushScheduler] Sending daily reward reminders...");
      const result = await sendDailyRewardReminders();
      console.log(`[PushScheduler] Reward reminders: ${result.sent} sent, ${result.skipped} skipped`);
    } catch (error) {
      console.error("[PushScheduler] Reward reminder error:", error);
    }
  }, 6 * 60 * 60 * 1000); // 6 hours

  // ─── Cleanup expired subscriptions: every 24 hours ───
  cleanupInterval = setInterval(async () => {
    try {
      console.log("[PushScheduler] Cleaning up expired subscriptions...");
      const count = await cleanupExpiredSubscriptions();
      console.log(`[PushScheduler] Cleaned ${count} expired subscriptions`);
    } catch (error) {
      console.error("[PushScheduler] Cleanup error:", error);
    }
  }, 24 * 60 * 60 * 1000); // 24 hours

  // Run initial cleanup after 30 seconds (let server fully start)
  setTimeout(async () => {
    try {
      const count = await cleanupExpiredSubscriptions();
      if (count > 0) {
        console.log(`[PushScheduler] Initial cleanup: removed ${count} expired subscriptions`);
      }
    } catch (error) {
      console.error("[PushScheduler] Initial cleanup error:", error);
    }
  }, 30_000);

  console.log("[PushScheduler] Scheduled tasks started:");
  console.log("  - Streak reminders: every 4 hours (8:00-22:00 UTC)");
  console.log("  - Daily reward reminders: every 6 hours");
  console.log("  - Subscription cleanup: every 24 hours");
}

/**
 * Stop all scheduled push notification tasks.
 * Call this when the server shuts down.
 */
export function stopPushScheduler() {
  if (streakInterval) clearInterval(streakInterval);
  if (rewardInterval) clearInterval(rewardInterval);
  if (cleanupInterval) clearInterval(cleanupInterval);
  streakInterval = null;
  rewardInterval = null;
  cleanupInterval = null;
  console.log("[PushScheduler] All scheduled tasks stopped.");
}
