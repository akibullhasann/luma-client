import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, CircleAlert, ShieldCheck } from "lucide-react";

import { stripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Payment Successful — SalonBook",
};

export const instant = false;

type CheckoutSuccessPageProps = {
  searchParams: Promise<{ session_id?: string | string[] }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const { session_id: rawSessionId } = await searchParams;
  const sessionId = Array.isArray(rawSessionId) ? rawSessionId[0] : rawSessionId;

  if (!sessionId) {
    return (
      <main className="min-h-svh bg-[#fdf9f6] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg rounded-2xl border border-[#eaddd8] bg-white p-8 text-center shadow-sm">
          <CircleAlert className="mx-auto size-10 text-amber-500" aria-hidden="true" />
          <h1 className="mt-4 text-xl font-bold text-[#2b2b2b]">No payment session found</h1>
          <p className="mt-2 text-sm text-[#8a7f7a]">This page needs a valid Stripe checkout session.</p>
          <Link href="/dashboard/patrons/appointments" className="mt-5 inline-flex rounded-xl bg-[#6d2e46] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#512033]">
            Back to My Appointments
          </Link>
        </div>
      </main>
    );
  }

  let session: Awaited<ReturnType<typeof stripe.checkout.sessions.retrieve>> | null = null;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    session = null;
  }

  if (!session || session.payment_status !== "paid") {
    return (
      <main className="min-h-svh bg-[#fdf9f6] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg rounded-2xl border border-[#eaddd8] bg-white p-8 text-center shadow-sm">
          <CircleAlert className="mx-auto size-10 text-amber-500" aria-hidden="true" />
          <h1 className="mt-4 text-xl font-bold text-[#2b2b2b]">Payment not confirmed</h1>
          <p className="mt-2 text-sm text-[#8a7f7a]">
            We couldn’t confirm this payment. If you were charged, please contact support with your session ID.
          </p>
          <p className="mt-3 break-all rounded-lg bg-[#fdf9f6] px-3 py-2 text-xs text-[#8a7f7a] ring-1 ring-[#f1e7e3]">
            {sessionId}
          </p>
          <Link href="/dashboard/patrons/appointments" className="mt-5 inline-flex rounded-xl bg-[#6d2e46] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#512033]">
            Back to My Appointments
          </Link>
        </div>
      </main>
    );
  }

  const amountPaid = session.amount_total != null ? (session.amount_total / 100).toFixed(2) : null;
  const customerEmail = session.customer_details?.email ?? session.customer_email ?? null;

  let updateWarning: string | null = null;
  const appointmentId = session.metadata?.appointmentId;
  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;

  try {
    const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim() || "http://localhost:8000";
    const res = await fetch(`${baseUrl}/payments/confirm`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        appointmentId,
        stripeSessionId: session.id,
        paymentIntentId,
        amountTotal: session.amount_total,
        currency: session.currency,
        customerEmail: session.customer_details?.email ?? session.customer_email ?? null,
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      updateWarning = data?.message || "Payment confirmed, but it could not be recorded automatically.";
    }
  } catch {
    updateWarning = "Payment confirmed, but it could not be recorded automatically.";
  }

  return (
    <main className="min-h-svh bg-[#fdf9f6] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg rounded-2xl border border-[#eaddd8] bg-white p-8 text-center shadow-sm">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
          <CheckCircle2 className="size-8" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-[#2b2b2b]">Payment successful</h1>
        <p className="mt-2 text-sm text-[#8a7f7a]">
          Your payment has been confirmed. Thank you for booking with SalonBook.
        </p>

        <div className="mt-6 space-y-3 rounded-xl border border-[#f1e7e3] bg-[#fdf9f6] p-4 text-left text-sm">
          {amountPaid && (
            <div className="flex items-center justify-between">
              <span className="text-[#8a7f7a]">Amount paid</span>
              <span className="font-semibold text-[#2b2b2b]">${amountPaid}</span>
            </div>
          )}
          {customerEmail && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#8a7f7a]">Receipt email</span>
              <span className="truncate font-medium text-[#2b2b2b]">{customerEmail}</span>
            </div>
          )}
          <div className="flex items-center justify-between gap-4">
            <span className="text-[#8a7f7a]">Status</span>
            <span className="font-medium capitalize text-emerald-700">{session.payment_status}</span>
          </div>
        </div>

        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-[#8a7f7a]">
          <ShieldCheck className="size-3.5 text-[#c9a227]" aria-hidden="true" />
          Payment processed securely by Stripe
        </p>

        {updateWarning && (
          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            {updateWarning}
          </p>
        )}

        <Link
          href="/dashboard/patrons/appointments"
          className="mt-6 inline-flex rounded-xl bg-[#6d2e46] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#512033]"
        >
          Back to My Appointments
        </Link>
      </div>
    </main>
  );
}
