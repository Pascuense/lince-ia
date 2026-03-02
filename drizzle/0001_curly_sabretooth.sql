CREATE TABLE `prompt_creations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`subject` text NOT NULL,
	`style` varchar(128) NOT NULL,
	`environment` varchar(256) NOT NULL,
	`details` text,
	`enhancedPrompt` text,
	`imageUrl` text,
	`status` enum('pending','generating','completed','failed') NOT NULL DEFAULT 'pending',
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `prompt_creations_id` PRIMARY KEY(`id`)
);
