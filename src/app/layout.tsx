import type React from "react"
import { ThemeProvider } from "~/components/theme-provider"

import "~/styles/globals.css"

export const metadata = {
  title: "Project Management Dashboard",
  description: "A dashboard for managing projects, todos, links, files, and notes.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
