"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CalendarDays, Fuel, Gauge, MapPin, Palette, Phone, Settings2, ShieldCheck, Zap, CarFront } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CarCard, conditionVariant } from "@/components/site/car-card";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { telLink, waLink } from "@/lib/config";
import { km, naira } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function CarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { db, hydrated, addInquiry } = useStore();
  const car = db.cars.find((c) => c.id === id);
  const [active, setActive] = useState(0);

  if (!car) {
    if (!hydrated)
      return (
        <div className="container-x grid gap-8 py-10 lg:grid-cols-12">
          <Skeleton className="aspect-[4/3] rounded-[24px] lg:col-span-7" />
          <div className="space-y-4 lg:col-span-5">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-14 w-3/4" />
            <Skeleton className="h-40" />
          </div>
        </div>
      );
    return (
      <div className="container-x py-24 text-center">
        <p className="font-display text-5xl">Car not found</p>
        <p className="mt-3 text-muted-foreground">This listing may have been sold or removed.</p>
        <Button asChild className="mt-8">
          <Link href="/cars">Back to all cars</Link>
        </Button>
      </div>
    );
  }

  const name = `${car.year} ${car.make} ${car.model} ${car.trim}`;
  const sold = car.status === "sold";
  const message = `Hello God's Help Autos, I'm interested in the ${name} (${naira(car.price)}) on your website. Is it still available?`;
  const similar = db.cars.filter((c) => c.id !== car.id && c.status === "available" && (c.bodyType === car.bodyType || c.make === car.make)).slice(0, 3);

  const specs = [
    { icon: CalendarDays, label: "Year", value: car.year },
    { icon: Gauge, label: "Mileage", value: car.mileage === 0 ? "0 km (new)" : km(car.mileage) },
    { icon: Settings2, label: "Transmission", value: car.transmission },
    { icon: Fuel, label: "Fuel", value: car.fuel },
    { icon: Zap, label: "Engine", value: car.engine },
    { icon: Palette, label: "Colour", value: car.color },
    { icon: CarFront, label: "Body type", value: car.bodyType },
    { icon: MapPin, label: "Location", value: car.location },
  ];

  const enquire = () =>
    addInquiry({ kind: "enquiry", name: "WhatsApp visitor", phone: "via WhatsApp", vehicle: name, carId: car.id, message: "Clicked “Enquire on WhatsApp” on the website." });

  return (
    <div className="pb-24">
      <div className="container-x pt-6 sm:pt-8">
        <Link href="/cars" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> All cars
        </Link>
      </div>

      <div className="container-x mt-5 grid gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Gallery */}
        <div className="min-w-0 lg:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-[#e6edf4]">
            <AnimatePresence mode="wait">
              <motion.img
                key={active}
                src={car.images[active]}
                alt={`${name}, photo ${active + 1}`}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className={cn("absolute inset-0 h-full w-full object-cover", sold && "grayscale-[0.5]")}
              />
            </AnimatePresence>
            <div className="absolute left-4 top-4 flex gap-2">
              <Badge variant={conditionVariant(car.condition)}>{car.condition}</Badge>
              {sold && <Badge variant="red">Sold</Badge>}
            </div>
            <span className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              {active + 1} / {car.images.length}
            </span>
          </div>
          <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto">
            {car.images.map((src, i) => (
              <button key={src + i} onClick={() => setActive(i)} className={cn("relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-2xl bg-[#e6edf4] ring-2 transition sm:w-32", active === i ? "ring-black" : "ring-transparent opacity-70 hover:opacity-100")}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0 lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p className="text-sm font-medium text-muted-foreground">
              {car.year} · {car.bodyType} · {car.condition}
            </p>
            <h1 className="mt-2 font-display text-[2.6rem] sm:text-6xl">
              {car.make} {car.model}
            </h1>
            <p className="mt-1 text-lg font-semibold text-muted-foreground">{car.trim}</p>
            <p className="mt-5 text-4xl font-extrabold tracking-tight">{naira(car.price)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Duty paid · Price negotiable on inspection</p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Button asChild variant="whatsapp" size="lg" className={cn(sold && "pointer-events-none opacity-50")}>
                <a href={waLink(message)} target="_blank" rel="noopener noreferrer" onClick={enquire}>
                  <WhatsAppIcon /> Enquire on WhatsApp
                </a>
              </Button>
              <Button asChild size="lg">
                <a href={telLink()}>
                  <Phone /> Call now
                </a>
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[24px] bg-black/5 ring-1 ring-black/5">
              {specs.map((s) => (
                <div key={s.label} className="bg-white p-4">
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <s.icon className="size-3.5" /> {s.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold">{s.value}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">{car.description}</p>
            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-gold-soft/60 p-4 text-sm">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#7a5410]" />
              <p className="text-[#5c3f0b]">Every car is inspected by our team. Come for a test drive at our Ojodu Berger yard, open 24 hours.</p>
            </div>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="container-x mt-24">
          <h2 className="font-display text-4xl sm:text-5xl">You may also like</h2>
          <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((c) => (
              <CarCard key={c.id} car={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
