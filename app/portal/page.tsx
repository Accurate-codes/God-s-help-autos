"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, CalendarClock, CarFront, Wallet } from "lucide-react";
import { StageBadge, StageProgress } from "@/components/site/stage-timeline";
import { Card } from "@/components/ui/card";
import { fmtDate, naira } from "@/lib/format";
import { useStore } from "@/lib/store";
import { STAGES } from "@/lib/types";

export default function PortalHome() {
  const { db, session } = useStore();
  if (session?.role !== "customer") return null;
  const me = db.customers.find((c) => c.id === session.customerId);
  const cars = db.shipments.filter((s) => s.customerId === session.customerId).sort((a, b) => a.stage - b.stage);
  const active = cars.filter((c) => c.stage < 8).length;
  const balance = cars.reduce((a, s) => a + Math.max(0, s.totalNGN - s.paidNGN), 0);
  const next = cars.filter((c) => c.stage < 8).sort((a, b) => a.eta.localeCompare(b.eta))[0];

  return (
    <div>
      <p className="eyebrow">
        <span className="h-px w-6 bg-gold" /> Customer portal
      </p>
      <h1 className="mt-3 font-display text-[2.6rem] sm:text-6xl">Hi, {me?.name.split(" ")[0]}</h1>
      <p className="mt-2 text-muted-foreground">Here&apos;s where all your cars are right now.</p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <CarFront className="size-5 text-navy" />
          <p className="mt-4 text-3xl font-extrabold">{active}</p>
          <p className="text-sm text-muted-foreground">Cars in progress</p>
        </Card>
        <Card className="p-5">
          <Wallet className="size-5 text-navy" />
          <p className="mt-4 text-2xl font-extrabold sm:text-3xl">{naira(balance, { compact: true })}</p>
          <p className="text-sm text-muted-foreground">Outstanding balance</p>
        </Card>
        <Card className="col-span-2 bg-[#0a0f1c] p-5 text-white lg:col-span-1">
          <CalendarClock className="size-5 text-gold" />
          <p className="mt-4 text-2xl font-extrabold sm:text-3xl">{next ? fmtDate(next.eta) : "—"}</p>
          <p className="text-sm text-white/60">{next ? `Next delivery: ${next.make} ${next.model}` : "No upcoming deliveries"}</p>
        </Card>
      </div>

      <h2 className="mt-12 text-lg font-bold">My cars</h2>
      {cars.length === 0 ? (
        <Card className="mt-4 p-10 text-center text-muted-foreground">You don&apos;t have any cars with us yet.</Card>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cars.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Link href={`/portal/cars/${s.id}`} className="group block overflow-hidden rounded-[24px] bg-white shadow-[0_12px_32px_-16px_rgba(15,31,61,0.15)] ring-1 ring-black/[0.04] transition hover:-translate-y-1">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#e6edf4]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute left-3 top-3">
                    <StageBadge stage={s.stage} className="bg-white ring-0" />
                  </div>
                  <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 opacity-0 transition group-hover:opacity-100">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
                <div className="p-5">
                  <p className="font-mono text-xs text-muted-foreground">{s.id}</p>
                  <h3 className="mt-1 text-lg font-bold">
                    {s.year} {s.make} {s.model}
                  </h3>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">VIN {s.vin}</p>
                  <StageProgress stage={s.stage} className="mt-4" />
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {s.stage + 1}/{STAGES.length} · {STAGES[s.stage]}
                    </span>
                    <span className="font-semibold">
                      {s.stage === 8 ? "Delivered" : "ETA"} {fmtDate(s.eta)}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
