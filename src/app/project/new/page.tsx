import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CreateProjectComponent from "~/components/create-project";

export default async function createProjectPage() {
  const user = await auth();
  if (!user.userId) return redirect("/");
  return <CreateProjectComponent />;
}
