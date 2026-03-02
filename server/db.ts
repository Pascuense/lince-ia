import { desc, eq, sql, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, promptCreations, InsertPromptCreation, gamePlayers, InsertGamePlayer, GamePlayer, legalAcceptances, InsertLegalAcceptance, LegalAcceptance, customCourses, InsertCustomCourse, CustomCourse, toolViews, InsertToolView, ToolView, chatSessions, InsertChatSession, ChatSession, chatMessages, InsertChatMessage, ChatMessage } from "../drizzle/schema";
import { ENV } from './_core/env';
import bcrypt from "bcryptjs";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ─── Game Players Queries ───

const BCRYPT_SALT_ROUNDS = 12;

export async function createGamePlayer(data: {
  email: string;
  username: string;
  realName: string;
  password: string;
  avatarKey: string;
  language: string;
  country?: string;
  instagramUser?: string;
  registrationCode?: string;
}): Promise<GamePlayer> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const passwordHash = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);

  const defaultLevels = [
    { id: 1, completed: false, stars: 0, promptsCompleted: 0, bestScore: 0 },
    { id: 2, completed: false, stars: 0, promptsCompleted: 0, bestScore: 0 },
    { id: 3, completed: false, stars: 0, promptsCompleted: 0, bestScore: 0 },
  ];
  const defaultDailyRewards = {
    lastClaimDate: "",
    consecutiveDays: 0,
    totalDaysClaimed: 0,
    weekProgress: [false, false, false, false, false, false, false],
  };

  await db.insert(gamePlayers).values({
    email: data.email.toLowerCase().trim(),
    username: data.username.toUpperCase().trim(),
    realName: data.realName.trim(),
    passwordHash,
    avatarKey: data.avatarKey,
    language: data.language,
    country: data.country || "ES",
    instagramUser: data.instagramUser || null,
    registrationCode: data.registrationCode || null,
    levelsData: defaultLevels,
    dailyRewardsData: defaultDailyRewards,
  });

  const rows = await db.select().from(gamePlayers).where(eq(gamePlayers.email, data.email.toLowerCase().trim())).limit(1);
  return rows[0];
}

export async function verifyGamePlayerLogin(email: string, password: string): Promise<GamePlayer | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const rows = await db.select().from(gamePlayers).where(eq(gamePlayers.email, email.toLowerCase().trim())).limit(1);
  if (rows.length === 0) return null;

  const player = rows[0];
  const valid = await bcrypt.compare(password, player.passwordHash);
  if (!valid) return null;

  // Update last login
  await db.update(gamePlayers).set({ lastLoginAt: new Date() }).where(eq(gamePlayers.id, player.id));
  return player;
}

export async function getGamePlayerById(id: number): Promise<GamePlayer | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const rows = await db.select().from(gamePlayers).where(eq(gamePlayers.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getGamePlayerByEmail(email: string): Promise<GamePlayer | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const rows = await db.select().from(gamePlayers).where(eq(gamePlayers.email, email.toLowerCase().trim())).limit(1);
  return rows[0] ?? null;
}

export async function getGamePlayerByUsername(username: string): Promise<GamePlayer | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const rows = await db.select().from(gamePlayers).where(eq(gamePlayers.username, username.toUpperCase().trim())).limit(1);
  return rows[0] ?? null;
}

export async function updateGamePlayerProgress(id: number, data: Partial<{
  linceCoins: number;
  xp: number;
  currentLevel: number;
  totalPromptsWritten: number;
  streak: number;
  lastPlayedDate: string;
  levelsData: Array<{ id: number; completed: boolean; stars: number; promptsCompleted: number; bestScore: number }>;
  dailyRewardsData: { lastClaimDate: string; consecutiveDays: number; totalDaysClaimed: number; weekProgress: boolean[] };
}>): Promise<GamePlayer | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(gamePlayers).set(data).where(eq(gamePlayers.id, id));
  const rows = await db.select().from(gamePlayers).where(eq(gamePlayers.id, id)).limit(1);
  return rows[0] ?? null;
}

/**
 * Compute the progressive unlock state for a player from their DB record.
 * Returns the unlock flags, XP, and level data needed by the frontend.
 */
