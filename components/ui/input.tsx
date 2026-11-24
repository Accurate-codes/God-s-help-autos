import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full min-w-0 rounded-xl border border-input bg-white px-4 text-[15px] shadow-xs transition placeholder:text-muted-foreground/70 focus-visible:border-navy focus-visible:ring-4 focus-visible:ring-navy/10 disabled:opacity-50 file:mr-3 file:rounded-full file:border-0 file:bg-black file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-24 w-full rounded-xl border border-input bg-white px-4 py-3 text-[15px] shadow-xs transition placeholder:text-muted-foreground/70 focus-visible:border-navy focus-visible:ring-4 focus-visible:ring-navy/10",
        className,
      )}
      {...props}
    />
  );
}

export function NativeSelect({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(
          "flex h-12 w-full appearance-none rounded-xl border border-input bg-white pl-4 pr-10 text-[15px] shadow-xs transition focus-visible:border-navy focus-visible:ring-4 focus-visible:ring-navy/10",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <svg className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return <label className={cn("mb-1.5 block text-[13px] font-semibold text-foreground/80", className)} {...props} />;
}

export function Field({ label, children, hint, className }: { label: string; children: React.ReactNode; hint?: string; className?: string }) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
