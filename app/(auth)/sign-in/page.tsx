"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { FcGoogle } from "react-icons/fc";
import { HiSparkles } from "react-icons/hi2";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { authClient } from "@/lib/auth-client";

const labelClassName = "mb-1.5 block text-sm font-medium text-[#2b2b2b]";
const inputClassName =
  "h-11 w-full rounded-xl border border-[#eaddd8] bg-[#fdf9f6] px-3.5 text-sm text-[#2b2b2b] outline-none transition placeholder:text-[#8a7f7a]/70 focus:border-[#d98c9a] focus:ring-4 focus:ring-[#d98c9a]/15";

export default function SignInPage() {
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));

    const { error } = await authClient.signIn.email({
      email: data.email as string,
      password: data.password as string,
      callbackURL: "/",
    });
    if (error) {
      toast.error(error.message ?? "Sign in failed. Please try again.");
      return;
    }

    toast.success("Signed in successfully.");
    router.push("/");
  }

  async function handleGoogleSignIn() {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });

    if (error) {
      toast.error(error.message ?? "Google sign in failed. Please try again.");
    }
  }

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#fdf9f6] px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(246,227,230,0.7),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(201,162,39,0.08),_transparent_45%)]" />
      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-[#eaddd8] bg-white/90 p-6 shadow-xl shadow-[#6d2e46]/5 backdrop-blur-sm sm:p-8">
          <Link
            href="/"
            className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6d2e46]"
            aria-label="Luma home"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-[#6d2e46] text-[#fdf9f6] shadow-sm">
              <HiSparkles className="size-4" aria-hidden="true" />
            </span>
            <span className="font-heading text-xl font-semibold tracking-tight text-[#6d2e46]">
              Luma
            </span>
          </Link>

          <h1 className="text-center font-heading text-2xl font-semibold tracking-tight text-[#2b2b2b] sm:text-3xl">
            Welcome back
          </h1>
          <p className="mt-2 text-center text-sm text-[#8a7f7a]">
            Sign in to manage your salon bookings.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="sign-in-email" className={labelClassName}>
                Email
              </label>
              <input
                id="sign-in-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="sign-in-password" className={labelClassName}>
                Password
              </label>
              <input
                id="sign-in-password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                className={inputClassName}
              />
            </div>

            <Button
              type="submit"
              className="h-11 w-full rounded-full bg-[#c9a227] text-sm font-semibold text-[#512033] shadow-sm hover:bg-[#b8911f] focus-visible:border-[#c9a227] focus-visible:ring-[#c9a227]/40 active:bg-[#a8821b]"
            >
              Sign In
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-[#eaddd8]" />
            <span className="text-xs uppercase tracking-wide text-[#8a7f7a]">
              or
            </span>
            <span className="h-px flex-1 bg-[#eaddd8]" />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            className="h-11 w-full gap-2 rounded-full border-[#eaddd8] bg-white text-sm font-medium text-[#2b2b2b] hover:bg-[#f6e3e6]/50 hover:text-[#512033] focus-visible:border-[#6d2e46] focus-visible:ring-[#6d2e46]/20"
          >
            <FcGoogle className="size-5" aria-hidden="true" />
            Continue with Google
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-[#8a7f7a]">
          New to Luma?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-[#6d2e46] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6d2e46]"
          >
            Create an account
          </Link>
        </p>
      </div>
      <Toaster richColors position="top-center" />
    </main>
  );
}
