import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-[#fdf9f6] px-4">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="relative">
          <div className="size-16 animate-spin rounded-full border-4 border-[#eaddd8] border-t-[#6d2e46]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="size-5 text-[#c9a227]" aria-hidden="true" />
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6d2e46]">
            Luma
          </p>
          <p className="mt-1 text-sm text-[#8a7f7a]">Loading your experience...</p>
        </div>
      </div>
    </div>
  );
}
