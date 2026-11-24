"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
  action,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <Reveal className={cn("mb-10 sm:mb-14", align === "center" && "text-center", className)}>
      <div className={cn("flex flex-col gap-6", action && "sm:flex-row sm:items-end sm:justify-between")}>
        <div className={cn(align === "center" && "mx-auto")}>
          {eyebrow && (
            <p className="eyebrow mb-4">
              <span className="h-px w-6 bg-gold" /> {eyebrow}
            </p>
          )}
          <h2 className="section-title">{title}</h2>
          {intro && <p className={cn("mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base", align === "center" && "mx-auto")}>{intro}</p>}
        </div>
        {action}
      </div>
    </Reveal>
  );
}

export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: React.ReactNode; intro?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="container-x pb-10 pt-10 sm:pb-14 sm:pt-16">
      <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="eyebrow mb-4">
        <span className="h-px w-6 bg-gold" /> {eyebrow}
      </motion.p>
      <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }} className="font-display text-[2.9rem] sm:text-7xl lg:text-8xl">
        {title}
      </motion.h1>
      {intro && (
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-lg">
          {intro}
        </motion.p>
      )}
      {children}
    </section>
  );
}
