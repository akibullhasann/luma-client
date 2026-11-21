"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Lock,
  Scissors,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import { Toaster } from "@/components/ui/sonner";
import type { Service } from "@/lib/api/services";

export type BookingUser = {
  id: string;
  name: string;
  email: string;
  role: string;
} | null;

type ServiceDetailsProps = {
  service: Service;
  user: BookingUser;
};

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

const fieldClass =
  "h-12 w-full rounded-xl border border-[#eaddd8] bg-white px-4 text-sm text-[#2b2b2b] outline-none transition placeholder:text-[#a99c96] focus:border-[#d98c9a] focus:ring-4 focus:ring-[#d98c9a]/20";

const labelClass = "mb-2 block text-sm font-semibold text-[#2b2b2b]";

export function ServiceDetails({ service, user }: ServiceDetailsProps) {
  const [fullName, setFullName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const minDate = new Date().toISOString().slice(0, 10);

  const isActive = service.status === "active";
  const isCustomer = Boolean(user && user.role !== "admin");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isCustomer || !isActive) return;

    setSubmitted(true);
    toast.success("Appointment request sent! We'll be in touch soon.");
  };

  return (
    <main className="min-h-svh bg-[#fdf9f6] pb-20">
      <Toaster />

      {/* Breadcrumb */}
      <div className="border-b border-[#eaddd8] bg-white/70">
        <nav
          aria-label="Breadcrumb"
          className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-4 text-sm text-[#8a7f7a] sm:px-6 lg:px-8"
        >
          <Link href="/" className="transition hover:text-[#6d2e46]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/services" className="transition hover:text-[#6d2e46]">
            Services
          </Link>
          <span aria-hidden="true">/</span>
          <span className="truncate font-medium text-[#6d2e46]">
            {service.serviceName}
          </span>
        </nav>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <Link
          href="/services"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#6d2e46] transition hover:gap-3"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to services
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* Image + about */}
          <div>
            <div className="relative overflow-hidden rounded-3xl border border-[#eaddd8] bg-[#f6e3e6] shadow-xl shadow-[#6d2e46]/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={service.image}
                alt={service.serviceName}
                className="aspect-[4/3] w-full object-cover"
              />
              <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-[#6d2e46] shadow-sm backdrop-blur">
                <Scissors className="size-3.5" aria-hidden="true" />
                {service.category}
              </span>
            </div>

            <section className="mt-8 rounded-2xl border border-[#eaddd8] bg-white p-6 shadow-sm shadow-[#6d2e46]/5 sm:p-8">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#c9a227]">
                <Sparkles className="size-3.5" aria-hidden="true" />
                About this service
              </p>
              <h2 className="mt-2 text-xl font-bold text-[#2b2b2b]">
                {service.serviceName}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#8a7f7a]">
                {service.description || "A little something special, just for you."}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl bg-[#fdf9f6] p-4 ring-1 ring-[#eaddd8]">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-[#f6e3e6] text-[#6d2e46]">
                    <Clock className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs text-[#a99c96]">Estimated duration</p>
                    <p className="font-semibold text-[#2b2b2b]">
                      {service.duration} minutes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-[#fdf9f6] p-4 ring-1 ring-[#eaddd8]">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-[#f6e3e6] text-[#6d2e46]">
                    <CalendarDays className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs text-[#a99c96]">Availability</p>
                    <p className="font-semibold text-[#2b2b2b]">
                      {isActive ? "Open for bookings" : "Unavailable"}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Booking card */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <section className="overflow-hidden rounded-3xl border border-[#eaddd8] bg-white shadow-xl shadow-[#6d2e46]/10">
              <div className="bg-gradient-to-br from-[#6d2e46] to-[#512033] p-6 text-white sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e8c9d1]">
                  {service.category}
                </p>
                <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
                  {service.serviceName}
                </h1>
                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs text-[#e8c9d1]">Starting from</p>
                    <p className="text-3xl font-bold text-[#f2d78a]">
                      ${Number(service.price).toFixed(2)}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs ring-1 ring-white/20">
                    <Clock className="size-3.5" aria-hidden="true" />
                    {service.duration} min
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {!user ? (
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#f6e3e6] text-[#6d2e46]">
                      <Lock className="size-6" aria-hidden="true" />
                    </div>
                    <h2 className="text-lg font-bold text-[#2b2b2b]">
                      Sign in to book
                    </h2>
                    <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#8a7f7a]">
                      You can explore services freely, but you need an account to
                      request an appointment.
                    </p>
                    <Link
                      href="/sign-in"
                      className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#6d2e46] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#512033]"
                    >
                      Sign in to continue
                    </Link>
                    <p className="mt-4 text-xs text-[#a99c96]">
                      New here?{" "}
                      <Link
                        href="/sign-up"
                        className="font-semibold text-[#6d2e46] hover:underline"
                      >
                        Create an account
                      </Link>
                    </p>
                  </div>
                ) : user.role === "admin" ? (
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                      <ShieldAlert className="size-6" aria-hidden="true" />
                    </div>
                    <h2 className="text-lg font-bold text-[#2b2b2b]">
                      Admin accounts can&apos;t book
                    </h2>
                    <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#8a7f7a]">
                      Appointment requests are for customers only. Please use a
                      customer account to book this service.
                    </p>
                  </div>
                ) : !isActive ? (
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
                      <CalendarDays className="size-6" aria-hidden="true" />
                    </div>
                    <h2 className="text-lg font-bold text-[#2b2b2b]">
                      Not available for booking
                    </h2>
                    <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#8a7f7a]">
                      This service is currently inactive. Browse our other
                      treatments to find one you love.
                    </p>
                    <Link
                      href="/services"
                      className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#6d2e46] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#512033]"
                    >
                      Browse other services
                    </Link>
                  </div>
                ) : submitted ? (
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                      <CheckCircle2 className="size-7" aria-hidden="true" />
                    </div>
                    <h2 className="text-lg font-bold text-[#2b2b2b]">
                      Request received!
                    </h2>
                    <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#8a7f7a]">
                      Thanks, {fullName || "there"}. We&apos;ll confirm your{" "}
                      {service.serviceName} appointment for {date} at {time} soon.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setDate("");
                        setTime("");
                        setMessage("");
                      }}
                      className="mt-6 w-full rounded-xl border border-[#6d2e46] px-4 py-3 text-sm font-semibold text-[#6d2e46] transition hover:bg-[#f6e3e6]"
                    >
                      Request another appointment
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <h2 className="text-lg font-bold text-[#2b2b2b]">
                        Request an appointment
                      </h2>
                      <p className="mt-1 text-sm text-[#8a7f7a]">
                        Pick a date and time — we&apos;ll confirm with you shortly.
                      </p>
                    </div>

                    <div>
                      <label htmlFor="booking-name" className={labelClass}>
                        Full name
                      </label>
                      <input
                        id="booking-name"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your name"
                        className={fieldClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="booking-email" className={labelClass}>
                        Email address
                      </label>
                      <input
                        id="booking-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={fieldClass}
                      />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="booking-date" className={labelClass}>
                          Preferred date
                        </label>
                        <input
                          id="booking-date"
                          type="date"
                          required
                          min={minDate}
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className={fieldClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="booking-time" className={labelClass}>
                          Preferred time
                        </label>
                        <select
                          id="booking-time"
                          required
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className={`${fieldClass} cursor-pointer`}
                        >
                          <option value="">Select a time</option>
                          {TIME_SLOTS.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="booking-message" className={labelClass}>
                        Anything we should know? <span className="font-normal text-[#a99c96]">(optional)</span>
                      </label>
                      <textarea
                        id="booking-message"
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about your preferences..."
                        className="w-full resize-none rounded-xl border border-[#eaddd8] bg-white px-4 py-3 text-sm text-[#2b2b2b] outline-none transition placeholder:text-[#a99c96] focus:border-[#d98c9a] focus:ring-4 focus:ring-[#d98c9a]/20"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-[#6d2e46] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#6d2e46]/25 transition hover:-translate-y-0.5 hover:bg-[#512033] hover:shadow-xl"
                    >
                      Request appointment
                    </button>
                    <p className="text-center text-xs text-[#a99c96]">
                      No payment needed now. We&apos;ll confirm the details first.
                    </p>
                  </form>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
