import Link from "next/link";
import {
  ArrowUpRight,
  Flower2,
  Hand,
  Palette,
  Scissors,
  Sparkles,
  Droplets,
  Heart,
  type LucideIcon,
} from "lucide-react";

import { getService } from "@/lib/api/services";

type CategoryDef = {
  name: string;
  description: string;
  icon: LucideIcon;
};

const CATEGORY_DEFS: CategoryDef[] = [
  {
    name: "Haircut & Styling",
    description: "Fresh cuts and styles tailored to you.",
    icon: Scissors,
  },
  {
    name: "Hair Coloring",
    description: "Vibrant color, highlights, and balayage.",
    icon: Palette,
  },
  {
    name: "Hair Treatment",
    description: "Repair, nourish, and restore your hair.",
    icon: Droplets,
  },
  {
    name: "Facial & Skincare",
    description: "Glowing skin with expert care.",
    icon: Sparkles,
  },
  {
    name: "Makeup",
    description: "Looks for every occasion, flawlessly done.",
    icon: Heart,
  },
  {
    name: "Manicure & Pedicure",
    description: "Polished nails and pampering care.",
    icon: Hand,
  },
  {
    name: "Spa & Massage",
    description: "Relax, unwind, and recharge fully.",
    icon: Flower2,
  },
];

export async function ServiceCategories() {
  let counts: Record<string, number> = {};

  try {
    const services = await getService("status=active");
    counts = services.reduce<Record<string, number>>((acc, s) => {
      const key = s.category?.trim();
      if (key) acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
  } catch {
    // Show categories without counts if fetch fails.
  }

  const categories = CATEGORY_DEFS.map((c) => ({
    ...c,
    count: counts[c.name] ?? 0,
  }));

  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a227]">
            Browse by Category
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#2b2b2b] sm:text-4xl">
            Salon Service Categories
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#8a7f7a] sm:text-base">
            Find exactly what you need. Explore our range of salon services by
            category.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map(({ name, description, icon: Icon, count }) => (
            <Link
              key={name}
              href={`/services?category=${encodeURIComponent(name)}`}
              className="group flex items-start gap-4 rounded-2xl border border-[#eaddd8] bg-[#fdf9f6] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#d98c9a]/60 hover:bg-white hover:shadow-lg hover:shadow-[#6d2e46]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6d2e46]"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#f6e3e6] text-[#6d2e46] transition group-hover:bg-[#6d2e46] group-hover:text-white">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-[#2b2b2b] sm:text-base">
                    {name}
                  </h3>
                  <ArrowUpRight
                    className="mt-0.5 size-4 shrink-0 text-[#c9a227] opacity-0 transition group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-1 text-xs leading-relaxed text-[#8a7f7a] sm:text-sm">
                  {description}
                </p>
                <p className="mt-2 text-xs font-medium text-[#6d2e46]">
                  {count} {count === 1 ? "service" : "services"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
