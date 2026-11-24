"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, PackageSearch, Search } from "lucide-react";
import { EmptyState, PageHeader, Panel, Td, Th } from "@/components/admin/ui";
import { StageBadge, StageProgress } from "@/components/site/stage-timeline";
import { Input, NativeSelect } from "@/components/ui/input";
import { fmtDate, naira } from "@/lib/format";
import { useStore } from "@/lib/store";
import { STAGES } from "@/lib/types";
import { cn } from "@/lib/utils";

const GROUPS = [
  { key: "all", label: "All", test: () => true },
  { key: "origin", label: "At origin", test: (s: number) => s <= 2 },
  { key: "transit", label: "In transit", test: (s: number) => s >= 1 && s <= 4 },
  { key: "clearing", label: "Clearing", test: (s: number) => s >= 5 && s <= 7 },
  { key: "delivered", label: "Delivered", test: (s: number) => s === 8 },
];

export default function ShipmentsPage() {
  const { db } = useStore();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("all");
  const [stage, setStage] = useState(-1);
  const [sort, setSort] = useState("updated");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("f")) setGroup(p.get("f")!);
    if (p.get("stage")) setStage(Number(p.get("stage")));
  }, []);

  const customers = useMemo(() => new Map(db.customers.map((c) => [c.id, c])), [db.customers]);
  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    const g = GROUPS.find((x) => x.key === group) ?? GROUPS[0];
    return db.shipments
      .filter((s) => g.test(s.stage) && (stage < 0 || s.stage === stage))
      .filter((s) => !t || [s.id, s.vin, s.make, s.model, String(s.year), customers.get(s.customerId)?.name ?? "", s.destinationState, s.originPort, s.vessel].join(" ").toLowerCase().includes(t))
      .sort((a, b) => (sort === "eta" ? a.eta.localeCompare(b.eta) : sort === "stage" ? a.stage - b.stage : (b.history.at(-1)?.date ?? "").localeCompare(a.history.at(-1)?.date ?? "")));
  }, [db.shipments, q, group, stage, sort, customers]);

  return (
    <div>
      <PageHeader title="Shipments" subtitle={`${db.shipments.length} shipments · ${db.shipments.filter((s) => s.stage < 8).length} active`} />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by ID, VIN, car, customer, state…" className="h-11 pl-11" />
        </div>
        <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-black/[0.05] p-1">
          {GROUPS.map((g) => (
            <button
              key={g.key}
              onClick={() => {
                setGroup(g.key);
                setStage(-1);
              }}
              className={cn("whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold transition", group === g.key && stage < 0 ? "bg-black text-white" : "text-muted-foreground hover:text-foreground")}
            >
              {g.label} <span className="opacity-60">{db.shipments.filter((s) => g.test(s.stage)).length}</span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 lg:flex">
          <NativeSelect value={stage} onChange={(e) => setStage(Number(e.target.value))} className="h-11 text-sm lg:w-44" aria-label="Stage">
            <option value={-1}>Any stage</option>
            {STAGES.map((s, i) => (
              <option key={s} value={i}>
                {i + 1}. {s}
              </option>
            ))}
          </NativeSelect>
          <NativeSelect value={sort} onChange={(e) => setSort(e.target.value)} className="h-11 text-sm lg:w-40" aria-label="Sort">
            <option value="updated">Last updated</option>
            <option value="eta">ETA soonest</option>
            <option value="stage">Stage</option>
          </NativeSelect>
        </div>
      </div>

      <Panel className="overflow-hidden">
        {rows.length === 0 ? (
          <EmptyState icon={PackageSearch} title="No shipments found" text="Try a different search or filter." />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead className="border-b border-black/5 bg-[#f8fafc]">
                  <tr>
                    <Th>Vehicle</Th>
                    <Th>Customer</Th>
                    <Th>Route</Th>
                    <Th>Stage</Th>
                    <Th>ETA</Th>
                    <Th className="text-right">Balance</Th>
                    <Th />
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {rows.map((s) => (
                    <tr key={s.id} className="group cursor-pointer transition hover:bg-[#f8fafc]" onClick={() => router.push(`/admin/shipments/${s.id}`)}>
                      <Td>
                        <Link href={`/admin/shipments/${s.id}`} className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={s.image} alt="" className="h-10 w-14 rounded-lg bg-[#e6edf4] object-cover" />
                          <div>
                            <p className="font-semibold">
                              {s.year} {s.make} {s.model}
                            </p>
                            <p className="font-mono text-xs text-muted-foreground">{s.id}</p>
                          </div>
                        </Link>
                      </Td>
                      <Td>
                        <p className="font-medium">{customers.get(s.customerId)?.name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{customers.get(s.customerId)?.phone}</p>
                      </Td>
                      <Td>
                        <p>{s.originPort.replace("Port of ", "").replace("Port ", "")}</p>
                        <p className="text-xs text-muted-foreground">
                          → {s.destinationPort} · {s.destinationState}
                        </p>
                      </Td>
                      <Td>
                        <StageBadge stage={s.stage} />
                        <StageProgress stage={s.stage} className="mt-2 w-28" />
                      </Td>
                      <Td>{fmtDate(s.eta)}</Td>
                      <Td className="text-right font-semibold tabular-nums">{s.totalNGN - s.paidNGN > 0 ? naira(s.totalNGN - s.paidNGN, { compact: true }) : <span className="text-emerald-600">Paid</span>}</Td>
                      <Td>
                        <ChevronRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5" />
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <ul className="divide-y divide-black/5 md:hidden">
              {rows.map((s) => (
                <li key={s.id}>
                  <Link href={`/admin/shipments/${s.id}`} className="flex gap-3 p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.image} alt="" className="h-14 w-20 shrink-0 rounded-xl bg-[#e6edf4] object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-semibold">
                          {s.year} {s.make} {s.model}
                        </p>
                        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                      </div>
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {s.id} · {customers.get(s.customerId)?.name}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <StageBadge stage={s.stage} />
                        <span className="text-xs text-muted-foreground">ETA {fmtDate(s.eta)}</span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </Panel>
    </div>
  );
}
