import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import ConditionalNavbar from "@/components/conditional-navbar";
import ConditionalFooter from "@/components/conditional-footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luma | Salon Appointment Booking",
  description: "Explore salon services and book your appointment with Luma.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{ scrollPaddingTop: "4rem" }}
    >
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <ConditionalNavbar />
        </Suspense>
        {children}
        <ConditionalFooter />
      </body>
    </html>
  );
}
