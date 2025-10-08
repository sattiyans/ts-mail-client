import { Pool } from "pg";

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});

export async function healthcheck(): Promise<boolean> {
  try {
    const res = await db.query("select 1 as ok");
    return res.rowCount === 1;
  } catch {
    return false;
  }
}


