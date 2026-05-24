import { parks, type NewPark } from "@circuito/db";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

import type { Db } from "../types.js";

export function createParksRoutes(db: Db) {
  const app = new Hono();

  app.get("/", async (c) => {
    const result = await db.select().from(parks);
    return c.json(result);
  });

  app.get("/:id", async (c) => {
    const id = c.req.param("id");
    const [park] = await db.select().from(parks).where(eq(parks.id, id));
    if (!park) return c.json({ error: "Parque não encontrado" }, 404);
    return c.json(park);
  });

  app.post("/", async (c) => {
    const body = (await c.req.json()) as NewPark;
    await db.insert(parks).values(body);
    return c.json(body, 201);
  });

  app.patch("/:id", async (c) => {
    const id = c.req.param("id");
    const body = (await c.req.json()) as Partial<NewPark>;
    const [updated] = await db.update(parks).set(body).where(eq(parks.id, id)).returning();
    if (!updated) return c.json({ error: "Parque não encontrado" }, 404);
    return c.json(updated);
  });

  app.delete("/:id", async (c) => {
    const id = c.req.param("id");
    const [deleted] = await db.delete(parks).where(eq(parks.id, id)).returning();
    if (!deleted) return c.json({ error: "Parque não encontrado" }, 404);
    return c.json(deleted);
  });

  return app;
}
