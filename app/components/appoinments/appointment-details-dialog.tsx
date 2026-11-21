"use client";

import { useState } from "react";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/format";
import type { Appointment } from "@/typescript";

type AppointmentDetailsDialogProps = {
  appointment: Appointment;
};

export function AppointmentDetailsDialog({
  appointment: a,
}: AppointmentDetailsDialogProps) {
  const [open, setOpen] = useState(false);

  const rows: [string, string][] = [
    ["Customer", a.customerName],
    ["Email", a.customerEmail],
    ["Service", a.serviceName],
    ["Category", a.serviceCategory],
    ["Date", formatDate(a.appointmentDate)],
    ["Time", a.timeSlot],
    ["Price", `$${Number(a.servicePrice).toFixed(2)}`],
    ["Status", a.status],
    ["Payment", a.paymentStatus],
    ["Requested on", formatDate(a.createdAt)],
    ["Message", a.message || "No message"],
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-[#6d2e46] ring-1 ring-[#eaddd8] transition hover:bg-[#fdf9f6]"
          />
        }
      >
        <Eye className="size-3.5" aria-hidden="true" />
        Details
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Appointment details</DialogTitle>
          <DialogDescription>Full information about this booking.</DialogDescription>
        </DialogHeader>

        <dl className="space-y-2.5 text-sm">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between gap-4 border-b border-[#f1e7e3] pb-2"
            >
              <dt className="text-[#8a7f7a]">{label}</dt>
              <dd className="text-right font-medium capitalize text-[#2b2b2b]">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}