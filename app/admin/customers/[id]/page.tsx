"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarDays, Mail, MapPin, Phone, Receipt } from "lucide-react";
import { PageHeader, Panel } from "@/components/admin/ui";
import { StageBadge, StageProgress } from "@/components/site/stage-timeline";
import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { telLink, waLink } from "@/lib/config";
import { fmtDate, initials, naira } from "@/lib/format";
import { invoiceTotal, useStore } from "@/lib/store";

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const { db } = useStore();
  const c = db.customers.find((x) => x.id === id);
  if (!c)
    return (
      <div className="py-20 text-center">
        <p className="font-display text-4xl">Customer not found</p>
        <Button asChild className="mt-6">
          <Link href="/admin/customers">Back</Link>
        </Button>
      </div>
    );
  const ships = db.shipments.filter((s) => s.customerId === c.id);
  const invoices = db.invoices.filter((i) => i.customerId === c.id).sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
  const total = ships.reduce((a, s) => a + s.totalNGN, 0);
  const paid = ships.reduce((a, s) => a + s.paidNGN, 0);
  const intl = "234" + c.phone.replace(/\D/g, "").replace(/^0/, "");

  return (
    <div>
      <Link href="/admin/customers" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Customers
      </Link>
      <div className="mt-4">
        <PageHeader
          title={c.name}
          subtitle={`Customer since ${fmtDate(c.createdAt)}`}
          actions={
            <>
              <Button asChild variant="whatsapp">
                <a href={waLink(`Hello ${c.name.split(" ")[0]}, this is God's Help Autos.`, intl)} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="size-4" /> WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={telLink("+" + intl)}>
                  <Phone /> Call
                </a>
              </Button>
            </>
          }
        />
      </div>
      <div className="grid gap-6 xl:grid-cols-12">
        <div className="min-w-0 space-y-6 xl:col-span-4">
          <Panel className="p-6">
            <span className="grid size-16 place-items-center rounded-full bg-navy text-xl font-bold text-white">{initials(c.name)}</span>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="size-4 text-muted-foreground" /> {c.phone}
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 text-muted-foreground" /> {c.email || "—"}
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="size-4 text-muted-foreground" /> {c.state}
              </li>
              <li className="flex items-center gap-3">
                <CalendarDays className="size-4 text-muted-foreground" /> Joined {fmtDate(c.createdAt)}
              </li>
            </ul>
            {c.id === "c1" && <p className="mt-5 rounded-2xl bg-gold-soft/60 p-3 text-xs text-[#5c3f0b]">This is the demo portal customer (customer@demo.com).</p>}
          </Panel>
          <Panel className="grid grid-cols-3 gap-2 p-4 text-center">
            {[
              ["Billed", total],
              ["Paid", paid],
              ["Balance", Math.max(0, total - paid)],
            ].map(([l, v]) => (
              <div key={l as string} className="rounded-2xl bg-[#f4f8fc] p-3">
                <p className="text-[11px] font-semibold uppercase text-muted-foreground">{l}</p>
                <p className="mt-1 text-sm font-extrabold">{naira(v as number, { compact: true })}</p>
              </div>
            ))}
          </Panel>
        </div>
        <div className="min-w-0 space-y-6 xl:col-span-8">
          <Panel className="p-5 sm:p-6">
            <p className="font-bold">Shipments ({ships.length})</p>
            <ul className="mt-4 divide-y divide-black/5">
              {ships.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground">No shipments yet.</li>}
              {ships.map((s) => (
                <li key={s.id}>
                  <Link href={`/admin/shipments/${s.id}`} className="flex items-center gap-4 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.image} alt="" className="h-12 w-16 shrink-0 rounded-xl bg-[#e6edf4] object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">
                        {s.year} {s.make} {s.model}
                      </p>
                      <p className="font-mono text-xs text-muted-foreground">{s.id}</p>
                      <StageProgress stage={s.stage} className="mt-2 max-w-48" />
                    </div>
                    <StageBadge stage={s.stage} className="hidden sm:inline-flex" />
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="p-5 sm:p-6">
            <p className="font-bold">Invoices ({invoices.length})</p>
            <ul className="mt-4 divide-y divide-black/5">
              {invoices.map((i) => (
                <li key={i.id} className="flex items-center gap-3 py-3 text-sm">
                  <Receipt className="size-4 text-muted-foreground" />
                  <span className="font-semibold">{i.number}</span>
                  <span className="hidden truncate text-muted-foreground sm:block">{i.items[0]?.description}</span>
                  <span className="ml-auto font-semibold tabular-nums">{naira(invoiceTotal(i), { compact: true })}</span>
                  <Badge variant={i.status === "paid" ? "green" : "amber"}>{i.status}</Badge>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
