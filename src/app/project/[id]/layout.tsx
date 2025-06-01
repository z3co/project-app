import type React from "react";
import { MainNav } from "~/components/project-nav";
import { Search } from "~/components/search";
import { ModeToggle } from "~/components/mode-toggle";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back to projects</span>
              </Link>
            </Button>
            <MainNav projectId={id} />
          </div>
          <div className="flex items-center gap-4">
            <Search />
            <ModeToggle />
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Suspense>{children}</Suspense>
      </main>
    </div>
  );
}
