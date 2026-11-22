import { Appointment } from "@/typescript";


const BASE_URL =
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim() || "http://localhost:8000";

export const getAppointments = async (
  query: string = ""
): Promise<Appointment[]> => {
  const res = await fetch(`${BASE_URL}/appointments?${query}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`The appointments API responded with ${res.status}.`);
  }

  const data: unknown = await res.json();

  if (!Array.isArray(data)) {
    throw new Error("The appointments API returned an unexpected response.");
  }

  return data as Appointment[];
};