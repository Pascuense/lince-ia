import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   */
  id: int("id").autoincrement().primaryKey(),
  /** User email — unique identifier for login */
  email: varchar("email", { length: 320 }).notNull().unique(),
  /** Bcrypt-hashed password */
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  name: text("name"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * LINCE game players table.
 * Stores player registration, avatar, game progress, and currency.
 * This is the SINGLE SOURCE OF TRUTH for player data — replaces localStorage.
 *
 * INDEXES:
 * - PK on id (auto)
 * - UNIQUE on email (auto)
 * - UNIQUE on username (auto)
 * - idx_gameplayers_country: for leaderboard/analytics queries by country
 * - idx_gameplayers_xp: for leaderboard ranking queries (ORDER BY xp DESC)
 * - idx_gameplayers_created: for registration analytics (ORDER BY createdAt)
 * - idx_gameplayers_level: for level distribution analytics
 */
export const gamePlayers = mysqlTable("game_players", {
  id: int("id").autoincrement().primaryKey(),
  /** Email used for registration */
  email: varchar("email", { length: 320 }).notNull().unique(),
  /** LINCE username (ends in -LIN or -LINA). LOCKED after registration. */
  username: varchar("username", { length: 64 }).notNull().unique(),
  /** Real name of the player */
  realName: varchar("realName", { length: 128 }).notNull(),
  /** Hashed password (bcrypt) */
  passwordHash: varchar("passwordHash", { length: 256 }).notNull(),
  /** Selected avatar key (e.g., YAYALIN, PAPALIN, CHAVALIN, etc.) */
  avatarKey: varchar("avatarKey", { length: 32 }).notNull().default("PEQUELIN"),
  /** Preferred language: es, en, zh */
  language: varchar("language", { length: 5 }).notNull().default("es"),
  /** LinceCoins balance */
  linceCoins: int("linceCoins").notNull().default(0),
  /** Experience points */
  xp: int("xp").notNull().default(0),
  /** Current level (1-based) */
  currentLevel: int("currentLevel").notNull().default(1),
  /** Total prompts written */
  totalPromptsWritten: int("totalPromptsWritten").notNull().default(0),
  /** Current streak (consecutive days) */
  streak: int("streak").notNull().default(0),
  /** Last date played (YYYY-MM-DD) */
  lastPlayedDate: varchar("lastPlayedDate", { length: 10 }).notNull().default(""),
  /** Level completion data (JSON array of LevelState objects) */
  levelsData: json("levelsData").$type<Array<{ id: number; completed: boolean; stars: number; promptsCompleted: number; bestScore: number }>>(),
  /** Daily rewards state (JSON) */
  dailyRewardsData: json("dailyRewardsData").$type<{
    lastClaimDate: string;
    consecutiveDays: number;
    totalDaysClaimed: number;
    weekProgress: boolean[];
  }>(),
  /** Country code (ISO 3166-1 alpha-2, e.g., ES, CL, US, CN) */
  country: varchar("country", { length: 5 }).notNull().default("ES"),
  /** Instagram username (e.g., @yongbryel) */
  instagramUser: varchar("instagramUser", { length: 128 }),
  /** Referral/registration code (e.g., CL-VIVETE-001, ES-ACNB-001) */
  registrationCode: varchar("registrationCode", { length: 64 }),
  /** Whether email has been verified (0 or 1) */
  emailVerified: int("emailVerified").notNull().default(0),
  /** Registration timestamp */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  /** Last update */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  /** Last login */
  lastLoginAt: timestamp("lastLoginAt").defaultNow().notNull(),
}, (table) => [
  index("idx_gameplayers_country").on(table.country),
  index("idx_gameplayers_xp").on(table.xp),
  index("idx_gameplayers_created").on(table.createdAt),
  index("idx_gameplayers_level").on(table.currentLevel),
]);

export type GamePlayer = typeof gamePlayers.$inferSelect;
export type InsertGamePlayer = typeof gamePlayers.$inferInsert;

/**
 * Prompt Studio creations table.
 * Stores the 4 simplified fields, the enhanced prompt, and the generated image URL.
 *
 * INDEXES:
 * - idx_prompts_userid: for listing user's prompt history
 * - idx_prompts_status: for filtering by status
 * - idx_prompts_created: for ordering by creation date
 * - idx_prompts_userid_created: composite for user's prompts sorted by date
 */
export const promptCreations = mysqlTable("prompt_creations", {
  id: int("id").autoincrement().primaryKey(),
  /** Who created this prompt (nullable for anonymous/demo usage) */
  userId: int("userId"),
  /** Field 1: What do you want to create? (subject) */
  subject: text("subject").notNull(),
  /** Field 2: Visual style (realistic, cartoon, watercolor, etc.) */
  style: varchar("style", { length: 128 }).notNull(),
  /** Field 3: Environment/setting (studio, nature, city, space, etc.) */
  environment: varchar("environment", { length: 256 }).notNull(),
  /** Field 4: Additional details (colors, mood, specific elements) */
  details: text("details"),
  /** The AI-enhanced full prompt generated from the 4 fields */
  enhancedPrompt: text("enhancedPrompt"),
  /** URL of the generated image stored in S3 */
  imageUrl: text("imageUrl"),
  /** Status: pending, generating, completed, failed */
  status: mysqlEnum("status", ["pending", "generating", "completed", "failed"]).default("pending").notNull(),
  /** Error message if generation failed */
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("idx_prompts_userid").on(table.userId),
  index("idx_prompts_status").on(table.status),
  index("idx_prompts_created").on(table.createdAt),
  index("idx_prompts_userid_created").on(table.userId, table.createdAt),
]);

export type PromptCreation = typeof promptCreations.$inferSelect;
export type InsertPromptCreation = typeof promptCreations.$inferInsert;

/**
 * Legal acceptances table.
 * Stores evidence of every user who accepted the NDA/IP/Terms gate.
 * This provides legal proof of acceptance for ACNB IA SL.
 *
 * INDEXES:
 * - idx_legal_fingerprint: for checking if a device already accepted
 * - idx_legal_accepted: for ordering by acceptance date
 * - idx_legal_playerid: for finding acceptances by player
 */
export const legalAcceptances = mysqlTable("legal_acceptances", {
  id: int("id").autoincrement().primaryKey(),
  /** Version of the terms accepted (e.g., "2.0") */
  termsVersion: varchar("termsVersion", { length: 16 }).notNull(),
  /** IP address of the visitor */
  ipAddress: varchar("ipAddress", { length: 64 }),
  /** User-Agent string from the browser */
  userAgent: text("userAgent"),
  /** Browser language (navigator.language) */
  browserLanguage: varchar("browserLanguage", { length: 16 }),
  /** Screen resolution (e.g., "1920x1080") */
  screenResolution: varchar("screenResolution", { length: 32 }),
  /** Platform (e.g., "Win32", "MacIntel", "Linux armv8l") */
  platform: varchar("platform", { length: 64 }),
  /** Timezone (e.g., "Europe/Madrid") */
  timezone: varchar("timezone", { length: 64 }),
  /** Device fingerprint hash (combination of multiple browser signals) */
  fingerprint: varchar("fingerprint", { length: 128 }),
  /** Language selected in the gate (es, en, zh) */
  selectedLanguage: varchar("selectedLanguage", { length: 5 }),
  /** Referrer URL */
  referrer: text("referrer"),
  /** If the user was logged in, their game player ID */
  gamePlayerId: int("gamePlayerId"),
  /** If the user was logged in via Manus OAuth, their user ID */
  userId: int("userId"),
  /** Timestamp of acceptance */
  acceptedAt: timestamp("acceptedAt").defaultNow().notNull(),
}, (table) => [
  index("idx_legal_fingerprint").on(table.fingerprint),
  index("idx_legal_accepted").on(table.acceptedAt),
  index("idx_legal_playerid").on(table.gamePlayerId),
]);

export type LegalAcceptance = typeof legalAcceptances.$inferSelect;
export type InsertLegalAcceptance = typeof legalAcceptances.$inferInsert;

/**
 * Custom courses created by users via Course Builder.
 * Persists course designs so users don't lose their work.
 *
 * INDEXES:
 * - idx_courses_playerid: for listing a player's courses
 * - idx_courses_status: for filtering published courses
 * - idx_courses_updated: for ordering by last update
 * - idx_courses_player_updated: composite for player's courses sorted by update
 */
export const customCourses = mysqlTable("custom_courses", {
  id: int("id").autoincrement().primaryKey(),
  /** Who created this course (game player ID) */
  gamePlayerId: int("gamePlayerId"),
  /** Course title */
  title: varchar("title", { length: 256 }).notNull(),
  /** Course description */
  description: text("description"),
  /** Category: ia, ml, prompt, auto, data, design, business, other */
  category: varchar("category", { length: 32 }).notNull().default("ia"),
  /** Difficulty: beginner, intermediate, advanced */
  difficulty: varchar("difficulty", { length: 32 }).notNull().default("beginner"),
  /** Target audience description */
  targetAudience: text("targetAudience"),
  /** Estimated hours */
  estimatedHours: int("estimatedHours").notNull().default(0),
  /** Full course data as JSON (modules, lessons, etc.) */
  courseData: json("courseData").$type<{
    modules: Array<{
      id: string;
      title: string;
      description: string;
      lessons: Array<{
        id: string;
        title: string;
        type: string;
        duration: number;
        description: string;
      }>;
    }>;
  }>(),
  /** Status: draft, published */
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("idx_courses_playerid").on(table.gamePlayerId),
  index("idx_courses_status").on(table.status),
  index("idx_courses_updated").on(table.updatedAt),
  index("idx_courses_player_updated").on(table.gamePlayerId, table.updatedAt),
]);

export type CustomCourse = typeof customCourses.$inferSelect;
export type InsertCustomCourse = typeof customCourses.$inferInsert;

/**
 * Tool views tracking for Arsenal IA dashboard stats.
 *
 * INDEXES:
 * - idx_toolviews_playerid: for listing a player's tool views
 * - idx_toolviews_toolid: for analytics per tool
 * - idx_toolviews_viewed: for ordering by view date
 * - idx_toolviews_player_viewed: composite for player's views sorted by date
 */
export const toolViews = mysqlTable("tool_views", {
  id: int("id").autoincrement().primaryKey(),
  /** Game player who viewed the tool */
  gamePlayerId: int("gamePlayerId"),
  /** Tool ID from Arsenal IA */
  toolId: varchar("toolId", { length: 64 }).notNull(),
  /** Tool name */
  toolName: varchar("toolName", { length: 128 }).notNull(),
  viewedAt: timestamp("viewedAt").defaultNow().notNull(),
}, (table) => [
  index("idx_toolviews_playerid").on(table.gamePlayerId),
  index("idx_toolviews_toolid").on(table.toolId),
  index("idx_toolviews_viewed").on(table.viewedAt),
  index("idx_toolviews_player_viewed").on(table.gamePlayerId, table.viewedAt),
]);

export type ToolView = typeof toolViews.$inferSelect;
export type InsertToolView = typeof toolViews.$inferInsert;

/**
 * Chat sessions table.
 * Each session represents a conversation between a player and an avatar.
 * One session per (player, avatar) pair — reopening continues the same conversation.
 *
 * INDEXES:
 * - idx_chatsessions_player: for listing a player's conversations
 * - idx_chatsessions_avatar: for analytics per avatar
 * - idx_chatsessions_player_avatar: composite unique for one session per pair
 * - idx_chatsessions_updated: for ordering by last activity
 */
export const chatSessions = mysqlTable("chat_sessions", {
  id: int("id").autoincrement().primaryKey(),
  /** Game player who owns this session */
  gamePlayerId: int("gamePlayerId").notNull(),
  /** Avatar key (e.g., YAYALIN, LUMALIN, etc.) */
  avatarKey: varchar("avatarKey", { length: 64 }).notNull(),
  /** Total messages in this session */
  messageCount: int("messageCount").notNull().default(0),
  /** Relationship level: new, known, friend, best_friend */
  relationshipLevel: mysqlEnum("relationshipLevel", ["new", "known", "friend", "best_friend"]).default("new").notNull(),
  /** Last message preview (truncated to 100 chars) */
  lastMessagePreview: varchar("lastMessagePreview", { length: 256 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("idx_chatsessions_player").on(table.gamePlayerId),
  index("idx_chatsessions_avatar").on(table.avatarKey),
  index("idx_chatsessions_player_avatar").on(table.gamePlayerId, table.avatarKey),
  index("idx_chatsessions_updated").on(table.updatedAt),
]);

export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = typeof chatSessions.$inferInsert;

/**
 * Chat messages table.
 * Stores individual messages within a chat session.
 * Messages are ordered by createdAt within a session.
 *
 * INDEXES:
 * - idx_chatmessages_session: for loading messages of a session
 * - idx_chatmessages_session_created: composite for ordered message loading
 */
export const chatMessages = mysqlTable("chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  /** Session this message belongs to */
  sessionId: int("sessionId").notNull(),
  /** Role: user or assistant */
  role: mysqlEnum("role", ["user", "assistant"]).default("user").notNull(),
  /** Message content */
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  index("idx_chatmessages_session").on(table.sessionId),
  index("idx_chatmessages_session_created").on(table.sessionId, table.createdAt),
]);

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

/**
 * Web Push subscriptions table.
 * Stores browser push subscription endpoints for server-side notifications.
 * Each player can have multiple subscriptions (multiple devices/browsers).
 *
 * INDEXES:
 * - idx_pushsub_playerid: for finding all subscriptions of a player
 * - idx_pushsub_endpoint: for deduplication and unsubscribe
 * - idx_pushsub_active: for filtering active subscriptions
 */
export const pushSubscriptions = mysqlTable("push_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  /** Game player who owns this subscription */
  gamePlayerId: int("gamePlayerId").notNull(),
  /** Push API endpoint URL */
  endpoint: text("endpoint").notNull(),
  /** p256dh key from PushSubscription.getKey('p256dh') */
  p256dh: text("p256dh").notNull(),
  /** auth key from PushSubscription.getKey('auth') */
  auth: text("auth").notNull(),
  /** User agent string for device identification */
  userAgent: varchar("userAgent", { length: 512 }),
  /** Whether this subscription is active */
  active: int("active").notNull().default(1),
  /** Notification preferences (JSON) */
  preferences: json("preferences").$type<{
    streakReminder: boolean;
    missionAlerts: boolean;
    dailyRewardReminder: boolean;
    quietHoursStart: number;
    quietHoursEnd: number;
  }>(),
  /** Last successful push timestamp */
  lastPushedAt: timestamp("lastPushedAt"),
  /** Number of consecutive failures (for cleanup) */
  failureCount: int("failureCount").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("idx_pushsub_playerid").on(table.gamePlayerId),
  index("idx_pushsub_active").on(table.active),
]);

export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type InsertPushSubscription = typeof pushSubscriptions.$inferInsert;
