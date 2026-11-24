"use client";
import { RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";

export function DemoBanner() {
  const { reset } = useStore();
  return (
    <div className="relative z-[60] bg-[#0b1630] text-white">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-3 px-4 text-[12px] sm:px-6 lg:px-8">
        <p className="flex min-w-0 items-center gap-2 truncate">
          <Sparkles className="size-3.5 shrink-0 text-gold" />
          <span className="font-semibold">Demo mode</span>
          <span className="hidden truncate text-white/60 sm:inline">· Sample data only. Changes are saved in this browser.</span>
        </p>
        <button
          onClick={() => {
            reset();
            toast.success("Demo data reset", { description: "All sample data has been restored." });
          }}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-semibold transition hover:bg-white/20"
        >
          <RotateCcw className="size-3" /> Reset demo data
        </button>
      </div>
    </div>
  );
}
