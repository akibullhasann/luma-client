"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export async function banPatron(userId: string) {
  const h = await headers();
  await auth.api.banUser({
    body: { userId },
    headers: h,
  });
  revalidatePath("/dashboard/admin/users");
}

export async function unbanPatron(userId: string) {
  const h = await headers();
  await auth.api.unbanUser({
    body: { userId },
    headers: h,
  });
  revalidatePath("/dashboard/admin/users");
}