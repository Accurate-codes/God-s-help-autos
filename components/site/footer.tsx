"use client";
import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import { COMPANY, telLink, waLink } from "@/lib/config";
import { useStore } from "@/lib/store";
import { RatingBadge } from "./rating-badge";
import { WhatsAppIcon } from "./whatsapp-icon";

const cols = [
  { title: "Company", links: [["Home", "/"], ["Services", "/services"], ["FAQs", "/faqs"], ["Contact", "/contact"]] },
  { title: "Buy & Ship", links: [["Cars for Sale", "/cars"], ["Get a Quote", "/quote"], ["Duty Estimator", "/estimator"], ["Track My Car", "/track"]] },
  { title: "Accounts", links: [["Customer Portal", "/portal"], ["Staff Dashboard", "/admin"]] },
];

export function Footer() {
  const { db } = useStore();
  const c = db.company;
  return (
    <footer className="px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="overflow-hidden rounded-[24px] bg-[#0a0f1c] text-white">
        <div className="container-x py-14 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="font-display text-4xl sm:text-5xl">
                God&apos;s Help
                <br />
                Autos
              </p>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
                Car sales, shipping from the USA, Canada and Europe, customs clearing at Apapa and Tin Can, and delivery anywhere in Nigeria.
              </p>
              <RatingBadge dark className="mt-7" />
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-4">
              {cols.map((col) => (
                <div key={col.title}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">{col.title}</p>
                  <ul className="mt-4 space-y-2.5 text-sm">
                    {col.links.map(([label, href]) => (
                      <li key={href}>
                        <Link href={href} className="text-white/80 transition hover:text-white">
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="space-y-4 text-sm lg:col-span-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">Visit us</p>
              <p className="flex gap-3 text-white/80">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
                <a href={COMPANY.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  {c.address}
                </a>
              </p>
              <p className="flex gap-3 text-white/80">
                <Phone className="mt-0.5 size-4 shrink-0 text-gold" />
                <a href={telLink()} className="hover:text-white">
                  {c.phone}
                </a>
              </p>
              <p className="flex gap-3 text-white/80">
                <Clock className="mt-0.5 size-4 shrink-0 text-gold" /> {c.hours}
              </p>
              <a href={waLink("Hello God's Help Autos!")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 font-semibold text-white">
                <WhatsAppIcon className="size-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="container-x flex flex-col gap-2 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <p>© {2026} God&apos;s Help Autos. All rights reserved.</p>
            <p>Demo build. Car images are generic placeholder renders (3D model: Khronos “Car Concept”, CC BY 4.0).</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
