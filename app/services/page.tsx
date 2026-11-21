import type { Metadata } from "next";

import { BrowseServices } from "@/app/components/browse-services";
import { getService, type Service } from "@/lib/api/services";

export const metadata: Metadata = {
  title: "Browse Services | Luma Salon",
  description:
    "Explore salon services, compare prices and find your next treatment at Luma.",
};

// Reads request-time data from the services API.
export const instant = false;

const BrowseServicesPage = async () => {
  let services: Service[] = [];
  let error: string | null = null;

  try {
    services = await getService("status=active");
  } catch {
    error = "Services are unavailable right now. Please try again later.";
  }

  return <BrowseServices services={services} error={error} />;
};

export default BrowseServicesPage;
