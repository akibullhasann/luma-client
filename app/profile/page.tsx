import { redirect } from "next/navigation";

import { getSession } from "@/lib/core/server";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (session.user.role === "admin") {
    redirect("/dashboard/admin/profile");
  }

  redirect("/dashboard/patrons/profile");
}