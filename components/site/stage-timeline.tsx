"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { STAGES, type Shipment } from "@/lib/types";
import { fmtDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function stageVariant(stage: number) {
  if (stage >= 8) return "green" as const;
  if (stage >= 5) return "amber" as const;
  if (stage >= 3) return "blue" as const;
  return "violet" as const;
}

export function StageBadge({ stage, className }: { stage: number; className?: string }) {
  return (
    <Badge variant={stageVariant(stage)} className={className}>
      <span className="size-1.5 rounded-full bg-current" /> {STAGES[stage]}
    </Badge>
  );
}

/** Thin progress bar across the 9 stages */
export function StageProgress({ stage, className, dark }: { stage: number; className?: string; dark?: boolean }) {
  return (
    <div className={cn("flex gap-1", className)}>
      {STAGES.map((s, i) => (
        <motion.span
          key={s}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: i * 0.04, duration: 0.3 }}
          className={cn("h-1.5 flex-1 origin-left rounded-full", i <= stage ? (i === stage && stage < 8 ? "bg-gold" : dark ? "bg-white" : "bg-black") : dark ? "bg-white/15" : "bg-black/10")}
        />
      ))}
    </div>
  );
}

/** Full vertical timeline with dates and notes */
export function StageTimeline({ shipment, showNotes = true }: { shipment: Pick<Shipment, "stage" | "history" | "eta">; showNotes?: boolean }) {
  const byStage = new Map(shipment.history.map((h) => [h.stage, h]));
  return (
    <ol className="relative">
      {STAGES.map((name, i) => {
        const ev = byStage.get(i);
        const done = i < shipment.stage || (i === shipment.stage && shipment.stage === 8);
        const current = i === shipment.stage && shipment.stage < 8;
        const last = i === STAGES.length - 1;
        return (
          <motion.li
            key={name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.35 }}
            className="relative flex gap-4 pb-7 last:pb-0"
          >
            {!last && <span className={cn("absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5", i < shipment.stage ? "bg-black" : "bg-black/10")} />}
            <span
              className={cn(
                "relative z-10 grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold",
                done && "bg-black text-white",
                current && "bg-gold text-black ring-4 ring-gold/25",
                !done && !current && "bg-white text-black/30 ring-1 ring-black/10",
              )}
            >
              {done ? <Check className="size-4" strokeWidth={3} /> : i + 1}
              {current && <span className="absolute inset-0 animate-ping rounded-full bg-gold/40 [animation-duration:2s]" />}
            </span>
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <p className={cn("text-[15px] font-semibold", !ev && "text-black/35")}>
                  {name}
                  {current && <span className="ml-2 rounded-full bg-gold-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#7a5410]">Current</span>}
                </p>
                <p className="text-xs text-muted-foreground">{ev ? fmtDate(ev.date) : i === 8 ? `ETA ${fmtDate(shipment.eta)}` : "Pending"}</p>
              </div>
              {showNotes && ev?.note && <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{ev.note}</p>}
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
