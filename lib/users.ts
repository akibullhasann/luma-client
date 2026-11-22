

/* ==========================================================
   TYPES
   ========================================================== */

import { USER_ROLES, UserRole } from "./role"


export type UserRecord = {
  id?: string | null
  _id?: unknown            
  name?: string | null
  email?: string | null
  image?: string | null    
  role?: string | null     
  emailVerified?: boolean | null
  banned?: boolean | null  
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
}


export type ManagedUser = {
  id: string
  name: string
  email: string
  image: string            
  role: UserRole
  emailVerified: boolean
  banned: boolean          
  createdAt: string
  updatedAt: string
}

/* ==========================================================
   HELPERS
   ========================================================== */


export function toUserRole(value?: string | null): UserRole {
  return value && USER_ROLES.includes(value as UserRole)
    ? (value as UserRole)
    : "patrons"
}


function toIsoString(value?: Date | string | null) {
  if (!value) return ""

  const date = value instanceof Date ? value : new Date(value)

  return Number.isNaN(date.getTime()) ? "" : date.toISOString()
}


export function toManagedUser(record: UserRecord): ManagedUser {
  return {
    id: String(record.id ?? record._id ?? ""),
    name: record.name?.trim() ?? "",
    email: record.email?.trim() ?? "",
    image: record.image?.trim() ?? "",
    role: toUserRole(record.role),
    emailVerified: record.emailVerified === true,
    banned: record.banned === true,
    createdAt: toIsoString(record.createdAt),
    updatedAt: toIsoString(record.updatedAt),
  }
}