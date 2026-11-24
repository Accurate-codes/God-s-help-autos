"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/config";
import { cn } from "@/lib/utils";
import { Navbar } from "./navbar";

const ease = [0.16, 1, 0.3, 1] as const;

function Line({ children, delay, className }: { children: React.ReactNode; delay: number; className?: string }) {
  return (
    <span className={cn("block overflow-hidden pb-[0.04em]", className)}>
      <motion.span className="block will-change-transform" initial={{ y: "105%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} transition={{ duration: 1.1, delay, ease }}>
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  return (
    <section className="px-2.5 pt-2.5 sm:px-4 sm:pt-4">
      <div className="relative isolate flex min-h-[max(calc(100svh-46px),720px)] flex-col overflow-hidden rounded-[24px] bg-[#070b14] md:min-h-[680px] lg:h-[90vh] lg:min-h-[640px]">
        {/* Background image with slow zoom */}
        <motion.div className="absolute inset-0 -z-20" initial={{ scale: 1.05 }} animate={{ scale: 1 }} transition={{ duration: 2.8, ease: [0.25, 0.1, 0.25, 1] }}>
          <picture>
            <source media="(max-width: 767px)" srcSet="/hero-car-mobile.jpg" />
            <img src="/hero-car.jpg" alt="A glossy luxury car at dusk on a wet, reflective surface" className="h-full w-full object-cover object-bottom" fetchPriority="high" />
          </picture>
        </motion.div>
        {/* Readability gradients */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70%] bg-gradient-to-b from-black/70 via-black/30 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-black/50 to-transparent" />

        <Navbar variant="overlay" />

        <div className="relative flex flex-1 flex-col px-4 pb-5 pt-24 sm:px-8 sm:pb-6 sm:pt-28 lg:px-10 lg:pt-32">
          <div className="lg:flex lg:items-start lg:justify-between lg:gap-10">
            <h1 className="font-display text-white whitespace-nowrap text-[clamp(2.6rem,14.6vw,6rem)] leading-[0.88] md:text-[clamp(5rem,10.5vw,8rem)] lg:text-[clamp(5.5rem,min(9.4vw,17vh),10.5rem)]">
              <span className="sr-only">Buy. Ship. Clear. Drive.</span>
              <span aria-hidden>
                <Line delay={0.15}>Buy. Ship.</Line>
                <Line delay={0.3} className="pl-[1.35em] sm:pl-[1.6em]">
                  Clear.
                </Line>
                <Line delay={0.45}>Drive.</Line>
              </span>
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.9, ease }}
              className="mt-5 max-w-sm sm:mt-8 lg:mt-0 lg:max-w-[20rem] lg:self-center lg:pt-[6vh] xl:max-w-[22rem]"
            >
              <p className="text-[15px] leading-relaxed text-white/85 sm:text-base">
                From the auction to your doorstep: we sell, ship, clear and deliver cars across Nigeria.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
                <Button asChild size="lg" className="group h-11 bg-black px-5 text-sm text-white ring-1 ring-white/10 hover:bg-black/80 sm:h-12 sm:px-6 sm:text-[15px]">
                  <Link href="/cars">
                    Explore Our Cars <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outlineLight" className="h-11 px-5 text-sm sm:h-12 sm:px-6 sm:text-[15px]">
                  <Link href="/track">Track My Car</Link>
                </Button>
              </div>
            </motion.div>
          </div>

          <motion.a
            href={COMPANY.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="mt-auto inline-flex w-fit max-w-[calc(100%-4.5rem)] flex-wrap sm:max-w-none items-center gap-x-2 gap-y-1 pt-10 text-[12px] font-medium text-white/80 transition hover:text-white sm:text-[13px]"
          >
            <span className="inline-flex items-center gap-1">
              <Star className="size-3.5 fill-gold text-gold" /> {COMPANY.rating} on Google
            </span>
            <span className="text-white/40">·</span>
            <span>{COMPANY.hours}</span>
            <span className="text-white/40">·</span>
            <span>{COMPANY.shortAddress}</span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
