"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight, Plus, Search, Users } from "lucide-react";
import { toast } from "sonner";
import { EmptyState, PageHeader, Panel, Td, Th } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, Input, NativeSelect } from "@/components/ui/input";
import { NIGERIAN_STATES } from "@/lib/data";
import { initials, naira } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function CustomersPage() {
  const { db, addCustomer } = useStore();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", phone: "", email: "", state: "Lagos" });

  const rows = useMemo(() => {
    const t = q.toLowerCase();
    return db.customers
      .map((c) => {
        const ships = db.shipments.filter((s) => s.customerId === c.id);
        return { c, ships: ships.length, active: ships.filter((s) => s.stage < 8).length, balance: ships.reduce((a, s) => a + Math.max(0, s.totalNGN - s.paidNGN), 0), spent: ships.reduce((a, s) => a + s.paidNGN, 0) };
      })
      .filter((r) => !t || `${r.c.name} ${r.c.phone} ${r.c.email} ${r.c.state}`.toLowerCase().includes(t))
      .sort((a, b) => a.c.name.localeCompare(b.c.name));
  }, [db, q]);

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle={`${db.customers.length} customers`}
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus /> Add customer
          </Button>
        }
      />
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, phone, email or state…" className="h-11 pl-11" />
      </div>
      <Panel className="overflow-hidden">
        {rows.length === 0 ? (
          <EmptyState icon={Users} title="No customers found" />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead className="border-b border-black/5 bg-[#f8fafc]">
                  <tr>
                    <Th>Customer</Th>
                    <Th>Phone</Th>
                    <Th>State</Th>
                    <Th className="text-right">Shipments</Th>
                    <Th className="text-right">Paid to date</Th>
                    <Th className="text-right">Balance</Th>
                    <Th />
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {rows.map(({ c, ships, active, balance, spent }) => (
                    <tr key={c.id} className="group transition hover:bg-[#f8fafc]">
                      <Td>
                        <Link href={`/admin/customers/${c.id}`} className="flex items-center gap-3">
                          <span className="grid size-9 place-items-center rounded-full bg-navy text-xs font-bold text-white">{initials(c.name)}</span>
                          <span>
                            <span className="block font-semibold">{c.name}</span>
                            <span className="block text-xs text-muted-foreground">{c.email || "—"}</span>
                          </span>
                        </Link>
                      </Td>
                      <Td>{c.phone}</Td>
                      <Td>{c.state}</Td>
                      <Td className="text-right">
                        {ships} {active > 0 && <span className="text-xs text-muted-foreground">({active} active)</span>}
                      </Td>
                      <Td className="text-right tabular-nums">{naira(spent, { compact: true })}</Td>
                      <Td className="text-right font-semibold tabular-nums">{balance > 0 ? naira(balance, { compact: true }) : <span className="text-emerald-600">—</span>}</Td>
                      <Td>
                        <Link href={`/admin/customers/${c.id}`}>
                          <ChevronRight className="size-4 text-muted-foreground" />
                        </Link>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="divide-y divide-black/5 md:hidden">
              {rows.map(({ c, ships, balance }) => (
                <li key={c.id}>
                  <Link href={`/admin/customers/${c.id}`} className="flex items-center gap-3 p-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-navy text-xs font-bold text-white">{initials(c.name)}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{c.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.phone} · {c.state} · {ships} shipment{ships !== 1 && "s"}
                      </p>
                    </div>
                    {balance > 0 && <span className="text-xs font-bold text-[#a16207]">{naira(balance, { compact: true })}</span>}
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </Panel>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add customer</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              addCustomer(f);
              toast.success(`${f.name} added`);
              setF({ name: "", phone: "", email: "", state: "Lagos" });
              setOpen(false);
            }}
          >
            <Field label="Full name">
              <Input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
            </Field>
            <Field label="Phone">
              <Input required type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
            </Field>
            <Field label="Email (optional)">
              <Input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
            </Field>
            <Field label="State">
              <NativeSelect value={f.state} onChange={(e) => setF({ ...f, state: e.target.value })}>
                {NIGERIAN_STATES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </NativeSelect>
            </Field>
            <Button type="submit" size="lg" className="w-full">
              Add customer
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
