import "server-only"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { UserRole } from "../role"


const BASE_URL =
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim() || "http://localhost:8000"

/* ==========================================================
   SESSION
   ========================================================== */

export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  })
}


export const getToken = async () => {
  const session = await getSession()

  if (!session?.session?.token || session.user.banned) {
    redirect("/sign-in")
  }
  return session.session.token
}

/* ==========================================================
   BACKEND CALLS 
   ========================================================== */


export const authFetch = async (path: string) => {
  const token = await getToken()

  const res = await fetch(`${BASE_URL}${path}`, {
    cache: "no-store",
    headers: { authorization: `Bearer ${token}` },
  })

  if (res.status === 401) redirect("/sign-in")
  if (res.status === 403) redirect("/unauthorised")

  return res
}

export const protectedMutation = async (
  path: string,
  method: "POST" | "PATCH" | "PUT" | "DELETE",
  data?: unknown
) => {
  const token = await getToken()

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: data !== undefined ? JSON.stringify(data) : undefined,
  })

  if (res.status === 401) redirect("/sign-in")
  if (res.status === 403) redirect("/unauthorised")

  return res
}

/* ==========================================================
   ROLE GUARD
   ========================================================== */


export const requireRole = async (role: UserRole) => {
  const session = await getSession()

  if (!session) redirect("/sign-in")
  if (session.user.banned || session.user.role !== role) {
    redirect("/unauthorised")
  }
  return session
}