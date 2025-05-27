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
import { Edit, MoreHorizontal, Plus } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { tryCatch } from "~/lib/utils";
import { QUERIES } from "~/server/db/queries";

export default async function ProjectNotesPage({
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
    throw new Error("Error while getting project");
  }

  const projectResponse = result.data;

  // If project not found, show 404
  if (!projectResponse[0]) {
    notFound();
  }

  const project = projectResponse[0];

  // Get project-specific notes
  const notesResult = await tryCatch(
    QUERIES.getNotesByParent({
      userId,
      parentId: projectId,
    }),
  );
  if (notesResult.error) {
    console.error("Error while getting notes from db", notesResult.error);
    throw new Error("Error while getting notes");
  }

  const notes = notesResult.data;

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notes</h2>
          <p className="text-muted-foreground">
            Manage notes for {project.name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Input className="max-w-sm" placeholder="Search notes..." />
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Meetings">Meetings</SelectItem>
            <SelectItem value="Requirements">Requirements</SelectItem>
            <SelectItem value="Design">Design</SelectItem>
            <SelectItem value="Development">Development</SelectItem>
            <SelectItem value="Testing">Testing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notes</CardTitle>
          <CardDescription>Manage all notes for this project.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {notes.map((note) => (
              <Card key={note.id} className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{note.title}</CardTitle>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-muted-foreground text-sm">
                    {note.content}
                  </p>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
