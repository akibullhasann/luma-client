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