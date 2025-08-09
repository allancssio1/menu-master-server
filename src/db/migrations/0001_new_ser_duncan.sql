ALTER TABLE "orderItems" ADD COLUMN "price" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "orderItems" ADD COLUMN "decimals" integer DEFAULT 2 NOT NULL;