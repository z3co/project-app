import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import {
  PlusCircle,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { MainNav } from "~/components/main-nav";
import { UserNav } from "~/components/user-nav";
import { Search } from "~/components/search";
import { ModeToggle } from "~/components/mode-toggle";
import { db } from "~/server/db";
import { project_table } from "~/server/db/schema";

export default async function ProjectsPage() {
  let projects: typeof project_table.$inferSelect[] = [];
  try {
    projects = await db
      .select({
        id: project_table.id,
        name: project_table.name,
        description: project_table.description,
        status: project_table.status,
      })
      .from(project_table);
  } catch (err) {
    console.error("DB error while fetching projects", err);
    // You could show a fallback UI, rethrow, or return early here
  }

  // …rest of your component rendering using `projects`
}
  /* Former project schema
   *   {
      id: "1",
      name: "Website Redesign",
      description: "Redesign the company website",
      status: "In Progress",
      completionPercentage: 65,
      dueDate: "2025-05-15",
      priority: "High",
      team: ["John Doe", "Jane Smith", "Alex Johnson"],
    },
    **/

  // Calculate project statistics
  const totalProjects = projects.length;
  const completedProjects = projects.filter(
    (p) => p.status === "Completed",
  ).length;
  const inProgressProjects = projects.filter(
    (p) => p.status === "In Progress",
  ).length;
  const planningProjects = projects.filter(
    (p) => p.status === "Planning",
  ).length;
 // const highPriorityProjects = projects.filter(
 //   (p) => p.status !== "Completed",
 // ).length;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
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
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
              <p className="text-muted-foreground">
                Manage and track all your projects in one place
              </p>
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProjects}</div>
                <p className="text-muted-foreground text-xs">
                  {inProgressProjects} in progress, {completedProjects}{" "}
                  completed
                </p>
              </CardContent>
            </Card>

            {/**
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Projects not completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{highPriorityProjects}</div>
                <p className="text-muted-foreground text-xs">
                  Projects that should be done by today
                </p>
              </CardContent>
            </Card>
            **/}

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  In Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProgressProjects}</div>
                <p className="text-muted-foreground text-xs">
                  Active projects currently being worked on
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{planningProjects}</div>
                <p className="text-muted-foreground text-xs">
                  Projects in the planning phase
                </p>
              </CardContent>
            </Card>
            {/* Put a card here **/}
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
                        <CardTitle className="text-lg font-bold">
                          {project.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {project.description}
                        </CardDescription>
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
                  {/*
                  <CardContent className="flex-grow pb-3">
                    <div className="space-y-3">
                      <div>
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Progress
                          </span>
                          <span className="font-medium">{"50"}%</span>
                        </div>
                        <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
                          <div
                            className="bg-primary h-full rounded-full"
                            style={{
                              width: `${"50"}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Due Date:
                          </span>
                          <span className="ml-1 font-medium">
                            {project.endDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  **/}
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
);
}
