import type { Metadata } from "next";

import { ManageAppointments } from "@/app/components/appoinments/manage-appointments";
import type { Appointment } from "@/typescript";

export const metadata: Metadata = {
  title: "Manage Appointments — SalonBook",
};

const ManageAppointmentsPage = async () => {
  // TODO: API থেকে appointment আনো
  const appointments: Appointment[] = [];
  const error: string | null = null;

  return (
    <div className="min-h-svh bg-[#fdf9f6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <ManageAppointments appointments={appointments} error={error} />
      </div>
    </div>
  );
};

export default ManageAppointmentsPage;