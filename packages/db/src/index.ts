import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema/index.js";

const defaultDatabaseUrl = "postgresql://postgres:postgres@localhost:5432/circuito";

export function createDb(connectionString = process.env["DATABASE_URL"] ?? defaultDatabaseUrl) {
  const client = postgres(connectionString);
  return drizzle(client, { schema });
}

export type Db = ReturnType<typeof createDb>;

export type {
  NewParkEvent,
  NewPark,
  NewTrail,
  NewWaterfall,
  Park,
  ParkEvent,
  ParkEventCategory,
  ParkEventStatus,
  ParkStatus,
  Trail,
  TrailDifficulty,
  TrailStatus,
  Waterfall,
  WaterfallAccess,
} from "./schema/index.js";

export { events, parks, trails, waterfalls } from "./schema/index.js";
