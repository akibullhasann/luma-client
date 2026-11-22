import { CalendarCheck, ShieldCheck, Sparkles, Star } from "lucide-react";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Expert Stylists",
    description:
      "Our skilled professionals bring creativity and care to every appointment, so you leave feeling confident.",
  },
  {
    icon: CalendarCheck,
    title: "Easy Booking",
    description:
      "Choose your service, pick a time, and book in minutes. Managing your appointments is simple and stress-free.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Quality",
    description:
      "We use premium products and maintain high hygiene standards to give you a safe, comfortable experience.",
  },
  {
    icon: Star,
    title: "Personalized Care",
    description:
      "Every service is tailored to your style and needs, from a quick refresh to a full pampering session.",
  },
];

export function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="bg-[#fdf9f6] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a227]">
            Why Luma
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#2b2b2b] sm:text-4xl">
            Why Choose Us
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#8a7f7a] sm:text-base">
            More than a salon visit — we make every moment feel special, from
            booking to the final look.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-[#eaddd8] bg-white p-6 text-center shadow-sm shadow-[#6d2e46]/5 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#6d2e46]/10"
            >
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#f6e3e6] text-[#6d2e46]">
                <Icon className="size-6" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-[#2b2b2b]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#8a7f7a]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
