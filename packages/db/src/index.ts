import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema.js";

const defaultDatabaseUrl = "postgresql://postgres:postgres@localhost:5432/circuito";

export function createDb(connectionString = process.env["DATABASE_URL"] ?? defaultDatabaseUrl) {
  const client = postgres(connectionString);
  return drizzle(client, { schema });
}

export type Db = ReturnType<typeof createDb>;

export type {
  NewEvent,
  NewPark,
  NewTrail,
  Park,
  ParkEvent,
  ParkEventCategory,
  ParkEventStatus,
  ParkId,
  Trail,
  TrailDifficulty,
  TrailStatus,
} from "./schema.js";

export { events, parks, trails } from "./schema.js";
