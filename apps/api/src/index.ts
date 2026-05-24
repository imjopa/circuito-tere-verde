import { createDb } from "@circuito/db";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { createEventsRoutes } from "./routes/events.js";
import { createParksRoutes } from "./routes/parks.js";
import { createSearchRoutes } from "./routes/search.js";
import { createTrailsRoutes } from "./routes/trails.js";
import { createWaterfallsRoutes } from "./routes/waterfalls.js";

const db = createDb();
const app = new Hono();

app.use("/*", cors());

app.get("/health", (c) => c.json({ status: "ok" }));

app.route("/parks", createParksRoutes(db));
app.route("/search", createSearchRoutes(db));
app.route("/trails", createTrailsRoutes(db));
app.route("/events", createEventsRoutes(db));
app.route("/waterfalls", createWaterfallsRoutes(db));

const port = Number(process.env["PORT"] ?? 3001);

serve({ fetch: app.fetch, port }, () => {
  console.log(`API running on http://localhost:${port}`);
});
