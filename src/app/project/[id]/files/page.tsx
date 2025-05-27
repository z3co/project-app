import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Download, MoreHorizontal, Upload } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { tryCatch } from "~/lib/utils";
import { QUERIES } from "~/server/db/queries";

export default async function ProjectFilesPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");
  const { id } = await params; // eslint-disable-line
  const projectId = Number.parseInt(id, 10);
  if (Number.isNaN(projectId)) notFound();

  // Find the project by ID
  const result = await tryCatch(
    QUERIES.getProjectById({
      userId,
      projectId,
    }),
  );

  if (result.error) {
    console.error("Error while getting project", result.error);
    throw new Error("Error while getting projects");
  }
  const projectResponse = result.data;

  // If project not found, show 404
  if (!projectResponse[0]) {
    notFound();
  }

  const project = projectResponse[0];

  // Get project-specific todos
  const filesResult = await tryCatch(
    QUERIES.getFilesByParent({
      userId,
      parentId: projectId,
    }),
  );
  if (filesResult.error) {
    console.error("Failed to get files from db", filesResult.error);
    throw new Error("Failed to get files from db");
  }

  const files = filesResult.data;

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Files</h2>
          <p className="text-muted-foreground">
            Manage files for {project.name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Input className="max-w-sm" placeholder="Search files..." />
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="docx">Word</SelectItem>
            <SelectItem value="xlsx">Excel</SelectItem>
            <SelectItem value="pptx">PowerPoint</SelectItem>
            <SelectItem value="zip">Archive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Files</CardTitle>
          <CardDescription>Manage all files for this project.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  {/**
                  {file.type === "pdf" ? (
                    <FileText className="h-10 w-10 text-red-500" />
                  ) : file.type === "docx" ? (
                    <FileText className="h-10 w-10 text-blue-500" />
                  ) : file.type === "xlsx" ? (
                    <FileText className="h-10 w-10 text-green-500" />
                  ) : file.type === "pptx" ? (
                    <FileText className="h-10 w-10 text-orange-500" />
                  ) : (
                    <File className="h-10 w-10 text-gray-500" />
                  )}
                **/}
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                      {/** <Badge variant="outline">{file.type.toUpperCase()}</Badge> **/}
                      <span className="text-muted-foreground text-xs">
                        Size: {file.size}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        Uploaded: {file.createdAt.toString()}
                      </span>
                      {/**
                      <span className="text-muted-foreground text-xs">
                        By: {file}
                      </span>
                      **/}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
