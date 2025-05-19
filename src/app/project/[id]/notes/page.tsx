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
import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { note_table, project_table } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export default async function ProjectNotesPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params; // eslint-disable-line

  const numericId = Number.parseInt(id, 10);
  if (Number.isNaN(numericId)) notFound();

  // Find the project by ID
  const projectResponse = await db
    .select()
    .from(project_table)
    .where(eq(project_table.id, numericId))
    .limit(1);

  // If project not found, show 404
  if (!projectResponse[0]) {
    notFound();
  }

  const project = projectResponse[0];

  // Get project-specific notes
  const notes = await db
    .select()
    .from(note_table)
    .where(eq(note_table.parentId, numericId));
    .from(note_table)
    .where(eq(note_table.parentId, numericId));
  const notes = await db
    .select()
    .from(note_table)
    .where(eq(note_table.parentId, numericId));
  return (
    .from(note_table)
    .where(eq(note_table.parentId, numericId));
  
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
    .where(eq(note_table.parentId, numericId));
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
