import type { Metadata } from "next";
import { CreditCard, ReceiptText } from "lucide-react";

import { requireRole } from "@/lib/core/server";

export const metadata: Metadata = {
  title: "Transactions — Luma Admin",
};

export const instant = false;

export default async function AdminTransactionsPage() {
  await requireRole("admin");

  return (
    <main className="min-h-svh bg-[#fdf9f6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1600px] space-y-6">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6d2e46] to-[#512033] p-7 text-white shadow-xl shadow-[#6d2e46]/20 sm:p-8">
          <div className="absolute -right-10 -top-14 size-44 rounded-full bg-white/5" aria-hidden="true" />
          <div className="relative">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#e8c9d1]">
              <CreditCard className="size-3.5" aria-hidden="true" />
              Payments
            </p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Transactions</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#e8c9d1]">
              Review payment activity and transaction records for your salon bookings.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-[#eaddd8] bg-white p-8 text-center shadow-sm shadow-[#6d2e46]/5 sm:p-12">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#f6e3e6] text-[#6d2e46]">
            <ReceiptText className="size-7" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-[#2b2b2b]">No transactions to display</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#8a7f7a]">
            Completed payment transactions will appear here as customers pay for their appointments.
          </p>
        </section>
      </div>
    </main>
  );
}
