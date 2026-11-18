import type { LucideIcon } from "lucide-react";

export type DashboardRole = "patrons" | "admin";

export interface DashboardMenuItem {
  id: string;
  name: string;
  url: string;
  icon: LucideIcon;
}