export async function getPlayerUnlockState(playerId: number): Promise<{
  xp: number;
  currentLevel: number;
  levelsData: Array<{ id: number; completed: boolean; stars: number; promptsCompleted: number; bestScore: number }>;
  unlocks: Record<string, boolean>;
} | null> {
  const player = await getGamePlayerById(playerId);
  if (!player) return null;

  const levels = (player.levelsData as Array<{ id: number; completed: boolean; stars: number; promptsCompleted: number; bestScore: number }>) || [];
  const level1Done = levels.some(l => l.id === 1 && l.completed);
  const level2Done = levels.some(l => l.id === 2 && l.completed);
  const level3Done = levels.some(l => l.id === 3 && l.completed);
  const has500XP = player.xp >= 500;

  return {
    xp: player.xp,
    currentLevel: player.currentLevel,
    levelsData: levels,
    unlocks: {
      jugar: true,
      creaTuLincelin: true,
      personajes: true,
      perfil: true,
      recompensas: true,
      arsenalIA: level1Done,
      promptStudio: level1Done,
      promptear: level1Done,
      mundo: level2Done,
      raids: level3Done,
      academia: has500XP,
    },
  };
}

export async function updateGamePlayerLanguage(id: number, language: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(gamePlayers).set({ language }).where(eq(gamePlayers.id, id));
}

export async function updateGamePlayerAvatar(id: number, avatarKey: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(gamePlayers).set({ avatarKey }).where(eq(gamePlayers.id, id));
}

// ─── Prompt Studio Queries ───

export async function createPromptCreation(data: InsertPromptCreation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(promptCreations).values(data);
  const insertId = result[0].insertId;
  const rows = await db.select().from(promptCreations).where(eq(promptCreations.id, insertId)).limit(1);
  return rows[0];
}

export async function updatePromptCreation(id: number, data: Partial<InsertPromptCreation> & { imageUrl?: string | null; enhancedPrompt?: string | null; status?: "pending" | "generating" | "completed" | "failed"; errorMessage?: string | null }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(promptCreations).set(data).where(eq(promptCreations.id, id));
  const rows = await db.select().from(promptCreations).where(eq(promptCreations.id, id)).limit(1);
  return rows[0];
}

export async function getPromptCreationById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const rows = await db.select().from(promptCreations).where(eq(promptCreations.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function listPromptCreations(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(promptCreations).orderBy(desc(promptCreations.createdAt)).limit(limit).offset(offset);
}

export async function listUserPromptCreations(userId: number, limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(promptCreations).where(eq(promptCreations.userId, userId)).orderBy(desc(promptCreations.createdAt)).limit(limit).offset(offset);
}

// ─── Legal Acceptance Queries ───

export async function logLegalAcceptance(data: {
  termsVersion: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  browserLanguage?: string | null;
  screenResolution?: string | null;
  platform?: string | null;
  timezone?: string | null;
  fingerprint?: string | null;
  selectedLanguage?: string | null;
  referrer?: string | null;
  gamePlayerId?: number | null;
  userId?: number | null;
}): Promise<LegalAcceptance> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(legalAcceptances).values({
    termsVersion: data.termsVersion,
    ipAddress: data.ipAddress ?? null,
    userAgent: data.userAgent ?? null,
    browserLanguage: data.browserLanguage ?? null,
    screenResolution: data.screenResolution ?? null,
    platform: data.platform ?? null,
    timezone: data.timezone ?? null,
    fingerprint: data.fingerprint ?? null,
    selectedLanguage: data.selectedLanguage ?? null,
    referrer: data.referrer ?? null,
    gamePlayerId: data.gamePlayerId ?? null,
    userId: data.userId ?? null,
  });

  const insertId = result[0].insertId;
  const rows = await db.select().from(legalAcceptances).where(eq(legalAcceptances.id, insertId)).limit(1);
  return rows[0];
}

export async function getLegalAcceptances(limit = 100, offset = 0): Promise<LegalAcceptance[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(legalAcceptances).orderBy(desc(legalAcceptances.acceptedAt)).limit(limit).offset(offset);
}

export async function getLegalAcceptancesByFingerprint(fingerprint: string): Promise<LegalAcceptance[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(legalAcceptances).where(eq(legalAcceptances.fingerprint, fingerprint)).orderBy(desc(legalAcceptances.acceptedAt));
}

export async function getLegalAcceptanceCount(): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select({ count: sql<number>`count(*)` }).from(legalAcceptances);
  return result[0]?.count ?? 0;
}

// ─── Custom Courses Queries ───

