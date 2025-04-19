import { int, bigint, text, singlestoreTableCreator } from "drizzle-orm/singlestore-core";

const tableCreator = singlestoreTableCreator((name) => `project_app_${name}`)

export const users = tableCreator("users_table", {
  id: bigint("id", { mode: "bigint" }).primaryKey().autoincrement(),
  name: text("name"),
  age: int("age"),
});
