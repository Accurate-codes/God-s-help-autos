"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Anchor, ArrowRight, ArrowUpRight, Car, FileCheck2, Quote, Ship, Truck } from "lucide-react";
import { Hero } from "@/components/site/hero";
import { Reveal, SectionHeading } from "@/components/site/section";
import { CarCard } from "@/components/site/car-card";
import { RatingBadge, Stars } from "@/components/site/rating-badge";
import { FinalCTA } from "@/components/site/cta";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { STATS, TESTIMONIALS } from "@/lib/data";

const SERVICES = [
  { icon: Car, title: "Car Sales", text: "Foreign used, Nigerian used and brand-new cars, inspected and ready to drive away.", href: "/cars", tag: "01" },
  { icon: Ship, title: "Shipping", text: "RoRo and container shipping from the USA, Canada and Europe straight to Lagos.", href: "/services#shipping", tag: "02" },
  { icon: FileCheck2, title: "Clearing", text: "Fast, transparent customs clearing at Apapa and Tin Can Island ports.", href: "/services#clearing", tag: "03" },
  { icon: Truck, title: "Delivery", text: "Door-to-door forwarding to any state in Nigeria, fully insured and tracked.", href: "/services#delivery", tag: "04" },
];

const STEPS = [
  { icon: Anchor, title: "We source & ship", text: "Buy from our stock, or let us win your car at Copart, IAAI or Manheim. We pick it up and ship it from the nearest port." },
  { icon: FileCheck2, title: "We clear", text: "Our licensed agents handle customs at Apapa or Tin Can: duty, documents and terminal release, with no surprises." },
  { icon: Truck, title: "We deliver", text: "Your car is inspected and delivered to your gate anywhere in Nigeria. You track every stage online." },
];

export default function HomePage() {
  const { db } = useStore();
  const featured = db.cars.filter((c) => c.featured && c.status === "available").slice(0, 6);

  return (
    <>
      <Hero />

      {/* Services */}
      <section className="container-x py-20 sm:py-28">
        <SectionHeading
          eyebrow="What we do"
          title={
            <>
              One team.
              <br />
              Every step.
            </>
          }
          intro="Whether you're buying in Lagos or bidding in Baltimore, God's Help Autos handles the whole journey under one roof."
          action={
            <Button asChild variant="outline" className="w-fit">
              <Link href="/services">
                All services <ArrowRight />
              </Link>
            </Button>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <Link href={s.href} className="group relative flex h-full flex-col overflow-hidden rounded-[24px] bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-16px_rgba(15,31,61,0.15)] ring-1 ring-black/[0.04] transition duration-300 hover:-translate-y-1 hover:bg-[#0a0f1c] hover:text-white sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-[#eef6fc] text-navy transition group-hover:bg-white/10 group-hover:text-gold">
                    <s.icon className="size-5" />
                  </span>
                  <span className="font-display text-sm text-black/20 transition group-hover:text-white/30">{s.tag}</span>
                </div>
                <h3 className="mt-10 font-display text-2xl sm:text-[1.7rem]">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground transition group-hover:text-white/70">{s.text}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold">
                  Learn more <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-2.5 sm:px-4">
        <div className="overflow-hidden rounded-[24px] bg-white py-20 sm:py-28">
          <div className="container-x">
            <SectionHeading eyebrow="How it works" title={<>Three steps<br />to your keys</>} />
            <div className="relative grid gap-10 md:grid-cols-3 md:gap-6">
              <div className="absolute left-[7%] right-[7%] top-7 hidden h-px bg-gradient-to-r from-transparent via-black/15 to-transparent md:block" />
              {STEPS.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.12} className="relative">
                  <div className="flex items-center gap-4 md:flex-col md:items-start">
                    <span className="relative grid size-14 shrink-0 place-items-center rounded-full bg-black text-white ring-8 ring-white">
                      <s.icon className="size-5" />
                      <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-gold text-[11px] font-black text-black">{i + 1}</span>
                    </span>
                    <h3 className="font-display text-[1.7rem] sm:text-3xl md:mt-6">{s.title}</h3>
                  </div>
                  <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted-foreground">{s.text}</p>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-14 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/quote">Get a shipping quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/estimator">Estimate duty & clearing</Link>
              </Button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Featured cars */}
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="In the showroom"
            title={<>Featured<br />cars for sale</>}
            action={
              <Button asChild variant="outline" className="w-fit">
                <Link href="/cars">
                  View all cars <ArrowRight />
                </Link>
              </Button>
            }
          />
        </div>
        <div className="no-scrollbar -my-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 py-4 sm:scroll-px-6 sm:px-6 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-6 lg:gap-y-12 lg:overflow-visible lg:px-8">
          {featured.map((car, i) => (
            <Reveal key={car.id} delay={(i % 3) * 0.08} className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-auto">
              <CarCard car={car} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Stats strip */}
      <section className="px-2.5 sm:px-4">
        <div className="relative overflow-hidden rounded-[24px] bg-navy text-white">
          <div className="absolute -right-24 -top-24 size-80 rounded-full bg-gold/20 blur-3xl" />
          <div className="container-x relative grid grid-cols-2 gap-y-10 py-14 sm:py-16 lg:grid-cols-4">
            {[
              { v: `${STATS.carsDelivered.toLocaleString()}+`, l: "Cars delivered" },
              { v: `${STATS.years}+`, l: "Years in business" },
              { v: `${STATS.states}`, l: "States covered" },
              { v: "24/7", l: "Always open" },
            ].map((s, i) => (
              <Reveal key={s.l} delay={i * 0.08} className="px-2 lg:border-l lg:border-white/10 lg:px-8 lg:first:border-l-0 lg:first:pl-0">
                <p className="font-display text-[2.5rem] sm:text-6xl lg:text-7xl">{s.v}</p>
                <p className="mt-2 text-sm text-white/60">{s.l}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <p className="container-x mt-2 text-right text-[11px] text-muted-foreground">Placeholder figures for demo.</p>
      </section>

      {/* Reviews */}
      <section className="container-x py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="Trusted in Lagos" title={<>Rated<br />4.4 on Google</>} className="mb-8" />
            <RatingBadge />
            <p className="mt-6 max-w-xs text-sm text-muted-foreground">Read every review on our Google Maps listing. Real customer reviews will be chosen by the owner.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:col-span-8">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <figure className="relative flex h-full flex-col rounded-[24px] bg-white p-6 shadow-[0_12px_32px_-16px_rgba(15,31,61,0.15)] ring-1 ring-black/[0.04]">
                  <span className="absolute right-4 top-4 rounded-full bg-gold-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#7a5410]">Placeholder</span>
                  <Quote className="size-7 fill-black text-black" />
                  <Stars value={5} className="mt-5" />
                  <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-foreground/85">“{t.text}”</blockquote>
                  <figcaption className="mt-6 border-t border-black/5 pt-4">
                    <p className="text-sm font-bold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.car} · {t.location}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y border-black/5 bg-white py-5">
        <motion.div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-2xl text-black/80 sm:text-3xl">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            ["Baltimore", "Houston", "New Jersey", "Halifax", "Antwerp", "Bremerhaven", "Apapa", "Tin Can Island", "Lagos", "Abuja", "Port Harcourt", "Onitsha"].map((c) => (
              <span key={`${k}-${c}`} className="flex items-center gap-10">
                {c} <span className="size-2 rounded-full bg-gold" />
              </span>
            )),
          )}
        </motion.div>
      </div>

      <div className="h-20 sm:h-28" />
      <FinalCTA />
    </>
  );
}
