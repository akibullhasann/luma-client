"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { authClient } from "@/lib/auth-client";

type ProfileEditFormProps = {
  initialName: string;
  initialPhone: string;
};

export default function ProfileEditForm({
  initialName,
  initialPhone,
}: ProfileEditFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedName) {
      toast.error("Name is required.");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await authClient.updateUser({
        name: trimmedName,
        phoneNumber: trimmedPhone,
      } as any);

      if (error) {
        toast.error(error.message ?? "Could not update profile.");
        return;
      }

      toast.success("Profile updated successfully.");
      router.refresh();
    } catch {
      toast.error("Could not update profile.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[#eaddd8] bg-white p-6 shadow-sm shadow-[#6d2e46]/5 sm:p-7">
      <Toaster richColors position="top-center" />
      <h2 className="text-lg font-semibold text-[#2b2b2b]">Edit Profile</h2>
      <p className="mt-1 text-sm text-[#8a7f7a]">
        Update your name and phone number.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="profile-name" className="text-sm font-medium text-[#2b2b2b]">
              Full Name
            </label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="h-11 rounded-xl border-[#eaddd8] bg-[#fdf9f6] px-3.5 text-[#2b2b2b] focus-visible:border-[#6d2e46] focus-visible:ring-[#6d2e46]/20"
              maxLength={80}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="profile-phone" className="text-sm font-medium text-[#2b2b2b]">
              Phone Number
            </label>
            <Input
              id="profile-phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Your phone number"
              className="h-11 rounded-xl border-[#eaddd8] bg-[#fdf9f6] px-3.5 text-[#2b2b2b] focus-visible:border-[#6d2e46] focus-visible:ring-[#6d2e46]/20"
              maxLength={30}
              inputMode="tel"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSaving}
            className="h-11 rounded-xl bg-[#6d2e46] px-6 text-white hover:bg-[#512033]"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </section>
  );
}