export async function createCustomCourse(data: {
  gamePlayerId: number;
  title: string;
  description?: string;
  category: string;
  difficulty: string;
  targetAudience?: string;
  estimatedHours: number;
  courseData: InsertCustomCourse["courseData"];
  status?: "draft" | "published";
}): Promise<CustomCourse> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(customCourses).values({
    gamePlayerId: data.gamePlayerId,
    title: data.title,
    description: data.description ?? null,
    category: data.category,
    difficulty: data.difficulty,
    targetAudience: data.targetAudience ?? null,
    estimatedHours: data.estimatedHours,
    courseData: data.courseData,
    status: data.status ?? "draft",
  });

  const insertId = result[0].insertId;
  const rows = await db.select().from(customCourses).where(eq(customCourses.id, insertId)).limit(1);
  return rows[0];
}

export async function updateCustomCourse(id: number, gamePlayerId: number, data: Partial<{
  title: string;
  description: string | null;
  category: string;
  difficulty: string;
  targetAudience: string | null;
  estimatedHours: number;
  courseData: InsertCustomCourse["courseData"];
  status: "draft" | "published";
}>): Promise<CustomCourse | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(customCourses).set(data).where(and(eq(customCourses.id, id), eq(customCourses.gamePlayerId, gamePlayerId)));
  const rows = await db.select().from(customCourses).where(eq(customCourses.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function deleteCustomCourse(id: number, gamePlayerId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.delete(customCourses).where(and(eq(customCourses.id, id), eq(customCourses.gamePlayerId, gamePlayerId)));
  return (result[0].affectedRows ?? 0) > 0;
}

export async function listUserCourses(gamePlayerId: number, limit = 50, offset = 0): Promise<CustomCourse[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(customCourses).where(eq(customCourses.gamePlayerId, gamePlayerId)).orderBy(desc(customCourses.updatedAt)).limit(limit).offset(offset);
}

export async function getCustomCourseById(id: number): Promise<CustomCourse | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const rows = await db.select().from(customCourses).where(eq(customCourses.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function countUserCourses(gamePlayerId: number): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select({ count: sql<number>`count(*)` }).from(customCourses).where(eq(customCourses.gamePlayerId, gamePlayerId));
  return result[0]?.count ?? 0;
}

// ─── Tool Views Queries ───

export async function logToolView(data: { gamePlayerId: number; toolId: string; toolName: string }): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(toolViews).values({
    gamePlayerId: data.gamePlayerId,
    toolId: data.toolId,
    toolName: data.toolName,
  });
}

export async function countUserToolViews(gamePlayerId: number): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select({ count: sql<number>`count(*)` }).from(toolViews).where(eq(toolViews.gamePlayerId, gamePlayerId));
  return result[0]?.count ?? 0;
}

export async function listUserToolViews(gamePlayerId: number, limit = 50): Promise<ToolView[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(toolViews).where(eq(toolViews.gamePlayerId, gamePlayerId)).orderBy(desc(toolViews.viewedAt)).limit(limit);
}

export async function getUserDashboardStats(gamePlayerId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [promptCount] = await db.select({ count: sql<number>`count(*)` }).from(promptCreations).where(eq(promptCreations.userId, gamePlayerId));
  const [courseCount] = await db.select({ count: sql<number>`count(*)` }).from(customCourses).where(eq(customCourses.gamePlayerId, gamePlayerId));
  const [toolViewCount] = await db.select({ count: sql<number>`count(*)` }).from(toolViews).where(eq(toolViews.gamePlayerId, gamePlayerId));

  // Recent tool views (unique tools)
  const recentTools = await db.select({
    toolId: toolViews.toolId,
    toolName: toolViews.toolName,
    lastViewed: sql<Date>`MAX(${toolViews.viewedAt})`,
    viewCount: sql<number>`count(*)`,
  }).from(toolViews).where(eq(toolViews.gamePlayerId, gamePlayerId)).groupBy(toolViews.toolId, toolViews.toolName).orderBy(desc(sql`MAX(${toolViews.viewedAt})`)).limit(10);

  // Recent prompts
  const recentPrompts = await db.select().from(promptCreations).where(eq(promptCreations.userId, gamePlayerId)).orderBy(desc(promptCreations.createdAt)).limit(5);

  // Recent courses
  const recentCourses = await db.select().from(customCourses).where(eq(customCourses.gamePlayerId, gamePlayerId)).orderBy(desc(customCourses.updatedAt)).limit(5);

  return {
    totalPrompts: promptCount?.count ?? 0,
    totalCourses: courseCount?.count ?? 0,
    totalToolViews: toolViewCount?.count ?? 0,
    recentTools,
    recentPrompts,
    recentCourses,
  };
}

// P0-2: GDPR Account Deletion (Derecho de Supresión)
export async function deleteGamePlayerAccount(gamePlayerId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    await db.delete(promptCreations).where(eq(promptCreations.userId, gamePlayerId));
    await db.delete(customCourses).where(eq(customCourses.gamePlayerId, gamePlayerId));
    await db.delete(toolViews).where(eq(toolViews.gamePlayerId, gamePlayerId));
    await db.delete(legalAcceptances).where(eq(legalAcceptances.gamePlayerId, gamePlayerId));
    await db.delete(gamePlayers).where(eq(gamePlayers.id, gamePlayerId));
    return true;
  } catch (error) {
    console.error('[GDPR] Error deleting account:', error);
    return false;
  }
}


