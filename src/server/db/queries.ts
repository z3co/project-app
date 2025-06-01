import "server-only";
import {
  file_table,
  link_table,
  note_table,
  project_table,
  todo_table,
} from "./schema";
import { db } from ".";
import { eq, and } from "drizzle-orm";

export const QUERIES = {
  getProjectByUser: function(userId: string) {
    return db
      .select({
        id: project_table.id,
        name: project_table.name,
        description: project_table.description,
        status: project_table.status,
      })
      .from(project_table)
      .where(eq(project_table.ownerId, userId));
  },
  getProjectById: function(input: { userId: string; projectId: number }) {
    return db
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
  getProjectNameById: function(input: { userId: string; projectId: number }) {
    return db
      .select({
        name: project_table.name,
      })
      .from(project_table)
      .where(
        and(
          eq(project_table.id, input.projectId),
          eq(project_table.ownerId, input.userId),
        ),
      )
      .limit(1);
  },
  getFilesByParent: function(input: { userId: string; parentId: number }) {
    return db
      .select()
      .from(file_table)
      .where(
        and(
          eq(file_table.parentId, input.parentId),
          eq(file_table.ownerId, input.userId),
        ),
      );
  },
  getLinksByParent: function(input: { userId: string; parentId: number }) {
    return db
      .select()
      .from(link_table)
      .where(
        and(
          eq(link_table.parentId, input.parentId),
          eq(link_table.ownerId, input.userId),
        ),
      );
  },
  getNotesByParent: function(input: { userId: string; parentId: number }) {
    return db
      .select()
      .from(note_table)
      .where(
        and(
          eq(note_table.parentId, input.parentId),
          eq(note_table.ownerId, input.userId),
        ),
      );
  },
  getTodosByParent: function(input: { userId: string; parentId: number }) {
    return db
      .select()
      .from(todo_table)
      .where(
        and(
          eq(todo_table.parentId, input.parentId),
          eq(todo_table.ownerId, input.userId),
        ),
      );
  },
  getProjectsForHome: function(userId: string) {
    return db
      .select()
      .from(project_table)
      .where(eq(project_table.ownerId, userId))
      .limit(6);
  },
};

export const MUTATIONS = {
  createProject: function(
    project: Omit<typeof project_table.$inferInsert, "id">,
  ) {
    return db.insert(project_table).values(project).$returningId();
  },
};
