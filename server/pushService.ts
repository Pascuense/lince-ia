/**
 * LINCE Server-Side Push Notification Service
 * Uses web-push with VAPID keys to send notifications to subscribed browsers.
 * Works even when the app is closed.
 */
import webpush from "web-push";
import { ENV } from "./env";
import { getDb } from "./db";
import { pushSubscriptions, gamePlayers } from "../drizzle/schema";
import { eq, and, sql } from "drizzle-orm";

// ─── Configure web-push with VAPID keys ───
if (ENV.vapidPublicKey && ENV.vapidPrivateKey) {
  webpush.setVapidDetails(
    "mailto:cristobal@acnb.es",
    ENV.vapidPublicKey,
    ENV.vapidPrivateKey
  );
  console.log("[PushService] VAPID keys configured");
} else {
  console.warn("[PushService] VAPID keys not configured — push notifications disabled");
}

// ─── Types ───
export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  actions?: Array<{ action: string; title: string }>;
}

interface SubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// ─── Subscription Management ───

/**
 * Save or update a push subscription for a player.
 * If the endpoint already exists for this player, update the keys.
 */
export async function savePushSubscription(
  gamePlayerId: number,
  subscription: SubscriptionData,
  userAgent?: string,
  preferences?: {
    streakReminder: boolean;
    missionAlerts: boolean;
    dailyRewardReminder: boolean;
    quietHoursStart: number;
    quietHoursEnd: number;
  }
): Promise<{ id: number }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if this endpoint already exists for this player
  const existing = await db
    .select({ id: pushSubscriptions.id })
    .from(pushSubscriptions)
    .where(
      and(
        eq(pushSubscriptions.gamePlayerId, gamePlayerId),
        sql`${pushSubscriptions.endpoint} = ${subscription.endpoint}`
      )
    )
    .limit(1);

  if (existing.length > 0) {
    // Update existing subscription
    await db
      .update(pushSubscriptions)
      .set({
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userAgent: userAgent || null,
        active: 1,
        failureCount: 0,
        preferences: preferences || null,
      })
      .where(eq(pushSubscriptions.id, existing[0].id));
    return { id: existing[0].id };
  }

  // Create new subscription
  const result = await db.insert(pushSubscriptions).values({
    gamePlayerId,
    endpoint: subscription.endpoint,
    p256dh: subscription.keys.p256dh,
    auth: subscription.keys.auth,
    userAgent: userAgent || null,
    active: 1,
    failureCount: 0,
    preferences: preferences || null,
  });

  return { id: Number(result[0].insertId) };
}

/**
 * Remove a push subscription by endpoint.
 */
export async function removePushSubscription(
  gamePlayerId: number,
  endpoint: string
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(pushSubscriptions)
    .set({ active: 0 })
    .where(
      and(
        eq(pushSubscriptions.gamePlayerId, gamePlayerId),
        sql`${pushSubscriptions.endpoint} = ${endpoint}`
      )
    );
}

/**
 * Update notification preferences for a subscription.
 */
export async function updateSubscriptionPreferences(
  gamePlayerId: number,
  endpoint: string,
  preferences: {
    streakReminder: boolean;
    missionAlerts: boolean;
    dailyRewardReminder: boolean;
    quietHoursStart: number;
    quietHoursEnd: number;
  }
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(pushSubscriptions)
    .set({ preferences })
    .where(
      and(
        eq(pushSubscriptions.gamePlayerId, gamePlayerId),
        sql`${pushSubscriptions.endpoint} = ${endpoint}`
      )
    );
}

// ─── Push Sending ───

/**
 * Send a push notification to a specific subscription.
 * Returns true if successful, false if failed (and marks subscription as failed).
 */
