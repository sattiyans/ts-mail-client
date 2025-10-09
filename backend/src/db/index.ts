import { Pool } from "pg";

// Enable SSL for managed Postgres providers (Neon, Supabase, Render) when required.
// If DATABASE_URL already includes `sslmode=require`, pg will negotiate TLS, but
// some providers still require passing an ssl config in Node clients.
// Toggle via DATABASE_SSL env (default: "require"). Set to "disable" to turn off.
const shouldUseSsl = (process.env.DATABASE_SSL || "require").toLowerCase() !== "disable";

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined,
});

export async function healthcheck(): Promise<boolean> {
  try {
    const res = await db.query("select 1 as ok");
    return res.rowCount === 1;
  } catch {
    return false;
  }
}


