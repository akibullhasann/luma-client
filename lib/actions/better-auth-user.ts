import "server-only" 

import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { ManagedUser, toManagedUser, UserRecord } from "../users"

export async function getUsers(): Promise<ManagedUser[]> {
  const result = await auth.api.listUsers({
    query: {
      limit: 1000,
      sortBy: "createdAt",
      sortDirection: "desc",
      // PDF: "View All Registered Customers",
      filterField: "role",
      filterValue: "patrons",
      filterOperator: "eq",
    },
    headers: await headers(), 
  })

  return result.users.map((user) =>
    toManagedUser(user as unknown as UserRecord)
  )
}