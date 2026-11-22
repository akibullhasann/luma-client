"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Clock, Inbox, Scissors, Sparkles } from "lucide-react";

import type { Service } from "@/lib/api/services";
import ServiceFilters from "@/app/components/service-filters";

type BrowseServicesProps = {
  services: Service[];
  error: string | null;
  initialCategory?: string;
};

export function BrowseServices({
  services,
  error,
  initialCategory = "",
}: BrowseServicesProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("");

  const visible = useMemo(() => {
    const text = search.trim().toLowerCase();
    const list = services.filter((s) => {
      const matchSearch = !text || s.serviceName?.toLowerCase().includes(text);
      const matchCategory = !category || s.category === category;
      return matchSearch && matchCategory;
    });

    if (sort === "price_asc") {
      return [...list].sort((a, b) => Number(a.price) - Number(b.price));
    }
    if (sort === "price_desc") {
      return [...list].sort((a, b) => Number(b.price) - Number(a.price));
    }
    return list;
  }, [services, search, category, sort]);

  const hasFilters = Boolean(search || category || sort);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSort("");
  };

  return (
    <main className="min-h-svh bg-[#fdf9f6] pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#6d2e46] via-[#6d2e46] to-[#512033] px-4 pb-20 pt-16 text-white sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-[#d98c9a]/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-1/4 size-80 rounded-full bg-[#c9a227]/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-[1600px] text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#f3d9df] backdrop-blur">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Luma Salon
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Explore our services
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#f3d9df] sm:text-lg">
            From fresh cuts to relaxing rituals, find the perfect treatment for
            you. Browse freely — no account needed.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm text-white ring-1 ring-white/20 backdrop-blur">
            <Scissors className="size-4 text-[#e8c9d1]" aria-hidden="true" />
            {services.length} {services.length === 1 ? "service" : "services"} available
          </div>
        </div>
      </section>

      <div className="relative mx-auto -mt-12 w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {error && (
          <p
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {/* Search & filters */}
        <section className="rounded-2xl border border-[#eaddd8] bg-white p-5 shadow-xl shadow-[#6d2e46]/10 sm:p-6">
          <ServiceFilters
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            sort={sort}
            setSort={setSort}
          />

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#f1e7e3] pt-5">
            <p className="text-sm text-[#8a7f7a]">
              Showing{" "}
              <span className="font-semibold text-[#6d2e46]">{visible.length}</span>{" "}
              of {services.length} services
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-[#6d2e46] ring-1 ring-[#eaddd8] transition hover:bg-[#f6e3e6]"
              >
                Clear filters
              </button>
            )}
          </div>
        </section>

        {/* Results */}
        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9a227]">
                The collection
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#2b2b2b]">
                Our services
              </h2>
            </div>
          </div>

          {visible.length === 0 && !error ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#eaddd8] bg-white py-20 text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-[#fdf9f6] text-[#c9a227]">
                <Inbox className="size-7" aria-hidden="true" />
              </div>
              <p className="text-base font-semibold text-[#2b2b2b]">
                No services found
              </p>
              <p className="mt-1 max-w-sm text-sm text-[#8a7f7a]">
                {hasFilters
                  ? "Try a different name, category, or price sort."
                  : "Check back soon — new treatments are on the way."}
              </p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-xl bg-[#6d2e46] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#512033]"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {visible.map((s) => (
                <article
                  key={s._id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#eaddd8] bg-white shadow-sm shadow-[#6d2e46]/5 transition duration-300 hover:-translate-y-1 hover:border-[#d98c9a]/60 hover:shadow-xl hover:shadow-[#6d2e46]/15"
                >
                  <div className="relative h-52 overflow-hidden bg-[#f6e3e6]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.image}
                      alt={s.serviceName}
                      className="size-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#6d2e46] shadow-sm backdrop-blur">
                      <Scissors className="size-3" aria-hidden="true" />
                      {s.category}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-semibold leading-snug text-[#2b2b2b]">
                      {s.serviceName}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#8a7f7a]">
                      {s.description || "A little something special, just for you."}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 text-sm text-[#8a7f7a]">
                        <Clock className="size-4 text-[#c9a227]" aria-hidden="true" />
                        {s.duration} min
                      </span>
                      <span className="text-xl font-bold text-[#c9a227]">
                        ${Number(s.price).toFixed(2)}
                      </span>
                    </div>

                    <Link
                      href={`/services/${s._id}`}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#6d2e46] px-4 py-2.5 text-sm font-semibold text-[#6d2e46] transition hover:bg-[#6d2e46] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6d2e46]"
                    >
                      View Details
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
