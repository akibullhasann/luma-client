"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { FcGoogle } from "react-icons/fc";
import { HiSparkles } from "react-icons/hi2";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const labelClassName = "mb-1.5 block text-sm font-medium text-ink";
const inputClassName =
  "h-11 w-full rounded-lg border border-blush bg-cream px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-luma-muted/70 focus:border-plum focus:ring-2 focus:ring-plum/15";

export default function SignInPage() {
    const router = useRouter();
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    console.log("Sign in form data:", data);

    
    const { data: signUpResponse, error } = await authClient.signIn.email({
                
                email: data.email as string,
                password: data.password as string,
                callbackURL: '/'
            })
            if (error) {
                toast.error(error.message ?? "Sign up failed. Please try again.");
                return;
            }
    
            toast.success("Account created successfully.");
            router.push("/");



  }

  return (
    <main className="flex flex-1 items-center justify-center bg-cream px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-blush bg-white/80 p-6 shadow-sm sm:p-8">
          <Link
            href="/"
            className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-plum"
            aria-label="Luma home"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-plum text-cream">
              <HiSparkles className="size-4" aria-hidden="true" />
            </span>
            <span className="font-heading text-xl font-semibold text-plum">
              Luma
            </span>
          </Link>

          <h1 className="text-center font-heading text-2xl font-semibold text-plum sm:text-3xl">
            Welcome back
          </h1>
          <p className="mt-2 text-center text-sm text-luma-muted">
            Sign in to manage your salon bookings.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
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
              className="h-11 w-full rounded-full bg-gold text-sm font-semibold text-plum-deep hover:bg-gold/85 focus-visible:border-gold focus-visible:ring-gold/50 active:bg-gold/70"
            >
              Sign In
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-blush" />
            <span className="text-xs uppercase tracking-wide text-luma-muted">
              or
            </span>
            <span className="h-px flex-1 bg-blush" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full gap-2 rounded-full border-blush bg-cream text-sm font-medium text-ink hover:bg-rose-soft/60 focus-visible:border-plum focus-visible:ring-plum/30"
          >
            <FcGoogle className="size-5" aria-hidden="true" />
            Continue with Google
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-luma-muted">
          New to Luma?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-plum hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
