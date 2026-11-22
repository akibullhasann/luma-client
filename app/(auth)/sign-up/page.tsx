"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { FcGoogle } from "react-icons/fc";
import { HiCheckCircle, HiSparkles, HiXCircle } from "react-icons/hi2";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { authClient } from "@/lib/auth-client";

const labelClassName = "mb-1.5 block text-sm font-medium text-[#2b2b2b]";
const inputClassName =
  "h-11 w-full rounded-xl border border-[#eaddd8] bg-[#fdf9f6] px-3.5 text-sm text-[#2b2b2b] outline-none transition placeholder:text-[#8a7f7a]/70 focus:border-[#d98c9a] focus:ring-4 focus:ring-[#d98c9a]/15";
const MAX_IMAGE_MB = 5;

export default function SignUpPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [preview, setPreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const passwordRules = [
    { label: "Minimum 8 characters", isValid: password.length >= 8 },
    { label: "One uppercase letter", isValid: /[A-Z]/.test(password) },
    { label: "One lowercase letter", isValid: /[a-z]/.test(password) },
  ];

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const processFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file (JPG, PNG or WebP).");
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      toast.error(`Image must be smaller than ${MAX_IMAGE_MB} MB.`);
      return;
    }

    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));

    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("image", file);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGEBB_API_KEY}`,
        { method: "POST", body: fd },
      );
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error("Image upload failed.");

      setImageUrl(data.data.url);
    } catch (error) {
      console.error(error);
      if (preview) URL.revokeObjectURL(preview);
      setPreview("");
      setImageUrl("");
      toast.error("Image upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview("");
    setImageUrl("");
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (uploading) {
      toast.error("Wait for the image upload to finish.");
      return;
    }

    const data = Object.fromEntries(new FormData(event.currentTarget));

    const { error } = await authClient.signUp.email({
      name: data.name as string,
      email: data.email as string,
      password: data.password as string,
      image: imageUrl || undefined,
      callbackURL: "/",
    });
    if (error) {
      toast.error(error.message ?? "Sign up failed. Please try again.");
      return;
    }

    toast.success("Account created successfully.");
    router.push("/");
  }

  async function handleGoogleSignUp() {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });

    if (error) {
      toast.error(error.message ?? "Google sign up failed. Please try again.");
    }
  }

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#fdf9f6] px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(246,227,230,0.7),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(201,162,39,0.08),_transparent_45%)]" />
      <div className="relative w-full max-w-lg">
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
            Create your account
          </h1>
          <p className="mt-2 text-center text-sm text-[#8a7f7a]">
            Join Luma and book your perfect look in minutes.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <span className={labelClassName}>Profile Photo (optional)</span>
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  {preview ? (
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preview}
                        alt="Selected profile preview"
                        className="size-20 rounded-full object-cover ring-2 ring-[#eaddd8]"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        aria-label="Remove image"
                        className="absolute -right-1 -top-1 rounded-full bg-white p-1 text-[#2b2b2b] shadow ring-1 ring-[#eaddd8] hover:bg-[#f6e3e6]/60"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex size-20 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-[#eaddd8] bg-[#fdf9f6] text-[#8a7f7a] transition hover:border-[#6d2e46] hover:text-[#6d2e46]">
                      <ImagePlus className="size-5" aria-hidden="true" />
                      <span className="sr-only">Upload profile photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => processFile(e.target.files?.[0])}
                        className="sr-only"
                      />
                    </label>
                  )}
                </div>
                <div className="min-w-0 text-sm text-[#8a7f7a]">
                  {uploading ? (
                    <p className="flex items-center gap-2 text-[#6d2e46]">
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      Uploading image...
                    </p>
                  ) : (
                    <>
                      <p>Upload a profile photo.</p>
                      <p className="text-xs">JPG, PNG or WebP, up to {MAX_IMAGE_MB} MB.</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="sign-up-name" className={labelClassName}>
                Full Name
              </label>
              <input
                id="sign-up-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Your full name"
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="sign-up-email" className={labelClassName}>
                Email
              </label>
              <input
                id="sign-up-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="sign-up-password" className={labelClassName}>
                Password
              </label>
              <input
                id="sign-up-password"
                name="password"
                type="password"
                required
                minLength={8}
                pattern="(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Use at least 8 characters with one uppercase and one lowercase letter."
                autoComplete="new-password"
                placeholder="Create a password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClassName}
              />
              <ul className="mt-2 space-y-1">
                {passwordRules.map((rule) => (
                  <li
                    key={rule.label}
                    className={`flex items-center gap-1.5 text-xs ${
                      rule.isValid ? "text-[#6d2e46]" : "text-[#8a7f7a]"
                    }`}
                  >
                    {rule.isValid ? (
                      <HiCheckCircle className="size-3.5" aria-hidden="true" />
                    ) : (
                      <HiXCircle className="size-3.5" aria-hidden="true" />
                    )}
                    {rule.label}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              type="submit"
              disabled={uploading}
              className="h-11 w-full rounded-full bg-[#c9a227] text-sm font-semibold text-[#512033] shadow-sm hover:bg-[#b8911f] focus-visible:border-[#c9a227] focus-visible:ring-[#c9a227]/40 active:bg-[#a8821b]"
            >
              {uploading ? "Uploading image..." : "Create Account"}
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
            onClick={handleGoogleSignUp}
            className="h-11 w-full gap-2 rounded-full border-[#eaddd8] bg-white text-sm font-medium text-[#2b2b2b] hover:bg-[#f6e3e6]/50 hover:text-[#512033] focus-visible:border-[#6d2e46] focus-visible:ring-[#6d2e46]/20"
          >
            <FcGoogle className="size-5" aria-hidden="true" />
            Continue with Google
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-[#8a7f7a]">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-[#6d2e46] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6d2e46]"
          >
            Sign in
          </Link>
        </p>
      </div>
      <Toaster richColors position="top-center" />
    </main>
  );
}