async function sendToSubscription(
  sub: { id: number; endpoint: string; p256dh: string; auth: string },
  payload: PushPayload
): Promise<boolean> {
  if (!ENV.vapidPublicKey || !ENV.vapidPrivateKey) return false;

  const pushSubscription: webpush.PushSubscription = {
    endpoint: sub.endpoint,
    keys: {
      p256dh: sub.p256dh,
      auth: sub.auth,
    },
  };

  try {
    await webpush.sendNotification(
      pushSubscription,
      JSON.stringify(payload),
      { TTL: 86400 } // 24 hours
    );

    // Mark success
    const dbInner = await getDb();
    if (dbInner) await dbInner
      .update(pushSubscriptions)
      .set({
        lastPushedAt: new Date(),
        failureCount: 0,
      })
      .where(eq(pushSubscriptions.id, sub.id));

    return true;
  } catch (error: any) {
    const statusCode = error?.statusCode;

    // 404 or 410 = subscription expired/invalid → deactivate
    const dbErr = await getDb();
    if (statusCode === 404 || statusCode === 410) {
      if (dbErr) await dbErr
        .update(pushSubscriptions)
        .set({ active: 0 })
        .where(eq(pushSubscriptions.id, sub.id));
      console.log(`[PushService] Subscription ${sub.id} expired (${statusCode}), deactivated`);
    } else {
      // Increment failure count
      if (dbErr) await dbErr
        .update(pushSubscriptions)
        .set({
          failureCount: sql`${pushSubscriptions.failureCount} + 1`,
        })
        .where(eq(pushSubscriptions.id, sub.id));
      console.warn(`[PushService] Push failed for sub ${sub.id}:`, error?.message || error);
    }

    return false;
  }
}

/**
 * Send a push notification to a specific player (all their active subscriptions).
 */
export async function sendPushToPlayer(
  gamePlayerId: number,
  payload: PushPayload
): Promise<{ sent: number; failed: number }> {
  const db = await getDb();
  if (!db) return { sent: 0, failed: 0 };

  const subs = await db
    .select({
      id: pushSubscriptions.id,
      endpoint: pushSubscriptions.endpoint,
      p256dh: pushSubscriptions.p256dh,
      auth: pushSubscriptions.auth,
      preferences: pushSubscriptions.preferences,
    })
    .from(pushSubscriptions)
    .where(
      and(
        eq(pushSubscriptions.gamePlayerId, gamePlayerId),
        eq(pushSubscriptions.active, 1)
      )
    );

  let sent = 0;
  let failed = 0;

  for (const sub of subs) {
    const success = await sendToSubscription(sub, payload);
    if (success) sent++;
    else failed++;
  }

  return { sent, failed };
}

/**
 * Send a push notification to all active subscriptions (broadcast).
 * Used for announcements or global events.
 */
export async function sendPushBroadcast(
  payload: PushPayload
): Promise<{ sent: number; failed: number }> {
  const db = await getDb();
  if (!db) return { sent: 0, failed: 0 };

  const subs = await db
    .select({
      id: pushSubscriptions.id,
      endpoint: pushSubscriptions.endpoint,
      p256dh: pushSubscriptions.p256dh,
      auth: pushSubscriptions.auth,
    })
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.active, 1));

  let sent = 0;
  let failed = 0;

  for (const sub of subs) {
    const success = await sendToSubscription(sub, payload);
    if (success) sent++;
    else failed++;
  }

  return { sent, failed };
}

// ─── Scheduled Notification Logic ───

/**
 * Check if current hour is within quiet hours for a subscription.
 */
function isInQuietHours(prefs: { quietHoursStart: number; quietHoursEnd: number } | null): boolean {
  if (!prefs) return false;
  const hour = new Date().getUTCHours(); // Note: server runs in UTC
  const { quietHoursStart, quietHoursEnd } = prefs;
  if (quietHoursStart > quietHoursEnd) {
    return hour >= quietHoursStart || hour < quietHoursEnd;
  }
  return hour >= quietHoursStart && hour < quietHoursEnd;
}

/**
 * Send streak reminders to all players who haven't played today.
 * Called by the scheduled job.
 */
