import { events, parks, type NewParkEvent } from "@circuito/db";
import type { Db, ParkEventCategory } from "@circuito/db";
import { and, desc, eq, SQL } from "drizzle-orm";
import { Hono } from "hono";

export function createEventsRoutes(db: Db) {
  const app = new Hono();

  app.get("/", async (c) => {
    const parkId = c.req.query("park");
    const category = c.req.query("category");

    const filters = [
      parkId && eq(events.parkId, parkId),
      category && eq(events.category, category as ParkEventCategory),
    ].filter((f): f is SQL => Boolean(f));

    const query = db
      .select()
      .from(events)
      .leftJoin(parks, eq(events.parkId, parks.id))
      .orderBy(desc(events.date));

    if (filters.length > 0) {
      query.where(and(...filters));
    }

    return c.json(
      (await query).map((r) => ({
        ...r.events,
        park: r.parks,
      })),
    );
  });

  app.get("/:id", async (c) => {
    const id = c.req.param("id");
    const [event] = await db.select().from(events).where(eq(events.id, id));
    if (!event) return c.json({ error: "Evento não encontrado" }, 404);
    return c.json(event);
  });

  app.post("/", async (c) => {
    const body = await c.req.json<NewParkEvent>();
    await db.insert(events).values(body);
    return c.json(body, 201);
  });

  app.patch("/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json<NewParkEvent>();
    const [updated] = await db.update(events).set(body).where(eq(events.id, id)).returning();
    if (!updated) return c.json({ error: "Evento não encontrado" }, 404);
    return c.json(updated);
  });

  app.delete("/:id", async (c) => {
    const id = c.req.param("id");
    const [deleted] = await db.delete(events).where(eq(events.id, id)).returning();
    if (!deleted) return c.json({ error: "Evento não encontrado" }, 404);
    return c.json(deleted);
  });

  return app;
}
