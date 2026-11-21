import { CalendarClock } from "lucide-react";

const MyAppointmentsPage = () => {
  return (
    <main className="min-h-svh bg-[#fdf9f6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6d2e46] to-[#512033] text-white shadow-lg shadow-[#6d2e46]/25">
            <CalendarClock className="size-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#2b2b2b]">
              My Appointments
            </h1>
            <p className="mt-1 text-sm text-[#8a7f7a]">
              Your salon bookings will appear here.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-[#eaddd8] bg-white py-20 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-[#fdf9f6] text-[#c9a227]">
            <CalendarClock className="size-7" aria-hidden="true" />
          </div>
          <p className="text-base font-semibold text-[#2b2b2b]">
            No appointments found
          </p>
          <p className="mt-1 max-w-sm text-sm text-[#8a7f7a]">
            Once you book a service, your appointment details will show up here.
          </p>
        </div>
      </div>
    </main>
  );
};

export default MyAppointmentsPage;
