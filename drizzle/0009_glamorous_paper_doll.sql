CREATE TABLE `push_subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`gamePlayerId` int NOT NULL,
	`endpoint` text NOT NULL,
	`p256dh` text NOT NULL,
	`auth` text NOT NULL,
	`userAgent` varchar(512),
	`active` int NOT NULL DEFAULT 1,
	`preferences` json,
	`lastPushedAt` timestamp,
	`failureCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `push_subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `idx_pushsub_playerid` ON `push_subscriptions` (`gamePlayerId`);--> statement-breakpoint
CREATE INDEX `idx_pushsub_active` ON `push_subscriptions` (`active`);