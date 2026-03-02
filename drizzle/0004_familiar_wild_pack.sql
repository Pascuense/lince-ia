CREATE TABLE `custom_courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`gamePlayerId` int,
	`title` varchar(256) NOT NULL,
	`description` text,
	`category` varchar(32) NOT NULL DEFAULT 'ia',
	`difficulty` varchar(32) NOT NULL DEFAULT 'beginner',
	`targetAudience` text,
	`estimatedHours` int NOT NULL DEFAULT 0,
	`courseData` json,
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `custom_courses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tool_views` (
	`id` int AUTO_INCREMENT NOT NULL,
	`gamePlayerId` int,
	`toolId` varchar(64) NOT NULL,
	`toolName` varchar(128) NOT NULL,
	`viewedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tool_views_id` PRIMARY KEY(`id`)
);
