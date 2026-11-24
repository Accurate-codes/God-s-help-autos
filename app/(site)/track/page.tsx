"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Anchor, ArrowRight, CalendarClock, Loader2, MapPin, PackageSearch, Search, Ship } from "lucide-react";
import { PageHero } from "@/components/site/section";
import { StageBadge, StageProgress, StageTimeline } from "@/components/site/stage-timeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEMO_TRACKING_IDS } from "@/lib/data";
import { fmtDate } from "@/lib/format";
import { useStore } from "@/lib/store";
import { STAGES, type Shipment } from "@/lib/types";

export default function TrackPage() {
  const { db, hydrated } = useStore();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Shipment | null | undefined>(undefined);

  const lookup = (value: string) => {
    const v = value.trim().toUpperCase();
    if (!v) return;
    setLoading(true);
    setResult(undefined);
    setTimeout(() => {
      const found = db.shipments.find((s) => s.id.toUpperCase() === v || s.vin.toUpperCase() === v || s.id.toUpperCase().endsWith(v.replace(/^GHA-?/, "")) && v.length >= 4);
      setResult(found ?? null);
      setLoading(false);
      const url = new URL(window.location.href);
      url.searchParams.set("id", v);
      window.history.replaceState(null, "", url);
    }, 650);
  };

  useEffect(() => {
    if (!hydrated) return;
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) {
      setQ(id);
      lookup(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  return (
    <>
      <PageHero eyebrow="Track my car" title={<>Where is<br />my car?</>} intro="Enter your tracking ID or VIN to see exactly where your car is, from auction to your door.">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            lookup(q);
          }}
          className="mt-8 flex max-w-2xl flex-col gap-3 rounded-[24px] bg-white p-2 shadow-[0_20px_50px_-24px_rgba(15,31,61,0.35)] ring-1 ring-black/5 sm:flex-row sm:rounded-full"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. GHA-2026-0012 or VIN" className="h-14 rounded-full border-0 pl-12 text-base shadow-none focus-visible:ring-0" aria-label="Tracking ID or VIN" />
          </div>
          <Button type="submit" size="xl" disabled={loading || !q.trim()}>
            {loading ? <Loader2 className="animate-spin" /> : <PackageSearch />} Track
          </Button>
        </form>
        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Try a demo ID:</span>
          {DEMO_TRACKING_IDS.map((id) => (
            <button
              key={id}
              onClick={() => {
                setQ(id);
                lookup(id);
              }}
              className="rounded-full bg-white px-3 py-1.5 font-mono text-[13px] font-semibold ring-1 ring-black/10 transition hover:bg-black hover:text-white"
            >
              {id}
            </button>
          ))}
        </div>
      </PageHero>

      <section className="container-x min-h-[30vh] pb-24">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3 rounded-[24px] bg-white p-8 text-muted-foreground ring-1 ring-black/5">
              <Loader2 className="size-5 animate-spin" /> Looking up your shipment…
            </motion.div>
          )}
          {result === null && !loading && (
            <motion.div key="n" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] border border-dashed border-black/15 bg-white/70 p-10 text-center">
              <PackageSearch className="mx-auto size-10 text-muted-foreground" />
              <p className="mt-4 text-lg font-bold">No shipment found</p>
              <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">Check the tracking ID on your invoice (it looks like GHA-2026-0012), or send us a message on WhatsApp and we&apos;ll help.</p>
            </motion.div>
          )}
          {result && !loading && (
            <motion.div key={result.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }} className="grid gap-6 lg:grid-cols-12">
              <div className="overflow-hidden rounded-[24px] bg-[#0a0f1c] text-white lg:col-span-5">
                <div className="relative aspect-[16/10] bg-[#e6edf4]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={result.image} alt="" className="h-full w-full object-cover" />
                  <div className="absolute left-4 top-4">
                    <StageBadge stage={result.stage} className="bg-white text-black ring-0" />
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <p className="font-mono text-xs text-white/50">{result.id}</p>
                  <h2 className="mt-1 font-display text-3xl sm:text-4xl">
                    {result.year} {result.make} {result.model}
                  </h2>
                  <p className="mt-1 font-mono text-xs text-white/50">VIN ···{result.vin.slice(-6)}</p>
                  <StageProgress stage={result.stage} dark className="mt-6" />
                  <p className="mt-2 text-sm text-white/70">
                    Stage {result.stage + 1} of {STAGES.length}: <span className="font-semibold text-white">{STAGES[result.stage]}</span>
                  </p>
                  <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 text-sm">
                    <div>
                      <dt className="flex items-center gap-1.5 text-xs text-white/50">
                        <Anchor className="size-3.5" /> From
                      </dt>
                      <dd className="mt-1 font-semibold">{result.originPort}</dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-1.5 text-xs text-white/50">
                        <MapPin className="size-3.5" /> To
                      </dt>
                      <dd className="mt-1 font-semibold">
                        {result.destinationPort} → {result.destinationState}
                      </dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-1.5 text-xs text-white/50">
                        <Ship className="size-3.5" /> Vessel
                      </dt>
                      <dd className="mt-1 font-semibold">{result.vessel}</dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-1.5 text-xs text-white/50">
                        <CalendarClock className="size-3.5" /> {result.stage === 8 ? "Delivered" : "ETA"}
                      </dt>
                      <dd className="mt-1 font-semibold">{fmtDate(result.eta)}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              <div className="rounded-[24px] bg-white p-6 shadow-[0_12px_32px_-16px_rgba(15,31,61,0.15)] ring-1 ring-black/[0.04] sm:p-8 lg:col-span-7">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <h3 className="text-lg font-bold">Shipment timeline</h3>
                  <Link href="/portal" className="inline-flex items-center gap-1 text-sm font-semibold hover:underline">
                    Full details in portal <ArrowRight className="size-4" />
                  </Link>
                </div>
                <StageTimeline shipment={result} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
