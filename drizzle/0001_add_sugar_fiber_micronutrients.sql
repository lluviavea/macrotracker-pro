ALTER TABLE "foods" ADD COLUMN "sugar" numeric(10, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "foods" ADD COLUMN "fiber" numeric(10, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "foods" ADD COLUMN "micronutrients" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "log_entries" ADD COLUMN "sugar" numeric(10, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "log_entries" ADD COLUMN "fiber" numeric(10, 2) DEFAULT '0' NOT NULL;