import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type ServiceStatus = "active" | "inactive";

export type ServiceFormValues = {
  serviceName: string;
  category: string;
  description: string;
  price: number | "";      
  duration: number | "";
  status: ServiceStatus;
  image: string;
  adminId: string;
};
export type FormErrors = Partial<Record<keyof ServiceFormValues | "image", string>>;

export type FieldProps = {
  label: string;
  error?: string;
  right?: ReactNode;
  children: ReactNode;
};

export type IconInputProps = {
  icon: LucideIcon;
  children: ReactNode;
};
