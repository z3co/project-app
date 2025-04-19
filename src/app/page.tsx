import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import Link from "next/link"
import { PlusCircle, ArrowRight, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { Badge } from "~/components/ui/badge"
import { MainNav } from "~/components/main-nav"
import { UserNav } from "~/components/user-nav"
import { Search } from "~/components/search"
import { ModeToggle } from "~/components/mode-toggle"

export default function ProjectsPage() {
  // Mock projects data
  const projects = [
    {
      id: "1",
      name: "Website Redesign",
      description: "Redesign the company website",
      status: "In Progress",
      completionPercentage: 65,
      dueDate: "2025-05-15",
      priority: "High",
      team: ["John Doe", "Jane Smith", "Alex Johnson"],
    },
    {
      id: "2",
      name: "Mobile App Development",
      description: "Develop a new mobile application",
      status: "Planning",
      completionPercentage: 25,
      dueDate: "2025-07-30",
      priority: "Medium",
      team: ["John Doe", "Mike Wilson", "Sarah Brown"],
    },
    {
      id: "3",
      name: "Marketing Campaign",
      description: "Q2 Marketing Campaign",
      status: "Completed",
      completionPercentage: 100,
      dueDate: "2025-03-31",
      priority: "Medium",
      team: ["Jane Smith", "Tom Davis"],
    },
    {
      id: "4",
      name: "Product Launch",
      description: "New product launch preparation",
      status: "In Progress",
      completionPercentage: 45,
      dueDate: "2025-06-01",
      priority: "High",
      team: ["John Doe", "Jane Smith", "Mike Wilson"],
    },
    {
      id: "5",
      name: "Infrastructure Upgrade",
      description: "Upgrade server infrastructure",
      status: "Planning",
      completionPercentage: 10,
      dueDate: "2025-06-15",
      priority: "Low",
      team: ["Alex Johnson", "Sarah Brown"],
    },
  ]

  // Calculate project statistics
  const totalProjects = projects.length
  const completedProjects = projects.filter((p) => p.status === "Completed").length
  const inProgressProjects = projects.filter((p) => p.status === "In Progress").length
  const planningProjects = projects.filter((p) => p.status === "Planning").length
  const highPriorityProjects = projects.filter((p) => p.priority === "High").length

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
          <div className="flex items-center gap-4">
            <Search />
            <ModeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="flex-1 space-y-6 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
              <p className="text-muted-foreground">Manage and track all your projects in one place</p>
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProjects}</div>
                <p className="text-xs text-muted-foreground">
                  {inProgressProjects} in progress, {completedProjects} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{highPriorityProjects}</div>
                <p className="text-xs text-muted-foreground">Projects requiring immediate attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProgressProjects}</div>
                <p className="text-xs text-muted-foreground">Active projects currently being worked on</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{planningProjects}</div>
                <p className="text-xs text-muted-foreground">Projects in the planning phase</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Projects</h2>
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold">{project.name}</CardTitle>
                        <CardDescription className="mt-1">{project.description}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          project.status === "Completed"
                            ? "outline"
                            : project.status === "In Progress"
                              ? "default"
                              : "secondary"
                        }
                        className="flex items-center gap-1"
                      >
                        {project.status === "Completed" ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : project.status === "In Progress" ? (
                          <Clock className="h-3 w-3" />
                        ) : (
                          <AlertTriangle className="h-3 w-3" />
                        )}
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3 flex-grow">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{project.completionPercentage}%</span>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${project.completionPercentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between text-sm">
                        <div>
                          <span className="text-muted-foreground">Due Date:</span>
                          <span className="ml-1 font-medium">{project.dueDate}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Priority:</span>
                          <span
                            className={`ml-1 font-medium ${
                              project.priority === "High"
                                ? "text-destructive"
                                : project.priority === "Medium"
                                  ? "text-amber-500"
                                  : "text-green-500"
                            }`}
                          >
                            {project.priority}
                          </span>
                        </div>
                      </div>

                      <div className="text-sm">
                        <span className="text-muted-foreground">Team:</span>
                        <span className="ml-1 font-medium">{project.team.length} members</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button asChild className="w-full">
                      <Link href={`/project/${project.id}`}>View Project</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
