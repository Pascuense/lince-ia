CREATE TABLE `legal_acceptances` (
	`id` int AUTO_INCREMENT NOT NULL,
	`termsVersion` varchar(16) NOT NULL,
	`ipAddress` varchar(64),
	`userAgent` text,
	`browserLanguage` varchar(16),
	`screenResolution` varchar(32),
	`platform` varchar(64),
	`timezone` varchar(64),
	`fingerprint` varchar(128),
	`selectedLanguage` varchar(5),
	`referrer` text,
	`gamePlayerId` int,
	`userId` int,
	`acceptedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `legal_acceptances_id` PRIMARY KEY(`id`)
);
