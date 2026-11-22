import Link from "next/link";
import { ArrowUpRight, Clock, Scissors } from "lucide-react";

import { getService } from "@/lib/api/services";

export async function FeaturedServices() {
  let services: Awaited<ReturnType<typeof getService>> = [];
  let error: string | null = null;

  try {
    const data = await getService("status=active");
    services = data.slice(0, 6);
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "Failed to load services.";
  }

  return (
    <section className="bg-[#fdf9f6] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a227]">
            Our Services
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#2b2b2b] sm:text-4xl">
            Featured Salon Services
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#8a7f7a] sm:text-base">
            Discover our most loved treatments, crafted to help you look and feel
            your best.
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {!error && services.length === 0 ? (
          <p className="mt-10 text-center text-sm text-[#8a7f7a]">
            No services available right now. Please check back soon.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {services.map((s) => (
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

        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-xl bg-[#6d2e46] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#6d2e46]/20 transition hover:bg-[#512033] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6d2e46]"
          >
            Explore All Services
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
