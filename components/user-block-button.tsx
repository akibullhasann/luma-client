"use client";

import { useEffect, useState, useTransition } from "react";
import { Ban, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { banPatron, unbanPatron } from "@/lib/actions/manage-users";

type UserBlockButtonProps = {
  userId: string;
  banned: boolean;
  userName: string;
};

export default function UserBlockButton({
  userId,
  banned,
  userName,
}: UserBlockButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticBanned, setOptimisticBanned] = useState(banned);

  useEffect(() => {
    if (!isPending) setOptimisticBanned(banned);
  }, [banned, isPending]);

  function performToggle(nextBanned: boolean) {
    setOptimisticBanned(nextBanned);
    startTransition(async () => {
      try {
        if (nextBanned) {
          await banPatron(userId);
          toast.success("User blocked.");
        } else {
          await unbanPatron(userId);
          toast.success("User unblocked.");
        }
      } catch (cause) {
        setOptimisticBanned(!nextBanned);
        toast.error(
          cause instanceof Error ? cause.message : "Could not update user status."
        );
      }
    });
  }

  function handleToggle() {
    const nextBanned = !optimisticBanned;
    const label = userName || "this user";

    toast(nextBanned ? `Block ${label}?` : `Unblock ${label}?`, {
      description: nextBanned
        ? "They will not be able to access their account."
        : "They will regain account access.",
      action: {
        label: nextBanned ? "Block" : "Unblock",
        onClick: () => performToggle(nextBanned),
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={handleToggle}
      className={
        optimisticBanned
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
      }
    >
      {optimisticBanned ? (
        <>
          <ShieldCheck className="size-4" aria-hidden="true" />
          {isPending ? "Unblocking..." : "Unblock"}
        </>
      ) : (
        <>
          <Ban className="size-4" aria-hidden="true" />
          {isPending ? "Blocking..." : "Block"}
        </>
      )}
    </Button>
  );
}