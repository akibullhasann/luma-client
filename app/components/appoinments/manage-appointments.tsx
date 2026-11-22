"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CalendarClock,
  Check,
  Clock,
  Inbox,
  MessageSquare,
  Search,
  X,
} from "lucide-react";

import { Toaster } from "@/components/ui/sonner";
import { updateAppointmentStatus } from "@/lib/actions/appoinments";
import type { Appointment, AppointmentStatus, PaymentStatus } from "@/typescript";
import { AppointmentDetailsDialog } from "./appointment-details-dialog";

type ManageAppointmentsProps = {
  appointments: Appointment[];
  error: string | null;
};

const inputClass =
  "h-11 w-full rounded-xl border border-[#eaddd8] bg-white pl-10 pr-4 text-sm text-[#2b2b2b] placeholder:text-[#a99c96] outline-none transition focus:border-[#d98c9a] focus:ring-4 focus:ring-[#d98c9a]/20";


const statusStyle: Record<AppointmentStatus, { bar: string; badge: string }> = {
  pending: { bar: "border-l-amber-400", badge: "bg-amber-50 text-amber-700 ring-amber-200" },
  confirmed: { bar: "border-l-green-500", badge: "bg-green-50 text-green-700 ring-green-200" },
  cancelled: { bar: "border-l-red-400", badge: "bg-red-50 text-red-700 ring-red-200" },
};

const paymentStyle: Record<PaymentStatus, string> = {
  unpaid: "bg-gray-100 text-gray-600 ring-gray-200",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};


function DateTile({ value }: { value: string }) {
  const date = new Date(value);
  const valid = !Number.isNaN(date.getTime());

  return (
    <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#6d2e46] text-white">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#e8c9d1]">
        {valid ? date.toLocaleString("en-GB", { month: "short" }) : "-"}
      </span>
      <span className="text-2xl font-bold leading-none">
        {valid ? date.getDate() : "-"}
      </span>
    </div>
  );
}


function Avatar({ name }: { name: string }) {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f6e3e6] text-sm font-semibold text-[#6d2e46]">
      {name?.charAt(0).toUpperCase() || "?"}
    </span>
  );
}

