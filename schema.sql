-- ============================================================
-- LINCE — Schema SQL Completo para Azure MySQL
-- Servidor: lince-db-acnb.mysql.database.azure.com
-- Base de datos: lince_db
-- Generado: 2026-02-20
-- ============================================================

CREATE DATABASE IF NOT EXISTS `lince_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `lince_db`;

-- ─── 1. USERS (Admin auth via JWT/bcrypt) ───
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(320) NOT NULL,
  `passwordHash` VARCHAR(255) NOT NULL,
  `name` TEXT,
  `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastSignedIn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 2. GAME PLAYERS ───
CREATE TABLE IF NOT EXISTS `game_players` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(320) NOT NULL,
  `username` VARCHAR(64) NOT NULL,
  `realName` VARCHAR(128) NOT NULL,
  `passwordHash` VARCHAR(256) NOT NULL,
  `avatarKey` VARCHAR(32) NOT NULL DEFAULT 'PEQUELIN',
  `language` VARCHAR(5) NOT NULL DEFAULT 'es',
  `linceCoins` INT NOT NULL DEFAULT 0,
  `xp` INT NOT NULL DEFAULT 0,
  `currentLevel` INT NOT NULL DEFAULT 1,
  `totalPromptsWritten` INT NOT NULL DEFAULT 0,
  `streak` INT NOT NULL DEFAULT 0,
  `lastPlayedDate` VARCHAR(10) NOT NULL DEFAULT '',
  `levelsData` JSON,
  `dailyRewardsData` JSON,
  `country` VARCHAR(5) NOT NULL DEFAULT 'ES',
  `instagramUser` VARCHAR(128),
  `registrationCode` VARCHAR(64),
  `emailVerified` INT NOT NULL DEFAULT 0,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastLoginAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `game_players_email_unique` (`email`),
  UNIQUE KEY `game_players_username_unique` (`username`),
  INDEX `idx_gameplayers_country` (`country`),
  INDEX `idx_gameplayers_xp` (`xp`),
  INDEX `idx_gameplayers_created` (`createdAt`),
  INDEX `idx_gameplayers_level` (`currentLevel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 3. PROMPT CREATIONS ───
CREATE TABLE IF NOT EXISTS `prompt_creations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT,
  `subject` TEXT NOT NULL,
  `style` VARCHAR(128) NOT NULL,
  `environment` VARCHAR(256) NOT NULL,
  `details` TEXT,
  `enhancedPrompt` TEXT,
  `imageUrl` TEXT,
  `status` ENUM('pending', 'generating', 'completed', 'failed') NOT NULL DEFAULT 'pending',
  `errorMessage` TEXT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_prompts_userid` (`userId`),
  INDEX `idx_prompts_status` (`status`),
  INDEX `idx_prompts_created` (`createdAt`),
  INDEX `idx_prompts_userid_created` (`userId`, `createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 4. LEGAL ACCEPTANCES ───
CREATE TABLE IF NOT EXISTS `legal_acceptances` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `termsVersion` VARCHAR(16) NOT NULL,
  `ipAddress` VARCHAR(64),
  `userAgent` TEXT,
  `browserLanguage` VARCHAR(16),
  `screenResolution` VARCHAR(32),
  `platform` VARCHAR(64),
  `timezone` VARCHAR(64),
  `fingerprint` VARCHAR(128),
  `selectedLanguage` VARCHAR(5),
  `referrer` TEXT,
  `gamePlayerId` INT,
  `userId` INT,
  `acceptedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_legal_fingerprint` (`fingerprint`),
  INDEX `idx_legal_accepted` (`acceptedAt`),
  INDEX `idx_legal_playerid` (`gamePlayerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 5. CUSTOM COURSES ───
CREATE TABLE IF NOT EXISTS `custom_courses` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `gamePlayerId` INT,
  `title` VARCHAR(256) NOT NULL,
  `description` TEXT,
  `category` VARCHAR(32) NOT NULL DEFAULT 'ia',
  `difficulty` VARCHAR(32) NOT NULL DEFAULT 'beginner',
  `targetAudience` TEXT,
  `estimatedHours` INT NOT NULL DEFAULT 0,
  `courseData` JSON,
  `status` ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_courses_playerid` (`gamePlayerId`),
  INDEX `idx_courses_status` (`status`),
  INDEX `idx_courses_updated` (`updatedAt`),
  INDEX `idx_courses_player_updated` (`gamePlayerId`, `updatedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 6. TOOL VIEWS ───
CREATE TABLE IF NOT EXISTS `tool_views` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `gamePlayerId` INT,
  `toolId` VARCHAR(64) NOT NULL,
  `toolName` VARCHAR(128) NOT NULL,
  `viewedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_toolviews_playerid` (`gamePlayerId`),
  INDEX `idx_toolviews_toolid` (`toolId`),
  INDEX `idx_toolviews_viewed` (`viewedAt`),
  INDEX `idx_toolviews_player_viewed` (`gamePlayerId`, `viewedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 7. CHAT SESSIONS ───
CREATE TABLE IF NOT EXISTS `chat_sessions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `gamePlayerId` INT NOT NULL,
  `avatarKey` VARCHAR(64) NOT NULL,
  `messageCount` INT NOT NULL DEFAULT 0,
  `relationshipLevel` ENUM('new', 'known', 'friend', 'best_friend') NOT NULL DEFAULT 'new',
  `lastMessagePreview` VARCHAR(256),
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_chatsessions_player` (`gamePlayerId`),
  INDEX `idx_chatsessions_avatar` (`avatarKey`),
  INDEX `idx_chatsessions_player_avatar` (`gamePlayerId`, `avatarKey`),
  INDEX `idx_chatsessions_updated` (`updatedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 8. CHAT MESSAGES ───
CREATE TABLE IF NOT EXISTS `chat_messages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sessionId` INT NOT NULL,
  `role` ENUM('user', 'assistant') NOT NULL DEFAULT 'user',
  `content` TEXT NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_chatmessages_session` (`sessionId`),
  INDEX `idx_chatmessages_session_created` (`sessionId`, `createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 9. PUSH SUBSCRIPTIONS ───
CREATE TABLE IF NOT EXISTS `push_subscriptions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `gamePlayerId` INT NOT NULL,
  `endpoint` TEXT NOT NULL,
  `p256dh` TEXT NOT NULL,
  `auth` TEXT NOT NULL,
  `userAgent` VARCHAR(512),
  `active` INT NOT NULL DEFAULT 1,
  `preferences` JSON,
  `lastPushedAt` TIMESTAMP NULL,
  `failureCount` INT NOT NULL DEFAULT 0,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_pushsub_playerid` (`gamePlayerId`),
  INDEX `idx_pushsub_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- FIN DEL SCHEMA
-- ============================================================
