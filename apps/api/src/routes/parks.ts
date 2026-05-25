import { parks, type NewPark } from "@circuito/db";
import type { Db } from "@circuito/db";
import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";

export function createParksRoutes(db: Db) {
  const app = new Hono();

  app.get("/", async (c) => {
    const result = await db.select().from(parks).orderBy(desc(parks.name));
    return c.json(result);
  });

  app.get("/:id", async (c) => {
    const id = c.req.param("id");
    const [park] = await db.select().from(parks).where(eq(parks.id, id));
    if (!park) return c.json({ error: "Parque não encontrado" }, 404);
    return c.json(park);
  });

  app.patch("/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json<Partial<NewPark>>();
    const [updated] = await db.update(parks).set(body).where(eq(parks.id, id)).returning();
    if (!updated) return c.json({ error: "Parque não encontrado" }, 404);
    return c.json(updated);
  });

  return app;
}
