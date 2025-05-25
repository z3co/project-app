"use server";

import { auth } from "@clerk/nextjs/server";
import { project_table } from "~/server/db/schema";
import { z } from "zod";
import { db } from "~/server/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const ProjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  status: z.enum(["Planning", "In Progress", "Completed"]),
  createdAt: z.date(),
  endDate: z.string(),
  ownerId: z.string(),
});

const CreateProject = ProjectSchema.omit({
  id: true,
  status: true,
  createdAt: true,
  ownerId: true,
});

export async function createProject(formData: FormData) {
  try {
    const user = await auth();

    if (!user.userId) throw new Error("User not authorized");

    const { name, description, endDate } = CreateProject.parse({
      name: formData.get("name"),
      description: formData.get("description"),
      endDate: formData.get("endDate"),
    });

    const newProject: typeof project_table.$inferInsert = {
      name: name,
      description: description,
      endDate: new Date(endDate),
      ownerId: user.userId,
      status: "Planning",
    };

    const returningId = await db
      .insert(project_table)
      .values(newProject)
      .$returningId();
    if (!returningId[0]) throw new Error("Failed to insert new project");
    revalidatePath("/");
  } catch (error) {
    console.error(error);
    throw new Error(`Error while creating new todo: ${error}`)
  } finally {
    redirect("/");
  }
}
