import { createDb } from "@circuito/db";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { createEventsRoutes } from "./routes/events.js";
import { createParksRoutes } from "./routes/parks.js";
import { createTrailsRoutes } from "./routes/trails.js";

const db = createDb();
const app = new Hono();

app.use("/api/*", cors());

app.get("/api/health", (c) => c.json({ status: "ok" }));

app.route("/api/parks", createParksRoutes(db));
app.route("/api/trails", createTrailsRoutes(db));
app.route("/api/events", createEventsRoutes(db));

const port = Number(process.env["PORT"] ?? 3001);

serve({ fetch: app.fetch, port }, () => {
  console.log(`API running on http://localhost:${port}`);
});
