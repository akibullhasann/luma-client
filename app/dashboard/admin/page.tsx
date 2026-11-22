import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Scissors,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";

import { getAppointments } from "@/lib/api/appoinments";
import { getService } from "@/lib/api/services";
import { getSession } from "@/lib/core/server";
import type { Appointment } from "@/typescript";

export const metadata: Metadata = {
  title: "Dashboard Overview — SalonBook",
};

// Fetches request-time data from the services and appointments APIs.
export const instant = false;

const AdminDashboardPage = async () => {
  const session = await getSession();
  const adminId = session?.user?.id ?? "";

  let totalCustomers = 0;
  let activeServices = 0;
  let appointments: Appointment[] = [];
  let error: string | null = null;

  const [servicesResult, appointmentsResult] = await Promise.allSettled([
    getService(adminId ? `adminId=${adminId}` : ""),
    getAppointments(),
  ]);

  if (servicesResult.status === "fulfilled") {
    const adminServices = servicesResult.value;
    activeServices = adminServices.filter((s) => s.status === "active").length;
    const adminServiceIds = new Set(adminServices.map((s) => s._id));

    if (appointmentsResult.status === "fulfilled") {
      appointments = appointmentsResult.value.filter((item) =>
        adminServiceIds.has(item.serviceId)
      );
    }
  } else if (appointmentsResult.status === "fulfilled") {
    appointments = [];
  }

  if (appointmentsResult.status === "rejected" || servicesResult.status === "rejected") {
    error = "Some overview data could not be loaded.";
  }

  totalCustomers = new Set(
    appointments
      .map((item) => item.customerId)
      .filter((id): id is string => Boolean(id))
  ).size;

  const count = (status: Appointment["status"]) =>
    appointments.filter((item) => item.status === status).length;

  const stats = [
    {
      label: "Total Customers",
      value: totalCustomers,
      icon: Users,
      tone: "bg-[#f6e3e6] text-[#6d2e46]",
    },
    {
      label: "Total Active Services",
      value: activeServices,
      icon: Scissors,
      tone: "bg-[#fdf3d9] text-[#a88418]",
    },
    {
      label: "Total Appointment Requests",
      value: appointments.length,
      icon: ClipboardList,
      tone: "bg-violet-50 text-violet-700",
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
      label: "Total Successful Payments",
      value: appointments.filter((item) => item.paymentStatus === "paid").length,
      icon: Wallet,
      tone: "bg-sky-50 text-sky-700",
    },
  ];

  const firstName = session?.user.name?.trim().split(/\s+/)[0] || "Admin";

  return (
    <main className="min-h-svh bg-[#fdf9f6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1600px] space-y-8">
        {/* Welcome banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6d2e46] to-[#512033] p-7 text-white shadow-xl shadow-[#6d2e46]/20 sm:p-10">
          <div className="absolute -right-12 -top-16 size-56 rounded-full bg-white/5" aria-hidden="true" />
          <div className="absolute -bottom-20 right-24 size-40 rounded-full bg-[#f2d78a]/10" aria-hidden="true" />
          <div className="relative">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#e8c9d1]">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Admin Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
              Welcome back, {firstName}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#e8c9d1]">
              Your salon at a glance — customers, services, bookings and payments.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dashboard/admin/services"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#6d2e46] transition hover:bg-[#f6e3e6]"
              >
                <Scissors className="size-4" aria-hidden="true" />
                Manage Services
              </Link>
              <Link
                href="/dashboard/admin/appointments"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <ClipboardList className="size-4" aria-hidden="true" />
                Manage Appointments
              </Link>
            </div>
          </div>
        </section>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          >
            {error}
          </p>
        )}

        {/* Overview stats */}
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#2b2b2b]">Overview</h2>
              <p className="mt-1 text-sm text-[#8a7f7a]">
                Everything happening across your salon.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      </div>
    </main>
  );
};

export default AdminDashboardPage;
