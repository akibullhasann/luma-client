import type { Metadata } from "next";
import { CreditCard, DollarSign, ReceiptText, ShieldCheck } from "lucide-react";

import { getAppointments } from "@/lib/api/appoinments";
import { getService } from "@/lib/api/services";
import { getSession, requireRole } from "@/lib/core/server";
import type { Appointment } from "@/typescript";

export const metadata: Metadata = {
  title: "Transactions — Luma Admin",
};

export const instant = false;

type TransactionRow = Appointment & {
  paymentId?: string;
  paidAt?: string;
  stripeSessionId?: string;
};

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(amount: number) {
  if (!Number.isFinite(amount)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default async function AdminTransactionsPage() {
  await requireRole("admin");
  const session = await getSession();
  const adminId = session?.user?.id ?? "";

  let transactions: TransactionRow[] = [];
  let error: string | null = null;

  try {
    const [services, appointments] = await Promise.all([
      getService(adminId ? `adminId=${adminId}` : ""),
      getAppointments() as Promise<TransactionRow[]>,
    ]);
    const adminServiceIds = new Set(services.map((s) => s._id));

    transactions = appointments
      .filter((a) => a.paymentStatus === "paid" && adminServiceIds.has(a.serviceId))
      .sort((a, b) => {
        const da = new Date(a.paidAt || a.createdAt || 0).getTime();
        const db = new Date(b.paidAt || b.createdAt || 0).getTime();
        return db - da;
      });
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "Failed to load transactions.";
  }

  const totalRevenue = transactions.reduce(
    (sum, t) => sum + (Number(t.servicePrice) || 0),
    0,
  );

  return (
    <main className="min-h-svh bg-[#fdf9f6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1600px] space-y-6">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6d2e46] to-[#512033] p-7 text-white shadow-xl shadow-[#6d2e46]/20 sm:p-8">
          <div className="absolute -right-10 -top-14 size-44 rounded-full bg-white/5" aria-hidden="true" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#e8c9d1]">
                <CreditCard className="size-3.5" aria-hidden="true" />
                Payments
              </p>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Transactions</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#e8c9d1]">
                Review completed payment transactions for salon bookings.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:flex">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <ReceiptText className="size-5 text-[#f2d78a]" aria-hidden="true" />
                <div>
                  <p className="text-2xl font-bold leading-none">{transactions.length}</p>
                  <p className="text-xs uppercase tracking-wider text-[#e8c9d1]">Transactions</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <DollarSign className="size-5 text-[#f2d78a]" aria-hidden="true" />
                <div>
                  <p className="text-2xl font-bold leading-none">{formatCurrency(totalRevenue)}</p>
                  <p className="text-xs uppercase tracking-wider text-[#e8c9d1]">Total Revenue</p>
                </div>
              </div>
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

        <section className="overflow-hidden rounded-2xl border border-[#eaddd8] bg-white shadow-sm shadow-[#6d2e46]/5">
          <div className="border-b border-[#eaddd8] px-5 py-4 sm:px-6">
            <h2 className="text-lg font-semibold text-[#2b2b2b]">Payment Transactions</h2>
            <p className="mt-1 text-sm text-[#8a7f7a]">
              All successful customer payments recorded in Luma.
            </p>
          </div>

          {transactions.length === 0 && !error ? (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#f6e3e6] text-[#6d2e46]">
                <ReceiptText className="size-6" aria-hidden="true" />
              </div>
              <p className="mt-4 text-base font-medium text-[#2b2b2b]">No transactions yet</p>
              <p className="mt-1 text-sm text-[#8a7f7a]">
                Completed payment transactions will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#fdf9f6] text-xs uppercase tracking-wider text-[#8a7f7a]">
                  <tr>
                    <th className="px-5 py-3 font-semibold sm:px-6">Transaction</th>
                    <th className="px-5 py-3 font-semibold">Customer</th>
                    <th className="px-5 py-3 font-semibold">Service</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Amount</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0e6e1]">
                  {transactions.map((t) => {
                    const txId = t.paymentId || t.stripeSessionId || t._id;
                    return (
                      <tr key={t._id} className="transition hover:bg-[#fdf9f6]/70">
                        <td className="px-5 py-4 sm:px-6">
                          <p className="font-medium text-[#2b2b2b]">
                            #{String(txId).slice(-8).toUpperCase()}
                          </p>
                          <p className="mt-0.5 max-w-[220px] truncate text-xs text-[#8a7f7a]" title={String(txId)}>
                            {String(txId)}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-[#2b2b2b]">{t.customerName || "—"}</p>
                          <p className="text-xs text-[#8a7f7a]">{t.customerEmail || "—"}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-[#2b2b2b]">{t.serviceName || "—"}</p>
                          <p className="text-xs text-[#8a7f7a]">{t.serviceCategory || "Service"}</p>
                        </td>
                        <td className="px-5 py-4 text-[#5d5550]">
                          {formatDate(t.paidAt || t.createdAt)}
                        </td>
                        <td className="px-5 py-4 font-semibold text-[#2b2b2b]">
                          {formatCurrency(Number(t.servicePrice))}
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                            <ShieldCheck className="size-3.5" aria-hidden="true" />
                            Paid
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
