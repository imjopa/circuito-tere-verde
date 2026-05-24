import { parks, waterfalls, type NewWaterfall } from "@circuito/db";
import type { Db, WaterfallAccess } from "@circuito/db";
import { and, desc, eq, SQL } from "drizzle-orm";
import { Hono } from "hono";

export function createWaterfallsRoutes(db: Db) {
  const app = new Hono();

  app.get("/", async (c) => {
    const parkId = c.req.query("park");
    const access = c.req.query("access");

    const filters = [
      parkId && eq(waterfalls.parkId, parkId),
      access && eq(waterfalls.access, access as WaterfallAccess),
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
    await db.insert(waterfalls).values(body);
    return c.json(body, 201);
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
