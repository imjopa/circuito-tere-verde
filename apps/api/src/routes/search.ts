import { parks, trails, waterfalls } from "@circuito/db";
import type { Db } from "@circuito/db";
import { ilike, or, sql } from "drizzle-orm";
import { Hono } from "hono";

export function createSearchRoutes(db: Db) {
  const app = new Hono();

  app.get("/", async (c) => {
    const q = c.req.query("q")?.trim() ?? "";

    if (q.length < 2) {
      return c.json({ parks: [], trails: [], waterfalls: [], total: 0 });
    }

    const pattern = `%${q}%`;

    const [matchedParks, matchedTrails, matchedWaterfalls] = await Promise.all([
      db
        .select()
        .from(parks)
        .where(
          or(
            ilike(parks.name, pattern),
            ilike(parks.type, pattern),
            sql`${parks.biodiversity}::text ilike ${pattern}`,
          ),
        ),
      db
        .select()
        .from(trails)
        .where(
          or(
            ilike(trails.name, pattern),
            ilike(trails.parkName, pattern),
            ilike(trails.difficulty, pattern),
          ),
        ),
      db
        .select()
        .from(waterfalls)
        .where(or(ilike(waterfalls.name, pattern), ilike(waterfalls.parkName, pattern))),
    ]);

    return c.json({
      parks: matchedParks,
      trails: matchedTrails,
      waterfalls: matchedWaterfalls,
      total: matchedParks.length + matchedTrails.length + matchedWaterfalls.length,
    });
  });

  return app;
}
