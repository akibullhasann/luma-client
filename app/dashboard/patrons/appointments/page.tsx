import type { Metadata } from "next";


import { getSession } from "@/lib/core/server";
import type { Appointment } from "@/typescript/appoinment";
import { getAppointments } from "@/lib/api/appoinments";
import { MyAppointments } from "@/app/components/appoinments/my-appointments";


export const metadata: Metadata = {
  title: "My Appointments — SalonBook",
};

export const instant = false;

type AppointmentResponse = Appointment & {
  service?: { serviceName?: string; image?: string; category?: string };
  customer?: { name?: string; email?: string };
};

const normalizeAppointment = (item: AppointmentResponse): Appointment => {
  const { service, customer, ...rest } = item;
  return {
    ...rest,
    customerName: customer?.name ?? item.customerName ?? "",
    customerEmail: customer?.email ?? item.customerEmail ?? "",
    serviceName: service?.serviceName ?? item.serviceName ?? "",
    serviceImage: service?.image ?? item.serviceImage ?? "",
    serviceCategory: service?.category ?? item.serviceCategory ?? "",
  };
};

const MyAppointmentsPage = async () => {
  let appointments: Appointment[] = [];
  let error: string | null = null;

  const session = await getSession();
  const customerId = session?.user.id;

  if (customerId) {
    try {
      // শুধু নিজের appointment
      const data = await getAppointments(`customerId=${customerId}`);
      appointments = (data as unknown as AppointmentResponse[]).map(
        normalizeAppointment
      );
    } catch (cause) {
      error = cause instanceof Error ? cause.message : "Failed to load appointments.";
    }
  }

  return (
    <main className="min-h-svh bg-[#fdf9f6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1600px]">
        <MyAppointments appointments={appointments} error={error} />
      </div>
    </main>
  );
};

export default MyAppointmentsPage;