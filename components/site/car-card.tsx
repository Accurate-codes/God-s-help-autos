"use client";
import Link from "next/link";
import { ArrowUpRight, Gauge, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Car } from "@/lib/types";
import { km, naira } from "@/lib/format";
import { cn } from "@/lib/utils";

export function conditionVariant(c: Car["condition"]) {
  return c === "Brand New" ? "gold" : c === "Foreign Used" ? "navy" : "muted";
}

export function CarCard({ car, className }: { car: Car; className?: string }) {
  const sold = car.status === "sold";
  return (
    <Link href={`/cars/${car.id}`} className={cn("group block", className)}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-[#e6edf4]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={car.images[0]} alt={`${car.year} ${car.make} ${car.model}`} loading="lazy" className={cn("h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]", sold && "grayscale-[0.6] opacity-70")} />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <Badge variant={conditionVariant(car.condition)}>{car.condition}</Badge>
          {sold && <Badge variant="red">Sold</Badge>}
        </div>
        <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-black opacity-0 shadow-sm transition group-hover:opacity-100">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <div className="px-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">
              {car.year} · {car.bodyType}
            </p>
            <h3 className="mt-0.5 truncate text-[17px] font-bold tracking-tight">
              {car.make} {car.model} <span className="font-medium text-muted-foreground">{car.trim}</span>
            </h3>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Gauge className="size-3.5" /> {car.mileage === 0 ? "0 km (new)" : km(car.mileage)}
          </span>
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" /> <span className="truncate">{car.location}</span>
          </span>
        </div>
        <p className="mt-3 text-xl font-extrabold tracking-tight">{naira(car.price)}</p>
      </div>
    </Link>
  );
}
