import Link from "next/link";
import { Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
  { href: "/#why-choose-us", label: "Why Choose Us" },
  { href: "/sign-up", label: "Create Account" },
];

const serviceLinks = [
  { href: "/services?category=Hair", label: "Hair Care" },
  { href: "/services?category=Skin", label: "Skin Care" },
  { href: "/services?category=Makeup", label: "Makeup" },
  { href: "/services?category=Spa", label: "Spa & Relaxation" },
];

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-plum to-plum-deep text-cream">
      <div
        className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full bg-white/5"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 right-10 size-72 rounded-full bg-gold/10"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1600px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="lg:pr-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              aria-label="Luma home"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-cream/15 text-gold ring-1 ring-white/15">
                <Sparkles className="size-5" aria-hidden="true" />
              </span>
              <span className="font-heading text-2xl font-semibold tracking-tight text-cream">
                Luma
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-rose-soft/85">
              Your destination for premium salon experiences. Discover curated
              services, book with ease, and let our experts bring out your
              natural glow.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { href: "https://facebook.com", label: "Facebook", icon: FaFacebookF },
                { href: "https://instagram.com", label: "Instagram", icon: FaInstagram },
                { href: "https://x.com", label: "X", icon: FaXTwitter },
              ].map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-rose-soft transition hover:-translate-y-0.5 hover:border-gold/50 hover:bg-gold/15 hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  <Icon className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-rose-soft/85 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              Popular Services
            </h3>
            <ul className="mt-5 space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-rose-soft/85 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              Get In Touch
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-rose-soft/85">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-gold">
                  <MapPin className="size-4" aria-hidden="true" />
                </span>
                <span className="leading-relaxed">
                  123 Beauty Avenue, London, UK
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-gold">
                  <Phone className="size-4" aria-hidden="true" />
                </span>
                <a
                  href="tel:+442012345678"
                  className="leading-relaxed transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  +44 20 1234 5678
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-gold">
                  <Mail className="size-4" aria-hidden="true" />
                </span>
                <a
                  href="mailto:hello@luma-salon.com"
                  className="leading-relaxed transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  hello@luma-salon.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-rose-soft/70">
            © 2026 Luma Salon. All rights reserved.
          </p>
          <p className="text-sm text-rose-soft/70">
            Crafted with care for your beauty &amp; wellness.
          </p>
        </div>
      </div>
    </footer>
  );
}