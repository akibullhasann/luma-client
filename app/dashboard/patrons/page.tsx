import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarCheck2,
  CalendarClock,
  CheckCircle2,
  Inbox,
  Sparkles,
  XCircle,
} from "lucide-react";

import { getAppointments } from "@/lib/api/appoinments";
import { getSession } from "@/lib/core/server";
import type { Appointment } from "@/typescript";

export const metadata: Metadata = {
  title: "Dashboard Overview — SalonBook",
};

// Fetches request-time data from the appointments API.
export const instant = false;

const PatronsDashboardPage = async () => {
  const session = await getSession();
  const customerId = session?.user.id;

  let appointments: Appointment[] = [];
  let error: string | null = null;

  if (customerId) {
    try {
      appointments = await getAppointments(`customerId=${customerId}`);
    } catch (cause) {
      error = cause instanceof Error ? cause.message : "Failed to load appointments.";
    }
  }

  const count = (status: Appointment["status"]) =>
    appointments.filter((item) => item.status === status).length;

  const stats = [
    {
      label: "Total Appointment Requests",
      value: appointments.length,
      icon: Inbox,
      tone: "bg-[#f6e3e6] text-[#6d2e46]",
    },
    {
      label: "Pending Appointments",
      value: count("pending"),
      icon: CalendarClock,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      label: "Confirmed Appointments",
      value: count("confirmed"),
      icon: CheckCircle2,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Cancelled Appointments",
      value: count("cancelled"),
      icon: XCircle,
      tone: "bg-red-50 text-red-600",
    },
  ];

  const firstName = session?.user.name?.trim().split(/\s+/)[0] || "there";

  return (
    <main className="min-h-svh bg-[#fdf9f6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        {/* Welcome banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6d2e46] to-[#512033] p-7 text-white shadow-xl shadow-[#6d2e46]/20 sm:p-10">
          <div className="absolute -right-12 -top-16 size-56 rounded-full bg-white/5" aria-hidden="true" />
          <div className="absolute -bottom-20 right-24 size-40 rounded-full bg-[#f2d78a]/10" aria-hidden="true" />
          <div className="relative">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#e8c9d1]">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Customer Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
              Welcome back, {firstName}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#e8c9d1]">
              Here&apos;s a quick look at your salon bookings. Track your requests,
              confirmations and cancellations in one place.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dashboard/patrons/appointments"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#6d2e46] transition hover:bg-[#f6e3e6]"
              >
                <CalendarCheck2 className="size-4" aria-hidden="true" />
                My Appointments
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Browse Services
              </Link>
            </div>
          </div>
        </section>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {!customerId && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Please{" "}
            <Link href="/sign-in" className="font-semibold underline">
              sign in
            </Link>{" "}
            to see your appointment overview.
          </p>
        )}

        {/* Overview stats */}
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#2b2b2b]">Overview</h2>
              <p className="mt-1 text-sm text-[#8a7f7a]">
                Your appointment activity at a glance.
              </p>
            </div>
            <span className="hidden text-sm text-[#a99c96] sm:block">
              {appointments.length} total
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ label, value, icon: Icon, tone }) => (
              <div
                key={label}
                className="rounded-2xl border border-[#eaddd8] bg-white p-5 shadow-sm shadow-[#6d2e46]/5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#6d2e46]/10"
              >
                <div className={`flex size-11 items-center justify-center rounded-xl ${tone}`}>
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <p className="mt-4 text-3xl font-bold text-[#2b2b2b]">{value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#a99c96]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {!error && customerId && appointments.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#eaddd8] bg-white p-10 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#f6e3e6] text-[#6d2e46]">
              <Inbox className="size-6" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#2b2b2b]">
              No appointment requests yet
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[#8a7f7a]">
              Browse our services and send your first booking request.
            </p>
            <Link
              href="/services"
              className="mt-5 inline-flex rounded-xl bg-[#6d2e46] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#512033]"
            >
              Explore services
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default PatronsDashboardPage;
