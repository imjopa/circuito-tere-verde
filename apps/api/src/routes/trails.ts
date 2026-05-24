import { trails, type NewTrail } from "@circuito/db";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

import type { Db } from "../types.js";

export function createTrailsRoutes(db: Db) {
  const app = new Hono();

  app.get("/", async (c) => {
    const result = await db.select().from(trails);
    return c.json(result);
  });

  app.get("/:id", async (c) => {
    const id = c.req.param("id");
    const [trail] = await db.select().from(trails).where(eq(trails.id, id));
    if (!trail) return c.json({ error: "Trilha não encontrada" }, 404);
    return c.json(trail);
  });

  app.post("/", async (c) => {
    const body = await c.req.json<NewTrail>();
    await db.insert(trails).values(body);
    return c.json(body, 201);
  });

  app.patch("/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json<NewTrail>();
    const [updated] = await db.update(trails).set(body).where(eq(trails.id, id)).returning();
    if (!updated) return c.json({ error: "Trilha não encontrada" }, 404);
    return c.json(updated);
  });

  app.delete("/:id", async (c) => {
    const id = c.req.param("id");
    const [deleted] = await db.delete(trails).where(eq(trails.id, id)).returning();
    if (!deleted) return c.json({ error: "Trilha não encontrada" }, 404);
    return c.json(deleted);
  });

  return app;
}
