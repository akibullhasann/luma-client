import type { Metadata } from "next";
import Link from "next/link";

import { PaymentCheckout } from "@/app/components/appoinments/payment-checkout";
import { getAppointments } from "@/lib/api/appoinments";
import { getSession } from "@/lib/core/server";
import type { Appointment } from "@/typescript";

export const metadata: Metadata = {
  title: "Payment — SalonBook",
};

export const instant = false;

type PaymentPageProps = {
  params: Promise<{ id: string }>;
};

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

const PaymentPage = async ({ params }: PaymentPageProps) => {
  const { id } = await params;
  const session = await getSession();
  const customerId = session?.user.id;

  if (!customerId) {
    return (
      <main className="min-h-svh bg-[#fdf9f6] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg rounded-2xl border border-[#eaddd8] bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-[#2b2b2b]">Sign in required</h1>
          <p className="mt-2 text-sm text-[#8a7f7a]">
            Please sign in to continue with your payment.
          </p>
          <Link
            href="/sign-in"
            className="mt-5 inline-flex rounded-xl bg-[#6d2e46] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#512033]"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  let appointment: Appointment | null = null;
  let error: string | null = null;

  try {
    const data = await getAppointments(`customerId=${customerId}`);
    const found = (data as unknown as AppointmentResponse[]).find(
      (item) => item._id === id
    );
    appointment = found ? normalizeAppointment(found) : null;
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "Failed to load appointment.";
  }

  if (error) {
    return (
      <main className="min-h-svh bg-[#fdf9f6] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      </main>
    );
  }

  if (!appointment) {
    return (
      <main className="min-h-svh bg-[#fdf9f6] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg rounded-2xl border border-[#eaddd8] bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-[#2b2b2b]">Appointment not found</h1>
          <p className="mt-2 text-sm text-[#8a7f7a]">
            We couldn’t find this appointment or you don’t have access to it.
          </p>
          <Link
            href="/dashboard/patrons/appointments"
            className="mt-5 inline-flex rounded-xl bg-[#6d2e46] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#512033]"
          >
            Back to My Appointments
          </Link>
        </div>
      </main>
    );
  }

  return <PaymentCheckout appointment={appointment} />;
};

export default PaymentPage;
