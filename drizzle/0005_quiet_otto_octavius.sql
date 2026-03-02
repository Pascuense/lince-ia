ALTER TABLE `game_players` ADD `country` varchar(5) DEFAULT 'ES' NOT NULL;--> statement-breakpoint
ALTER TABLE `game_players` ADD `registrationCode` varchar(64);