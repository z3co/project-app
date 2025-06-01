"use client";

import { Input } from "~/components/ui/input";
import { MainNav } from "~/components/main-nav";
import { Search } from "~/components/search";
import { ModeToggle } from "~/components/mode-toggle";
import { DatePicker } from "~/components/date-picker";
import { Button } from "~/components/ui/button";
import { createProject, type State } from "~/server/actions";
import { UserButton } from "@clerk/nextjs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "./ui/card";
import { Label } from "~/components/ui/label";
import { FileText, CalendarDays, FolderPlus } from "lucide-react";
import { useActionState } from "react";

export default function CreateProjectComponent() {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createProject, initialState);

  return (
    <form action={formAction}>
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
          <div className="flex items-center gap-4">
            <Search />
            <ModeToggle />
            <UserButton />
          </div>
        </div>
      </header>
      <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 rounded-md p-4 md:p-6">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <FolderPlus className="text-primary h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Project
            </h1>
            <p className="text-muted-foreground mt-2">
              Set up your project with a name, description, and timeline
            </p>
          </div>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Fill in the information below to create your new project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="h-4 w-4" />
                  Name of project
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter name"
                    className="h-11"
                  />
                </div>
                <div id="name-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.name?.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
                </div>
              </div>

              {/* Project Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="h-4 w-4" />
                  Description
                </Label>
                <div className="relative">
                  <Input
                    id="description"
                    name="description"
                    type="text"
                    placeholder="A short description of the project"
                    className="h-11"
                  />
                </div>
                <div id="description-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.description?.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
                </div>
              </div>

              {/* Project End Date */}
              <div className="space-y-2">
                <Label htmlFor="endDate" className="flex items-center gap-2 text-sm font-medium">
                  <CalendarDays className="h-4 w-4" />
                  End of the project
                </Label>
                <div className="relative">
                  <DatePicker id="endDate"/>
                </div>
                <div id="endDate-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.endDate?.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="h-11 w-full text-base font-medium"
                >
                  Submit
                </Button>
              </div>
              <div aria-live="polite" aria-atomic="true">
                <p className="mt-2 text-sm text-red-500" key={state.message}>
                  {state?.message}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-muted-foreground mt-6 text-center text-sm">
            <p>
              You can always edit these details later in your project settings.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
