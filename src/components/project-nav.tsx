"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "~/lib/utils"

export function MainNav({ projectId }: { projectId: string }) {
  const pathname = usePathname()

  const routes = [
    {
      href: `/project/${projectId}`,
      label: "Dashboard",
      active: pathname === `/project/${projectId}`,
    },
    {
      href: `/project/${projectId}/todos`,
      label: "Todos",
      active: pathname === `/project/${projectId}/todos`,
    },
    {
      href: `/project/${projectId}/links`,
      label: "Links",
      active: pathname === `/project/${projectId}/links`,
    },
    {
      href: `/project/${projectId}/files`,
      label: "Files",
      active: pathname === `/project/${projectId}/files`,
    },
    {
      href: `/project/${projectId}/notes`,
      label: "Notes",
      active: pathname === `/project/${projectId}/notes`,
    },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-primary" : "text-muted-foreground",
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
