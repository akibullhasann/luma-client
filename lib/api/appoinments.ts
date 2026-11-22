import "server-only";

import { authFetch } from "@/lib/core/server";
import { Appointment } from "@/typescript";

export const getAppointments = async (
  query: string = ""
): Promise<Appointment[]> => {
  const path = query ? `/appointments?${query}` : "/appointments";
  const res = await authFetch(path);

  if (!res.ok) {
    throw new Error(`The appointments API responded with ${res.status}.`);
  }

  const data: unknown = await res.json();

  if (!Array.isArray(data)) {
    throw new Error("The appointments API returned an unexpected response.");
  }

  return data as Appointment[];
};
