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
import { CheckCircle, Circle, Clock, MoreHorizontal, Plus } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { project_table, todo_table } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export default async function ProjectTodosPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params; // eslint-disable-line
  const projectId = Number.parseInt(id, 10);
  if (Number.isNaN(projectId)) notFound();

  // Find the project by ID
  const projectResponse = await db
    .select()
    .from(project_table)
    .where(eq(project_table.id, projectId))
    .limit(1);

  // If project not found, show 404
  if (!projectResponse[0]) {
    notFound();
  }

  const project = projectResponse[0];

  // Get project-specific todos
  const todos = await db
    .select()
    .from(todo_table)
    .where(eq(todo_table.parentId, projectId));

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Todos</h2>
          <p className="text-muted-foreground">
            Manage todos for {project.name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Todo
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Input className="max-w-sm" placeholder="Search todos..." />
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="mine">Assigned to Me</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Todos</CardTitle>
              <CardDescription>
                Manage all todos for this project.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      {todo.status === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : todo.status === "in-progress" ? (
                        <Clock className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-yellow-500" />
                      )}
                      <div>
                        <p className="font-medium">{todo.title}</p>
                        <p className="text-muted-foreground text-sm">
                          {todo.description}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge
                            variant={
                              todo.priority === "high"
                                ? "destructive"
                                : todo.priority === "medium"
                                  ? "default"
                                  : "outline"
                            }
                          >
                            {todo.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Edit
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
        </TabsContent>

        <TabsContent value="mine" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Todos</CardTitle>
              <CardDescription>Todos assigned to you.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todos
                  .filter(() => "John Doe" === "John Doe")
                  .map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-4">
                        {todo.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : todo.status === "in-progress" ? (
                          <Clock className="h-5 w-5 text-blue-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-yellow-500" />
                        )}
                        <div>
                          <p className="font-medium">{todo.title}</p>
                          <p className="text-muted-foreground text-sm">
                            {todo.description}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge
                              variant={
                                todo.priority === "high"
                                  ? "destructive"
                                  : todo.priority === "medium"
                                    ? "default"
                                    : "outline"
                              }
                            >
                              {todo.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          Edit
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
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Todos</CardTitle>
              <CardDescription>
                All completed todos for this project.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todos
                  .filter((todo) => todo.status === "completed")
                  .map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">{todo.title}</p>
                          <p className="text-muted-foreground text-sm">
                            {todo.description}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge variant="outline">{todo.priority}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
