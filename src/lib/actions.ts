"use server";

import { auth } from "@clerk/nextjs/server";
import { project_table } from "~/server/db/schema";
import { z } from "zod";
import { db } from "~/server/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const ProjectSchema = z.object({
  id: z.number(),
  name: z.string({
    invalid_type_error: "Please name your project.",
  }).nonempty(),
  description: z.string({
    invalid_type_error: "Please enter a description for your project",
  }).nonempty(),
  status: z.enum(["Planning", "In Progress", "Completed"]),
  createdAt: z.string().datetime(),
  endDate: z.string().datetime({
    message: "Please select a date for your project",
  }),
  ownerId: z.string(),
});

const CreateProject = ProjectSchema.omit({
  id: true,
  status: true,
  createdAt: true,
  ownerId: true,
});

export type State = {
  errors?: {
    name?: string[];
    description?: string[];
    endDate?: string[];
  };
  message?: string | null;
};

export async function createProject(prevState: State, formData: FormData) {
  const user = await auth();

  if (!user.userId) return { status: "401", message: "User not authorized" };

  console.log(prevState);

  const validatedFields = CreateProject.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    endDate: formData.get("endDate"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields, Failed to create project",
    };
  }

  const { name, description, endDate } = validatedFields.data;
  const newProject: typeof project_table.$inferInsert = {
    name: name,
    description: description,
    endDate: new Date(endDate),
    ownerId: user.userId,
    status: "Planning",
  };
  let returningId;
  try {
    returningId = await db
      .insert(project_table)
      .values(newProject)
      .$returningId();
    if (!returningId[0]) throw new Error("Failed to insert new project");
  } catch (error) {
    console.error(error);
    return {
      message: "A server error occured while creating new project",
    };
  }
  revalidatePath("/");
  redirect(`/project/${returningId[0].id}`);
}
