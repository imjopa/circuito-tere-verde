import { index, integer, jsonb, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";

export const parks = pgTable(
  "parks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    type: text("type").notNull(),
    status: text("status").notNull(),
    description: text("description").notNull(),
    areaHectares: integer("area_hectares").notNull(),
    altitudeMeters: integer("altitude_meters").notNull(),
    openingHours: text("opening_hours").notNull(),
    entranceFeeCents: integer("entrance_fee_cents").notNull(),
    biodiversity: jsonb("biodiversity").$type<string[]>().notNull(),
    highlights: jsonb("highlights").$type<string[]>().notNull(),
  },
  (table) => [index("parks_name_idx").on(table.name), uniqueIndex("parks_slug_idx").on(table.slug)],
);

export type Park = typeof parks.$inferSelect;
export type NewPark = typeof parks.$inferInsert;
