import "server-only";
import { file_table, link_table, note_table, project_table, todo_table } from "./schema";
import { db } from ".";
import { eq, and } from "drizzle-orm";

export const QUERIES = {
  getProjectByUser: async function(userId: string) {
    return await db
      .select({
        id: project_table.id,
        name: project_table.name,
        description: project_table.description,
        status: project_table.status,
      })
      .from(project_table)
      .where(eq(project_table.ownerId, userId));
  },
  getProjectById: async function(input: {
    userId: string;
    projectId: number;
  }) {
    return await db
      .select()
      .from(project_table)
      .where(
        and(
          eq(project_table.id, input.projectId),
          eq(project_table.ownerId, input.userId),
        ),
      )
      .limit(1);
  },
  getFilesByParent: async function(input: {
    userId: string;
    parentId: number;
  }) {
    return await db
      .select()
      .from(file_table)
      .where(
        and(
          eq(file_table.parentId, input.parentId),
          eq(file_table.ownerId, input.userId),
        ),
      );
  },
  getLinksByParent: async function(input: {
    userId: string;
    parentId: number;
  }) {
    return await db
      .select()
      .from(link_table)
      .where(
        and(
          eq(link_table.parentId, input.parentId),
          eq(link_table.ownerId, input.userId),
        ),
      );
  },
  getNotesByParents: async function(input: {
    userId: string;
    parentId: number;
  }) {
    return await db
      .select()
      .from(note_table)
      .where(
        and(
          eq(note_table.parentId, input.parentId),
          eq(note_table.ownerId, input.userId),
        ),
      );
  },
  getTodosByParents: async function(input: {
    userId: string;
    parentId: number;
  }) {
    return await db
      .select()
      .from(todo_table)
      .where(
        and(
          eq(todo_table.parentId, input.parentId),
          eq(todo_table.ownerId, input.userId),
        ),
      );
  },
};

export const MUTATIONS = {
  createProject: async function(project: typeof project_table.$inferInsert) {
    return await db.insert(project_table).values(project).$returningId();
  },
};
