import type { Metadata } from "next";
import { CalendarDays, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";

import ProfileEditForm from "@/components/profile-edit-form";
import { requireRole } from "@/lib/core/server";

export const metadata: Metadata = {
  title: "My Profile — Luma",
};

export const instant = false;

function formatDate(value: unknown) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function initials(name?: string | null, email?: string | null) {
  const source = (name || email || "U").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default async function PatronProfilePage() {
  const session = await requireRole("patrons");
  const user = session.user as typeof session.user & {
    createdAt?: Date | string | null;
    emailVerified?: boolean | null;
    image?: string | null;
    phoneNumber?: string | null;
  };

  const details = [
    {
      label: "Full Name",
      value: user.name || "—",
      icon: UserRound,
    },
    {
      label: "Email Address",
      value: user.email || "—",
      icon: Mail,
    },
    {
      label: "Phone Number",
      value: user.phoneNumber || "—",
      icon: Phone,
    },
    {
      label: "Account Type",
      value: "Customer",
      icon: UserRound,
    },
    {
      label: "Member Since",
      value: formatDate(user.createdAt),
      icon: CalendarDays,
    },
  ];

  return (
    <main className="min-h-svh bg-[#fdf9f6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1600px] space-y-6">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6d2e46] to-[#512033] p-7 text-white shadow-xl shadow-[#6d2e46]/20 sm:p-8">
          <div className="absolute -right-10 -top-14 size-44 rounded-full bg-white/5" aria-hidden="true" />
          <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name ? `${user.name} profile photo` : "Profile photo"}
                className="size-24 rounded-full object-cover ring-4 ring-white/20"
              />
            ) : (
              <div className="flex size-24 items-center justify-center rounded-full bg-white/15 text-3xl font-bold text-white ring-4 ring-white/20">
                {initials(user.name, user.email)}
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e8c9d1]">
                My Profile
              </p>
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{user.name || "Customer"}</h1>
              <p className="mt-2 text-sm text-[#e8c9d1]">{user.email}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
                  <UserRound className="size-3.5" aria-hidden="true" />
                  Customer
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                    user.emailVerified
                      ? "bg-emerald-400/20 text-emerald-100"
                      : "bg-amber-400/20 text-amber-100"
                  }`}
                >
                  <ShieldCheck className="size-3.5" aria-hidden="true" />
                  {user.emailVerified ? "Email Verified" : "Email Not Verified"}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#eaddd8] bg-white p-6 shadow-sm shadow-[#6d2e46]/5 sm:p-7">
          <h2 className="text-lg font-semibold text-[#2b2b2b]">Account Details</h2>
          <p className="mt-1 text-sm text-[#8a7f7a]">
            Your personal information and account status.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {details.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-xl border border-[#efe3de] bg-[#fdf9f6] p-4"
              >
                <div className="flex items-center gap-2 text-[#8a7f7a]">
                  <Icon className="size-4 text-[#6d2e46]" aria-hidden="true" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {label}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-[#2b2b2b] break-words">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <ProfileEditForm
          initialName={user.name || ""}
          initialPhone={user.phoneNumber || ""}
        />
      </div>
    </main>
  );
}