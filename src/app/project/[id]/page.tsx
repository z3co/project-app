import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { projectTodos, projectLinks, projects } from "~/lib/mock-data"
import { BarChart, CheckCircle, FileText, Link, ListTodo, MoreHorizontal } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Progress } from "~/components/ui/progress"
import { notFound } from "next/navigation"

export default function ProjectDashboardPage({ params }: { params: { id: string } }) {
  const projectId = params.id

  // Find the project by ID
  const project = projects.find((p) => p.id === projectId)

  // If project not found, show 404
  if (!project) {
    notFound()
  }

  // Get project-specific data
  const todos = projectTodos[projectId] || []
  const links = projectLinks[projectId] || []

  // Calculate project-specific stats
  const completedTodos = todos.filter((todo) => todo.status === "completed").length
  const inProgressTodos = todos.filter((todo) => todo.status === "in-progress").length
  const pendingTodos = todos.filter((todo) => todo.status === "pending").length
  const totalTodos = todos.length

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{project.name}</h2>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>Download Report</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Status</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.status}</div>
            <Progress value={project.completionPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">{project.completionPercentage}% complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Todo Completion</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0}%
            </div>
            <Progress value={totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {completedTodos} of {totalTodos} tasks completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.startDate}</div>
            <p className="text-xs text-muted-foreground">to {project.endDate}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.team.length}</div>
            <p className="text-xs text-muted-foreground">team members assigned</p>
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
                  You have {inProgressTodos} tasks in progress and {pendingTodos} pending.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {todos.slice(0, 3).map((todo) => (
                    <div key={todo.id} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            todo.status === "completed"
                              ? "bg-green-500"
                              : todo.status === "in-progress"
                                ? "bg-blue-500"
                                : "bg-yellow-500"
                          }`}
                        />
                        <div>
                          <p className="text-sm font-medium">{todo.title}</p>
                          <p className="text-xs text-muted-foreground">Due: {todo.dueDate}</p>
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
                <CardDescription>You have {links.length} saved links for this project.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {links.slice(0, 3).map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Link className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">{link.title}</p>
                          <p className="text-xs text-muted-foreground">{link.category}</p>
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
                {project.team.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        {member
                          .split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{member}</p>
                        <p className="text-xs text-muted-foreground">Team Member</p>
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
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">Activity feed coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Settings</CardTitle>
              <CardDescription>Manage project settings and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">Settings panel coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
