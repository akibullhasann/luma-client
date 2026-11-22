"use client";

import { useState } from "react";
import Link from "next/link";
import {
    CalendarClock,
    Clock,
    CreditCard,
    Inbox,
    X,
} from "lucide-react";

import { AppointmentDetailsDialog } from "@/app/components/appoinments/appointment-details-dialog";
import { Toaster } from "@/components/ui/sonner";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import type {
    Appointment,
    AppointmentStatus,
    PaymentStatus,
} from "@/typescript/appoinment";
import { useRouter } from "next/navigation";
import { updateAppointmentStatus } from "@/lib/actions/appoinments";

type MyAppointmentsProps = {
    appointments: Appointment[];
    error: string | null;
};

const statusStyle: Record<AppointmentStatus, { bar: string; badge: string }> = {
    pending: { bar: "border-l-amber-400", badge: "bg-amber-50 text-amber-700 ring-amber-200" },
    confirmed: { bar: "border-l-green-500", badge: "bg-green-50 text-green-700 ring-green-200" },
    cancelled: { bar: "border-l-red-400", badge: "bg-red-50 text-red-700 ring-red-200" },
};

const paymentStyle: Record<PaymentStatus, string> = {
    unpaid: "bg-gray-100 text-gray-600 ring-gray-200",
    paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export function MyAppointments({
    appointments,
    error,
}: MyAppointmentsProps) {
    
    const [status, setStatus] = useState("");
    const router = useRouter();
     const [busyId, setBusyId] = useState<string | null>(null); 

    // TODO: লজিক এখানে বসাও
    const handleCancel = async (appointment: Appointment) => {
        try {
            setBusyId(appointment._id);
            await updateAppointmentStatus(appointment._id, "cancelled");
            toast.success("Appointment cancelled.");
            router.refresh();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not cancel.");
        } finally {
            setBusyId(null);
        }
    };
    const handlePay = (a: Appointment) => {
        router.push(`/dashboard/patrons/appointments/${a._id}/pay`);
    };

    const count = (s: AppointmentStatus) =>
        appointments.filter((a) => a.status === s).length;

    const stats = [
        { label: "Total", value: appointments.length, color: "text-[#2b2b2b]" },
        { label: "Pending", value: count("pending"), color: "text-amber-600" },
        { label: "Confirmed", value: count("confirmed"), color: "text-green-600" },
        { label: "Cancelled", value: count("cancelled"), color: "text-red-500" },
    ];

    const tabs = [
        { value: "", label: "All", count: appointments.length },
        { value: "pending", label: "Pending", count: count("pending") },
        { value: "confirmed", label: "Confirmed", count: count("confirmed") },
        { value: "cancelled", label: "Cancelled", count: count("cancelled") },
    ];

    const visible = appointments.filter((a) => !status || a.status === status);

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
                        My Appointments
                    </h1>
                    <p className="mt-1 text-sm text-[#8a7f7a]">
                        Track your bookings, cancel requests and pay for confirmed visits.
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

            {/* Status tabs */}
            <div className="flex flex-wrap gap-2">
                {tabs.map((t) => (
                    <button
                        key={t.label}
                        type="button"
                        onClick={() => setStatus(t.value)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${status === t.value
                                ? "bg-[#6d2e46] text-white shadow-md shadow-[#6d2e46]/25"
                                : "bg-white text-[#6d2e46] ring-1 ring-[#eaddd8] hover:bg-[#f6e3e6]"
                            }`}
                    >
                        {t.label} ({t.count})
                    </button>
                ))}
            </div>

            {/* List */}
            {visible.length === 0 && !error ? (
                <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#eaddd8] bg-white py-20 text-center">
                    <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-[#fdf9f6] text-[#c9a227]">
                        <Inbox className="size-7" aria-hidden="true" />
                    </div>
                    <p className="text-base font-semibold text-[#2b2b2b]">
                        No appointments found
                    </p>
                    <p className="mt-1 max-w-sm text-sm text-[#8a7f7a]">
                        {appointments.length === 0
                            ? "Once you book a service, your appointment details will show up here."
                            : "No appointments match this filter."}
                    </p>
                    {appointments.length === 0 && (
                        <Link
                            href="/services"
                            className="mt-5 inline-flex items-center rounded-xl bg-[#6d2e46] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#512033]"
                        >
                            Browse services
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid gap-3">
                    {visible.map((a) => (
                        <div
                            key={a._id}
                            className={`flex flex-col gap-4 rounded-2xl border border-l-4 border-[#eaddd8] bg-white p-4 shadow-sm shadow-[#6d2e46]/5 transition hover:shadow-lg hover:shadow-[#6d2e46]/10 sm:p-5 lg:flex-row lg:items-center ${statusStyle[a.status].bar}`}
                        >
                            {/* Service image */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={a.serviceImage}
                                alt={a.serviceName}
                                className="h-36 w-full rounded-xl object-cover ring-1 ring-black/5 lg:h-24 lg:w-32"
                            />

                            {/* Info */}
                            <div className="min-w-0 flex-1 space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="truncate text-base font-semibold text-[#2b2b2b]">
                                        {a.serviceName}
                                    </h3>
                                    <span className="text-xs text-[#8a7f7a]">{a.serviceCategory}</span>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#8a7f7a]">
                                    <span className="inline-flex items-center gap-1.5">
                                        <CalendarClock className="size-3.5" aria-hidden="true" />
                                        {formatDate(a.appointmentDate)}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <Clock className="size-3.5" aria-hidden="true" />
                                        {a.timeSlot}
                                    </span>
                                    <span className="text-lg font-bold text-[#c9a227]">
                                        ${Number(a.servicePrice).toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-1.5">
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
                                    <span className="text-xs text-[#a99c96]">
                                        Requested {formatDate(a.createdAt)}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                                <AppointmentDetailsDialog appointment={a} />

                                {/* Pay Now: শুধু confirmed + unpaid */}
                                {a.status === "confirmed" && a.paymentStatus === "unpaid" && (
                                    <button
                                        type="button"
                                        disabled={busyId === a._id}
                                        onClick={() => handlePay(a)}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#6d2e46] px-3 py-2 text-sm font-semibold text-white shadow-md shadow-[#6d2e46]/20 transition hover:bg-[#512033] disabled:opacity-50"
                                    >
                                        <CreditCard className="size-3.5" aria-hidden="true" />
                                        Pay now
                                    </button>
                                )}

                                {/* Cancel: শুধু pending */}
                                {a.status === "pending" && (
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
    );
}