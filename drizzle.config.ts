import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "singlestore",
  dbCredentials: {
    host: env.SINGLESTORE_HOST,
    user: env.SINGLESTORE_USER,
    password: env.SINGLESTORE_PASS,
    port: parseInt(env.SINGLESTORE_PORT),
    database: env.SINGLESTORE_DATABASE,
    ssl:  {}
  },
  tablesFilter: ["project_app_*"],
} satisfies Config;
