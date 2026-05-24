import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const defaultDatabaseUrl = "postgresql://postgres:postgres@localhost:5432/circuito";
const connectionString = process.env["DATABASE_URL"] ?? defaultDatabaseUrl;

const migrationClient = postgres(connectionString, { max: 1 });
const db = drizzle(migrationClient);

await migrate(db, { migrationsFolder: new URL("../drizzle", import.meta.url).pathname });

await migrationClient.end();

console.log("Migrations applied successfully.");
