import { AppointmentFormValues } from "@/typescript/appoinment";


const BASE_URL =
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim() || "http://localhost:8000";

export const createAppoinments = async (data: AppointmentFormValues) => {
  const res = await fetch(`${BASE_URL}/appointments`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Could not book the appointment.");
  }

  return result;
};






export const updateAppointmentStatus = async (
  id: string,
  status: "confirmed" | "cancelled"
) => {
  const res = await fetch(`${BASE_URL}/appointments/${id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status }),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Could not update the appointment.");
  return result;
};

export const deleteAppointment = async (id: string) => {
  const res = await fetch(`${BASE_URL}/appointments/${id}`, {
    method: "DELETE",
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Could not delete the appointment.");
  return result;
};