export async function sendStreakReminders(): Promise<{ sent: number; skipped: number }> {
  const today = new Date().toISOString().split("T")[0];
  const db = await getDb();
  if (!db) return { sent: 0, skipped: 0 };

  // Find players with active subscriptions who haven't played today
  const playersWithSubs = await db
    .select({
      playerId: gamePlayers.id,
      streak: gamePlayers.streak,
      lastPlayedDate: gamePlayers.lastPlayedDate,
      language: gamePlayers.language,
      subId: pushSubscriptions.id,
      endpoint: pushSubscriptions.endpoint,
      p256dh: pushSubscriptions.p256dh,
      auth: pushSubscriptions.auth,
      preferences: pushSubscriptions.preferences,
    })
    .from(gamePlayers)
    .innerJoin(
      pushSubscriptions,
      and(
        eq(pushSubscriptions.gamePlayerId, gamePlayers.id),
        eq(pushSubscriptions.active, 1)
      )
    )
    .where(sql`${gamePlayers.lastPlayedDate} != ${today} OR ${gamePlayers.lastPlayedDate} = ''`);

  let sent = 0;
  let skipped = 0;

  for (const row of playersWithSubs) {
    // Check preferences
    if (row.preferences && !row.preferences.streakReminder) {
      skipped++;
      continue;
    }
    if (isInQuietHours(row.preferences)) {
      skipped++;
      continue;
    }

    const lang = row.language || "es";
    const streak = row.streak || 0;

    const titles: Record<string, string> = {
      es: "¡No pierdas tu racha! 🔥",
      en: "Don't lose your streak! 🔥",
      zh: "不要断了你的连续记录！🔥",
    };
    const bodies: Record<string, string> = {
      es: streak > 0
        ? `Llevas ${streak} días seguidos aprendiendo IA. ¡No pares ahora!`
        : "¡Empieza una nueva racha hoy! Entra y juega para aprender IA.",
      en: streak > 0
        ? `You've been learning AI for ${streak} days straight. Don't stop now!`
        : "Start a new streak today! Log in and play to learn AI.",
      zh: streak > 0
        ? `你已经连续${streak}天学习AI了。不要停下来！`
        : "今天开始新的连续记录！登录并玩游戏学习AI。",
    };

    const success = await sendToSubscription(
      { id: row.subId, endpoint: row.endpoint, p256dh: row.p256dh, auth: row.auth },
      {
        title: titles[lang] || titles.es,
        body: bodies[lang] || bodies.es,
        url: "/jugar",
        tag: "streak-reminder",
      }
    );

    if (success) sent++;
    else skipped++;
  }

  console.log(`[PushService] Streak reminders: ${sent} sent, ${skipped} skipped`);
  return { sent, skipped };
}

/**
 * Send daily reward reminders to players who haven't claimed today.
 */
export async function sendDailyRewardReminders(): Promise<{ sent: number; skipped: number }> {
  const today = new Date().toISOString().split("T")[0];

  const db2 = await getDb();
  if (!db2) return { sent: 0, skipped: 0 };

  const playersWithSubs = await db2
    .select({
      playerId: gamePlayers.id,
      language: gamePlayers.language,
      dailyRewardsData: gamePlayers.dailyRewardsData,
      subId: pushSubscriptions.id,
      endpoint: pushSubscriptions.endpoint,
      p256dh: pushSubscriptions.p256dh,
      auth: pushSubscriptions.auth,
      preferences: pushSubscriptions.preferences,
    })
    .from(gamePlayers)
    .innerJoin(
      pushSubscriptions,
      and(
        eq(pushSubscriptions.gamePlayerId, gamePlayers.id),
        eq(pushSubscriptions.active, 1)
      )
    );

  let sent = 0;
  let skipped = 0;

  for (const row of playersWithSubs) {
    // Check if already claimed today
    const dr = row.dailyRewardsData as any;
    if (dr && dr.lastClaimDate === today) {
      skipped++;
      continue;
    }

    if (row.preferences && !row.preferences.dailyRewardReminder) {
      skipped++;
      continue;
    }
    if (isInQuietHours(row.preferences)) {
      skipped++;
      continue;
    }

    const lang = row.language || "es";
    const titles: Record<string, string> = {
      es: "¡Recompensa diaria lista! 🎁",
      en: "Daily reward ready! 🎁",
      zh: "每日奖励已就绪！🎁",
    };
    const bodies: Record<string, string> = {
      es: "Tu recompensa diaria te espera. ¡Reclámala antes de que termine el día!",
      en: "Your daily reward is waiting. Claim it before the day ends!",
      zh: "你的每日奖励在等你。在一天结束前领取吧！",
    };

    const success = await sendToSubscription(
      { id: row.subId, endpoint: row.endpoint, p256dh: row.p256dh, auth: row.auth },
      {
        title: titles[lang] || titles.es,
        body: bodies[lang] || bodies.es,
        url: "/recompensas",
        tag: "reward-reminder",
      }
    );

    if (success) sent++;
    else skipped++;
  }

  console.log(`[PushService] Reward reminders: ${sent} sent, ${skipped} skipped`);
  return { sent, skipped };
}

/**
 * Cleanup expired/failed subscriptions (failure count > 5).
 */
export async function cleanupExpiredSubscriptions(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .delete(pushSubscriptions)
    .where(
      sql`${pushSubscriptions.active} = 0 OR ${pushSubscriptions.failureCount} > 5`
    );

  const count = (result as any)[0]?.affectedRows || 0;
  if (count > 0) {
    console.log(`[PushService] Cleaned up ${count} expired subscriptions`);
  }
  return count;
}
