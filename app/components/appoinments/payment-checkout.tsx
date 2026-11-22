"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { formatDate } from "@/lib/format";
import type { Appointment } from "@/typescript";

type PaymentCheckoutProps = {
  appointment: Appointment;
};

export function PaymentCheckout({ appointment: a }: PaymentCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayNow = async () => {
    // Stripe Checkout integration will be wired here later.
    // Future flow: create a Checkout Session on the server, then redirect:
    // window.location.href = checkoutUrl;
    setIsProcessing(true);
    try {
      // Placeholder for future Stripe Checkout redirect.
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.info("Stripe Checkout redirect will be connected here.", {
        appointmentId: a._id,
        amount: a.servicePrice,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const amount = Number(a.servicePrice ?? 0);

  return (
    <main className="min-h-svh bg-[#fdf9f6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <Link
          href="/dashboard/patrons/appointments"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#6d2e46] transition hover:text-[#512033]"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to My Appointments
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          {/* Summary */}
          <section className="rounded-2xl border border-[#eaddd8] bg-white p-6 shadow-sm shadow-[#6d2e46]/5 lg:col-span-3">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a227]">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Payment Summary
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#2b2b2b] sm:text-3xl">
              Review your payment
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[#8a7f7a]">
              Confirm your appointment details below before proceeding to secure
              payment.
            </p>

            <div className="mt-6 overflow-hidden rounded-xl border border-[#f1e7e3]">
              <div className="flex gap-4 p-4 sm:p-5">
                {a.serviceImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={a.serviceImage}
                    alt={a.serviceName}
                    className="size-20 shrink-0 rounded-xl object-cover ring-1 ring-black/5 sm:size-24"
                  />
                ) : (
                  <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-[#f6e3e6] text-[#6d2e46] sm:size-24">
                    <Sparkles className="size-6" aria-hidden="true" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#c9a227]">
                    {a.serviceCategory || "Service"}
                  </p>
                  <h2 className="mt-1 truncate text-lg font-semibold text-[#2b2b2b]">
                    {a.serviceName || "Salon Service"}
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#8a7f7a]">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="size-4 text-[#6d2e46]" aria-hidden="true" />
                      {formatDate(a.appointmentDate)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-4 text-[#6d2e46]" aria-hidden="true" />
                      {a.timeSlot}
                    </span>
                  </div>
                </div>
              </div>

              <dl className="border-t border-[#f1e7e3] bg-[#fdf9f6] px-4 py-4 sm:px-5">
                <div className="flex items-center justify-between text-sm">
                  <dt className="text-[#8a7f7a]">Service price</dt>
                  <dd className="font-medium text-[#2b2b2b]">
                    ${amount.toFixed(2)}
                  </dd>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <dt className="text-[#8a7f7a]">Booking fee</dt>
                  <dd className="font-medium text-[#2b2b2b]">$0.00</dd>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[#eaddd8] pt-3">
                  <dt className="text-base font-semibold text-[#2b2b2b]">
                    Total due
                  </dt>
                  <dd className="text-2xl font-bold text-[#c9a227]">
                    ${amount.toFixed(2)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-6 rounded-xl bg-[#fdf9f6] p-4 text-sm text-[#8a7f7a] ring-1 ring-[#f1e7e3]">
              <p className="font-medium text-[#2b2b2b]">Booking details</p>
              <p className="mt-1">
                Customer: <span className="text-[#2b2b2b]">{a.customerName || "—"}</span>
              </p>
              <p>
                Status:{" "}
                <span className="capitalize text-[#2b2b2b]">{a.status}</span>
                {" · "}
                Payment:{" "}
                <span className="capitalize text-[#2b2b2b]">{a.paymentStatus}</span>
              </p>
            </div>
          </section>

          {/* Payment action */}
          <section className="rounded-2xl border border-[#eaddd8] bg-white p-6 shadow-sm shadow-[#6d2e46]/5 lg:col-span-2">
            <div className="flex size-12 items-center justify-center rounded-xl bg-[#f6e3e6] text-[#6d2e46]">
              <CreditCard className="size-6" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-[#2b2b2b]">
              Secure payment
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#8a7f7a]">
              You’ll be redirected to a secure checkout to complete your payment.
            </p>

            <div className="mt-6 rounded-xl border border-[#eaddd8] bg-[#fdf9f6] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8a7f7a]">Amount to pay</span>
                <span className="text-xl font-bold text-[#2b2b2b]">
                  ${amount.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePayNow}
              disabled={isProcessing || a.paymentStatus === "paid" || a.status !== "confirmed"}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6d2e46] px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#6d2e46]/20 transition hover:bg-[#512033] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6d2e46] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CreditCard className="size-4" aria-hidden="true" />
              {a.paymentStatus === "paid"
                ? "Already Paid"
                : isProcessing
                  ? "Processing..."
                  : "Pay Now"}
            </button>

            <div className="mt-4 space-y-2 text-xs text-[#8a7f7a]">
              <p className="flex items-center gap-2">
                <Lock className="size-3.5 text-[#c9a227]" aria-hidden="true" />
                Secure checkout powered by Stripe (coming soon)
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck className="size-3.5 text-[#c9a227]" aria-hidden="true" />
                Your payment details are encrypted and protected
              </p>
            </div>

            <p className="mt-6 text-center text-xs text-[#a99c96]">
              By clicking Pay Now, you’ll proceed to complete this booking
              payment.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
