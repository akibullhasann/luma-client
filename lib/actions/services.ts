"use server";

import { revalidatePath } from "next/cache";

import { protectedMutation } from "@/lib/core/server";
import type { ServiceFormValues } from "@/typescript";

export const createService = async (data: ServiceFormValues) => {
  const res = await protectedMutation("/services", "POST", data);
  const result = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(result?.message || `Create failed with ${res.status}.`);
  }
  revalidatePath("/dashboard/admin/services");
  return result;
};

export const updateService = async (id: string, data: Partial<ServiceFormValues>) => {
  const res = await protectedMutation(`/services/${id}`, "PATCH", data);
  const result = await res.json().catch(() => null);
  if (!res.ok) throw new Error(result?.message || `Update failed with ${res.status}.`);
  return result;
};

export const deleteService = async (id: string) => {
  const res = await protectedMutation(`/services/${id}`, "DELETE");
  const result = await res.json().catch(() => null);
  if (!res.ok) throw new Error(result?.message || `Delete failed with ${res.status}.`);
  return result;
};
