import { boolean, index, integer, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { parks } from "./park.js";

export const waterfallAccess = ["easy", "medium", "hard"] as const;
export type WaterfallAccess = (typeof waterfallAccess)[number];

export const waterfalls = pgTable(
  "waterfalls",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    parkId: uuid("park_id")
      .notNull()
      .references(() => parks.id),
    parkName: text("park_name").notNull(),
    heightMeters: integer("height_meters").notNull(),
    access: text("access", { enum: waterfallAccess }).notNull(),
    allowsBathing: boolean("allows_bathing").notNull(),
    description: text("description").notNull(),
    accessibility: text("accessibility").notNull(),
    howToGet: text("how_to_get").notNull(),
    tips: jsonb("tips").$type<string[]>().notNull(),
  },
  (table) => [
    index("waterfalls_park_id_idx").on(table.parkId),
    index("waterfalls_access_idx").on(table.access),
    index("waterfalls_allows_bathing_idx").on(table.allowsBathing),
  ],
);

export type Waterfall = typeof waterfalls.$inferSelect;
export type NewWaterfall = typeof waterfalls.$inferInsert;
