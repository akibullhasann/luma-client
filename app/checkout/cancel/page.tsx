import type { Metadata } from "next";
import Link from "next/link";
import { CircleAlert, ArrowLeft, CreditCard } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Canceled — SalonBook",
};

export const instant = false;

type PaymentCancelPageProps = {
  searchParams: Promise<{ appointmentId?: string | string[] }>;
};

export default async function PaymentCancelPage({
  searchParams,
}: PaymentCancelPageProps) {
  const { appointmentId: rawAppointmentId } = await searchParams;
  const appointmentId = Array.isArray(rawAppointmentId)
    ? rawAppointmentId[0]
    : rawAppointmentId;

  return (
    <main className="min-h-svh bg-[#fdf9f6] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg rounded-2xl border border-[#eaddd8] bg-white p-8 text-center shadow-sm">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-amber-50 text-amber-600 ring-1 ring-amber-200">
          <CircleAlert className="size-8" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-[#2b2b2b]">Payment canceled</h1>
        <p className="mt-2 text-sm text-[#8a7f7a]">
          Your payment was not completed. Your appointment is still reserved, and you can try paying again when you’re ready.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {appointmentId && (
            <Link
              href={`/checkout?id=${encodeURIComponent(appointmentId)}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6d2e46] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#512033]"
            >
              <CreditCard className="size-4" aria-hidden="true" />
              Try Again
            </Link>
          )}
          <Link
            href="/dashboard/patrons/appointments"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#eaddd8] px-4 py-2.5 text-sm font-semibold text-[#6d2e46] hover:bg-[#fdf9f6]"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to My Appointments
          </Link>
        </div>
      </div>
    </main>
  );
}
