import { Star } from "lucide-react";
import { COMPANY } from "@/lib/config";
import { cn } from "@/lib/utils";

export function GoogleG({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

export function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - (i - 1)));
        return (
          <span key={i} className="relative inline-block size-4">
            <Star className="absolute inset-0 size-4 fill-[#d5dae1] text-transparent" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="size-4 fill-[#FBBC04] text-[#FBBC04]" />
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function RatingBadge({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <a
      href={COMPANY.mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex items-center gap-3 rounded-full py-2 pl-2 pr-5 transition",
        dark ? "bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15" : "bg-white text-black shadow-[0_8px_30px_-12px_rgba(15,31,61,0.25)] ring-1 ring-black/5 hover:-translate-y-0.5",
        className,
      )}
    >
      <span className="grid size-10 place-items-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
        <GoogleG className="size-5" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="flex items-center gap-2">
          <span className="text-lg font-extrabold">{COMPANY.rating}</span>
          <Stars value={COMPANY.rating} />
        </span>
        <span className={cn("text-xs", dark ? "text-white/70" : "text-muted-foreground")}>
          {COMPANY.reviews} Google reviews · <span className="underline-offset-2 group-hover:underline">View on Maps</span>
        </span>
      </span>
    </a>
  );
}
