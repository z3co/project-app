import { drizzle } from "drizzle-orm/singlestore";

import { env } from "~/env";
import * as schema from "./schema";
import { createPool, type Pool } from "mysql2/promise";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: Pool | undefined;
};

const conn =
  globalForDb.conn ??
  createPool({
    host: env.SINGLESTORE_HOST,
    user: env.SINGLESTORE_USER,
    password: env.SINGLESTORE_PASS,
    port: parseInt(env.SINGLESTORE_PORT),
    database: env.SINGLESTORE_DATABASE,
    ssl: {},
    maxIdle: 0,
  })


if (env.NODE_ENV !== "production") globalForDb.conn = conn;

conn.addListener("error", (err) => {
  console.error("Databse connection error", err)
})

export const db = drizzle(conn, { schema });
