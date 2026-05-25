import { parks, waterfalls, type NewWaterfall } from "@circuito/db";
import type { Db, WaterfallAccess } from "@circuito/db";
import { and, desc, eq, ilike, or, SQL, sql } from "drizzle-orm";
import { Hono } from "hono";

export function createWaterfallsRoutes(db: Db) {
  const app = new Hono();

  app.get("/", async (c) => {
    const parkSlug = c.req.query("park");
    const access = c.req.query("access");
    const searchQuery = c.req.query("q");

    const filters = [
      parkSlug && eq(parks.slug, parkSlug),
      access && eq(waterfalls.access, access as WaterfallAccess),
      searchQuery &&
        or(
          ilike(waterfalls.name, `%${searchQuery}%`),
          ilike(waterfalls.parkName, `%${searchQuery}%`),
          ilike(waterfalls.description, `%${searchQuery}%`),
          ilike(waterfalls.accessibility, `%${searchQuery}%`),
          ilike(waterfalls.howToGet, `%${searchQuery}%`),
          ilike(parks.name, `%${searchQuery}%`),
          sql`${waterfalls.tips}::text ilike ${`%${searchQuery}%`}`,
        ),
    ].filter((f): f is SQL => Boolean(f));

    const query = db
      .select()
      .from(waterfalls)
      .leftJoin(parks, eq(waterfalls.parkId, parks.id))
      .orderBy(desc(waterfalls.name));

    if (filters.length > 0) {
      query.where(and(...filters));
    }

    return c.json(
      (await query).map((r) => ({
        ...r.waterfalls,
        park: r.parks,
      })),
    );
  });

  app.get("/:id", async (c) => {
    const id = c.req.param("id");
    const [waterfall] = await db.select().from(waterfalls).where(eq(waterfalls.id, id));
    if (!waterfall) return c.json({ error: "Cachoeira não encontrada" }, 404);
    return c.json(waterfall);
  });

  app.post("/", async (c) => {
    const body = await c.req.json<NewWaterfall>();
    const [created] = await db.insert(waterfalls).values(body).returning();
    return c.json(created, 201);
  });

  app.patch("/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json<Partial<NewWaterfall>>();
    const [updated] = await db
      .update(waterfalls)
      .set(body)
      .where(eq(waterfalls.id, id))
      .returning();
    if (!updated) return c.json({ error: "Cachoeira não encontrada" }, 404);
    return c.json(updated);
  });

  app.delete("/:id", async (c) => {
    const id = c.req.param("id");
    const [deleted] = await db.delete(waterfalls).where(eq(waterfalls.id, id)).returning();
    if (!deleted) return c.json({ error: "Cachoeira não encontrada" }, 404);
    return c.json(deleted);
  });

  return app;
}
