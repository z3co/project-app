import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { projectLinks, projects } from "~/lib/mock-data"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { ExternalLink, LinkIcon, MoreHorizontal, Plus } from "lucide-react"
import { Badge } from "~/components/ui/badge"
import { notFound } from "next/navigation"

export default async function ProjectLinksPage({ params }: { params: { id: string } }) {
  const projectId = (await params).id

  // Find the project by ID
  const project = projects.find((p) => p.id === projectId)

  // If project not found, show 404
  if (!project) {
    notFound()
  }

  // Get project-specific links
  const links = projectLinks[projectId] || []

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Links</h2>
          <p className="text-muted-foreground">Manage links for {project.name}</p>
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
              <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <LinkIcon className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">{link.title}</p>
                    <p className="text-sm text-muted-foreground">{link.url}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge>{link.category}</Badge>
                      <span className="text-xs text-muted-foreground">Added: {link.createdAt}</span>
                      <span className="text-xs text-muted-foreground">By: {link.createdBy}</span>
                    </div>
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
  )
}
