import type { Metadata } from "next";
import { ShieldCheck, UserRound, UsersRound } from "lucide-react";

import UserBlockButton from "@/components/user-block-button";
import { Toaster } from "@/components/ui/sonner";
import { getUsers } from "@/lib/actions/better-auth-user";
import { requireRole } from "@/lib/core/server";
import type { ManagedUser } from "@/lib/users";

export const metadata: Metadata = {
  title: "Manage Users — Luma",
};

export const instant = false;

function formatDate(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function initials(name: string, email: string) {
  const source = (name || email || "U").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default async function ManageUsersPage() {
  await requireRole("admin");

  let users: ManagedUser[] = [];
  let error: string | null = null;

  try {
    users = await getUsers();
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "Failed to load users.";
  }

  return (
    <main className="min-h-svh bg-[#fdf9f6] px-4 py-6 sm:px-6 lg:px-8">
      <Toaster richColors position="top-center" />
      <div className="mx-auto w-full max-w-[1600px] space-y-6">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6d2e46] to-[#512033] p-7 text-white shadow-xl shadow-[#6d2e46]/20 sm:p-8">
          <div
            className="absolute -right-10 -top-14 size-44 rounded-full bg-white/5"
            aria-hidden="true"
          />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#e8c9d1]">
                <UsersRound className="size-3.5" aria-hidden="true" />
                User Management
              </p>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Manage Users</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#e8c9d1]">
                View all registered customers, monitor account details, and keep
                your salon community organized.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <UserRound className="size-5 text-[#f2d78a]" aria-hidden="true" />
              <div>
                <p className="text-2xl font-bold leading-none">{users.length}</p>
                <p className="text-xs uppercase tracking-wider text-[#e8c9d1]">
                  Registered Customers
                </p>
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
            <h2 className="text-lg font-semibold text-[#2b2b2b]">
              All Registered Customers
            </h2>
            <p className="mt-1 text-sm text-[#8a7f7a]">
              Customer account details from your Luma platform.
            </p>
          </div>

          {users.length === 0 && !error ? (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#f6e3e6] text-[#6d2e46]">
                <UsersRound className="size-6" aria-hidden="true" />
              </div>
              <p className="mt-4 text-base font-medium text-[#2b2b2b]">
                No registered customers yet
              </p>
              <p className="mt-1 text-sm text-[#8a7f7a]">
                When customers sign up, they will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#fdf9f6] text-xs uppercase tracking-wider text-[#8a7f7a]">
                  <tr>
                    <th className="px-5 py-3 font-semibold sm:px-6">Customer</th>
                    <th className="px-5 py-3 font-semibold">Email</th>
                    <th className="px-5 py-3 font-semibold">Role</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Joined</th>
                    <th className="px-5 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0e6e1]">
                  {users.map((user) => (
                    <tr key={user.id} className="transition hover:bg-[#fdf9f6]/70">
                      <td className="px-5 py-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={user.image}
                              alt=""
                              className="size-10 rounded-full object-cover ring-1 ring-[#eaddd8]"
                            />
                          ) : (
                            <span className="flex size-10 items-center justify-center rounded-full bg-[#f6e3e6] text-sm font-semibold text-[#6d2e46] ring-1 ring-[#eaddd8]">
                              {initials(user.name, user.email)}
                            </span>
                          )}
                          <div className="min-w-0">
                            <p className="truncate font-medium text-[#2b2b2b]">
                              {user.name || "Unnamed customer"}
                            </p>
                            <p className="text-xs text-[#8a7f7a]">ID: {user.id.slice(0, 8)}…</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#5d5550]">{user.email || "—"}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-[#f6e3e6] px-2.5 py-1 text-xs font-medium capitalize text-[#6d2e46]">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {user.banned ? (
                          <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                            Banned
                          </span>
                        ) : user.emailVerified ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                            <ShieldCheck className="size-3.5" aria-hidden="true" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-[#5d5550]">{formatDate(user.createdAt)}</td>
                      <td className="px-5 py-4 text-right">
                        <UserBlockButton
                          userId={user.id}
                          banned={user.banned}
                          userName={user.name || user.email}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}