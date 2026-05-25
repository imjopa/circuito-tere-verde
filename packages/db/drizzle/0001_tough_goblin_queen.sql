ALTER TABLE "events" ALTER COLUMN "park_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "trails" ALTER COLUMN "park_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "waterfalls" ALTER COLUMN "park_id" SET DATA TYPE uuid;--> statement-breakpoint
CREATE INDEX "parks_status_idx" ON "parks" USING btree ("status");