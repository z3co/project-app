import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  BarChart,
  CheckCircle,
  FileText,
  Link,
  ListTodo,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { notFound, redirect } from "next/navigation";
import { db } from "~/server/db";
import { link_table, project_table, todo_table } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { tryCatch } from "~/lib/utils";
import { QUERIES } from "~/server/db/queries";

export default async function ProjectDashboardPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { id } = await params; // eslint-disable-line
  const projectId = Number.parseInt(id, 10);
  if (Number.isNaN(projectId)) notFound();

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

  // Get project-specific data
  const todosResult = await tryCatch(
    QUERIES.getTodosByParent({
      userId,
      parentId: projectId,
    }),
  );
  if (todosResult.error) {
    console.error("Error while getting todos from db", todosResult.error);
    throw new Error("Error while getting todos");
  }

  const todos = todosResult.data;

  const linksResult = await tryCatch(
    QUERIES.getLinksByParent({
      userId,
      parentId: projectId,
    }),
  );
  if (linksResult.error) {
    console.error("Error while getting links from db", linksResult.error);
    throw new Error("Error while getting links");
  }

  const links = linksResult.data;

  // Calculate project-specific stats
  const completedTodos = todos.filter(
    (todo) => todo.status === "completed",
  ).length;
  const inProgressTodos = todos.filter(
    (todo) => todo.status === "in-progress",
  ).length;
  const pendingTodos = todos.filter((todo) => todo.status === "pending").length;
  const totalTodos = todos.length;
  const team = ["Jeppe Johansen", "Hanne Clausen"];

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {project?.name}
          </h2>
          <p className="text-muted-foreground">{project?.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>Download Report</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Project Status
            </CardTitle>
            <BarChart className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.status}</div>
            <Progress value={50} className="mt-2" />
            <p className="text-muted-foreground mt-2 text-xs">
              {"50"}% complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Todo Completion
            </CardTitle>
            <CheckCircle className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalTodos > 0
                ? Math.round((completedTodos / totalTodos) * 100)
                : 0}
              %
            </div>
            <Progress
              value={totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0}
              className="mt-2"
            />
            <p className="text-muted-foreground mt-2 text-xs">
              {completedTodos} of {totalTodos} tasks completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent></CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team</CardTitle>
            <ListTodo className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{team.length}</div>
            <p className="text-muted-foreground text-xs">
              team members assigned
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Todos</CardTitle>
                <CardDescription>
                  You have {inProgressTodos} tasks in progress and{" "}
                  {pendingTodos} pending.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {todos.slice(0, 3).map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center justify-between rounded-lg border p-2"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${todo.status === "completed"
                              ? "bg-green-500"
                              : todo.status === "in-progress"
                                ? "bg-blue-500"
                                : "bg-yellow-500"
                            }`}
                        />
                        <div>
                          <p className="text-sm font-medium">{todo.title}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Links</CardTitle>
                <CardDescription>
                  You have {links.length} saved links for this project.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {links.slice(0, 3).map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between rounded-lg border p-2"
                    >
                      <div className="flex items-center gap-2">
                        <Link className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">{link.title}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>People working on this project.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {team.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full">
                        {member
                          .split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{member}</p>
                        <p className="text-muted-foreground text-xs">
                          Team Member
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Recent actions on this project.</CardDescription>
            </CardHeader>
            <CardContent className="flex h-[300px] items-center justify-center">
              <p className="text-muted-foreground">Activity feed coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Settings</CardTitle>
              <CardDescription>
                Manage project settings and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex h-[300px] items-center justify-center">
              <p className="text-muted-foreground">
                Settings panel coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
