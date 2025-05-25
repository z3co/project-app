"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to projects</span>
              </Link>
            </Button>
            <h1 className="text-lg font-semibold">Error</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="border-destructive/20">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-xl font-bold">Something went wrong</CardTitle>
              <CardDescription className="text-muted-foreground">
                We encountered an unexpected error while processing your request.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {process.env.NODE_ENV === "development" && (
                <div className="rounded-md bg-muted p-3">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Error Details:</p>
                  <p className="text-xs font-mono text-destructive break-all">{error.message}</p>
                  {error.digest && (
                    <p className="text-xs font-mono text-muted-foreground mt-1">Digest: {error.digest}</p>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Button onClick={reset} className="w-full" size="lg">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>

                <Button variant="outline" asChild className="w-full" size="lg">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Go to Projects
                  </Link>
                </Button>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">If this problem persists, please contact support.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
