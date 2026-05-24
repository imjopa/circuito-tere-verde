import { events, type NewEvent } from "@circuito/db";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

import type { Db } from "../types.js";

export function createEventsRoutes(db: Db) {
  const app = new Hono();

  app.get("/", async (c) => {
    const result = await db.select().from(events);
    return c.json(result);
  });

  app.get("/:id", async (c) => {
    const id = c.req.param("id");
    const [event] = await db.select().from(events).where(eq(events.id, id));
    if (!event) return c.json({ error: "Evento não encontrado" }, 404);
    return c.json(event);
  });

  app.post("/", async (c) => {
    const body = (await c.req.json()) as NewEvent;
    await db.insert(events).values(body);
    return c.json(body, 201);
  });

  app.patch("/:id", async (c) => {
    const id = c.req.param("id");
    const body = (await c.req.json()) as Partial<NewEvent>;
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
