import { date, index, integer, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { parks } from "./park.js";

export const eventCategory = ["guided_trail", "education", "volunteer", "workshop"] as const;
export type ParkEventCategory = (typeof eventCategory)[number];

export const eventStatus = ["open", "few_spots", "full", "cancelled"] as const;
export type ParkEventStatus = (typeof eventStatus)[number];

export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    parkId: uuid("park_id")
      .notNull()
      .references(() => parks.id),
    date: date("date").notNull(),
    duration: text("duration").notNull(),
    category: text("category", {
      enum: eventCategory,
    }).notNull(),
    status: text("status", { enum: eventStatus }).notNull(),
    spots: integer("spots").notNull(),
    spotsLeft: integer("spots_left").notNull(),
    description: text("description").notNull(),
    priceCents: integer("price_cents").notNull(),
    requirements: jsonb("requirements").$type<string[]>().notNull(),
  },
  (table) => [index("events_category_idx").on(table.category)],
);

export type ParkEvent = typeof events.$inferSelect;
export type NewParkEvent = typeof events.$inferInsert;
