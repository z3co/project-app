import { bigint, text, singlestoreTableCreator, singlestoreEnum, timestamp, date, index, int } from "drizzle-orm/singlestore-core";

const tableCreator = singlestoreTableCreator((name) => `project_app_${name}`)

export const project_table = tableCreator(
  "project_table",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    status: singlestoreEnum("status", ["Planning", "In Progress", "Completed"]).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    endDate: date("end_date").notNull(),
    ownerId: text("owner_id").notNull(),
  }, (t) => {
    return [index("owner_id_index").on(t.ownerId)]
  });

export const todo_table = tableCreator(
  "todo_table",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    status: singlestoreEnum("status", ["pending", "in-progress", "completed"]).notNull(),
    priority: singlestoreEnum("priority", ["low", "medium", "high"]).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    parentId: bigint("parent_id", { mode: "number", unsigned: true }).notNull(),
    ownerId: text("owner_id").notNull(),
  }, (t) => {
    return [
      index("owner_id_index").on(t.ownerId),
      index("parent_id_index").on(t.parentId),
    ]
  }
)

export const link_table = tableCreator(
  "link_table",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    title: text("title").notNull(),
    url: text("url").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    parentId: bigint("parent_id", { mode: "number", unsigned: true }).notNull(),
    ownerId: text("owner_id").notNull(),
  }, (t) => {
    return [
      index("owner_id_index").on(t.ownerId),
      index("parent_id_index").on(t.parentId),
    ]
  }
)

export const file_table = tableCreator(
  "file_table",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    name: text("name").notNull(),
    size: int("size").notNull(),
    url: text("url").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    parentId: bigint("parent_id", { mode: "number", unsigned: true }).notNull(),
    ownerId: text("owner_id").notNull(),
  }, (t) => {
    return [
      index("owner_id_index").on(t.ownerId),
      index("parent_id_index").on(t.parentId),
    ]
  }
)

export const note_table = tableCreator(
  "note_table",
  {
    id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    parentId: bigint("parent_id", { mode: "number", unsigned: true }).notNull(),
    ownerId: text("owner_id").notNull(),
  }, (t) => {
    return [
      index("owner_id_index").on(t.ownerId),
      index("parent_id_index").on(t.parentId),
    ]
  }
)
