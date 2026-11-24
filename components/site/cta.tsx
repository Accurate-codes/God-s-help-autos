import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY, telLink, waLink } from "@/lib/config";
import { WhatsAppIcon } from "./whatsapp-icon";

export function FinalCTA({ title = <>Ready when<br />you are.</>, text }: { title?: React.ReactNode; text?: string }) {
  return (
    <section className="px-2.5 pb-3 sm:px-4 sm:pb-4">
      <div className="relative isolate overflow-hidden rounded-[24px] bg-[#070b14] px-5 py-16 text-white sm:px-10 sm:py-24 lg:px-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero-car.jpg" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover object-bottom opacity-45" loading="lazy" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#070b14] via-[#070b14]/85 to-[#070b14]/20" />
        <div className="max-w-3xl">
          <p className="eyebrow text-white/60">
            <span className="h-px w-6 bg-gold" /> Talk to us 24/7
          </p>
          <h2 className="mt-4 font-display text-[3rem] sm:text-7xl lg:text-8xl">{title}</h2>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/70 sm:text-lg">
            {text ?? "Buying a car, shipping one you won at auction, or need it cleared at Apapa or Tin Can? Send us a message and we'll reply quickly, day or night."}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="whatsapp" size="xl">
              <a href={waLink("Hello God's Help Autos, I'd like to get started.")} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon /> Chat on WhatsApp
              </a>
            </Button>
            <Button asChild size="xl" className="bg-white text-black hover:bg-white/90">
              <a href={telLink()}>
                <Phone /> Call {COMPANY.phone}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
