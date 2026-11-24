"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY, telLink, waLink } from "@/lib/config";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "./whatsapp-icon";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/cars", label: "Cars for Sale" },
  { href: "/services", label: "Services" },
  { href: "/track", label: "Track My Car" },
  { href: "/faqs", label: "FAQs" },
];

const MORE_LINKS = [
  { href: "/quote", label: "Get a Quote" },
  { href: "/estimator", label: "Duty Estimator" },
  { href: "/contact", label: "Contact" },
  { href: "/portal", label: "Customer Portal" },
];

export function Wordmark({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)} aria-label="God's Help Autos home">
      <span className={cn("grid size-8 place-items-center rounded-full text-[13px] font-black", light ? "bg-white text-black" : "bg-black text-white")}>
        <span className="font-display text-[12px] tracking-normal">G</span>
      </span>
      <span className={cn("text-[13px] font-extrabold uppercase tracking-[0.22em] sm:text-sm", light ? "text-white" : "text-black")}>
        God&apos;s Help Autos
      </span>
    </Link>
  );
}

export function Navbar({ variant = "solid" }: { variant?: "overlay" | "solid" }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const overlay = variant === "overlay";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className={cn("relative z-40", overlay ? "absolute inset-x-0 top-0" : "sticky top-0 border-b border-black/5 bg-background/80 backdrop-blur-xl")}>
        <nav className={cn("flex items-center justify-between", overlay ? "px-5 py-5 sm:px-8 sm:py-6 lg:px-10" : "container-x h-16 sm:h-[72px]")}>
          <Wordmark light={overlay} />
          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => {
              const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-[13px] font-medium transition",
                    overlay ? "text-white/85 hover:text-white" : "text-black/70 hover:text-black",
                    active && (overlay ? "text-white" : "text-black"),
                  )}
                >
                  {l.label}
                  {active && <span className={cn("absolute inset-x-3.5 -bottom-0.5 h-px", overlay ? "bg-white/70" : "bg-black")} />}
                </Link>
              );
            })}
            <Button asChild size="sm" className="ml-3 h-10 px-5">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className={cn("grid size-11 place-items-center rounded-full lg:hidden", overlay ? "bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-md" : "bg-black text-white")}
          >
            <Menu className="size-5" />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-[#0a0f1c] text-white"
          >
            <div className="flex items-center justify-between px-5 py-5">
              <Wordmark light />
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="grid size-11 place-items-center rounded-full bg-white/10 ring-1 ring-white/15">
                <X className="size-5" />
              </button>
            </div>
            <div className="flex flex-1 flex-col px-5 pb-8 pt-4">
              <ul className="space-y-1">
                {NAV_LINKS.map((l, i) => (
                  <motion.li key={l.href} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.05, ease: [0.2, 0.8, 0.2, 1] }}>
                    <Link onClick={() => setOpen(false)} href={l.href} className="flex items-center justify-between border-b border-white/10 py-3.5">
                      <span className="font-display text-[2.1rem]">{l.label}</span>
                      <ArrowUpRight className="size-5 text-white/40" />
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-6 flex flex-wrap gap-2">
                {MORE_LINKS.map((l) => (
                  <Link key={l.href} onClick={() => setOpen(false)} href={l.href} className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium ring-1 ring-white/10">
                    {l.label}
                  </Link>
                ))}
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-auto grid grid-cols-2 gap-3 pt-10">
                <Button asChild variant="whatsapp" size="lg">
                  <a href={waLink("Hello God's Help Autos!")} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon /> WhatsApp
                  </a>
                </Button>
                <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
                  <a href={telLink()}>
                    <Phone /> Call
                  </a>
                </Button>
                <p className="col-span-2 mt-2 text-center text-xs text-white/50">
                  {COMPANY.phone} · {COMPANY.hours}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
