"use server";

import { protectedMutation } from "@/lib/core/server";
import { AppointmentFormValues } from "@/typescript/appoinment";

export const createAppoinments = async (data: AppointmentFormValues) => {
  const res = await protectedMutation("/appointments", "POST", data);
  const result = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(result?.message || "Could not book the appointment.");
  }

  return result;
};

export const updateAppointmentStatus = async (
  id: string,
  status: "confirmed" | "cancelled"
) => {
  const res = await protectedMutation(`/appointments/${id}`, "PATCH", { status });
  const result = await res.json().catch(() => null);
  if (!res.ok) throw new Error(result?.message || "Could not update the appointment.");
  return result;
};

export const deleteAppointment = async (id: string) => {
  const res = await protectedMutation(`/appointments/${id}`, "DELETE");
  const result = await res.json().catch(() => null);
  if (!res.ok) throw new Error(result?.message || "Could not delete the appointment.");
  return result;
};
