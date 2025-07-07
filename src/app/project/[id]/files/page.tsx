import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { tryCatch } from "~/lib/utils";
import { QUERIES } from "~/server/db/queries";
import { FilesPage } from "~/components/files-page";

export default async function ProjectFilesPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");
  const params = await props.params;
  const parsedProjectId = parseInt(params.id);
  if (isNaN(parsedProjectId)) {
    notFound();
  }

  // Query db
  const result = await tryCatch(
    Promise.all([
      QUERIES.getProjectNameById({
        userId,
        projectId: parsedProjectId,
      }),
      QUERIES.getFilesByParent({
        userId,
        parentId: parsedProjectId,
      }),
    ]),
  );

  if (result.error) {
    console.error("Error while getting project", result.error);
    throw new Error("Error while getting project");
  }
  const [projectResponse, files] = result.data;

  // If project not found, show 404
  if (!projectResponse[0]) {
    notFound();
  }

  const project = projectResponse[0];

  return <FilesPage project={project} files={files} projectId={parsedProjectId} />;
}
