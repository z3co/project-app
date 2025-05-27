"use server";

import { auth } from "@clerk/nextjs/server";
import { project_table } from "~/server/db/schema";
import { z } from "zod";
import { db } from "~/server/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { tryCatch } from "./utils";
import { MUTATIONS } from "~/server/db/queries";

const ProjectSchema = z.object({
  id: z.number(),
  name: z
    .string({
      invalid_type_error: "Please name your project.",
    })
    .min(1, "Please name your project"),
  description: z
    .string({
      invalid_type_error: "Please enter a description for your project",
    })
    .min(1, "Please enter a description for your project"),
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

export async function createProject(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const user = await auth();

  if (!user.userId) return { message: "User not authorized" };

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

  const result = await tryCatch(MUTATIONS.createProject(newProject));
  if (result.error) {
    return { message: "Failed to create project" };
  }

  const returningId = result.data;
  if (!returningId[0]) return { message: "Failed to create project" };

  revalidatePath("/");
  redirect(`/project/${returningId[0].id}`);
}
