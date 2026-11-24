"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Box, CalendarClock, Download, FileText, MapPin, Receipt, Ship, X } from "lucide-react";
import { toast } from "sonner";
import { StageBadge, StageProgress, StageTimeline } from "@/components/site/stage-timeline";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { waLink } from "@/lib/config";
import { fmtDate, naira } from "@/lib/format";
import { downloadPdf } from "@/lib/pdf";
import { docLines, invoiceLines } from "@/lib/docs";
import { invoiceTotal, useStore } from "@/lib/store";


export default function PortalCarDetail() {
  const { id } = useParams<{ id: string }>();
  const { db, session } = useStore();
  const [photo, setPhoto] = useState<string | null>(null);
  const s = db.shipments.find((x) => x.id === id && session?.role === "customer" && x.customerId === session.customerId);
  const me = db.customers.find((c) => c.id === s?.customerId);

  if (!s)
    return (
      <div className="py-20 text-center">
        <p className="font-display text-4xl">Car not found</p>
        <Button asChild className="mt-6">
          <Link href="/portal">Back to my cars</Link>
        </Button>
      </div>
    );

  const invoices = db.invoices.filter((i) => i.shipmentId === s.id).sort((a, b) => a.issuedAt.localeCompare(b.issuedAt));
  const balance = Math.max(0, s.totalNGN - s.paidNGN);
  const pct = s.totalNGN ? Math.min(100, (s.paidNGN / s.totalNGN) * 100) : 0;
  const DOC_TYPES = ["Bill of Lading", "Title", "Invoice", "Customs Papers"] as const;

  return (
    <div>
      <Link href="/portal" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> My cars
      </Link>

      {/* Header */}
      <div className="mt-5 overflow-hidden rounded-[24px] bg-[#0a0f1c] text-white lg:grid lg:grid-cols-2">
        <div className="relative aspect-[16/10] bg-[#e6edf4] lg:aspect-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <StageBadge stage={s.stage} className="bg-white text-black ring-0" />
            <span className="font-mono text-xs text-white/50">{s.id}</span>
          </div>
          <h1 className="mt-4 font-display text-[2.4rem] sm:text-6xl">
            {s.year} {s.make}
            <br />
            {s.model}
          </h1>
          <p className="mt-3 font-mono text-xs text-white/60">VIN {s.vin}</p>
          <StageProgress stage={s.stage} dark className="mt-6" />
          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 text-sm">
            {[
              { icon: Ship, l: "Vessel", v: s.vessel },
              { icon: Box, l: "Container", v: s.container },
              { icon: MapPin, l: "Route", v: `${s.originPort.replace("Port of ", "")} → ${s.destinationPort}` },
              { icon: CalendarClock, l: s.stage === 8 ? "Delivered" : "ETA (delivery)", v: fmtDate(s.eta) },
            ].map((x) => (
              <div key={x.l}>
                <dt className="flex items-center gap-1.5 text-xs text-white/50">
                  <x.icon className="size-3.5" /> {x.l}
                </dt>
                <dd className="mt-1 font-semibold">{x.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <Card className="min-w-0 lg:col-span-7">
          <CardHeader>
            <CardTitle className="text-lg">Shipment timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <StageTimeline shipment={s} />
          </CardContent>
        </Card>

        <div className="min-w-0 space-y-6 lg:col-span-5">
          {/* Payment summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { l: "Total", v: s.totalNGN },
                  { l: "Paid", v: s.paidNGN },
                  { l: "Balance", v: balance },
                ].map((x) => (
                  <div key={x.l} className="rounded-2xl bg-[#f4f8fc] p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{x.l}</p>
                    <p className={`mt-1 text-sm font-extrabold sm:text-base ${x.l === "Balance" && balance > 0 ? "text-[#a16207]" : ""}`}>{naira(x.v, { compact: true })}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/10">
                <div className="h-full rounded-full bg-black transition-all" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {pct.toFixed(0)}% paid · {naira(s.paidNGN)} of {naira(s.totalNGN)}
              </p>
              <ul className="mt-5 divide-y divide-black/5">
                {invoices.map((inv) => (
                  <li key={inv.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#eef6fc] text-navy">
                        <Receipt className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{inv.number}</p>
                        <p className="truncate text-xs text-muted-foreground">{inv.items[0]?.description}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <div className="text-right">
                        <p className="text-sm font-bold">{naira(invoiceTotal(inv), { compact: true })}</p>
                        <Badge variant={inv.status === "paid" ? "green" : "amber"}>{inv.status}</Badge>
                      </div>
                      <Button variant="ghost" size="iconSm" aria-label={`Download ${inv.number}`} onClick={() => { downloadPdf(inv.number, `Invoice ${inv.number}`, invoiceLines(inv, me?.name)); toast.success(`${inv.number} downloaded`); }}>
                        <Download />
                      </Button>
                    </div>
                  </li>
                ))}
                {invoices.length === 0 && <li className="py-3 text-sm text-muted-foreground">No invoices yet.</li>}
              </ul>
              {balance > 0 && (
                <Button asChild variant="whatsapp" className="mt-4 w-full">
                  <a href={waLink(`Hello, I'd like to pay the balance of ${naira(balance)} for ${s.id} (${s.year} ${s.make} ${s.model}).`)} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="size-4" /> Arrange payment on WhatsApp
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {DOC_TYPES.map((t) => {
                  const docs = s.documents.filter((d) => d.type === t);
                  if (docs.length === 0)
                    return (
                      <li key={t} className="flex items-center gap-3 rounded-2xl border border-dashed border-black/10 p-3 text-sm text-muted-foreground">
                        <FileText className="size-4" /> {t} <span className="ml-auto text-xs">Not yet available</span>
                      </li>
                    );
                  return docs.map((d) => (
                    <li key={d.id}>
                      <button
                        onClick={() => {
                          downloadPdf(d.name, d.type, docLines(s, d, me?.name));
                          toast.success("Download started", { description: d.name });
                        }}
                        className="group flex w-full items-center gap-3 rounded-2xl bg-[#f4f8fc] p-3 text-left transition hover:bg-black hover:text-white"
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-navy">
                          <FileText className="size-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold">{d.type}</span>
                          <span className="block truncate text-xs text-muted-foreground group-hover:text-white/60">
                            {d.name} · {fmtDate(d.date)}
                          </span>
                        </span>
                        <Download className="size-4 shrink-0" />
                      </button>
                    </li>
                  ));
                })}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Photos */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Photos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {s.photos.map((p, i) => (
              <button key={p + i} onClick={() => setPhoto(p)} className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#e6edf4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p} alt={`Photo ${i + 1}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!photo} onOpenChange={(o) => !o && setPhoto(null)}>
        <DialogContent className="p-2 sm:max-w-4xl sm:p-2" aria-describedby={undefined}>
          <DialogTitle className="sr-only">Photo</DialogTitle>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {photo && <img src={photo} alt="" className="w-full rounded-[18px]" />}
          <span className="hidden">
            <X />
          </span>
        </DialogContent>
      </Dialog>
    </div>
  );
}
