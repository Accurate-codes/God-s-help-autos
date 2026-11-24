"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Download, FileText, Plus, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { EmptyState, PageHeader, Panel, Td, Th } from "@/components/admin/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, Input, NativeSelect } from "@/components/ui/input";
import { invoiceLines } from "@/lib/docs";
import { fmtDate, naira } from "@/lib/format";
import { downloadPdf } from "@/lib/pdf";
import { invoiceTotal, useStore } from "@/lib/store";
import type { Invoice, InvoiceItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function InvoicesPage() {
  const { db, createInvoice, markInvoicePaid } = useStore();
  const [tab, setTab] = useState<"all" | "unpaid" | "paid">("all");
  const [q, setQ] = useState("");
  const [shipmentFilter, setShipmentFilter] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [shipmentId, setShipmentId] = useState("");
  const [due, setDue] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([{ description: "", amount: 0 }]);
  const [confirm, setConfirm] = useState<Invoice | null>(null);

  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("shipment");
    if (s) setShipmentFilter(s);
  }, []);

  const customers = useMemo(() => new Map(db.customers.map((c) => [c.id, c])), [db.customers]);
  const list = useMemo(() => {
    const t = q.toLowerCase();
    return db.invoices
      .filter((i) => (tab === "all" || i.status === tab) && (!shipmentFilter || i.shipmentId === shipmentFilter))
      .filter((i) => !t || `${i.number} ${customers.get(i.customerId)?.name ?? ""} ${i.shipmentId ?? ""}`.toLowerCase().includes(t))
      .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
  }, [db.invoices, tab, q, shipmentFilter, customers]);

  const outstanding = db.invoices.filter((i) => i.status === "unpaid").reduce((a, i) => a + invoiceTotal(i), 0);
  const collected = db.invoices.filter((i) => i.status === "paid").reduce((a, i) => a + invoiceTotal(i), 0);

  const openCreate = () => {
    const sid = shipmentFilter ?? "";
    const ship = db.shipments.find((s) => s.id === sid);
    setCustomerId(ship?.customerId ?? db.customers[0]?.id ?? "");
    setShipmentId(sid);
    setDue(new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10));
    setItems([{ description: ship ? `Customs duty & clearing: ${ship.year} ${ship.make} ${ship.model}` : "", amount: 0 }]);
    setOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = items.filter((i) => i.description.trim() && i.amount > 0);
    if (!clean.length) {
      toast.error("Add at least one line item with an amount");
      return;
    }
    createInvoice({ customerId, shipmentId: shipmentId || undefined, items: clean, dueAt: new Date(due + "T12:00:00Z").toISOString() });
    toast.success("Invoice created", { description: `${naira(clean.reduce((a, b) => a + b.amount, 0))} billed to ${customers.get(customerId)?.name}` });
    setOpen(false);
  };

  const custShipments = db.shipments.filter((s) => s.customerId === customerId);
  const draftTotal = items.reduce((a, b) => a + (b.amount || 0), 0);

  return (
    <div>
      <PageHeader
        title="Invoices"
        subtitle={
          <>
            {naira(outstanding, { compact: true })} outstanding · {naira(collected, { compact: true })} collected
          </>
        }
        actions={
          <Button onClick={openCreate}>
            <Plus /> New invoice
          </Button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search invoice no., customer, shipment…" className="h-11 pl-11" />
        </div>
        <div className="flex gap-1 rounded-full bg-black/[0.05] p-1">
          {(["all", "unpaid", "paid"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cn("flex-1 rounded-full px-4 py-2 text-[13px] font-semibold capitalize transition sm:flex-none", tab === t ? "bg-black text-white" : "text-muted-foreground")}>
              {t}
            </button>
          ))}
        </div>
      </div>
      {shipmentFilter && (
        <div className="mb-4 flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Showing invoices for</span>
          <Link href={`/admin/shipments/${shipmentFilter}`} className="font-mono font-semibold hover:underline">
            {shipmentFilter}
          </Link>
          <button onClick={() => setShipmentFilter(null)} className="inline-flex items-center gap-1 rounded-full bg-black/5 px-2.5 py-1 text-xs font-semibold">
            <X className="size-3" /> Clear
          </button>
        </div>
      )}

      <Panel className="overflow-hidden">
        {list.length === 0 ? (
          <EmptyState icon={FileText} title="No invoices" text="Create an invoice to bill a customer." action={<Button onClick={openCreate}>New invoice</Button>} />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead className="border-b border-black/5 bg-[#f8fafc]">
                  <tr>
                    <Th>Invoice</Th>
                    <Th>Customer</Th>
                    <Th>Shipment</Th>
                    <Th>Issued</Th>
                    <Th>Due</Th>
                    <Th className="text-right">Amount</Th>
                    <Th>Status</Th>
                    <Th className="text-right">Actions</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {list.map((i) => (
                    <tr key={i.id} className="hover:bg-[#f8fafc]">
                      <Td>
                        <p className="font-semibold">{i.number}</p>
                        <p className="max-w-56 truncate text-xs text-muted-foreground">{i.items[0]?.description}</p>
                      </Td>
                      <Td>{customers.get(i.customerId)?.name ?? "—"}</Td>
                      <Td>
                        {i.shipmentId ? (
                          <Link href={`/admin/shipments/${i.shipmentId}`} className="font-mono text-xs hover:underline">
                            {i.shipmentId}
                          </Link>
                        ) : (
                          "—"
                        )}
                      </Td>
                      <Td>{fmtDate(i.issuedAt)}</Td>
                      <Td>{fmtDate(i.dueAt)}</Td>
                      <Td className="text-right font-semibold tabular-nums">{naira(invoiceTotal(i))}</Td>
                      <Td>
                        <Badge variant={i.status === "paid" ? "green" : "amber"}>{i.status}</Badge>
                      </Td>
                      <Td className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="iconSm" aria-label="Download PDF" onClick={() => downloadPdf(i.number, `Invoice ${i.number}`, invoiceLines(i, customers.get(i.customerId)?.name))}>
                            <Download />
                          </Button>
                          {i.status === "unpaid" && (
                            <Button size="sm" variant="outline" onClick={() => setConfirm(i)}>
                              <CheckCircle2 /> Mark paid
                            </Button>
                          )}
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="divide-y divide-black/5 md:hidden">
              {list.map((i) => (
                <li key={i.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold">
                        {i.number} <Badge variant={i.status === "paid" ? "green" : "amber"} className="ml-1 align-middle">{i.status}</Badge>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {customers.get(i.customerId)?.name} · due {fmtDate(i.dueAt)}
                      </p>
                    </div>
                    <p className="font-bold tabular-nums">{naira(invoiceTotal(i), { compact: true })}</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => downloadPdf(i.number, `Invoice ${i.number}`, invoiceLines(i, customers.get(i.customerId)?.name))}>
                      <Download /> PDF
                    </Button>
                    {i.status === "unpaid" && (
                      <Button size="sm" onClick={() => setConfirm(i)}>
                        <CheckCircle2 /> Mark paid
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </Panel>

      {/* Mark paid confirm */}
      <Dialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark {confirm?.number} as paid?</DialogTitle>
            <DialogDescription>
              {confirm && `${naira(invoiceTotal(confirm))} from ${customers.get(confirm.customerId)?.name}. The customer's balance updates and they get a notification.`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                if (confirm) {
                  markInvoicePaid(confirm.id);
                  toast.success(`${confirm.number} marked as paid`);
                }
                setConfirm(null);
              }}
            >
              <CheckCircle2 /> Confirm payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>New invoice</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Customer">
                <NativeSelect
                  value={customerId}
                  onChange={(e) => {
                    setCustomerId(e.target.value);
                    setShipmentId("");
                  }}
                >
                  {db.customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
              <Field label="Shipment (optional)">
                <NativeSelect value={shipmentId} onChange={(e) => setShipmentId(e.target.value)}>
                  <option value="">None</option>
                  {custShipments.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id} · {s.make} {s.model}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
              <Field label="Due date">
                <Input type="date" required value={due} onChange={(e) => setDue(e.target.value)} />
              </Field>
            </div>
            <div>
              <p className="mb-2 text-[13px] font-semibold text-foreground/80">Line items</p>
              <div className="space-y-2">
                {items.map((it, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input placeholder="Description" value={it.description} onChange={(e) => setItems(items.map((x, i) => (i === idx ? { ...x, description: e.target.value } : x)))} className="flex-1" />
                    <Input type="number" placeholder="₦ amount" value={it.amount || ""} onChange={(e) => setItems(items.map((x, i) => (i === idx ? { ...x, amount: Number(e.target.value) } : x)))} className="w-32 sm:w-40" />
                    <Button type="button" variant="ghost" size="icon" className="h-12 shrink-0" disabled={items.length === 1} onClick={() => setItems(items.filter((_, i) => i !== idx))} aria-label="Remove line">
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setItems([...items, { description: "", amount: 0 }])} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold hover:underline">
                <Plus className="size-4" /> Add line
              </button>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-[#f4f8fc] p-4">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-xl font-extrabold">{naira(draftTotal)}</span>
            </div>
            <Button type="submit" size="lg" className="w-full">
              Create invoice
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
