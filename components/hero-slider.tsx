"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "cn";

const slides = [
  {
    src: "/assests/hero-1.jpg",
    alt: "Warm salon interior with gold mirrors and wood slats",
    objectPosition: "center center",
  },
  {
    src: "/assests/hero-2.jpg",
    alt: "Moody salon with dark walls and round mirrors",
    objectPosition: "left center",
  },
  {
    src: "/assests/hero-3.jpg",
    alt: "Bright white salon interior with a chandelier",
    objectPosition: "center center",
  },
] as const;

const SLIDE_INTERVAL_MS = 6000;

const ctaClassName =
  "inline-flex items-center justify-center rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-plum-deep shadow-lg transition-colors hover:bg-gold/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold active:bg-gold/70 sm:px-9 sm:text-base";

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPaused = isHovered || isFocused;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion || isPaused) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [reduceMotion, isPaused]);

  return (
    <section
      aria-label="Salon appointment booking hero"
      className="relative isolate flex min-h-[70vh] w-full overflow-hidden bg-plum-deep md:min-h-[85vh]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsFocused(false);
        }
      }}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.src}
          aria-hidden={index !== activeIndex}
          className={cn(
            "pointer-events-none absolute inset-0",
            !reduceMotion && "transition-opacity duration-700 ease-in-out",
            index === activeIndex ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: slide.objectPosition }}
            preload={index === 0}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent"
          />
          {index === 2 && (
            <div aria-hidden="true" className="absolute inset-0 bg-black/20" />
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/20 md:hidden"
          />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-5 py-20 text-center text-white md:items-start md:px-8 md:text-left lg:px-12">
        <div className="max-w-3xl">
          <h1 className="font-heading text-4xl font-bold leading-[1.1] tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
            Book Your Perfect Look, Anytime
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg md:mx-0 md:mt-6 md:text-xl">
            Discover top salon services, choose your time, and book your
            appointment in minutes.
          </p>
          <Link
            href="/services"
            className={cn(ctaClassName, "mt-8 md:mt-10")}
          >
            Explore Salon Services
          </Link>
        </div>
      </div>

      <div
        role="group"
        aria-label="Choose a background slide"
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 md:bottom-8"
      >
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show slide ${index + 1}: ${slide.alt}`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "size-2.5 rounded-full border border-white/70 bg-white/30 transition-colors hover:bg-white/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold md:size-3",
              index === activeIndex && "border-gold bg-gold hover:bg-gold"
            )}
          />
        ))}
      </div>
    </section>
  );
}
