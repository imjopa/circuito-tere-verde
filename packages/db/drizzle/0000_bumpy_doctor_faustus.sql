CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"park_id" uuid NOT NULL,
	"date" date NOT NULL,
	"duration" text NOT NULL,
	"category" text NOT NULL,
	"status" text NOT NULL,
	"spots" integer NOT NULL,
	"spots_left" integer NOT NULL,
	"description" text NOT NULL,
	"price_cents" integer NOT NULL,
	"requirements" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"type" text NOT NULL,
	"status" text NOT NULL,
	"description" text NOT NULL,
	"area_hectares" integer NOT NULL,
	"altitude_meters" integer NOT NULL,
	"opening_hours" text NOT NULL,
	"entrance_fee_cents" integer NOT NULL,
	"biodiversity" jsonb NOT NULL,
	"highlights" jsonb NOT NULL,
	CONSTRAINT "parks_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "trails" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"park_id" uuid NOT NULL,
	"park_name" text NOT NULL,
	"difficulty" text NOT NULL,
	"distance_meters" integer NOT NULL,
	"duration" text NOT NULL,
	"altitude_meters" integer NOT NULL,
	"status" text NOT NULL,
	"description" text NOT NULL,
	"conditions" text NOT NULL,
	"tips" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "waterfalls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"park_id" uuid NOT NULL,
	"park_name" text NOT NULL,
	"height_meters" integer NOT NULL,
	"access" text NOT NULL,
	"allows_bathing" boolean NOT NULL,
	"description" text NOT NULL,
	"accessibility" text NOT NULL,
	"how_to_get" text NOT NULL,
	"tips" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_park_id_parks_id_fk" FOREIGN KEY ("park_id") REFERENCES "public"."parks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trails" ADD CONSTRAINT "trails_park_id_parks_id_fk" FOREIGN KEY ("park_id") REFERENCES "public"."parks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waterfalls" ADD CONSTRAINT "waterfalls_park_id_parks_id_fk" FOREIGN KEY ("park_id") REFERENCES "public"."parks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "events_category_idx" ON "events" USING btree ("category");--> statement-breakpoint
CREATE INDEX "parks_name_idx" ON "parks" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "parks_slug_idx" ON "parks" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "trails_park_id_idx" ON "trails" USING btree ("park_id");--> statement-breakpoint
CREATE INDEX "trails_difficulty_idx" ON "trails" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX "trails_status_idx" ON "trails" USING btree ("status");--> statement-breakpoint
CREATE INDEX "waterfalls_park_id_idx" ON "waterfalls" USING btree ("park_id");--> statement-breakpoint
CREATE INDEX "waterfalls_access_idx" ON "waterfalls" USING btree ("access");--> statement-breakpoint
CREATE INDEX "waterfalls_allows_bathing_idx" ON "waterfalls" USING btree ("allows_bathing");
