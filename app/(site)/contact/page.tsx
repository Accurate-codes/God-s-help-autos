"use client";

import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { PageHero } from "@/components/site/section";
import { RatingBadge } from "@/components/site/rating-badge";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { COMPANY, telLink, waLink } from "@/lib/config";
import { useStore } from "@/lib/store";

export default function ContactPage() {
  const { db } = useStore();
  const c = db.company;
  const rows = [
    { icon: MapPin, label: "Address", value: c.address, href: COMPANY.mapsUrl },
    { icon: Phone, label: "Phone", value: c.phone, href: telLink() },
    { icon: Clock, label: "Hours", value: c.hours },
    { icon: Mail, label: "Email", value: c.email, href: `mailto:${c.email}` },
  ];
  return (
    <>
      <PageHero eyebrow="Contact" title={<>Come say<br />hello</>} intro="Visit our yard in Ojodu Berger, or call or WhatsApp us. We're open 24 hours, every day." />
      <section className="container-x grid gap-6 pb-24 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-[24px] bg-white p-6 shadow-[0_12px_32px_-16px_rgba(15,31,61,0.15)] ring-1 ring-black/[0.04] sm:p-8">
            <ul className="space-y-6">
              {rows.map((r) => (
                <li key={r.label} className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#eef6fc] text-navy">
                    <r.icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{r.label}</p>
                    {r.href ? (
                      <a href={r.href} target={r.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="mt-0.5 block break-words font-semibold hover:underline">
                        {r.value}
                      </a>
                    ) : (
                      <p className="mt-0.5 font-semibold">{r.value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Button asChild variant="whatsapp" size="lg">
                <a href={waLink("Hello God's Help Autos!")} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon /> WhatsApp
                </a>
              </Button>
              <Button asChild size="lg">
                <a href={telLink()}>
                  <Phone /> Call {c.phone}
                </a>
              </Button>
            </div>
          </div>
          <RatingBadge />
        </div>
        <div className="relative min-h-[380px] overflow-hidden rounded-[24px] bg-white ring-1 ring-black/[0.04] lg:col-span-7">
          <iframe
            title="Map showing God's Help Autos, Ojodu Berger, Lagos"
            src={COMPANY.mapsEmbed}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <a href={COMPANY.mapsUrl} target="_blank" rel="noopener noreferrer" className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white shadow-lg">
            <Navigation className="size-4" /> Get directions
          </a>
        </div>
      </section>
    </>
  );
}
