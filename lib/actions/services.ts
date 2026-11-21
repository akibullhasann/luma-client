import type { ServiceFormValues } from "@/typescript";

const BASE_URL =
    (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim() || "http://localhost:8000";

export const createService = async (data: ServiceFormValues) => {
    const res = await fetch(`${BASE_URL}/services`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return res.json();
};


export const updateService = async (id: string, data: Partial<ServiceFormValues>) => {
    const res = await fetch(`${BASE_URL}/services/${id}`, {
        method: "PATCH",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(`Update failed with ${res.status}.`);
    return res.json();
}


export const deleteService = async (id: string) => {
  const res = await fetch(`${BASE_URL}/services/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error(`Delete failed with ${res.status}.`);
  return res.json();
};