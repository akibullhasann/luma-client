"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";

import Navbar from "@/components/navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <Suspense
      fallback={
        <div className="h-16 w-full border-b border-blush bg-cream" />
      }
    >
      <Navbar />
    </Suspense>
  );
}
