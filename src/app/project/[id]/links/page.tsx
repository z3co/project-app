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
import { ExternalLink, LinkIcon, MoreHorizontal, Plus } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { tryCatch } from "~/lib/utils";
import { QUERIES } from "~/server/db/queries";

export default async function ProjectLinksPage(props: {
  params: Promise<{ id: number }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");
  const params = await props.params;

  // Find the project by ID
  const result = await tryCatch(
    Promise.all([
      QUERIES.getProjectById({
        userId,
        projectId: params.id,
      }),
      QUERIES.getLinksByParent({
        userId,
        parentId: params.id,
      }),
    ]),
  );

  if (result.error) {
    console.error("Error while getting project", result.error);
    throw new Error("Error while getting project");
  }

  const [projectResponse, links] = result.data;

  // If project not found, show 404
  if (!projectResponse[0]) {
    notFound();
  }

  const project = projectResponse[0];

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Links</h2>
          <p className="text-muted-foreground">
            Manage links for {project.name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Link
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Input className="max-w-sm" placeholder="Search links..." />
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Documentation">Documentation</SelectItem>
            <SelectItem value="Design">Design</SelectItem>
            <SelectItem value="Development">Development</SelectItem>
            <SelectItem value="Planning">Planning</SelectItem>
            <SelectItem value="Team">Team</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Links</CardTitle>
          <CardDescription>Manage all links for this project.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {links.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  <LinkIcon className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">{link.title}</p>
                    <p className="text-muted-foreground text-sm">{link.url}</p>
                    <div className="mt-1 flex items-center gap-2"></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open
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
