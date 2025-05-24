import { Input } from "~/components/ui/input";
import { MainNav } from "~/components/main-nav";
import { Search } from "~/components/search";
import { ModeToggle } from "~/components/mode-toggle";
import { DatePicker } from "~/components/date-picker";
import { Button } from "~/components/ui/button";
import { createProject } from "~/lib/actions";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function createProjectPage() {
  const user = await auth();
  if (!user.userId) return redirect("/")
  return (
    <form
      action={createProject}
    >
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
        {/* Project Name */}
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Name of project
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter name"
                required
              />
            </div>
          </div>
        </div>
        {/* Project description */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            Description
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <Input
                id="description"
                name="description"
                type="text"
                placeholder="A short description of the project"
                required
              />
            </div>
          </div>
        </div>
        {/* Project End date */}
        <div className="mb-4">
          <label htmlFor="end-date" className="mb-2 block text-sm font-medium">
            End of the project
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <DatePicker />
            </div>
          </div>
        </div>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
