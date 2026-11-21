import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

import { ServiceDetails, type BookingUser } from "@/app/components/service-details";
import { getServicesById, type Service } from "@/lib/api/services";
import { getSession } from "@/lib/core/server";

export const metadata: Metadata = {
  title: "Service Details | Luma Salon",
};

// Reads the session and fetches request-time data from the services API.
export const instant = false;

const isValidId = (id: string) => /^[a-f\d]{24}$/i.test(id);

function ErrorState({ title, message }: { title: string; message: string }) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#fdf9f6] px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-[#eaddd8] bg-white p-8 text-center shadow-lg shadow-[#6d2e46]/10 sm:p-12">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-[#f6e3e6] text-[#6d2e46]">
          <AlertTriangle className="size-7" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-[#2b2b2b]">{title}</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#8a7f7a]">
          {message}
        </p>
        <Link
          href="/services"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#6d2e46] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#512033]"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Browse all services
        </Link>
      </div>
    </main>
  );
}

type ServiceDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const ServiceDetailsPage = async ({ params }: ServiceDetailsPageProps) => {
  const { id } = await params;

  if (!isValidId(id)) {
    return (
      <ErrorState
        title="Invalid service link"
        message="This service link doesn't look right. Please check it or browse our services again."
      />
    );
  }

  let service: Service | null = null;
  let loadError = false;

  try {
    service = await getServicesById(id);
  } catch {
    loadError = true;
  }

  if (loadError) {
    return (
      <ErrorState
        title="Something went wrong"
        message="We couldn't load this service right now. Please try again in a moment."
      />
    );
  }

  if (!service) {
    return (
      <ErrorState
        title="Service not found"
        message="We couldn't find the service you're looking for. It may have been removed."
      />
    );
  }

  const session = await getSession();
  const user: BookingUser = session?.user
    ? {
        id: session.user.id,
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        role: String(session.user.role ?? "patrons"),
      }
    : null;

  return <ServiceDetails service={service} user={user} />;
};

export default ServiceDetailsPage;
