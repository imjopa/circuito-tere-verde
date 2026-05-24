import { index, integer, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { parks } from "./park.js";

export const trailStatus = ["open", "closed", "maintenance", "climate_risk", "full"] as const;
export type TrailStatus = (typeof trailStatus)[number];

export const trailDifficulty = ["easy", "medium", "hard"] as const;
export type TrailDifficulty = (typeof trailDifficulty)[number];

export const trails = pgTable(
  "trails",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    parkId: uuid("park_id")
      .notNull()
      .references(() => parks.id),
    parkName: text("park_name").notNull(),
    difficulty: text("difficulty", { enum: trailDifficulty }).notNull(),
    distanceMeters: integer("distance_meters").notNull(),
    duration: text("duration").notNull(),
    altitudeMeters: integer("altitude_meters").notNull(),
    status: text("status", {
      enum: trailStatus,
    }).notNull(),
    description: text("description").notNull(),
    conditions: text("conditions").notNull(),
    tips: jsonb("tips").$type<string[]>().notNull(),
  },
  (table) => [
    index("trails_park_id_idx").on(table.parkId),
    index("trails_difficulty_idx").on(table.difficulty),
    index("trails_status_idx").on(table.status),
  ],
);

export type Trail = typeof trails.$inferSelect;
export type NewTrail = typeof trails.$inferInsert;
