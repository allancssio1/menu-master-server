ALTER TABLE "products" ALTER COLUMN "price" SET DATA TYPE integer USING price::integer;
ALTER TABLE "products" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "decimals" integer DEFAULT 2 NOT NULL;