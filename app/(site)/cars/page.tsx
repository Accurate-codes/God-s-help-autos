"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SearchX, SlidersHorizontal, X } from "lucide-react";
import { PageHero } from "@/components/site/section";
import { CarCard } from "@/components/site/car-card";
import { NativeSelect } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/lib/store";
import type { BodyType } from "@/lib/types";
import { cn } from "@/lib/utils";

const BODY: ("All" | BodyType)[] = ["All", "Sedan", "SUV", "Crossover", "Minivan", "Pickup"];
const PRICES = [
  { label: "Any price", min: 0, max: Infinity },
  { label: "Under ₦20M", min: 0, max: 20_000_000 },
  { label: "₦20M – ₦40M", min: 20_000_000, max: 40_000_000 },
  { label: "₦40M – ₦70M", min: 40_000_000, max: 70_000_000 },
  { label: "Above ₦70M", min: 70_000_000, max: Infinity },
];

export default function CarsPage() {
  const { db, hydrated } = useStore();
  const [make, setMake] = useState("All");
  const [price, setPrice] = useState(0);
  const [year, setYear] = useState(0);
  const [body, setBody] = useState<(typeof BODY)[number]>("All");
  const [sort, setSort] = useState("newest");
  const [showSold, setShowSold] = useState(false);

  const makes = useMemo(() => ["All", ...Array.from(new Set(db.cars.map((c) => c.make))).sort()], [db.cars]);
  const years = useMemo(() => Array.from(new Set(db.cars.map((c) => c.year))).sort((a, b) => b - a), [db.cars]);

  const cars = useMemo(() => {
    const p = PRICES[price];
    const list = db.cars.filter(
      (c) =>
        (showSold || c.status === "available") &&
        (make === "All" || c.make === make) &&
        c.price >= p.min &&
        c.price < p.max &&
        (year === 0 || c.year >= year) &&
        (body === "All" || c.bodyType === body),
    );
    return [...list].sort((a, b) =>
      sort === "price-asc" ? a.price - b.price : sort === "price-desc" ? b.price - a.price : sort === "year" ? b.year - a.year : b.createdAt.localeCompare(a.createdAt),
    );
  }, [db.cars, make, price, year, body, sort, showSold]);

  const active = make !== "All" || price !== 0 || year !== 0 || body !== "All";
  const clear = () => {
    setMake("All");
    setPrice(0);
    setYear(0);
    setBody("All");
  };

  return (
    <>
      <PageHero
        eyebrow="Cars for sale"
        title={<>Find your<br />next car</>}
        intro="Inspected foreign used, Nigerian used and brand-new cars at our Ojodu Berger yard. Duty is paid on every car, and the papers are complete."
      />

      <section className="container-x pb-24">
        {/* Filters */}
        <div className="sticky top-16 z-30 -mx-4 mb-8 border-b border-black/5 bg-background/85 px-4 py-3 backdrop-blur-xl sm:top-[72px] sm:mx-0 sm:rounded-[24px] sm:border sm:bg-white/90 sm:p-4 sm:shadow-[0_12px_32px_-20px_rgba(15,31,61,0.25)]">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            {BODY.map((b) => (
              <button
                key={b}
                onClick={() => setBody(b)}
                className={cn("shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition", body === b ? "bg-black text-white" : "bg-white text-black/70 ring-1 ring-black/10 hover:ring-black/30 sm:bg-black/[0.04] sm:ring-0")}
              >
                {b === "All" ? "All types" : b}
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5">
            <NativeSelect aria-label="Make" value={make} onChange={(e) => setMake(e.target.value)} className="h-11 text-sm">
              {makes.map((m) => (
                <option key={m} value={m}>
                  {m === "All" ? "All makes" : m}
                </option>
              ))}
            </NativeSelect>
            <NativeSelect aria-label="Price" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="h-11 text-sm">
              {PRICES.map((p, i) => (
                <option key={p.label} value={i}>
                  {p.label}
                </option>
              ))}
            </NativeSelect>
            <NativeSelect aria-label="Year" value={year} onChange={(e) => setYear(Number(e.target.value))} className="h-11 text-sm">
              <option value={0}>Any year</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y} & newer
                </option>
              ))}
            </NativeSelect>
            <NativeSelect aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value)} className="h-11 text-sm">
              <option value="newest">Newest listings</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="year">Year: newest</option>
            </NativeSelect>
            <label className="col-span-2 flex h-11 cursor-pointer items-center gap-2 rounded-xl px-1 text-sm text-muted-foreground sm:col-span-4 lg:col-span-1 lg:justify-center">
              <input type="checkbox" checked={showSold} onChange={(e) => setShowSold(e.target.checked)} className="size-4 accent-black" /> Show sold cars
            </label>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <SlidersHorizontal className="mr-1.5 inline size-4" />
            {hydrated ? (
              <>
                <span className="font-semibold text-foreground">{cars.length}</span> {cars.length === 1 ? "car" : "cars"} found
              </>
            ) : (
              "Loading cars…"
            )}
          </p>
          {active && (
            <button onClick={clear} className="inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline">
              <X className="size-4" /> Clear filters
            </button>
          )}
        </div>

        {!hydrated ? (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-[4/3] rounded-[24px]" />
                <Skeleton className="mt-4 h-4 w-1/3" />
                <Skeleton className="mt-2 h-5 w-2/3" />
                <Skeleton className="mt-3 h-6 w-1/2" />
              </div>
            ))}
          </div>
        ) : cars.length === 0 ? (
          <div className="grid place-items-center rounded-[24px] border border-dashed border-black/15 bg-white/60 px-6 py-20 text-center">
            <SearchX className="size-10 text-muted-foreground" />
            <p className="mt-4 text-lg font-bold">No cars match your filters</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">Try a different make or price range, or tell us what you want and we&apos;ll source it from the USA, Canada or Europe.</p>
            <div className="mt-6 flex gap-3">
              <Button onClick={clear} variant="outline">
                Clear filters
              </Button>
              <Button asChild>
                <a href="/quote">Request a car</a>
              </Button>
            </div>
          </div>
        ) : (
          <motion.div layout className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {cars.map((car) => (
                <motion.div key={car.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.25 }}>
                  <CarCard car={car} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </>
  );
}
