import { doublePrecision, integer, jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const parks = pgTable("parks", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  description: text("description").notNull(),
  area: text("area").notNull(),
  altitude: text("altitude").notNull(),
  openingHours: text("opening_hours").notNull(),
  entranceFee: text("entrance_fee").notNull(),
  biodiversity: jsonb("biodiversity").$type<string[]>().notNull(),
  highlights: jsonb("highlights").$type<string[]>().notNull(),
});

export const trails = pgTable("trails", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  parkId: text("park_id")
    .notNull()
    .references(() => parks.id),
  parkName: text("park_name").notNull(),
  difficulty: text("difficulty", { enum: ["easy", "medium", "hard"] }).notNull(),
  distance: doublePrecision("distance").notNull(),
  duration: text("duration").notNull(),
  altitude: integer("altitude").notNull(),
  status: text("status", {
    enum: ["open", "closed", "maintenance", "climate_risk", "full"],
  }).notNull(),
  description: text("description").notNull(),
  conditions: text("conditions").notNull(),
  tips: jsonb("tips").$type<string[]>().notNull(),
});

export const events = pgTable("events", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  park: text("park").notNull(),
  parkId: text("park_id")
    .notNull()
    .references(() => parks.id),
  date: text("date").notNull(),
  time: text("time").notNull(),
  duration: text("duration").notNull(),
  category: text("category", {
    enum: ["guided_trail", "education", "volunteer", "workshop"],
  }).notNull(),
  categoryLabel: text("category_label").notNull(),
  status: text("status", { enum: ["open", "few_spots", "full", "cancelled"] }).notNull(),
  spots: integer("spots").notNull(),
  spotsLeft: integer("spots_left").notNull(),
  description: text("description").notNull(),
  requirements: jsonb("requirements").$type<string[]>().notNull(),
  price: text("price").notNull(),
});

export type ParkId = "serra-dos-orgaos" | "tres-picos" | "montanhas-teresopolis";
export type Park = typeof parks.$inferSelect;
export type NewPark = typeof parks.$inferInsert;

export type TrailDifficulty = "easy" | "medium" | "hard";
export type TrailStatus = "open" | "closed" | "maintenance" | "climate_risk" | "full";
export type Trail = typeof trails.$inferSelect;
export type NewTrail = typeof trails.$inferInsert;

export type ParkEventCategory = "guided_trail" | "education" | "volunteer" | "workshop";
export type ParkEventStatus = "open" | "few_spots" | "full" | "cancelled";
export type ParkEvent = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