export function ManageAppointments({
  appointments: initialAppointments,
  error,
}: ManageAppointmentsProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const router = useRouter();

  const handleConfirm = async (a: Appointment) => {
    if (a.status !== "pending") {
      toast.error("Only pending requests can be confirmed.");
      return;
    }

    try {
      setBusyId(a._id);
      await updateAppointmentStatus(a._id, "confirmed");
      setAppointments((current) =>
        current.map((item) =>
          item._id === a._id ? { ...item, status: "confirmed" as const } : item
        )
      );
      toast.success("Appointment confirmed.");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not confirm appointment."
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleCancel = async (a: Appointment) => {
    if (a.status !== "pending" && a.status !== "confirmed") {
      toast.error("Only pending or confirmed appointments can be cancelled.");
      return;
    }
    if (a.paymentStatus === "paid") {
      toast.error("Paid appointments cannot be cancelled.");
      return;
    }

    try {
      setBusyId(a._id);
      await updateAppointmentStatus(a._id, "cancelled");
      setAppointments((current) =>
        current.map((item) =>
          item._id === a._id ? { ...item, status: "cancelled" as const } : item
        )
      );
      toast.success("Appointment cancelled.");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not cancel appointment."
      );
    } finally {
      setBusyId(null);
    }
  };

 
  const visible = appointments.filter((a) => {
    const text = search.trim().toLowerCase();
    const matchSearch =
      !text ||
      a.customerName?.toLowerCase().includes(text) ||
      a.serviceName?.toLowerCase().includes(text);
    const matchStatus = !status || a.status === status;
    return matchSearch && matchStatus;
  });

  const count = (s: AppointmentStatus) =>
    appointments.filter((a) => a.status === s).length;

  const stats = [
    { label: "Pending", value: count("pending"), color: "text-amber-600" },
    { label: "Confirmed", value: count("confirmed"), color: "text-green-600" },
    { label: "Cancelled", value: count("cancelled"), color: "text-red-500" },
    {
      label: "Paid",
      value: appointments.filter((a) => a.paymentStatus === "paid").length,
      color: "text-emerald-600",
    },
  ];

  const tabs = [
    { value: "", label: "All", count: appointments.length },
    { value: "pending", label: "Pending", count: count("pending") },
    { value: "confirmed", label: "Confirmed", count: count("confirmed") },
    { value: "cancelled", label: "Cancelled", count: count("cancelled") },
  ];

  return (
    <div className="space-y-8">
      <Toaster />
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6d2e46] to-[#512033] text-white shadow-lg shadow-[#6d2e46]/25">
          <CalendarClock className="size-6" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#2b2b2b]">
            Appointments
          </h1>
          <p className="mt-1 text-sm text-[#8a7f7a]">
            Review requests, then confirm or cancel bookings.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-[#eaddd8] bg-white p-4 shadow-sm shadow-[#6d2e46]/5"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-[#a99c96]">
              {s.label}
            </p>
            <p className={`mt-1 text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-[#eaddd8] bg-white p-5 shadow-sm shadow-[#6d2e46]/5">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#a99c96]"
            aria-hidden="true"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer or service"
            className={inputClass}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => setStatus(t.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                status === t.value
                  ? "bg-[#6d2e46] text-white shadow-md shadow-[#6d2e46]/25"
                  : "bg-[#fdf9f6] text-[#6d2e46] ring-1 ring-[#eaddd8] hover:bg-[#f6e3e6]"
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#8a7f7a]">
            Booking requests
          </h2>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#8a7f7a] ring-1 ring-[#eaddd8]">
            {visible.length} {visible.length === 1 ? "booking" : "bookings"}
          </span>
        </div>

        {visible.length === 0 && !error ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#eaddd8] bg-white py-20 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-[#fdf9f6] text-[#c9a227]">
              <Inbox className="size-7" aria-hidden="true" />
            </div>
            <p className="text-base font-semibold text-[#2b2b2b]">No appointments found</p>
            <p className="mt-1 max-w-sm text-sm text-[#8a7f7a]">
              {appointments.length === 0
                ? "Customer booking requests will appear here."
                : "No bookings match your search or filter."}
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {visible.map((a) => (
              <div
                key={a._id}
                className={`flex flex-col gap-4 rounded-2xl border border-l-4 border-[#eaddd8] bg-white p-4 shadow-sm shadow-[#6d2e46]/5 transition hover:shadow-lg hover:shadow-[#6d2e46]/10 sm:p-5 lg:flex-row lg:items-center ${statusStyle[a.status].bar}`}
              >
                {/* Date + time */}
                <div className="flex items-center gap-3 lg:w-40 lg:shrink-0">
                  <DateTile value={a.appointmentDate} />
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2b2b2b]">
                    <Clock className="size-3.5 text-[#8a7f7a]" aria-hidden="true" />
                    {a.timeSlot}
                  </span>
                </div>

                {/* Service + customer */}
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-base font-semibold text-[#2b2b2b]">
                      {a.serviceName}
                    </h3>
                    <span className="text-xs text-[#8a7f7a]">{a.serviceCategory}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Avatar name={a.customerName} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#2b2b2b]">
                        {a.customerName}
                      </p>
                      <p className="truncate text-xs text-[#8a7f7a]">{a.customerEmail}</p>
                    </div>
                  </div>

                  {a.message && (
                    <p className="flex items-start gap-1.5 text-xs text-[#8a7f7a]">
                      <MessageSquare className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                      <span className="line-clamp-1">{a.message}</span>
                    </p>
                  )}
                </div>

                {/* Price + badges */}
                <div className="flex flex-row items-center gap-3 lg:w-40 lg:shrink-0 lg:flex-col lg:items-start lg:gap-2">
                  <span className="text-xl font-bold text-[#c9a227]">
                    ${Number(a.servicePrice).toFixed(2)}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${statusStyle[a.status].badge}`}
                    >
                      {a.status}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${paymentStyle[a.paymentStatus]}`}
                    >
                      {a.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  <AppointmentDetailsDialog appointment={a} />

                  
                  {a.status === "pending" && (
                    <button
                      type="button"
                      disabled={busyId === a._id}
                      onClick={() => handleConfirm(a)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#6d2e46] px-3 py-2 text-sm font-semibold text-white shadow-md shadow-[#6d2e46]/20 transition hover:bg-[#512033] disabled:opacity-50"
                    >
                      <Check className="size-3.5" aria-hidden="true" />
                      Confirm
                    </button>
                  )}

                  {/* Cancel: pending বা confirmed হলে */}
                  {(a.status === "pending" || a.status === "confirmed") && (
                    <button
                      type="button"
                      disabled={busyId === a._id}
                      onClick={() => handleCancel(a)}
                      className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-red-600 ring-1 ring-red-200 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      <X className="size-3.5" aria-hidden="true" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}