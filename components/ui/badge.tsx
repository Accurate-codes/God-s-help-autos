import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide", {
  variants: {
    variant: {
      default: "bg-black text-white",
      outline: "border border-black/15 text-foreground",
      muted: "bg-muted text-muted-foreground",
      gold: "bg-gold-soft text-[#7a5410]",
      navy: "bg-navy text-white",
      green: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/15",
      blue: "bg-sky-50 text-sky-700 ring-1 ring-sky-600/15",
      amber: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20",
      violet: "bg-violet-50 text-violet-700 ring-1 ring-violet-600/15",
      red: "bg-red-50 text-red-700 ring-1 ring-red-600/15",
      white: "bg-white/90 text-black backdrop-blur",
    },
  },
  defaultVariants: { variant: "default" },
});

export function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