// ─── Chat Sessions & Messages ───

/**
 * Get or create a chat session for a player+avatar pair.
 * Returns the existing session if one exists, otherwise creates a new one.
 */
export async function getOrCreateChatSession(gamePlayerId: number, avatarKey: string): Promise<ChatSession | null> {
  const db = await getDb();
  if (!db) return null;

  // Try to find existing session
  const existing = await db.select().from(chatSessions)
    .where(and(
      eq(chatSessions.gamePlayerId, gamePlayerId),
      eq(chatSessions.avatarKey, avatarKey)
    ))
    .limit(1);

  if (existing.length > 0) return existing[0];

  // Create new session
  const [result] = await db.insert(chatSessions).values({
    gamePlayerId,
    avatarKey,
    messageCount: 0,
    relationshipLevel: "new",
  });

  const [newSession] = await db.select().from(chatSessions)
    .where(eq(chatSessions.id, result.insertId))
    .limit(1);

  return newSession || null;
}

/**
 * Save a message to a chat session and update session metadata.
 */
export async function saveChatMessage(
  sessionId: number,
  role: "user" | "assistant",
  content: string
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.insert(chatMessages).values({
    sessionId,
    role,
    content,
  });

  // Update session metadata
  const preview = content.length > 100 ? content.slice(0, 97) + "..." : content;
  await db.update(chatSessions)
    .set({
      messageCount: sql`${chatSessions.messageCount} + 1`,
      lastMessagePreview: preview,
    })
    .where(eq(chatSessions.id, sessionId));
}

/**
 * Update relationship level based on message count thresholds.
 * - new: 0-4 messages
 * - known: 5-14 messages
 * - friend: 15-29 messages
 * - best_friend: 30+ messages
 */
export async function updateRelationshipLevel(sessionId: number): Promise<string> {
  const db = await getDb();
  if (!db) return "new";

  const [session] = await db.select().from(chatSessions)
    .where(eq(chatSessions.id, sessionId))
    .limit(1);

  if (!session) return "new";

  let newLevel: "new" | "known" | "friend" | "best_friend" = "new";
  if (session.messageCount >= 30) newLevel = "best_friend";
  else if (session.messageCount >= 15) newLevel = "friend";
  else if (session.messageCount >= 5) newLevel = "known";

  if (newLevel !== session.relationshipLevel) {
    await db.update(chatSessions)
      .set({ relationshipLevel: newLevel })
      .where(eq(chatSessions.id, sessionId));
  }

  return newLevel;
}

/**
 * Get chat history for a session (last N messages).
 */
export async function getChatHistory(sessionId: number, limit = 20): Promise<ChatMessage[]> {
  const db = await getDb();
  if (!db) return [];

  // Get the last N messages ordered by creation
  const messages = await db.select().from(chatMessages)
    .where(eq(chatMessages.sessionId, sessionId))
    .orderBy(desc(chatMessages.createdAt))
    .limit(limit);

  // Return in chronological order
  return messages.reverse();
}

/**
 * List all chat sessions for a player, ordered by last activity.
 */
export async function listPlayerChatSessions(gamePlayerId: number): Promise<ChatSession[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(chatSessions)
    .where(eq(chatSessions.gamePlayerId, gamePlayerId))
    .orderBy(desc(chatSessions.updatedAt));
}

/**
 * Delete a chat session and all its messages.
 */
export async function deleteChatSession(sessionId: number, gamePlayerId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  // Verify ownership
  const [session] = await db.select().from(chatSessions)
    .where(and(
      eq(chatSessions.id, sessionId),
      eq(chatSessions.gamePlayerId, gamePlayerId)
    ))
    .limit(1);

  if (!session) return false;

  // Delete messages first, then session
  await db.delete(chatMessages).where(eq(chatMessages.sessionId, sessionId));
  await db.delete(chatSessions).where(eq(chatSessions.id, sessionId));

  return true;
}
