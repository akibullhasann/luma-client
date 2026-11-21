import { ServiceStatus } from "@/typescript";

const BASE_URL =
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim() || "http://localhost:8000"


export  type Service = {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: ServiceStatus;
  adminId?: string;
  createdAt: string; 
};



export const getService = async(query: string = ""): Promise<Service[]>=>{
    const res = await fetch(`${BASE_URL}/services?${query}`, {cache: "no-store"})
    if(!res.ok){
        throw new Error(`The service API responded with ${res.status}.`)
    }

    const data :unknown = await res.json()

     if (!Array.isArray(data)) {
    throw new Error("The jobs API returned an unexpected response.")
  }
  return data as Service[];
}

export const getServicesById = async(id: string): Promise<Service | null>=>{
    const res = await fetch(`${BASE_URL}/services/${id}`, {cache: "no-store"})
    if(res.status === 404){
        return null;
    }
    if(!res.ok){
        throw new Error(`The service API responded with ${res.status}.`)
    }

    const data :unknown = await res.json()

    if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("The service API returned an unexpected response.")
  }
  return data as Service;
}


