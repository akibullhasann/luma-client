"use client";

import Link from "next/link";
import { useState } from "react";

import type { Service } from "@/lib/api/services";
import { toast } from "sonner";
import { deleteService, updateService } from "@/lib/actions/services";
import {
  CalendarDays,
  Check,
  Clock,
  Inbox,
  Pencil,
  Plus,
  Scissors,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { EditServiceDialog } from "./edit-service-dialog";
import ServiceFilters from "./service-filters";

type ManageServicesProps = {
  services: Service[];
  error: string | null;
};

export function ManageServices({ services: initialServices, error }: ManageServicesProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  
  const handleToggle = async (service: Service) => {
    const next = service.status === "active" ? "inactive" : "active";
    try {
      setBusyId(service._id);
      await updateService(service._id, { status: next });

      setServices((prev) =>
        prev.map((s) => (s._id === service._id ? { ...s, status: next } : s))
      );
      toast.success(`Service ${next === "active" ? "activated" : "deactivated"}.`);
    } catch {
      toast.error(`Could not update "${service.serviceName}".`);
    } finally {
      setBusyId(null);
    }
  };


  const handleDelete = async(id: string) => {
    try {
      setBusyId(id);
      await deleteService(id);

      setServices((prev) => prev.filter((s) => s._id !== id));
      toast.success("Service deleted.");
    } catch {
      toast.error("Could not delete the service.");
    } finally {
      setBusyId(null);
      setConfirmId(null);
    }
  };

  const handleUpdated = (updated: Service) => {
  setServices((prev) => prev.map((s) => (s._id === updated._id ? updated : s)));
};
  const tabs = [
    { value: "", label: "All", count: services.length },
    {
      value: "active",
      label: "Active",
      count: services.filter((s) => s.status === "active").length,
    },
    {
      value: "inactive",
      label: "Inactive",
      count: services.filter((s) => s.status === "inactive").length,
    },
  ];

  const visible = services
    .filter((s) => {
      const matchesSearch = s.serviceName
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory = category ? s.category === category : true;
      const matchesStatus = status ? s.status === status : true;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sort === "price_asc") return Number(a.price) - Number(b.price);
      if (sort === "price_desc") return Number(b.price) - Number(a.price);
      return 0;
    });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6d2e46] to-[#512033] text-cream shadow-lg shadow-[#6d2e46]/25">
            <Scissors className="size-6" aria-hidden="true" />
          </div>
          <div>
            <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#c9a227]">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Luma Admin
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-[#2b2b2b]">
              Manage services
            </h1>
            <p className="mt-1 text-sm text-[#8a7f7a]">
              Inactive services are hidden from Browse Services.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/admin/services/add"
          className="inline-flex items-center gap-2 rounded-xl bg-[#6d2e46] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#6d2e46]/25 transition hover:-translate-y-0.5 hover:bg-[#512033] hover:shadow-xl hover:shadow-[#6d2e46]/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6d2e46]"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add service
        </Link>
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

      {/* Filters */}
      <div className="rounded-2xl border border-[#eaddd8] bg-white p-5 shadow-sm shadow-[#6d2e46]/5 sm:p-6">
        <ServiceFilters
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          sort={sort}
          setSort={setSort}
        />

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#f1e7e3] pt-5">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-[#a99c96]">
            Status
          </span>
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
            Service catalog
          </h2>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#8a7f7a] ring-1 ring-[#eaddd8]">
            {visible.length} {visible.length === 1 ? "service" : "services"}
          </span>
        </div>

        {visible.length === 0 && !error ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#eaddd8] bg-white py-20 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-[#fdf9f6] text-[#c9a227]">
              <Inbox className="size-7" aria-hidden="true" />
            </div>
            <p className="text-base font-semibold text-[#2b2b2b]">No services found</p>
            <p className="mt-1 max-w-sm text-sm text-[#8a7f7a]">
              Add your first service to start building your salon catalog.
            </p>
            <Link
              href="/dashboard/admin/services/add"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#6d2e46] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#512033]"
            >
              <Plus className="size-4" aria-hidden="true" />
              Add a service
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {visible.map((s) => (
              <div
                key={s._id}
                className="group flex flex-col gap-5 rounded-2xl border border-[#eaddd8] bg-white p-4 shadow-sm shadow-[#6d2e46]/5 transition duration-200 hover:-translate-y-0.5 hover:border-[#d98c9a]/50 hover:shadow-lg hover:shadow-[#6d2e46]/10 sm:flex-row sm:items-center sm:p-5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image}
                  alt={s.serviceName}
                  className="h-40 w-full rounded-xl object-cover ring-1 ring-black/5 sm:h-24 sm:w-32"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-base font-semibold text-[#2b2b2b]">
                      {s.serviceName}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        s.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          s.status === "active" ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                      {s.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#8a7f7a]">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fdf9f6] px-2.5 py-1 text-xs font-medium text-[#6d2e46] ring-1 ring-[#eaddd8]">
                      <Scissors className="size-3" aria-hidden="true" />
                      {s.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-3.5" aria-hidden="true" />
                      {s.duration} min
                    </span>
                    <span className="text-lg font-bold text-[#c9a227]">
                      ${Number(s.price).toFixed(2)}
                    </span>
                  </div>

                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#a99c96]">
                    <CalendarDays className="size-3.5" aria-hidden="true" />
                    Added{" "}
                    {s.createdAt
                      ? new Date(s.createdAt).toLocaleDateString("en-GB")
                      : "-"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => handleToggle(s)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                      s.status === "active"
                        ? "bg-green-50 text-green-700 ring-1 ring-green-200 hover:bg-green-100"
                        : "bg-gray-50 text-gray-600 ring-1 ring-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        s.status === "active" ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                    {busyId === s._id ? "Updating..." : s.status === "active" ? "Active" : "Inactive"}
                  </button>

                  <EditServiceDialog service={s} onUpdated={handleUpdated} />

                  {confirmId === s._id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDelete(s._id)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-red-600/20 transition hover:bg-red-700"
                      >
                        <Check className="size-3.5" aria-hidden="true" />
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmId(null)}
                        className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-[#8a7f7a] ring-1 ring-[#eaddd8] transition hover:bg-[#fdf9f6]"
                      >
                        <X className="size-3.5" aria-hidden="true" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmId(s._id)}
                      className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-red-600 ring-1 ring-red-200 transition hover:bg-red-50"
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                      Delete
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
