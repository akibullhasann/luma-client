import type { Metadata } from "next";

import { ManageAppointments } from "@/app/components/appoinments/manage-appointments";
import { getAppointments } from "@/lib/api/appoinments";
import type { Appointment } from "@/typescript";

export const metadata: Metadata = {
  title: "Manage Appointments — SalonBook",
};

// Fetches request-time data from the appointments API.
export const instant = false;

type AppointmentResponse = Omit<
  Appointment,
  "customerName" | "customerEmail" | "serviceName" | "serviceImage" | "serviceCategory"
> & {
  service?: { serviceName?: string; image?: string; category?: string };
  customer?: { name?: string; email?: string };
};

const normalizeAppointment = (item: AppointmentResponse): Appointment => {
  const { service, customer, ...rest } = item;
  return {
    ...rest,
    customerName: customer?.name ?? "",
    customerEmail: customer?.email ?? "",
    serviceName: service?.serviceName ?? "",
    serviceImage: service?.image ?? "",
    serviceCategory: service?.category ?? "",
  };
};

const ManageAppointmentsPage = async () => {
  let appointments: Appointment[] = [];
  let error: string | null = null;

  try {
    const data = await getAppointments();
    appointments = (data as unknown as AppointmentResponse[]).map(
      normalizeAppointment
    );
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "Failed to load appointments.";
  }

  return (
    <div className="min-h-svh bg-[#fdf9f6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <ManageAppointments appointments={appointments} error={error} />
      </div>
    </div>
  );
};

export default ManageAppointmentsPage;