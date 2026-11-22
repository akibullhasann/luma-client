"use client";

type ServiceFiltersProps = {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
};

const CATEGORIES = [
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Makeup",
  "Manicure & Pedicure",
  "Spa & Massage",
];

const inputClass =
  "h-11 rounded-xl border border-[#eaddd8] bg-white px-3.5 text-sm text-[#2b2b2b] outline-none transition placeholder:text-[#8a7f7a]/70 focus:border-[#d98c9a] focus:ring-4 focus:ring-[#d98c9a]/15";

export default function ServiceFilters({
  search,
  setSearch,
  category,
  setCategory,
  sort,
  setSort,
}: ServiceFiltersProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row">
      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by service name"
        className={`${inputClass} flex-1`}
      />

      {/* Category */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className={inputClass}
      >
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className={inputClass}
      >
        <option value="">Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  );
}