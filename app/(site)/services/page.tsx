import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Car, Check, FileCheck2, Gavel, Ship, Truck } from "lucide-react";
import { PageHero, Reveal } from "@/components/site/section";
import { FinalCTA } from "@/components/site/cta";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Services" };

const SERVICES = [
  {
    id: "sales",
    icon: Car,
    title: "Car Sales",
    img: "/cars/champagne-a.jpg",
    text: "Browse inspected foreign used (tokunbo), Nigerian used and brand-new cars at our Ojodu Berger yard. Every car comes with complete papers and paid duty.",
    points: ["Toyota, Lexus, Honda, Mercedes-Benz, Ford and more", "Pre-purchase inspection and test drives", "Trade-in and flexible payment options"],
    cta: { label: "View cars for sale", href: "/cars" },
  },
  {
    id: "shipping",
    icon: Ship,
    title: "Shipping",
    img: "/cars/navy-c.jpg",
    text: "We ship cars from the USA, Canada and Europe to Lagos by RoRo or container. Pick-up from the auction or seller, export documents and ocean freight are all handled.",
    points: ["USA: Baltimore, Houston, New Jersey, Savannah", "Canada: Halifax, Montreal · Europe: Antwerp, Bremerhaven", "Marine insurance and photo updates at every port"],
    cta: { label: "Get a shipping quote", href: "/quote" },
  },
  {
    id: "clearing",
    icon: FileCheck2,
    title: "Customs Clearing",
    img: "/cars/white-d.jpg",
    text: "Our licensed agents clear vehicles at Apapa and Tin Can Island ports quickly and transparently. We handle valuation, duty payment, terminal charges and release.",
    points: ["Duty assessment and payment receipts", "Terminal and shipping line charges handled for you", "Clear, itemised breakdown with no hidden costs"],
    cta: { label: "Estimate duty & clearing", href: "/estimator" },
  },
  {
    id: "delivery",
    icon: Truck,
    title: "Forwarding & Delivery",
    img: "/cars/silver-b.jpg",
    text: "Once your car is released, we deliver it to your door anywhere in Nigeria: Lagos, Abuja, Port Harcourt, Onitsha, Ibadan, Kano and beyond.",
    points: ["Enclosed and open car carriers", "Delivery covered by insurance", "Delivered to 28+ states and counting"],
    cta: { label: "Track a delivery", href: "/track" },
  },
  {
    id: "auction",
    icon: Gavel,
    title: "Auction Buying Assistance",
    img: "/cars/red-a.jpg",
    text: "Don't have a dealer licence? We bid for you at Copart, IAAI and Manheim. We check vehicle history, advise on repair costs and secure the best price for you.",
    points: ["Vehicle history and damage checks", "Bidding with our dealer account", "Combined buy + ship + clear packages"],
    cta: { label: "Talk to an auction expert", href: "/contact" },
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Our services" title={<>Auction to<br />doorstep</>} intro="Five services, one trusted team. Use one, or let us handle the whole journey from the auction lot to your gate." />

      <div className="container-x no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-2">
        {SERVICES.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="shrink-0 rounded-full bg-white px-4 py-2 text-[13px] font-semibold ring-1 ring-black/10 transition hover:bg-black hover:text-white">
            {s.title}
          </a>
        ))}
      </div>

      <section className="container-x space-y-6 pb-24">
        {SERVICES.map((s, i) => (
          <Reveal key={s.id}>
            <article id={s.id} className="grid scroll-mt-28 overflow-hidden rounded-[24px] bg-white shadow-[0_12px_32px_-16px_rgba(15,31,61,0.15)] ring-1 ring-black/[0.04] lg:grid-cols-2">
              <div className={`relative aspect-[16/10] bg-[#e6edf4] lg:aspect-auto ${i % 2 ? "lg:order-2" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.img} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                <span className="absolute left-5 top-5 font-display text-sm text-black/30">0{i + 1}</span>
              </div>
              <div className="flex flex-col p-6 sm:p-10 lg:p-14">
                <span className="grid size-12 place-items-center rounded-2xl bg-[#eef6fc] text-navy">
                  <s.icon className="size-5" />
                </span>
                <h2 className="mt-6 font-display text-[2.1rem] sm:text-5xl">{s.title}</h2>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{s.text}</p>
                <ul className="mt-6 space-y-3">
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-3 text-sm">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-black text-white">
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-8 w-fit">
                  <Link href={s.cta.href}>
                    {s.cta.label} <ArrowRight />
                  </Link>
                </Button>
              </div>
            </article>
          </Reveal>
        ))}
      </section>
      <FinalCTA />
    </>
  );
}
