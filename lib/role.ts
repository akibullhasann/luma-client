export const USER_ROLES = ["patrons", "admin"] as const

export type UserRole = (typeof USER_ROLES)[number]

export type RoleOption = {
  value: UserRole
  label: string
  description: string
}

export const USER_ROLE_OPTIONS: RoleOption[] = [
  { value: "patrons", label: "Customer", description: "Book salon services" },
  { value: "admin", label: "Admin", description: "Manage the salon" },
]

export const DASHBOARD_PATH: Record<UserRole, string> = {
  patrons: "/dashboard/patrons",
  admin: "/dashboard/admin",
}