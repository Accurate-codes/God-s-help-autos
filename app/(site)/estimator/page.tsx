"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calculator, Info } from "lucide-react";
import { PageHero } from "@/components/site/section";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { Field, Input, NativeSelect } from "@/components/ui/input";
import { estimate, waLink, type EngineType } from "@/lib/config";
import { naira, usd } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const ENGINES: EngineType[] = ["Petrol", "Diesel", "Hybrid", "Electric"];
const SEG_COLORS = ["#0f1f3d", "#24406f", "#3d63a3", "#6b8cc7", "#a9bfe6", "#d4a24c", "#e8c989", "#111111", "#7a7f88", "#c9ced6"];

export default function EstimatorPage() {
  const { db } = useStore();
  const cfg = db.estimator;
  const [valueUSD, setValueUSD] = useState(12000);
  const [year, setYear] = useState(2019);
  const [engine, setEngine] = useState<EngineType>("Petrol");
  const [rate, setRate] = useState<number | "">("");
  const [zone, setZone] = useState("Lagos");

  const effectiveRate = rate === "" ? cfg.defaultRate : rate;
  const res = useMemo(() => estimate({ valueUSD: valueUSD || 0, year, engine, rate: effectiveRate || 1, zone }, cfg), [valueUSD, year, engine, effectiveRate, zone, cfg]);
  const zones = Object.keys(cfg.deliveryNGN);

  return (
    <>
      <PageHero eyebrow="Duty & clearing estimator" title={<>What will<br />it cost?</>} intro="Get a rough idea of customs duty, levies, port charges, our agency fee and delivery, all in Naira." />
      <section className="container-x grid gap-6 pb-24 lg:grid-cols-12">
        <div className="rounded-[24px] bg-white p-5 shadow-[0_12px_32px_-16px_rgba(15,31,61,0.15)] ring-1 ring-black/[0.04] sm:p-8 lg:col-span-5">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#eef6fc] text-navy">
              <Calculator className="size-5" />
            </span>
            <h2 className="text-lg font-bold">Your car</h2>
          </div>
          <div className="mt-6 space-y-5">
            <Field label="Car value (USD)" hint="Purchase price plus freight (CIF value) in US dollars">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-muted-foreground">$</span>
                <Input type="number" min={0} step={100} inputMode="numeric" value={valueUSD || ""} onChange={(e) => setValueUSD(Number(e.target.value))} className="pl-8 text-lg font-semibold" />
              </div>
              <input type="range" min={1000} max={80000} step={500} value={valueUSD} onChange={(e) => setValueUSD(Number(e.target.value))} className="mt-3 w-full accent-black" aria-label="Car value slider" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Year">
                <NativeSelect value={year} onChange={(e) => setYear(Number(e.target.value))}>
                  {Array.from({ length: 27 }, (_, i) => 2026 - i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
              <Field label="Exchange rate (₦/$)">
                <Input type="number" inputMode="decimal" placeholder={String(cfg.defaultRate)} value={rate} onChange={(e) => setRate(e.target.value === "" ? "" : Number(e.target.value))} />
              </Field>
            </div>
            <Field label="Engine type">
              <div className="grid grid-cols-4 gap-1 rounded-full bg-black/[0.05] p-1">
                {ENGINES.map((en) => (
                  <button key={en} type="button" onClick={() => setEngine(en)} className={cn("rounded-full py-2.5 text-[13px] font-semibold transition", engine === en ? "bg-black text-white shadow" : "text-muted-foreground hover:text-foreground")}>
                    {en}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Deliver to">
              <NativeSelect value={zone} onChange={(e) => setZone(e.target.value)}>
                {zones.map((z) => (
                  <option key={z}>{z}</option>
                ))}
              </NativeSelect>
            </Field>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-[24px] bg-[#0a0f1c] text-white">
            <div className="p-6 sm:p-8">
              <p className="text-sm text-white/60">Estimated total landed cost (excluding car price)</p>
              <motion.p key={Math.round(res.total)} initial={{ opacity: 0.4, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-2 font-display text-[2.6rem] sm:text-6xl">
                {naira(res.total)}
              </motion.p>
              <p className="mt-2 text-sm text-white/60">
                ≈ {usd(res.totalUSD)} · CIF value {naira(res.cif)} at ₦{effectiveRate.toLocaleString()}/$
              </p>
              <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-white/10">
                {res.lines.map((l, i) => (
                  <motion.span key={l.label} layout className="h-full" style={{ width: `${(l.ngn / res.total) * 100}%`, background: SEG_COLORS[i % SEG_COLORS.length] }} title={l.label} />
                ))}
              </div>
            </div>
            <div className="bg-white p-6 text-foreground sm:p-8">
              <ul className="divide-y divide-black/5">
                {res.lines.map((l, i) => (
                  <li key={l.label} className="flex items-center justify-between gap-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="size-2.5 shrink-0 rounded-full" style={{ background: SEG_COLORS[i % SEG_COLORS.length] }} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{l.label}</p>
                        {l.hint && <p className="truncate text-xs text-muted-foreground">{l.hint}</p>}
                      </div>
                    </div>
                    <p className="shrink-0 text-sm font-bold tabular-nums">{naira(l.ngn)}</p>
                  </li>
                ))}
                <li className="flex items-center justify-between py-4">
                  <p className="font-bold">Total estimate</p>
                  <p className="text-lg font-extrabold tabular-nums">{naira(res.total)}</p>
                </li>
              </ul>
              <div className="mt-2 flex gap-3 rounded-2xl bg-gold-soft/70 p-4 text-sm text-[#5c3f0b]">
                <Info className="mt-0.5 size-4 shrink-0" />
                <p>
                  <strong>Estimate only. Final figures are confirmed by God&apos;s Help Autos.</strong> Customs valuation, exchange rates and terminal charges change often.
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="whatsapp" size="lg">
                  <a href={waLink(`Hello, I used your estimator: ${year} car, ${usd(valueUSD)} value, ${engine}, delivery to ${zone}. Estimate ${naira(res.total)}. Can you confirm?`)} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon /> Confirm on WhatsApp
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/quote">Get a full quote</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
