import { parks, trails, type NewTrail } from "@circuito/db";
import type { Db, TrailDifficulty } from "@circuito/db";
import { and, desc, eq, ilike, or, SQL } from "drizzle-orm";
import { Hono } from "hono";

export function createTrailsRoutes(db: Db) {
  const app = new Hono();

  app.get("/", async (c) => {
    const parkSlug = c.req.query("park");
    const difficulty = c.req.query("difficulty");
    const searchQuery = c.req.query("q");

    const filters = [
      parkSlug && eq(parks.slug, parkSlug),
      difficulty && eq(trails.difficulty, difficulty as TrailDifficulty),
      searchQuery &&
        or(
          ilike(trails.name, `%${searchQuery}%`),
          ilike(trails.parkName, `%${searchQuery}%`),
          ilike(trails.difficulty, `%${searchQuery}%`),
          ilike(trails.description, `%${searchQuery}%`),
          ilike(trails.conditions, `%${searchQuery}%`),
          ilike(trails.tips, `%${searchQuery}%`),
          ilike(parks.name, `%${searchQuery}%`),
        ),
    ].filter((f): f is SQL => Boolean(f));

    const query = db
      .select()
      .from(trails)
      .leftJoin(parks, eq(trails.parkId, parks.id))
      .orderBy(desc(trails.name));

    if (filters.length > 0) {
      query.where(and(...filters));
    }

    return c.json(
      (await query).map((r) => ({
        ...r.trails,
        park: r.parks,
      })),
    );
  });

  app.get("/:id", async (c) => {
    const id = c.req.param("id");
    const [trail] = await db.select().from(trails).where(eq(trails.id, id));
    if (!trail) return c.json({ error: "Trilha não encontrada" }, 404);
    return c.json(trail);
  });

  app.post("/", async (c) => {
    const body = await c.req.json<NewTrail>();
    const [created] = await db.insert(trails).values(body).returning();
    return c.json(created, 201);
  });

  app.patch("/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json<Partial<NewTrail>>();
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
