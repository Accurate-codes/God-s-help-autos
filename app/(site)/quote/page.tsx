"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Loader2, Send, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/site/section";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { Field, Input, NativeSelect, Textarea } from "@/components/ui/input";
import { waLink } from "@/lib/config";
import { NIGERIAN_STATES, ORIGIN_PORTS, SERVICES_LIST } from "@/lib/data";
import { useStore } from "@/lib/store";

const empty = { name: "", phone: "", originCountry: "USA", originPort: "Port of Baltimore", make: "", model: "", year: "", vin: "", service: SERVICES_LIST[0], destination: "Lagos", message: "" };

export default function QuotePage() {
  const { addInquiry } = useStore();
  const [f, setF] = useState(empty);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<typeof empty | null>(null);
  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF((p) => ({ ...p, [k]: e.target.value }));
  const ports = ORIGIN_PORTS.find((o) => o.country === f.originCountry)?.ports ?? [];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (f.phone.replace(/\D/g, "").length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setSending(true);
    setTimeout(() => {
      addInquiry({
        kind: "quote",
        name: f.name.trim(),
        phone: f.phone.trim(),
        originCountry: f.originCountry,
        originPort: f.originPort,
        vehicle: `${f.make.trim()} ${f.model.trim()} ${f.year}`.replace(/\s+/g, " ").trim(),
        vin: f.vin.trim() || undefined,
        service: f.service,
        destination: f.destination,
        message: f.message.trim() || undefined,
      });
      setSending(false);
      setDone(f);
      toast.success("Quote request sent!", { description: "Our team will contact you shortly." });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 900);
  };

  return (
    <>
      <PageHero eyebrow="Get a quote" title={<>Get your<br />quote</>} intro="Tell us about the car and where it's going. We'll send you an itemised quote for shipping, clearing and delivery, usually within the hour." />
      <section className="container-x grid gap-8 pb-24 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {done ? (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[24px] bg-white p-8 text-center shadow-[0_12px_32px_-16px_rgba(15,31,61,0.15)] ring-1 ring-black/[0.04] sm:p-14">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }} className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="size-8" />
              </motion.div>
              <h2 className="mt-6 font-display text-4xl">Request received</h2>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                Thanks, {done.name.split(" ")[0]}! We&apos;ve received your request for the{" "}
                <strong className="text-foreground">
                  {done.make} {done.model} {done.year}
                </strong>
                . A God&apos;s Help Autos agent will call you on {done.phone} shortly.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button asChild variant="whatsapp" size="lg">
                  <a href={waLink(`Hello, I just requested a quote on your website for a ${done.make} ${done.model} ${done.year} (${done.service}) to ${done.destination}.`)} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon /> Follow up on WhatsApp
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    setDone(null);
                    setF(empty);
                  }}
                >
                  Send another request
                </Button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="rounded-[24px] bg-white p-5 shadow-[0_12px_32px_-16px_rgba(15,31,61,0.15)] ring-1 ring-black/[0.04] sm:p-10">
              <h2 className="text-lg font-bold">Your details</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Full name">
                  <Input required value={f.name} onChange={set("name")} placeholder="e.g. Chinedu Okafor" autoComplete="name" />
                </Field>
                <Field label="Phone / WhatsApp">
                  <Input required type="tel" value={f.phone} onChange={set("phone")} placeholder="0803 000 0000" autoComplete="tel" inputMode="tel" />
                </Field>
              </div>

              <h2 className="mt-10 text-lg font-bold">The car</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <Field label="Make">
                  <Input required value={f.make} onChange={set("make")} placeholder="Toyota" />
                </Field>
                <Field label="Model">
                  <Input required value={f.model} onChange={set("model")} placeholder="Camry" />
                </Field>
                <Field label="Year">
                  <Input required type="number" min={1990} max={2027} value={f.year} onChange={set("year")} placeholder="2020" inputMode="numeric" />
                </Field>
                <Field label="VIN (optional)" className="sm:col-span-3" hint="The 17-character VIN helps us check auction history and estimate duty more accurately.">
                  <Input value={f.vin} onChange={set("vin")} placeholder="e.g. 4T1G11AK5LU312845" maxLength={17} className="font-mono uppercase" />
                </Field>
              </div>

              <h2 className="mt-10 text-lg font-bold">Shipping & service</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Origin country">
                  <NativeSelect
                    value={f.originCountry}
                    onChange={(e) => {
                      const c = e.target.value;
                      setF((p) => ({ ...p, originCountry: c, originPort: ORIGIN_PORTS.find((o) => o.country === c)?.ports[0] ?? "" }));
                    }}
                  >
                    {ORIGIN_PORTS.map((o) => (
                      <option key={o.country}>{o.country}</option>
                    ))}
                    <option value="Already in Nigeria">Already in Nigeria</option>
                  </NativeSelect>
                </Field>
                <Field label="Origin port">
                  <NativeSelect value={f.originPort} onChange={set("originPort")} disabled={!ports.length}>
                    {ports.length ? ports.map((p) => <option key={p}>{p}</option>) : <option>Not applicable</option>}
                  </NativeSelect>
                </Field>
                <Field label="Service needed">
                  <NativeSelect value={f.service} onChange={set("service")}>
                    {SERVICES_LIST.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </NativeSelect>
                </Field>
                <Field label="Destination state">
                  <NativeSelect value={f.destination} onChange={set("destination")}>
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </NativeSelect>
                </Field>
                <Field label="Anything else? (optional)" className="sm:col-span-2">
                  <Textarea value={f.message} onChange={set("message")} placeholder="Auction lot number, budget, timeline…" />
                </Field>
              </div>
              <Button type="submit" size="xl" className="mt-8 w-full sm:w-auto" disabled={sending}>
                {sending ? <Loader2 className="animate-spin" /> : <Send />} {sending ? "Sending…" : "Request my quote"}
              </Button>
            </form>
          )}
        </div>

        <aside className="space-y-4 lg:col-span-4">
          {[
            { icon: Zap, t: "Fast response", d: "Most quotes go out within an hour, and we're open 24 hours." },
            { icon: ShieldCheck, t: "No hidden charges", d: "An itemised breakdown of shipping, duty, port charges and delivery." },
            { icon: Clock, t: "Track every stage", d: "Once you book, follow your car online from pick-up to delivery." },
          ].map((x) => (
            <div key={x.t} className="flex gap-4 rounded-[24px] bg-white p-5 ring-1 ring-black/[0.04]">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#eef6fc] text-navy">
                <x.icon className="size-5" />
              </span>
              <div>
                <p className="font-bold">{x.t}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{x.d}</p>
              </div>
            </div>
          ))}
          <div className="rounded-[24px] bg-[#0a0f1c] p-6 text-white">
            <p className="font-display text-2xl">Just want a number?</p>
            <p className="mt-2 text-sm text-white/60">Use our duty & clearing estimator for an instant rough figure.</p>
            <Button asChild className="mt-5 bg-white text-black hover:bg-white/90">
              <Link href="/estimator">Open estimator</Link>
            </Button>
          </div>
        </aside>
      </section>
    </>
  );
}
