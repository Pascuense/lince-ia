CREATE TABLE `chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`role` enum('user','assistant') NOT NULL DEFAULT 'user',
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`gamePlayerId` int NOT NULL,
	`avatarKey` varchar(64) NOT NULL,
	`messageCount` int NOT NULL DEFAULT 0,
	`relationshipLevel` enum('new','known','friend','best_friend') NOT NULL DEFAULT 'new',
	`lastMessagePreview` varchar(256),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chat_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `idx_chatmessages_session` ON `chat_messages` (`sessionId`);--> statement-breakpoint
CREATE INDEX `idx_chatmessages_session_created` ON `chat_messages` (`sessionId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_chatsessions_player` ON `chat_sessions` (`gamePlayerId`);--> statement-breakpoint
CREATE INDEX `idx_chatsessions_avatar` ON `chat_sessions` (`avatarKey`);--> statement-breakpoint
CREATE INDEX `idx_chatsessions_player_avatar` ON `chat_sessions` (`gamePlayerId`,`avatarKey`);--> statement-breakpoint
CREATE INDEX `idx_chatsessions_updated` ON `chat_sessions` (`updatedAt`);