CREATE TABLE "events" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"park" text NOT NULL,
	"park_id" text NOT NULL,
	"date" text NOT NULL,
	"time" text NOT NULL,
	"duration" text NOT NULL,
	"category" text NOT NULL,
	"category_label" text NOT NULL,
	"status" text NOT NULL,
	"spots" integer NOT NULL,
	"spots_left" integer NOT NULL,
	"description" text NOT NULL,
	"requirements" jsonb NOT NULL,
	"price" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parks" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"status" text NOT NULL,
	"description" text NOT NULL,
	"area" text NOT NULL,
	"altitude" text NOT NULL,
	"opening_hours" text NOT NULL,
	"entrance_fee" text NOT NULL,
	"biodiversity" jsonb NOT NULL,
	"highlights" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trails" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"park_id" text NOT NULL,
	"park_name" text NOT NULL,
	"difficulty" text NOT NULL,
	"distance" double precision NOT NULL,
	"duration" text NOT NULL,
	"altitude" integer NOT NULL,
	"status" text NOT NULL,
	"description" text NOT NULL,
	"conditions" text NOT NULL,
	"tips" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_park_id_parks_id_fk" FOREIGN KEY ("park_id") REFERENCES "public"."parks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trails" ADD CONSTRAINT "trails_park_id_parks_id_fk" FOREIGN KEY ("park_id") REFERENCES "public"."parks"("id") ON DELETE no action ON UPDATE no action;