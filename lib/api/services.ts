const BASE_URL =
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim() || "http://localhost:8000"



export const getService = async(query: string = "")=>{
    const res = await fetch(`${BASE_URL}/services?${query}`, {cache: "no-store"})
    if(!res.ok){
        throw new Error(`The jobs API responded with ${res.status}.`)
    }

    const data :unknown = await res.json()

     if (!Array.isArray(data)) {
    throw new Error("The jobs API returned an unexpected response.")
  }
  return data;
}